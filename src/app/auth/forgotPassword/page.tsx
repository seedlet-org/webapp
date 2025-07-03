"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Circle,
  Loader2,
} from "lucide-react";
import { OTP, ResetPassword } from "@/features/auth/api";
import { useRouter } from "next/navigation";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Include at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Include at least one lowercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Include at least one number",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Include at least one special character",
      }),
    confirm_password: z.string(),
    otp: z.string().length(6, "OTP must be 6 digits"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetSchema>;

const checkPassword = (password: string) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [passwordResetting, setPasswordResetting] = useState(false);
  const router = useRouter();
  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
      otp: "",
    },
  });

  const passwordRules = checkPassword(passwordValue);
  const allPassed = Object.values(passwordRules).every(Boolean);

  const sendOtp = async ({ email }: EmailForm) => {
    try {
      setOtpSending(true);
      await OTP(email);
      localStorage.setItem("forgotPasswordData", JSON.stringify({ email }));
      setEmail(email);
      setStep("reset");
      toast("OTP sent to your email");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      if (status === 429) return;
      const err = error as AxiosError<{ message: string }>;
      toast(err?.response?.data?.message || "Failed to send OTP");
      setOtpSending(false);
    }
  };

  const resetPassword = async (data: ResetForm) => {
    try {
      setPasswordResetting(true);
      await ResetPassword({
        email,
        password: data.password,
        confirm_password: data.confirm_password,
        otp: data.otp,
      });
      toast("Password reset successful. Please log in.");
      localStorage.removeItem("forgotPasswordData");
      router.push("/auth/login");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast(err?.response?.data?.message || "Failed to reset password");
    }
  };

  const handleResendOtp = async () => {
    if (!email) return toast("No email available");

    try {
      setResendLoading(true);
      await OTP(email);
      toast("OTP resent to your email");

      setResendCooldown(360);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      if (status === 429) return;
      const err = error as AxiosError<{ message: string }>;
      toast(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const paddedSecs = secs < 10 ? `0${secs}` : secs;
    return `${minutes}:${paddedSecs}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardHeader className="flex items-center justify-center pt-6">
          <Image src="/seedlet.png" alt="Logo" width={60} height={60} />
        </CardHeader>

        <CardContent>
          <h3 className="text-center text-h3 font-semibold mb-4">
            {step === "email" ? "Forgot Password?" : "Reset Your Password"}
          </h3>

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit(sendOtp)} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...emailRegister("email")}
                  className="pl-10"
                />
              </div>
              {emailErrors.email && (
                <p className="text-red-500 text-xs">
                  {emailErrors.email.message}
                </p>
              )}
              {/* Send OTP Button */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={otpSending}
              >
                {otpSending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-4">
                Back to{" "}
                <Link href="/auth/login" className="underline text-primary">
                  login
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit(resetPassword)} className="space-y-4">
              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="pl-10 pr-10"
                  {...register("password", {
                    onChange: (e) => setPasswordValue(e.target.value),
                    onBlur: () => setIsPasswordFocused(false),
                  })}
                  onFocus={() => setIsPasswordFocused(true)}
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
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}

              {/* Password Rules */}
              {isPasswordFocused && !allPassed && (
                <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-1">
                  {[
                    { key: "length", label: "At least 8 characters" },
                    { key: "uppercase", label: "One uppercase letter" },
                    { key: "lowercase", label: "One lowercase letter" },
                    { key: "number", label: "One number" },
                    { key: "special", label: "One special character" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"
                    >
                      {passwordRules[key as keyof typeof passwordRules] ? (
                        <CheckCircle size={13} className="text-green-500" />
                      ) : (
                        <Circle size={13} className="text-muted-foreground" />
                      )}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type={confirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="pl-10 pr-10"
                  {...register("confirm_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  tabIndex={-1}
                >
                  {confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs">
                  {errors.confirm_password.message}
                </p>
              )}

              {/* OTP */}
              <Input
                type="text"
                placeholder="Enter OTP"
                {...register("otp")}
                maxLength={6}
                inputMode="numeric"
              />
              {errors.otp && (
                <p className="text-red-500 text-xs">{errors.otp.message}</p>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={passwordResetting}
              >
                {passwordResetting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Password resetting...
                  </span>
                ) : (
                  "Reset password"
                )}
              </Button>

              {/* Resend OTP */}
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-muted-foreground">
                  Didn’t get the code?
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="text-primary p-0 h-auto"
                  disabled={resendLoading || resendCooldown > 0}
                  onClick={handleResendOtp}
                >
                  {resendLoading
                    ? "Resending..."
                    : resendCooldown > 0
                    ? `Resend in ${formatTime(resendCooldown)}`
                    : "Resend OTP"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
