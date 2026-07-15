import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEventHandler,
  type MouseEventHandler,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  type FieldErrors,
  type Resolver,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import type { ZodType } from "zod";
import { useNavigate } from "react-router-dom";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { RestaurantDetailsStep } from "./steps/RestaurantDetailsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { VerificationStep } from "./steps/VerificationStep";
import { RestaurantRegistrationProgress } from "./RestaurantRegistrationProgress";
import { StepIndicator } from "./StepIndicator";
import { useRestaurantRegisterStore } from "./store/restaurantRegister.store";
import {
  mergePersistedValues,
  fieldStepMap,
  restaurantRegisterFormSchema,
  stepFields,
  toSubmitData,
  totalSteps,
  type RestaurantRegisterFormValues,
} from "./types";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { authClient } from "@/lib/auth-client";

class AutomaticLoginError extends Error {}

function hasNestedError(
  errors: FieldErrors<RestaurantRegisterFormValues>,
  path: string,
) {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object") {
      return (value as Record<string, unknown>)[key];
    }

    return undefined;
  }, errors);
}

function RestaurantRegisterPage() {
  const [showProgress, setShowProgress] = useState(false);
  const [isSubmitResolved, setIsSubmitResolved] = useState(false);
  const [progressPhase, setProgressPhase] = useState<"registration" | "login">(
    "registration",
  );
  const [resolveProgressCompletion, setResolveProgressCompletion] = useState<
    (() => void) | null
  >(null);
  const submissionInFlightRef = useRef(false);
  const navigate = useNavigate();
  const storedStep = useRestaurantRegisterStore((state) => state.currentStep);
  const storedValues = useRestaurantRegisterStore((state) => state.formValues);
  const setStoredStep = useRestaurantRegisterStore(
    (state) => state.setCurrentStep,
  );
  const saveFormValues = useRestaurantRegisterStore(
    (state) => state.saveFormValues,
  );
  const clearRegistration = useRestaurantRegisterStore(
    (state) => state.clearRegistration,
  );

  const initialValues = useMemo(
    () => mergePersistedValues(storedValues),
    [storedValues],
  );

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    getFieldState,
    setFocus,
    formState: { isSubmitting },
  } = useForm<RestaurantRegisterFormValues>({
    resolver: zodResolver(
      restaurantRegisterFormSchema as unknown as ZodType<
        RestaurantRegisterFormValues,
        RestaurantRegisterFormValues
      >,
    ) as unknown as Resolver<RestaurantRegisterFormValues>,
    defaultValues: initialValues,
    mode: "onChange",
    shouldUnregister: false,
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    saveFormValues(getValues());
  }, [getValues, saveFormValues, watchedValues]);

  const currentStep =
    storedStep >= 1 && storedStep <= totalSteps ? storedStep : 1;
  const isFormLocked = isSubmitting || showProgress;

  const handleProgressComplete = useCallback(() => {
    resolveProgressCompletion?.();
    setResolveProgressCompletion(null);
  }, [resolveProgressCompletion]);

  const moveToFirstInvalidField = (
    hasError: (field: (typeof fieldStepMap)[number]["fields"][number]) => boolean,
  ) => {
    const firstInvalidStep = fieldStepMap.find(({ fields }) =>
      fields.some(hasError),
    );
    const firstInvalidField = firstInvalidStep?.fields.find(hasError);

    if (firstInvalidStep) {
      setStoredStep(firstInvalidStep.step);
    }

    if (firstInvalidField) {
      setTimeout(() => setFocus(firstInvalidField), 0);
    }
  };

  const onInvalid: SubmitErrorHandler<RestaurantRegisterFormValues> = (
    errors,
  ) => {
    moveToFirstInvalidField((field) => Boolean(hasNestedError(errors, field)));
  };

  const handleNext = async () => {
    if (isFormLocked) return;

    const fieldsToValidate = stepFields[currentStep];
    const isStepValid =
      fieldsToValidate.length === 0 ||
      (await trigger(fieldsToValidate, { shouldFocus: true }));

    if (isStepValid && currentStep < totalSteps - 1) {
      setStoredStep(currentStep + 1);
    }
  };

  const handleReview: MouseEventHandler<HTMLButtonElement> = async (event) => {
    // Prevent this click from becoming a submit if React reuses the button DOM
    // node when the review step replaces it with the final submit button.
    event.preventDefault();

    if (isFormLocked) return;

    const isFormValid = await trigger(undefined, { shouldFocus: false });

    if (!isFormValid) {
      moveToFirstInvalidField((field) => getFieldState(field).invalid);
      return;
    }

    setStoredStep(totalSteps);
  };

  const handlePrev = () => {
    if (isFormLocked) return;

    if (currentStep > 1) {
      setStoredStep(currentStep - 1);
    }
  };
  const submitRegistration: SubmitHandler<RestaurantRegisterFormValues> = async (
    data,
  ) => {
    // The API path is only reachable through the guarded submit event on the
    // review step. This also protects against future accidental submit buttons.
    if (currentStep !== totalSteps || !submissionInFlightRef.current) return;

    setShowProgress(true);
    setIsSubmitResolved(false);
    setProgressPhase("registration");

    const cleanData = toSubmitData(data);
    const formData = new FormData();

    formData.append("data", JSON.stringify(cleanData));

    if (data.uploads.logo) {
      formData.append("logo", data.uploads.logo);
    }

    if (data.uploads.banner) {
      formData.append("banner", data.uploads.banner);
    }

    if (data.uploads.businessLicense) {
      formData.append("businessLicense", data.uploads.businessLicense);
    }

    if (data.uploads.ownerIdDocument) {
      formData.append("ownerIdDocument", data.uploads.ownerIdDocument);
    }

    let registrationSucceeded = false;

    const submissionRequest = async () => {
      const response = await api.post("/owner/restaurant/register", formData);

      registrationSucceeded = true;

      // Registration completed; move the UI to the login phase.
      setProgressPhase("login");
      setIsSubmitResolved(false);

      try {
        const { error } = await authClient.signIn.email({
          email: data.owner.email.trim().toLowerCase(),
          password: data.owner.password,
          rememberMe: true,
        });

        if (error) {
          throw new AutomaticLoginError(
            error.message
              ? `Registration was submitted successfully, but automatic login failed: ${error.message}. Please log in manually.`
              : "Registration was submitted successfully, but automatic login failed. Please log in manually.",
          );
        }
      } catch (error) {
        if (error instanceof AutomaticLoginError) {
          throw error;
        }

        throw new AutomaticLoginError(
          "Registration was submitted, but automatic login failed. Please log in manually.",
        );
      }

      // Mark the final progress phase as complete, but do not await the UI.
      setIsSubmitResolved(true);

      return response;
    };

    try {
      await toast
        .promise(submissionRequest(), {
          loading: "Submitting restaurant registration...",
          success: "Restaurant registration submitted successfully",
          error: (error: unknown) => {
            if (error instanceof AutomaticLoginError) {
              return error.message;
            }

            if (isAxiosError<{ message?: string }>(error)) {
              return (
                error.response?.data?.message ??
                "Failed to submit restaurant registration"
              );
            }

            return "Failed to submit restaurant registration";
          },
        })
        .unwrap();

      clearRegistration();
      navigate("/owner/status", { replace: true });
    } catch {
      // The rejection is already displayed by toast.promise.
      if (registrationSucceeded) {
        navigate("/login", {
          replace: true,
          state: {
            email: data.owner.email.trim().toLowerCase(),
          },
        });
      }
    } finally {
      setResolveProgressCompletion(null);
      setShowProgress(false);
      setIsSubmitResolved(false);
      setProgressPhase("registration");
    }
  };
  const handleFinalSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    if (
      currentStep !== totalSteps ||
      isFormLocked ||
      submissionInFlightRef.current
    ) {
      event.preventDefault();
      return;
    }

    submissionInFlightRef.current = true;

    void handleSubmit(submitRegistration, onInvalid)(event).finally(() => {
      submissionInFlightRef.current = false;
    });
  };

  return (
    <div className="flex min-h-full flex-col text-foreground">
      <main className="mx-auto w-full max-w-5xl grow px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="mb-5 text-center sm:mb-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary/65 px-3 py-1.5 text-xs font-bold text-secondary-foreground">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Restaurant partner onboarding
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">
            Grow your business with us
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Create your owner account, introduce your restaurant, and prepare
            your application for review.
          </p>
        </header>

        <StepIndicator currentStep={currentStep} />

        <form
          onSubmit={handleFinalSubmit}
          aria-busy={isFormLocked}
          className="overflow-hidden rounded-2xl border border-border/90 bg-card text-card-foreground shadow-[0_24px_65px_-40px_rgba(15,23,42,0.35)]"
        >
          <fieldset
            disabled={isFormLocked}
            className="m-0 min-w-0 border-0 p-0 disabled:opacity-75"
          >
            <div className="p-5 sm:p-7 lg:p-9">
              {currentStep === 1 && (
                <BasicInfoStep control={control} disabled={isFormLocked} />
              )}
              {currentStep === 2 && (
                <RestaurantDetailsStep
                  control={control}
                  disabled={isFormLocked}
                />
              )}
              {currentStep === 3 && (
                <VerificationStep control={control} disabled={isFormLocked} />
              )}
              {currentStep === 4 && <ReviewStep values={getValues()} />}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border/80 bg-muted/25 px-5 py-4 sm:px-7 lg:px-9">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={isFormLocked}
                className={`h-11 rounded-xl bg-background px-5 font-semibold shadow-xs ${
                  currentStep === 1 ? "invisible pointer-events-none" : ""
                }`}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  key={
                    currentStep === totalSteps - 1 ? "review" : "continue"
                  }
                  type="button"
                  size="lg"
                  onClick={
                    currentStep === totalSteps - 1
                      ? handleReview
                      : handleNext
                  }
                  disabled={isFormLocked}
                  className="h-11 rounded-xl px-6 font-semibold shadow-md shadow-primary/15"
                >
                  {currentStep === totalSteps - 1 ? "Review" : "Continue"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  key="submit"
                  type="submit"
                  size="lg"
                  disabled={isFormLocked}
                  className="h-11 rounded-xl px-5 font-semibold shadow-md shadow-primary/15 sm:px-6"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        Submit for Approval
                      </span>
                      <span className="sm:hidden">Submit</span>
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </fieldset>
        </form>
      </main>
      {showProgress && (
        <RestaurantRegistrationProgress
          key={progressPhase}
          open={showProgress}
          phase={progressPhase}
          isResolved={isSubmitResolved}
          onComplete={handleProgressComplete}
        />
      )}
    </div>
  );
}

export default RestaurantRegisterPage;
