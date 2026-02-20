"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
       const [isLoading, setIsLoading] = useState(false)
       const [loadingText, setLoadingText] = useState('Logging in...')
       const [error, setError] = useState<string | null>(null)
       const [showPassword, setShowPassword] = useState(false)
       const supabase = createClient()
       const router = useRouter()

       const handleLogin = async (e: React.FormEvent) => {
              e.preventDefault()
              setIsLoading(true)
              setError(null)
              setLoadingText('Connecting...')

              const formData = new FormData(e.currentTarget as HTMLFormElement)
              const email = formData.get('email') as string
              const password = formData.get('password') as string

              // Show a helpful message after 5 seconds if still waiting
              const slowTimer = setTimeout(() => {
                     setLoadingText('Waking up server, please wait...')
              }, 5000)

              try {
                     const { data, error: authError } = await Promise.race([
                            supabase.auth.signInWithPassword({ email, password }),
                            new Promise<never>((_, reject) =>
                                   setTimeout(() => reject(new Error("Server is slow to respond. Please try again.")), 30000)
                            )
                     ])

                     clearTimeout(slowTimer)

                     if (authError) {
                            setError(authError.message || "Invalid credentials")
                            setIsLoading(false)
                            return
                     }

                     if (!data.session) {
                            setError("Login failed — no session returned")
                            setIsLoading(false)
                            return
                     }

                     // Short wait for Supabase session cookie to be written before
                     // doing a hard redirect (middleware needs the cookie to validate auth)
                     await new Promise(resolve => setTimeout(resolve, 500))
                     window.location.href = '/dashboard'
              } catch (err: any) {
                     clearTimeout(slowTimer)
                     console.error("Login error:", err)
                     setError(err?.message || "An unexpected error occurred")
                     setIsLoading(false)
              }
       }

       return (
              <div className="min-h-screen w-full flex bg-white">
                     {/* Left Side - Image (Full Height) */}
                     <div className="relative w-1/2 h-screen hidden md:block bg-black">
                            <Image
                                   src="/login-artwork.jpg"
                                   alt="The Career Company - Personal touch for your professional journey"
                                   fill
                                   className="object-contain p-24"
                                   priority
                            />
                     </div>

                     {/* Right Side - Login Form (Full Height) */}
                     <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative bg-white">
                            <div className="w-full max-w-md flex flex-col gap-8">
                                   {/* Intro */}
                                   <div className="text-center">
                                          <h1 className="text-[30px] font-bold text-[#1e232c] tracking-[-0.3px]">
                                                 Welcome back!
                                          </h1>
                                   </div>

                                   {/* Tabs for Login Type */}
                                   <Tabs defaultValue="password" className="w-full">
                                          <div className="flex justify-center mb-10">
                                                 <TabsList className="bg-white border border-black rounded-[25px] p-1 h-auto gap-2">
                                                        <TabsTrigger
                                                               value="password"
                                                               className="rounded-[20px] px-8 py-2 text-xs font-medium data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black data-[state=inactive]:bg-transparent shadow-none"
                                                        >
                                                               Login with Password
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                               value="otp"
                                                               className="rounded-[20px] px-8 py-2 text-xs font-medium data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black data-[state=inactive]:bg-transparent shadow-none"
                                                        >
                                                               Login with OTP
                                                        </TabsTrigger>
                                                 </TabsList>
                                          </div>

                                          <TabsContent value="password" className="space-y-6 mt-0">
                                                 <form onSubmit={handleLogin} className="space-y-6">
                                                        {error && (
                                                               <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md">
                                                                      {error}
                                                               </div>
                                                        )}
                                                        {/* Email Input */}
                                                        <div className="space-y-2">
                                                               <label className="text-[16px] text-[#0c1421] tracking-[0.16px]">Email</label>
                                                               <Input
                                                                      type="email"
                                                                      name="email"
                                                                      placeholder="Enter your email"
                                                                      className="h-[56px] bg-[#f7fbff] border-[#d4d7e3] text-[16px] placeholder:text-[#8897ad] rounded-[12px]"
                                                                      required
                                                               />
                                                        </div>

                                                        {/* Password Input */}
                                                        <div className="space-y-2">
                                                               <label className="text-[16px] text-[#0c1421] tracking-[0.16px]">Password</label>
                                                               <div className="relative">
                                                                      <Input
                                                                             type={showPassword ? "text" : "password"}
                                                                             name="password"
                                                                             placeholder="Enter your password"
                                                                             className="h-[56px] bg-[#f7fbff] border-[#d4d7e3] text-[16px] placeholder:text-[#8897ad] rounded-[12px] pr-12"
                                                                             required
                                                                      />
                                                                      <button
                                                                             type="button"
                                                                             onClick={() => setShowPassword(!showPassword)}
                                                                             className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                                             aria-label={showPassword ? "Hide password" : "Show password"}
                                                                      >
                                                                             {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                                                      </button>
                                                               </div>
                                                        </div>

                                                        {/* Forgot Password */}
                                                        <div className="flex justify-end">
                                                               <Link href="#" className="text-[16px] font-medium text-[#ff9e44] underline decoration-solid tracking-[0.16px]">
                                                                      Forgot Password?
                                                               </Link>
                                                        </div>

                                                        {/* Submit Button */}
                                                        <Button type="submit" disabled={isLoading} className="w-full h-[56px] text-[20px] bg-[#161616] hover:bg-black/90 rounded-[12px] tracking-[0.2px]">
                                                               {isLoading ? (
                                                                      <span className="flex items-center gap-2">
                                                                             <Loader2 className="animate-spin w-5 h-5" />
                                                                             {loadingText}
                                                                      </span>
                                                               ) : "Log in"}
                                                        </Button>
                                                 </form>
                                          </TabsContent>

                                          <TabsContent value="otp" className="space-y-6 mt-0">
                                                 <form onSubmit={handleLogin} className="space-y-6">
                                                        <div className="space-y-2">
                                                               <label className="text-[16px] text-[#0c1421] tracking-[0.16px]">Mobile Number</label>
                                                               <Input
                                                                      type="tel"
                                                                      placeholder="Enter mobile number"
                                                                      className="h-[56px] bg-[#f7fbff] border-[#d4d7e3] text-[16px] placeholder:text-[#8897ad] rounded-[12px]"
                                                                      required
                                                               />
                                                        </div>
                                                        <Button type="submit" className="w-full h-[56px] text-[20px] bg-[#161616] hover:bg-black/90 rounded-[12px] tracking-[0.2px]">
                                                               Send OTP
                                                        </Button>
                                                 </form>
                                          </TabsContent>
                                   </Tabs>

                                   {/* Footer */}
                                   <div className="text-center mt-4">
                                          <p className="text-[#62748e] text-[14px]">
                                                 Don&apos;t have an account? Contact your institute administrator
                                          </p>
                                   </div>
                            </div>
                     </div>
              </div >
       )
}
