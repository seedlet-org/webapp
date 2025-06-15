"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { RegisterPayload, APIError } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  userName: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {mutate, isPending} = useRegister();
  const router = useRouter();

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

  const onSubmit = (data: FormData) => {
    const payload: RegisterPayload = {
      firstname: data.firstName,
      lastname: data.lastName,
      username: data.userName,
      email: data.email,
      password: data.password,
    };

    mutate(payload, {
      onSuccess: (res) => {
        console.log("Registered successfully:", res);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        router.push("/auth/login");
      }, 
      onError: (err: APIError) => {
        const errorMessage = err?.message || "Something went wrong";
        console.error("Signup error: ", errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardHeader className="flex items-center gap-2 justify-center pt-6">
          <Image src="/seedlet.png" alt="Logo" width={60} height={60} />
        </CardHeader>

        <CardContent>
          <h3 className="text-center text-h3 font-semibold">Create your account</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* First Name */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input type="text" placeholder="First Name" {...register("firstName")} className="pl-10" />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            {/* Last Name */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input type="text" placeholder="Last Name" {...register("lastName")} className="pl-10" />
              </div>
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>

            {/* Username */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input type="text" placeholder="Username" {...register("userName")} className="pl-10" />
              </div>
              {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input type="email" placeholder="Email" {...register("email")} className="pl-10" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input type={showPassword ? "text" : "password"} placeholder="Password" {...register("password")} className="pl-10 pr-10" />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
              {isPending ? " Creating account..." : "Create account"}
            </Button>
          </form>

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
