"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CircleUser, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function DashboardLayout({
       children,
}: {
       children: React.ReactNode
}) {
       const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     {/* Header */}
                     <header className="fixed top-0 left-0 right-0 bg-black z-50">
                            <div className="h-[64px] md:h-[104px] px-4 md:px-12 flex items-center justify-between">
                                   {/* Hamburger - mobile only */}
                                   <button
                                          onClick={() => setMobileMenuOpen(prev => !prev)}
                                          className="md:hidden text-white p-2 -ml-2"
                                          aria-label="Toggle menu"
                                   >
                                          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                                   </button>

                                   {/* Logo - centered on mobile, left on desktop */}
                                   <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:w-[200px] flex items-center shrink-0">
                                          <Link href="/dashboard" className="relative w-[40px] h-[40px] md:w-[64px] md:h-[64px] hover:opacity-80 transition-opacity">
                                                 <Image
                                                        src="/login-artwork.jpg"
                                                        alt="Logo"
                                                        fill
                                                        className="object-cover rounded-xl"
                                                 />
                                          </Link>
                                   </div>

                                   {/* Navigation - desktop only */}
                                   <nav className="hidden md:flex items-center gap-12 text-[16px] font-medium grow justify-center">
                                          <NavLink href="/dashboard">Home</NavLink>
                                          <NavLink href="/my-journey">My Journey</NavLink>
                                          <NavLink href="#">Courses</NavLink>
                                          <NavLink href="#">Projects</NavLink>
                                          <NavLink href="#">Industry Updates</NavLink>
                                   </nav>

                                   {/* Profile - desktop only */}
                                   <div className="hidden md:flex w-[200px] justify-end items-center shrink-0">
                                          <Link href="/profile" className="hover:opacity-80 transition-opacity">
                                                 <UserProfile />
                                          </Link>
                                   </div>

                                   {/* Spacer on mobile to balance hamburger */}
                                   <div className="w-10 md:hidden" />
                            </div>

                            {/* Mobile dropdown menu */}
                            <div
                                   className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-[400px] border-t border-gray-800" : "max-h-0"}`}
                            >
                                   <nav className="flex flex-col px-6 py-4 gap-1">
                                          <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                                          <MobileNavLink href="/my-journey" onClick={() => setMobileMenuOpen(false)}>My Journey</MobileNavLink>
                                          <MobileNavLink href="#" onClick={() => setMobileMenuOpen(false)}>Courses</MobileNavLink>
                                          <MobileNavLink href="#" onClick={() => setMobileMenuOpen(false)}>Projects</MobileNavLink>
                                          <MobileNavLink href="#" onClick={() => setMobileMenuOpen(false)}>Industry Updates</MobileNavLink>
                                          <div className="border-t border-gray-800 mt-2 pt-3">
                                                 <Link
                                                        href="/profile"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors py-2"
                                                 >
                                                        <UserProfile />
                                                        <span className="text-sm font-medium">My Profile</span>
                                                 </Link>
                                          </div>
                                   </nav>
                            </div>
                     </header>

                     {/* Content */}
                     <main className="pt-[64px] md:pt-[104px]">
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

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
       const pathname = usePathname()
       const isActive = pathname === href

       return (
              <Link
                     href={href}
                     onClick={onClick}
                     className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-[#FF9E44] bg-gray-800/50" : "text-gray-300 hover:text-white hover:bg-gray-800/30"}`}
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
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 overflow-hidden">
                     {isLoading ? (
                            <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                     ) : userInitials ? (
                            <span className="text-white font-medium text-xs md:text-sm">{userInitials}</span>
                     ) : (
                            <CircleUser className="size-6 md:size-7 text-white" />
                     )}
              </div>
       )
}
