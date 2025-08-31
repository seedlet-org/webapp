"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  Circle,
  Loader2,
  Info,
} from "lucide-react";
import { useState } from "react";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { RegisterPayload, APIError } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { OTP } from "@/features/auth/api";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  userName: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
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
});
type FormData = z.infer<typeof formSchema>;

const otpSchema = z.object({
  otp: z.string().min(6, "Otp must be upt to 6 characters"),
});
type otpFormData = z.infer<typeof otpSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [otpSending, setOtpSending] = useState(false);
  const { mutate, isPending } = useRegister();
  const router = useRouter();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  const {
    register: otpRegister,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<otpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: FormData) => {
    const signupData = {
      firstname: data.firstName,
      lastname: data.lastName,
      username: data.userName,
      email: data.email,
      password: data.password,
    };
    localStorage.setItem("SignupData", JSON.stringify(signupData));

    try {
      setOtpSending(true);
      await OTP(data.email);
      setStep("otp");
      toast("OTP sent to your email");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      if (status === 429) return;
      const errorMessage = error as AxiosError<{ message: string }>;
      toast(errorMessage?.response?.data.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const checkPassword = (password: string) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const passwordRules = checkPassword(passwordValue);
  const allPassed = Object.values(passwordRules).every(Boolean);

  const handleOtpSubmit = async (data: otpFormData) => {
    localStorage.setItem("otpCode", data.otp);
    const rawData = localStorage.getItem("SignupData");
    if (!rawData) {
      toast("No data available, please sign up");
      return;
    }
    const signupData = JSON.parse(rawData) as RegisterPayload;
    const payload = {
      ...signupData,
      otp: data.otp,
    };
    mutate(payload, {
      onSuccess: () => {
        toast("Account created successfully");
        localStorage.removeItem("SignupData");
        localStorage.removeItem("otpCode");
        router.push("/auth/login");
      },
      onError: (err: APIError) => {
        const error = err as AxiosError<{ message: string }>;
        const errorMessage =
          error?.response?.data.message ||
          "Something went wrong, please try again";
        toast(errorMessage);
      },
    });
  };

  const handleResendOtp = async () => {
    const rawData = localStorage.getItem("SignupData");
    if (!rawData) {
      toast("No data available, please sign up");
      return;
    }
    const { email } = JSON.parse(rawData);

    try {
      setResendLoading(true);
      await OTP(email);
      toast("OTP sent to your email");
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
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      if (status === 429) return;
      const error = err as AxiosError<{ message: string }>;
      toast(error?.response?.data.message || "Failed to resend OTP");
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
        <CardHeader className="flex items-center gap-2 justify-center pt-6">
          <Image src="/seedlet.png" alt="Logo" width={60} height={60} />
        </CardHeader>

        <CardContent>
          <h3 className="text-center text-h3 font-semibold">
            Create your account
          </h3>

          {step === "signup" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div>
                {/* Firstname */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName")}
                    className="pl-10"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                {/* Lastname */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName")}
                    className="pl-10"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                {/* Username */}
                <div className="relative flex items-center">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />

                  <Input
                    type="text"
                    placeholder="Username"
                    {...register("userName")}
                    className="pl-10 pr-8"
                    onFocus={() => setTooltipOpen(true)}
                    onBlur={() => setTooltipOpen(false)}
                  />

                  <TooltipProvider>
                    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                      <TooltipTrigger asChild>
                        <Info className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Username can only contain letters and numbers.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {errors.userName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              <div>
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

                {/* Password rules */}
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
              </div>

              {/* Create account Button */}
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
                  "Create account"
                )}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={handleSubmitOtp(handleOtpSubmit)}
              className="space-y-4 mt-6"
            >
              <div>
                {/* OTP */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    {...otpRegister("otp")}
                    className="pl-10"
                  />
                </div>
                {otpErrors.otp && (
                  <p className="text-red-500 text-xs mt-1">
                    {otpErrors.otp.message}
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP & Register"
                )}
              </Button>

              {/* Resend OTP */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Didn’t get the code?
                </p>
                <Button
                  type="button"
                  variant="link"
                  disabled={resendLoading || resendCooldown > 0}
                  onClick={handleResendOtp}
                  className="text-primary p-0 h-auto"
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

          {/* Already have an account? */}
          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline text-primary">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
