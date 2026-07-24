import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { loginSchema, type LoginFormData } from "../schemas/auth";
import { login as loginApi } from "../services/auth";
import { useAuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginApi,

    onSuccess: async (data) => {
      await login(data.accessToken);
      navigate("/dashboard");
    },

    onError: () => {
      alert("Invalid email or password");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "80px auto",
        padding: "30px",
      }}
    >
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "8px",
          }}
        />

        {errors.email && (
          <p style={{ color: "red", marginBottom: "12px" }}>
            {errors.email.message}
          </p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "8px",
          }}
        />

        {errors.password && (
          <p style={{ color: "red", marginBottom: "12px" }}>
            {errors.password.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          style={{
            width: "100%",
            padding: "12px",
          }}
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}