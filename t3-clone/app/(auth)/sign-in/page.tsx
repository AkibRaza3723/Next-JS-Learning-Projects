"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

const SignInPage = () => {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    try {
      if (isSignUp) {
        await authClient.signUp.email(
          {
            email,
            password,
            name: name.trim() || email.split('@')[0],
            callbackURL: '/',
          },
          {
            onRequest: () => setLoading(true),
            onSuccess: () => {
              setLoading(false)
              router.push('/')
              router.refresh()
            },
            onError: (ctx) => {
              setLoading(false)
              setErrorMessage(ctx.error.message || 'Failed to sign up. Please try again.')
            },
          }
        )
      } else {
        await authClient.signIn.email(
          {
            email,
            password,
            callbackURL: '/',
          },
          {
            onRequest: () => setLoading(true),
            onSuccess: () => {
              setLoading(false)
              router.push('/')
              router.refresh()
            },
            onError: (ctx) => {
              setLoading(false)
              setErrorMessage(ctx.error.message || 'Invalid email or password.')
            },
          }
        )
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMessage(err?.message || 'An unexpected error occurred.')
    }
  }

  const handleGithubSignIn = async () => {
    setErrorMessage(null)
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      })
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign in with GitHub.')
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8">
      {/* Brand Header */}
      <div className="flex flex-row justify-center items-center gap-x-2 mb-2">
        <h1 className="text-3xl font-extrabold text-foreground whitespace-nowrap">Welcome to</h1>
        <Image
          src="/logo.svg"
          alt="logo"
          width={142}
          height={142}
          style={{ width: 'auto', height: 'auto' }}
          priority
        />
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-sm shadow-md border">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-bold">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your details to register a new account'
              : 'Enter your email ID and password to continue'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5 text-left">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5 text-left">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-2 cursor-pointer font-semibold bg-purple-400 hover:bg-purple-600 text-white" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <Separator className="w-full" />
            <span className="absolute bg-card px-2 text-xs uppercase text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Social Sign In */}
          <Button
            variant="outline"
            type="button"
            className="w-full py-5 flex items-center justify-center gap-2 cursor-pointer border hover:bg-accent"
            onClick={handleGithubSignIn}
            disabled={loading}
          >
            <Image src="/github.svg" alt="github" width={20} height={20} />
            <span className="font-semibold">Sign in with GitHub</span>
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-3 text-sm text-muted-foreground">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false)
                  setErrorMessage(null)
                }}
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true)
                  setErrorMessage(null)
                }}
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </section>
  )
}

export default SignInPage