import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@restomanager/validators";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardPath } from "../../auth/auth-types";
import { AuthFormCard } from "../../components/AuthFormCard";
import { TextField } from "../../components/form/TextField";
import { Button } from "../../components/ui/button";
import { authClient } from "../../lib/auth-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    setServerError("");
    const { data: result, error } = await authClient.signIn.email({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      rememberMe: data.rememberMe,
    });

    if (error) {
      setServerError(error.message ?? "Unable to log in. Check your details and try again.");
      return;
    }

    navigate(getDashboardPath(result?.user.role));
  };

  return (
    <AuthFormCard
      title="Welcome back"
      description={
        <>
          New to RestoManager?{" "}
          <Link to="/sign-up" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <TextField control={control} name="email" type="email" label="Email address" placeholder="you@example.com" autoComplete="email" required />
        <TextField control={control} name="password" type="password" label="Password" placeholder="Enter your password" autoComplete="current-password" required />

        {serverError && (
          <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full rounded-full">
          {isSubmitting ? (
            <><LoaderCircle className="animate-spin" aria-hidden="true" /> Logging in...</>
          ) : (
            <>Log in <ArrowRight aria-hidden="true" /></>
          )}
        </Button>
      </form>
    </AuthFormCard>
  );
}
