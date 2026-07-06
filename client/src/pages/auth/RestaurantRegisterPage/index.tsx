import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
  const [progressPhase, setProgressPhase] = useState<
    "registration" | "login"
  >("registration");
  const [resolveProgressCompletion, setResolveProgressCompletion] = useState<
    (() => void) | null
  >(null);
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

  const handleNext = async () => {
    if (isFormLocked) return;

    const fieldsToValidate = stepFields[currentStep];
    const isStepValid =
      fieldsToValidate.length === 0 ||
      (await trigger(fieldsToValidate, { shouldFocus: true }));

    if (isStepValid && currentStep < totalSteps) {
      setStoredStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (isFormLocked) return;

    if (currentStep > 1) {
      setStoredStep(currentStep - 1);
    }
  };
  const onSubmit: SubmitHandler<RestaurantRegisterFormValues> = async (
    data,
  ) => {
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

    const finishProgressPhase = () =>
      new Promise<void>((resolve) => {
        setResolveProgressCompletion(() => resolve);
        setIsSubmitResolved(true);
      });

    const submissionRequest = (async () => {
      const response = await api.post(
        "/owner/restaurant/register",
        formData,
      );
      registrationSucceeded = true;

      await finishProgressPhase();

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

      await finishProgressPhase();

      return response;
    })();

    try {
      await toast
        .promise(
          submissionRequest,
          {
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
          },
        )
        .unwrap();
      clearRegistration();
      setShowProgress(false);
      navigate("/owner/status", { replace: true });
    } catch {
      // The rejection is presented by toast.promise.
      if (registrationSucceeded) {
        navigate("/login", {
          replace: true,
          state: { email: data.owner.email.trim().toLowerCase() },
        });
      }
    } finally {
      setResolveProgressCompletion(null);
      setShowProgress(false);
      setIsSubmitResolved(false);
      setProgressPhase("registration");
    }
  };
  const onInvalid: SubmitErrorHandler<RestaurantRegisterFormValues> = (
    errors,
  ) => {
    const firstInvalidStep = fieldStepMap.find(({ fields }) =>
      fields.some((field) => hasNestedError(errors, field)),
    );
    const firstInvalidField = firstInvalidStep?.fields.find((field) =>
      hasNestedError(errors, field),
    );

    if (firstInvalidStep) {
      setStoredStep(firstInvalidStep.step);
    }

    if (firstInvalidField) {
      setTimeout(() => setFocus(firstInvalidField), 0);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-4xl grow px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
            Grow your business with us
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Join the next generation of restaurant management.
          </p>
        </header>

        <StepIndicator currentStep={currentStep} />

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          aria-busy={isFormLocked}
          className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
        >
          <fieldset
            disabled={isFormLocked}
            className="m-0 min-w-0 border-0 p-0 disabled:opacity-75"
          >
            <div className="p-5 sm:p-8 md:p-10">
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
                <VerificationStep
                  control={control}
                  disabled={isFormLocked}
                />
              )}
              {currentStep === 4 && <ReviewStep values={getValues()} />}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border bg-muted/20 px-5 py-5 sm:px-8 md:px-10">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={isFormLocked}
                className={`h-10 rounded-full px-5 shadow-none ${
                  currentStep === 1 ? "invisible pointer-events-none" : ""
                }`}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleNext}
                  disabled={isFormLocked}
                  className="h-10 rounded-full px-6 shadow-none"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  disabled={isFormLocked}
                  className="h-10 rounded-full px-6 shadow-none"
                >
                  Submit for Approval
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
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
