import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@restomanager/validators";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDashboardPath } from "../../auth/auth-types";
import { AuthFormCard } from "../../components/AuthFormCard";
import { TextField } from "../../components/form/TextField";
import { Button } from "../../components/ui/button";
import { authClient } from "../../lib/auth-client";
import { toast } from "sonner";

const authInputClassName =
  "h-12 rounded-xl border-border bg-background px-4 shadow-xs";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const suggestedEmail =
    (location.state as { email?: string } | null)?.email ?? "";
  const [serverError, setServerError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: suggestedEmail,
      password: "",
      rememberMe: false,
    },
  });


const onSubmit: SubmitHandler<LoginInput> = async (data) => {
  setServerError("");

  const loginToast = toast.promise(
    async () => {
      const { data: result, error } = await authClient.signIn.email({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (error) {
        throw new Error(
          error.message ?? "Unable to log in. Check your details and try again.",
        );
      }

      if (!result?.user) {
        throw new Error("Login succeeded, but user data was not returned.");
      }

      return result;
    },
    {
      loading: "Logging you in...",
      success: "Welcome back!",
      error: (error) =>
        error instanceof Error
          ? error.message
          : "Unable to log in. Check your details and try again.",
    },
  );

  try {
    const result = await loginToast.unwrap();
    navigate(getDashboardPath(result.user.role));
  } catch (error) {
    setServerError(
      error instanceof Error
        ? error.message
        : "Unable to log in. Check your details and try again.",
    );
  }
};

  return (
    <AuthFormCard
      eyebrow="Secure account access"
      title="Welcome back"
      description={
        <>
          Sign in to continue to your RestoManager workspace. New here?{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
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
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          inputClassName={authInputClassName}
          required
        />

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
          className="h-12 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/15"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />{" "}
              Logging in...
            </>
          ) : (
            <>
              Log in <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </AuthFormCard>
  );
}
