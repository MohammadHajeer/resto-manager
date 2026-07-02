import { useEffect, useMemo } from "react";
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
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { RestaurantDetailsStep } from "./steps/RestaurantDetailsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { VerificationStep } from "./steps/VerificationStep";
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
  const storedStep = useRestaurantRegisterStore((state) => state.currentStep);
  const storedValues = useRestaurantRegisterStore((state) => state.formValues);
  const setStoredStep = useRestaurantRegisterStore(
    (state) => state.setCurrentStep,
  );
  const saveFormValues = useRestaurantRegisterStore(
    (state) => state.saveFormValues,
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
  const brandPrimaryColor = useWatch({ control, name: "brandPrimaryColor" });

  useEffect(() => {
    saveFormValues(getValues());
  }, [getValues, saveFormValues, watchedValues]);

  const currentStep =
    storedStep >= 1 && storedStep <= totalSteps ? storedStep : 1;

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isStepValid =
      fieldsToValidate.length === 0 ||
      (await trigger(fieldsToValidate, { shouldFocus: true }));

    if (isStepValid && currentStep < totalSteps) {
      setStoredStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setStoredStep(currentStep - 1);
    }
  };
  const onSubmit: SubmitHandler<RestaurantRegisterFormValues> = async (
    data,
  ) => {
    const cleanData = toSubmitData(data);

    const formData = new FormData();

    formData.append("data", JSON.stringify(cleanData));

    try {
      const response = await api.post("/owner/register", formData);

      console.log(response.data);
    } catch (error) {
      console.error("Error submitting restaurant registration:", error);
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
          className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
        >
          <div className="p-5 sm:p-8 md:p-10">
            {currentStep === 1 && <BasicInfoStep control={control} />}
            {currentStep === 2 && <RestaurantDetailsStep control={control} />}
            {currentStep === 3 && (
              <VerificationStep
                control={control}
                brandPrimaryColor={brandPrimaryColor}
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
                className="h-10 rounded-full px-6 shadow-none"
              >
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-10 rounded-full px-6 shadow-none"
              >
                Submit for Approval
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default RestaurantRegisterPage;
