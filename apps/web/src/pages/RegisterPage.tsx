import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Sparkles } from "lucide-react";
import { registerSchema, type RegisterFormData } from "../schemas/auth";
import { register as registerApi } from "../services/auth";
import { useAuthContext } from "../context/AuthContext";

const input = "mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

function registrationError(error: unknown) {
  if (!axios.isAxiosError(error)) return "Could not create the account. Please try again.";

  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;

  return "Could not reach the server. Please check that the API is running and try again.";
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerApi({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    }),
    onSuccess: async (data) => {
      await login(data.accessToken);
      navigate("/dashboard");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 font-bold text-violet-700">
          <Sparkles size={21} /> DevFlow
        </Link>
        <p className="mt-10 text-sm font-semibold text-violet-600">CREATE YOUR WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Start building momentum</h1>
        <p className="mt-2 text-slate-500">Free to get started. Your next project is waiting.</p>

        <form
          className="mt-7 space-y-4"
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
          {[
            ["name", "Full name", "Your name", "text"],
            ["email", "Email address", "you@example.com", "email"],
            ["password", "Password", "At least 6 characters", "password"],
            ["confirmPassword", "Confirm password", "Repeat your password", "password"],
          ].map(([field, label, placeholder, type]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700">
                {label}
                <input
                  type={type}
                  placeholder={placeholder}
                  {...register(field as keyof RegisterFormData)}
                  className={input}
                />
              </label>
              {errors[field as keyof RegisterFormData] && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors[field as keyof RegisterFormData]?.message}
                </p>
              )}
            </div>
          ))}

          {mutation.isError && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700" role="alert">
              {registrationError(mutation.error)}
            </p>
          )}
          <button
            disabled={mutation.isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-200 hover:brightness-110 disabled:opacity-60"
          >
            {mutation.isPending ? "Creating account..." : <>Create account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-violet-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
