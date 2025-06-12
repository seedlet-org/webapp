"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (data: FormData) => {
    console.log("Sending OTP to:", data.email);
    localStorage.setItem("forgotPasswordData", JSON.stringify(data));
    setEmail(data.email);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    console.log("Verifying OTP:", otp);
  };

  const handleResendOtp = () => {
    console.log("Resending OTP to:", email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardHeader className="flex items-center justify-center pt-6">
          <Image src="/seedlet.png" alt="Logo" width={60} height={60} />
        </CardHeader>

        <CardContent>
          {!otpSent ? (
            <>
              <h3 className="text-center text-h3 font-semibold">Forgot Password?</h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input type="email" placeholder="Enter your email" {...register("email")} className="pl-10" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full cursor-pointer">
                  Send OTP
                </Button>
              </form>

              <p className="text-sm text-center text-muted-foreground mt-4">
                Back to{" "}
                <a href="/auth/login" className="underline text-primary">
                  login
                </a>
              </p>
            </>
          ) : (
            <>
              <h3 className="text-center text-h3 font-semibold">Enter the OTP</h3>
              {/* OTP */}
              <div className="space-y-4 mt-4">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,6}$/.test(value)) {
                      setOtp(value);
                    }
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="\d*"
                />

                {/* Submit Button */}
                <Button onClick={handleVerifyOtp} className="w-full cursor-pointer">
                  Verify OTP
                </Button>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Didn’t get the code?{" "}
                  <button onClick={handleResendOtp} className="text-primary underline cursor-pointer" type="button">
                    Resend OTP
                  </button>
                </p>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Back to{" "}
                  <a href="/auth/forgotPassword" className="underline text-primary">
                    Forgot password
                  </a>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
