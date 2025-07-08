"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { LoginPayload } from "@/types/types";
import { useLogin } from "@/features/auth/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

const formSchema = z.object({
  userid: z
    .string()
    .min(1, "Username or email is required")
    .refine((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(value);
      return isEmail || isUsername;
    }, "Please enter a valid username or email"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userid: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginPayload) => {
    mutate(data, {
      onSuccess: async (response) => {
        if (!response?.data) {
          toast("Unexpected response from server");
          console.error("Login response missing data:", response);
          return;
        }

        const { username, access_token, profileUpdated } = response.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("username", username);

        toast("Logged in successfully!");

        try {
          if (!profileUpdated) {
            router.push("/profile/edit");
          } else {
            router.push("/dashboard");
          }
        } catch (err) {
          console.error("Failed to redirect user:", err);
          toast("Unable to proceed after login.");
        }
      },
      onError: (err: unknown) => {
        const error = err as AxiosError<{ message: string }>;
        const errorMessage =
          error?.response?.data.message || "Something went wrong";
        toast(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardHeader className="flex items-center justify-center pt-6">
          <Image src="/seedlet.png" alt="Logo" width={60} height={60} />
        </CardHeader>

        <CardContent>
          <h3 className="text-center text-h3 font-semibold">Welcome back</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Username/Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Username/Email"
                  {...register("userid")}
                  className="pl-10"
                />
              </div>
              {errors.userid && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.userid.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline text-primary">
              Sign up
            </Link>
          </p>

          <p className="text-xs text-center text-muted-foreground mt-4">
            <Link
              href="/auth/forgotPassword"
              className="underline text-primary"
            >
              Forgot your password?
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
