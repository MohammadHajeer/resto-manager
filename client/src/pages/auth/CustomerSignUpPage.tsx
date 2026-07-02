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
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<CustomerRegistrationInput> = async (data) => {
    setServerError("");
    const { error } = await signUp.email({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phone: data.phone?.trim() || undefined,
      role: "customer",
    });

    if (error) {
      setServerError(error.message ?? "Registration failed. Please try again.");
      return;
    }

    navigate("/restaurants");
  };

  return (
    <AuthFormCard
      title="Create your account"
      description={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <TextField
          control={control}
          name="name"
          label="Full name"
          placeholder="John Smith"
          autoComplete="name"
          required
        />
        <TextField
          control={control}
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <TextField
          control={control}
          name="phone"
          type="tel"
          label="Phone number"
          placeholder="+961 71 234 567"
          autoComplete="tel"
        />
        <TextField
          control={control}
          name="password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />
        <TextField
          control={control}
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />

        {serverError && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full"
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
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthFormCard>
  );
}
