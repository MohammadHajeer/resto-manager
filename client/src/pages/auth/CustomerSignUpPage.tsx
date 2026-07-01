/**
 * CustomerSignUpPage.tsx
 * -----------------------
 * RES-19: Build customer registration form
 *
 * PURPOSE:
 *   Full registration page for new customers.
 *   Renders inside PublicLayout (navbar + footer already provided).
 *   Accessible only to GUESTS — logged-in users are redirected away
 *   by <GuestRoute> in App.tsx before this component even mounts.
 *
 * ROUTE:
 *   /sign-up  (defined in App.tsx, wrapped by GuestRoute + PublicLayout)
 *
 * FORM FIELDS:
 *   1. Full Name        — required, min 2, max 80 chars
 *   2. Email            — required, valid email format
 *   3. Phone            — optional, valid phone format
 *   4. Password         — required, min 8, max 100 chars
 *   5. Confirm Password — required, must match password
 *
 * VALIDATION STRATEGY:
 *   - Uses react-hook-form + zodResolver wired to the shared
 *     customerRegistrationSchema (shared/validators/src/auth.schema.ts).
 *   - Single source of truth — client and server share the same rules.
 *   - Errors appear inline under each field after blur or first submit.
 *   - InputField is defined OUTSIDE the component to prevent React from
 *     unmounting/remounting it on every render (which caused focus loss).
 *
 * AUTH METHOD:
 *   authClient.signUp.email() from better-auth.
 *   On success — better-auth automatically sets the session cookie.
 *   We then redirect to /restaurants.
 *
 * LOADING STATE:
 *   Submit button is disabled and shows a spinner while the network
 *   request is in flight to prevent duplicate submissions.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { authClient } from "../../lib/auth-client";

// ---------------------------------------------------------------------------
// SCHEMA — imported from shared validators
// customerRegistrationSchema lives in shared/validators/src/auth.schema.ts
// Fields: name, email, phone (optional), password, confirmPassword
// ---------------------------------------------------------------------------
import {
  customerRegistrationSchema,
  type CustomerRegistrationInput,
} from "@repo/validators";

// ---------------------------------------------------------------------------
// InputField — defined OUTSIDE the parent component.
//
// ⚠️  IMPORTANT: If InputField were defined INSIDE CustomerSignUpPage,
// React would treat it as a brand-new component type on every render.
// That causes the focused input to UNMOUNT and REMOUNT on every keystroke,
// immediately stealing focus and making the form impossible to type in.
// Defining it at module scope fixes this completely.
// ---------------------------------------------------------------------------
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  registration: ReturnType<ReturnType<typeof useForm<CustomerRegistrationInput>>["register"]>;
}

function InputField({
  id,
  label,
  type,
  placeholder,
  error,
  required = false,
  registration,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label — htmlFor links it to the input for accessibility */}
      <label htmlFor={id} className="text-sm font-medium text-[#0F172A]">
        {label}
        {!required && (
          <span className="ml-1 text-xs font-normal text-slate-400">
            (optional)
          </span>
        )}
      </label>

      {/* Input — border turns red when there is an error */}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={
          id === "password" || id === "confirmPassword"
            ? "new-password"
            : id === "email"
            ? "email"
            : id === "phone"
            ? "tel"
            : "name"
        }
        className={[
          "w-full px-4 py-2.5 rounded-lg border text-sm bg-white text-[#0F172A]",
          "placeholder:text-slate-400 outline-none transition-colors",
          "focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A]",
          error
            ? "border-red-400 bg-red-50"
            : "border-[#E2E8F0] hover:border-slate-300",
        ].join(" ")}
        {...registration}
      />

      {/* Error message — only renders when there is an error string */}
      {error && (
        <p className="text-xs text-red-500 mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function CustomerSignUpPage() {
  const navigate = useNavigate();

  // ── Server/general error (e.g. "Email already in use") ──
  const [serverError, setServerError] = useState("");

  // ── react-hook-form wired to the shared Zod schema ──
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerRegistrationInput>({
    resolver: zodResolver(customerRegistrationSchema),
    mode: "onTouched", // show errors after the user leaves a field
  });

  // -------------------------------------------------------------------------
  // SUBMIT HANDLER
  // Called by react-hook-form only when all fields pass Zod validation.
  // -------------------------------------------------------------------------
  async function onSubmit(data: CustomerRegistrationInput) {
    setServerError("");

    try {
      const { error } = await authClient.signUp.email({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) {
        setServerError(error.message ?? "Registration failed. Please try again.");
        return;
      }

      // Success — session cookie set automatically by better-auth.
      navigate("/restaurants");
    } catch {
      setServerError(
        "Something went wrong. Please check your connection and try again."
      );
    }
  }

  // -------------------------------------------------------------------------
  // JSX
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16 bg-[#F8FAF9]">

      {/* Form card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">

        {/* ── HEADER ── */}
        <div className="mb-8 text-center">
          <span className="text-4xl" role="img" aria-label="food">🍽</span>
          <h1 className="mt-3 text-2xl font-bold text-[#0F172A]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#16A34A] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* ── FORM ── */}
        {/*
          handleSubmit from react-hook-form runs Zod validation first.
          onSubmit is only called if all fields are valid.
          noValidate disables browser built-in popups.
        */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <InputField
            id="name"
            label="Full name"
            type="text"
            placeholder="e.g. John Smith"
            required
            error={errors.name?.message}
            registration={register("name")}
          />

          <InputField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            required
            error={errors.email?.message}
            registration={register("email")}
          />

          <InputField
            id="phone"
            label="Phone number"
            type="tel"
            placeholder="+961 71 234 567"
            required={false}
            error={errors.phone?.message}
            registration={register("phone")}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            required
            error={errors.password?.message}
            registration={register("password")}
          />

          <InputField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            required
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
          />

          {/*
            Server error banner.
            Only renders when the server returns an error after submission.
            role="alert" makes it announced by screen readers immediately.
          */}
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              {serverError}
            </div>
          )}

          {/*
            Submit button.
            isSubmitting is true while onSubmit's async work is running.
            react-hook-form sets this automatically — no manual useState needed.
          */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={[
              "w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors mt-1",
              isSubmitting
                ? "bg-[#16A34A]/60 cursor-not-allowed"
                : "bg-[#16A34A] hover:bg-[#15803D]",
            ].join(" ")}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>

          {/* Terms note — small print below the button */}
          <p className="text-center text-xs text-slate-400">
            By signing up, you agree to our{" "}
            <span className="text-slate-500 font-medium">Terms of Service</span>{" "}
            and{" "}
            <span className="text-slate-500 font-medium">Privacy Policy</span>.
          </p>
        </form>
      </div>
    </div>
  );
}
