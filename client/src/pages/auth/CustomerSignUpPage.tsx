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
 *   1. Full Name      — required, min 2 chars
 *   2. Email          — required, must be a valid email format
 *   3. Password       — required, min 8 chars
 *   4. Confirm Pass   — required, must exactly match password field
 *
 * VALIDATION STRATEGY:
 *   - All validation runs on the CLIENT before any network request.
 *   - Errors appear below each field as soon as the form is submitted.
 *   - Fields that were already touched (blurred) also show errors live.
 *   - If the server returns an error (e.g. email already in use),
 *     it is shown as a general error banner above the submit button.
 *
 * AUTH METHOD:
 *   authClient.signUp.email() from better-auth.
 *   See: https://www.better-auth.com/docs/basic-usage#sign-up
 *   The call is made with { name, email, password }.
 *   On success — better-auth automatically sets the session cookie.
 *   We then redirect to /restaurants (the customer dashboard path
 *   as defined in auth-types.ts → getDashboardPath("customer")).
 *
 * LOADING STATE:
 *   The submit button is disabled and shows a spinner while the
 *   network request is in flight to prevent duplicate submissions.
 *
 * AFTER SIGN-UP:
 *   Successful registration → redirect to /restaurants
 *   (GuestRoute will then also redirect logged-in users away from /sign-up)
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth-client";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

/** All the values the form tracks */
interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** One error string per field (empty string = no error) */
interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ---------------------------------------------------------------------------
// VALIDATION
// Pure function — takes current form values and returns an errors object.
// Each field either gets an error string or an empty string (= valid).
// ---------------------------------------------------------------------------
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // Full name — must not be blank and at least 2 characters
  if (!values.name.trim()) {
    errors.name = "Full name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  // Email — simple regex check for a valid email shape
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Password — minimum 8 characters for basic security
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  // Confirm password — must match the password field exactly
  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

/** Returns true if every error string is empty (= form is valid) */
function isValid(errors: FormErrors): boolean {
  return Object.values(errors).every((e) => e === "");
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function CustomerSignUpPage() {
  const navigate = useNavigate();

  // ── Form field values ──
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ── Per-field validation errors (shown under each input) ──
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ── Tracks which fields the user has already left (blurred) ──
  // Allows live error display only for fields the user has visited
  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // ── Server/general error (e.g. "Email already in use") ──
  const [serverError, setServerError] = useState("");

  // ── Loading flag — true while the network request is in flight ──
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------------------

  /**
   * handleChange
   * Called on every keystroke in any input.
   * Updates the field value and re-validates live IF the field was
   * already touched (so errors don't flash on first keypress).
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updated = { ...values, [name]: value };
    setValues(updated);

    // Only show live errors for fields the user has already visited
    if (touched[name as keyof FormValues]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  }

  /**
   * handleBlur
   * Called when the user leaves (tabs out of) an input.
   * Marks the field as touched and validates it immediately.
   */
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(values);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
  }

  /**
   * handleSubmit
   * Called when the user clicks "Create account".
   * 1. Runs full validation — stops if any field is invalid.
   * 2. Calls authClient.signUp.email() from better-auth.
   * 3. On success → redirect to /restaurants.
   * 4. On error   → show the server error message.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // prevent browser page reload
    setServerError("");  // clear any previous server error

    // Mark all fields as touched so all errors appear at once
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    // Run full validation
    const validationErrors = validate(values);
    setErrors(validationErrors);

    // Stop here if there are any validation errors
    if (!isValid(validationErrors)) return;

    // ── Call better-auth sign-up ──
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name:     values.name.trim(),
        email:    values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (error) {
        // better-auth returns structured errors — use the message directly
        setServerError(error.message ?? "Registration failed. Please try again.");
        return;
      }

      // Success — session cookie is now set by better-auth automatically.
      // Redirect to the customer area.
      navigate("/restaurants");

    } catch (err: unknown) {
      // Unexpected network/runtime error
      setServerError("Something went wrong. Please check your connection and try again.");
    } finally {
      // Always stop the loading spinner, success or fail
      setIsLoading(false);
    }
  }

  // -------------------------------------------------------------------------
  // RENDER HELPERS
  // -------------------------------------------------------------------------

  /**
   * InputField
   * Reusable inline component for a labeled input + error message.
   * Keeps the JSX below clean and avoids repeating the same structure 4 times.
   *
   * Props:
   *   id          — HTML id (also used as the `name` attribute)
   *   label       — visible label text
   *   type        — input type ("text", "email", "password")
   *   placeholder — grey hint text inside the field
   *   error       — validation error string (empty = no error shown)
   */
  function InputField({
    id,
    label,
    type,
    placeholder,
    error,
  }: {
    id: keyof FormValues;
    label: string;
    type: string;
    placeholder: string;
    error: string;
  }) {
    return (
      <div className="flex flex-col gap-1">
        {/* Label — htmlFor links it to the input for accessibility */}
        <label htmlFor={id} className="text-sm font-medium text-[#0F172A]">
          {label}
        </label>

        {/* Input — border turns red when there is an error */}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={values[id]}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete={
            id === "password" || id === "confirmPassword"
              ? "new-password"
              : id === "email"
              ? "email"
              : "name"
          }
          className={[
            "w-full px-4 py-2.5 rounded-lg border text-sm bg-white text-[#0F172A]",
            "placeholder:text-slate-400 outline-none transition-colors",
            "focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A]",
            error
              ? "border-red-400 bg-red-50"     // red border when invalid
              : "border-[#E2E8F0] hover:border-slate-300", // normal border
          ].join(" ")}
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

  // -------------------------------------------------------------------------
  // JSX
  // -------------------------------------------------------------------------
  return (
    /*
      The outer div centres the form card both vertically and horizontally.
      py-16 gives breathing room from the navbar and footer.
      The PublicLayout already provides the navbar + footer — this
      component only needs to render the page content area.
    */
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16 bg-[#F8FAF9]">

      {/* Form card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">

        {/* ── HEADER ── */}
        <div className="mb-8 text-center">
          <span className="text-4xl" role="img" aria-label="food">🍽</span>
          <h1 className="mt-3 text-2xl font-bold text-[#0F172A]">Create your account</h1>
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
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/*
            noValidate disables the browser's built-in validation popups
            so our custom validation messages are shown instead.
          */}

          <InputField
            id="name"
            label="Full name"
            type="text"
            placeholder="e.g. John Smith"
            error={errors.name}
          />

          <InputField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            error={errors.password}
          />

          <InputField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword}
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
              {/* Warning icon */}
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {serverError}
            </div>
          )}

          {/*
            Submit button.
            disabled when isLoading=true to prevent double submissions.
            Shows a spinner SVG + "Creating account..." text while loading.
          */}
          <button
            type="submit"
            disabled={isLoading}
            className={
              [
                "w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors mt-1",
                isLoading
                  ? "bg-[#16A34A]/60 cursor-not-allowed"   // dimmed when loading
                  : "bg-[#16A34A] hover:bg-[#15803D]",     // normal green
              ].join(" ")
            }
          >
            {isLoading ? (
              // Loading spinner + text
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
            <span className="text-slate-500 font-medium">Terms of Service</span>{" "}and{" "}
            <span className="text-slate-500 font-medium">Privacy Policy</span>.
          </p>
        </form>
      </div>
    </div>
  );
}
