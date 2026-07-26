import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { loginSchema, type LoginFormData } from "../schemas/auth";
import { login as loginApi } from "../services/auth";
import { useAuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => loginApi({ ...data, email: data.email.trim().toLowerCase() }),
    onSuccess: async (data) => {
      await login(data.accessToken);
      navigate("/dashboard");
    },
  });

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between p-12 text-white lg:flex">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><Sparkles size={22} /></span><span className="text-xl font-bold">DevFlow</span></div>
        <div><p className="text-sm font-bold tracking-[0.25em] text-fuchsia-300">PROJECT MANAGEMENT, SIMPLIFIED</p><h1 className="mt-5 max-w-lg text-5xl font-bold leading-tight">Bring your best work into flow.</h1><p className="mt-5 max-w-md text-lg leading-8 text-slate-300">Stay focused, coordinate clearly, and move every project forward with confidence.</p></div>
        <p className="text-sm text-slate-400">Built for teams who love making progress.</p>
      </section>
      <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9 lg:hidden"><div className="flex items-center gap-2 font-bold text-violet-700"><Sparkles size={21} /> DevFlow</div></div>
          <p className="text-sm font-semibold text-violet-600">WELCOME BACK</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Sign in to your workspace</h2>
          <p className="mt-2 text-slate-500">Enter your details to continue.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <label className="block text-sm font-medium text-slate-700">Email address<input type="email" placeholder="you@example.com" {...register("email")} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100" /></label>
            {errors.email && <p className="-mt-3 text-sm text-rose-600">{errors.email.message}</p>}
            <label className="block text-sm font-medium text-slate-700">Password<input type="password" placeholder="••••••••" {...register("password")} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100" /></label>
            {errors.password && <p className="-mt-3 text-sm text-rose-600">{errors.password.message}</p>}
            {mutation.isError && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">Invalid email or password.</p>}
            <button type="submit" disabled={mutation.isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110 disabled:opacity-60">{mutation.isPending ? "Signing in..." : <>Sign in <ArrowRight size={18} /></>}</button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">New to DevFlow? <Link to="/register" className="font-semibold text-violet-600 hover:underline">Create an account</Link></p>
          <p className="mt-10 flex justify-center gap-2 text-xs text-slate-400"><LockKeyhole size={14} /> Your workspace is secure</p>
        </div>
      </section>
    </div>
  );
}
