import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/auth";
import { register as registerApi } from "../services/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerApi,

    onSuccess: () => {
      navigate("/login");
    },

    onError: () => {
      alert("Registration failed");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "80px auto",
        padding: "30px",
      }}
    >
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Name"
          {...register("name")}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "8px",
          }}
        />

        {errors.name && (
          <p style={{ color: "red", marginBottom: "12px" }}>
            {errors.name.message}
          </p>
        )}

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

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "8px",
          }}
        />

        {errors.confirmPassword && (
          <p style={{ color: "red", marginBottom: "12px" }}>
            {errors.confirmPassword.message}
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
          {mutation.isPending ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}