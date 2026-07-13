import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerRegistrationSchema,
  type CustomerRegistrationInput,
} from "@restomanager/validators";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthFormCard } from "../../components/AuthFormCard";
import { TextField } from "../../components/form/TextField";
import { Button } from "../../components/ui/button";
import { signUp } from "../../lib/auth-client";
import { toast } from "sonner";

const authInputClassName =
  "h-11 rounded-xl border-border bg-background px-4 shadow-xs";

const defaultValues: CustomerRegistrationInput = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function CustomerSignUpPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CustomerRegistrationInput>({
    resolver: zodResolver(customerRegistrationSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<CustomerRegistrationInput> = async (data) => {
    setServerError("");

    const signUpPromise = signUp
      .email({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phone: data.phone?.trim() || undefined,
        role: "customer",
      })
      .then(({ error }) => {
        if (error) {
          throw new Error(
            error.message ?? "Registration failed. Please try again.",
          );
        }
      });

    toast.promise(signUpPromise, {
      loading: "Creating your account...",
      success: "Account created successfully!",
      error: (error) =>
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
    });

    try {
      await signUpPromise;
      navigate("/restaurants");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <AuthFormCard
      compact
      eyebrow="Customer account"
      title="Create your account"
      description={
        <>
          Create an account to save addresses and manage orders. Already
          registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextField
              control={control}
              name="name"
              label="Full name"
              placeholder="John Smith"
              autoComplete="name"
              inputClassName={authInputClassName}
              required
            />
          </div>

          <TextField
            control={control}
            name="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            autoComplete="email"
            inputClassName={authInputClassName}
            required
          />

          <TextField
            control={control}
            name="phone"
            type="tel"
            label="Phone number"
            placeholder="+961 71 234 567"
            autoComplete="tel"
            inputClassName={authInputClassName}
          />

          <TextField
            control={control}
            name="password"
            type="password"
            label="Password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            inputClassName={authInputClassName}
            required
          />

          <TextField
            control={control}
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            inputClassName={authInputClassName}
            required
          />
        </div>

        {serverError && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive"
          >
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/15"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />{" "}
              Creating account...
            </>
          ) : (
            <>
              Create account <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link
            to="/terms"
            className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthFormCard>
  );
}
