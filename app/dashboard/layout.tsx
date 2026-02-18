"use client"

import Link from "next/link"
import Image from "next/image"
import { CircleUser } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function DashboardLayout({
       children,
}: {
       children: React.ReactNode
}) {
       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     {/* Header */}
                     <header className="fixed top-0 left-0 right-0 h-[80px] md:h-[104px] bg-black z-50 px-4 md:px-12 flex items-center justify-between transition-all">
                            {/* Logo - Fixed Width to allow centering */}
                            <div className="w-auto md:w-[200px] flex items-center shrink-0">
                                   <Link href="/dashboard" className="relative w-[48px] h-[48px] md:w-[64px] md:h-[64px] hover:opacity-80 transition-opacity">
                                          <Image
                                                 src="/login-artwork.jpg"
                                                 alt="Logo"
                                                 fill
                                                 className="object-cover rounded-xl"
                                          />
                                   </Link>
                            </div>

                            {/* Navigation - Centered */}
                            <nav className="flex items-center gap-4 md:gap-12 text-[14px] md:text-[16px] font-medium grow justify-center overflow-x-auto no-scrollbar px-4">
                                   <NavLink href="/dashboard">Home</NavLink>
                                   <NavLink href="/my-journey">My Journey</NavLink>
                                   <span className="hidden md:inline-flex gap-12">
                                          <NavLink href="#">Courses</NavLink>
                                          <NavLink href="#">Projects</NavLink>
                                          <NavLink href="#">Industry Updates</NavLink>
                                   </span>
                            </nav>

                            {/* Profile - Fixed Width to allow centering */}
                            <div className="w-[200px] flex justify-end items-center shrink-0">
                                   <UserProfile />
                            </div>
                     </header>

                     {/* Content */}
                     <main className="pt-[80px] md:pt-[104px]">
                            {children}
                     </main>
              </div>
       )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
       const pathname = usePathname()
       const isActive = pathname === href

       return (
              <Link
                     href={href}
                     className={`transition-colors ${isActive ? "text-[#FF9E44]" : "text-gray-300 hover:text-white"}`}
              >
                     {children}
              </Link>
       )
}

function UserProfile() {
       const { profile, isLoading } = useAuth()
       const userInitials = profile?.full_name
              ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
              : null

       return (
              <Link href="/profile" className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 hover:bg-gray-700 transition-colors overflow-hidden">
                     {isLoading ? (
                            <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                     ) : userInitials ? (
                            <span className="text-white font-medium text-sm">{userInitials}</span>
                     ) : (
                            <CircleUser className="size-7 text-white" />
                     )}
              </Link>
       )
}
