'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Mail, Lock } from 'lucide-react'

const formSchema = z.object({
  usernameOrEmail: z.string().email('Please enter a username or email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof formSchema>

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
    localStorage.setItem('loginData', JSON.stringify(data))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl border border-border">
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
                  type="email"
                  placeholder="Username/Email"
                  {...register('usernameOrEmail')}
                  className="pl-10"
                />
              </div>
              {errors.usernameOrEmail && <p className="text-red-500 text-xs mt-1">{errors.usernameOrEmail.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  className="pl-10"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full cursor-pointer">
              Log in
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Don't have an account?{' '}
            <a href="/auth/signup" className="underline text-primary">Sign up</a>
          </p>

          <p className="text-xs text-center text-muted-foreground mt-4">
            <a href="/auth/forgotPassword" className="underline text-primary">
              Forgot your password?
            </a>
          </p>

          
        </CardContent>
      </Card>
    </div>
  )
}
