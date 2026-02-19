"use client"
import { ArrowRight, BookOpen, Briefcase, Building2, GraduationCap, LayoutPanelLeft, LineChart, Lock, Mail, MessageSquareText, Phone, Rocket, Sparkles, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export default function DashboardPage() {
       const { user, profile, isLoading } = useAuth()

       // Get user's first name or default to "User"
       const firstName = profile?.full_name?.split(' ')[0] || "User"
       const userInitials = profile?.full_name
              ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
              : "JD"

       return (
              <div className="max-w-[1440px] mx-auto p-8 space-y-12 pb-24">

                     {/* Welcome Section */}
                     <section className="bg-white rounded-[24px] p-6 lg:p-8 xl:p-10 flex flex-col xl:flex-row items-center justify-between shadow-sm border border-gray-100">
                            <div className="flex items-center gap-6 xl:gap-8 w-full xl:w-auto">
                                   <div className="w-16 h-16 rounded-full bg-[#FF9E44] flex items-center justify-center text-white text-2xl font-bold shrink-0">
                                          {isLoading ? "..." : userInitials}
                                   </div>
                                   <div className="space-y-2 min-w-0">
                                          <h1 className="text-2xl lg:text-3xl font-bold text-[#1e232c]">
                                                 <span className="flex items-center gap-2">
                                                        <span>Welcome Back,</span> <span className="text-2xl">👋</span>
                                                 </span>
                                                 <span className="block sm:inline truncate">{isLoading ? "..." : firstName}!</span>
                                          </h1>
                                          <div className="flex flex-col gap-1.5">
                                                 {profile?.institute_name && (
                                                        <p className="text-gray-600 font-medium flex items-center gap-2 truncate">
                                                               <Building2 className="size-4 text-[#FF9E44] shrink-0" />
                                                               <span className="truncate">{profile.institute_name}</span>
                                                        </p>
                                                 )}
                                                 <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                               <Mail className="size-4 text-[#FF9E44] shrink-0" />
                                                               {profile?.email || "email@example.com"}
                                                        </span>
                                                        {profile?.phone && (
                                                               <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                                      <Phone className="size-4 text-[#FF9E44] shrink-0" />
                                                                      {profile.phone}
                                                               </span>
                                                        )}
                                                 </div>
                                          </div>
                                   </div>
                            </div>

                            <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-8 mt-8 xl:mt-0 w-full xl:w-auto">
                                   <div className="flex items-center justify-center gap-4 lg:gap-8 w-full xl:w-auto">
                                          <div className="text-center">
                                                 <p className="text-3xl font-bold text-[#1e232c]">85%</p>
                                                 <p className="text-gray-500 text-sm">Profile</p>
                                          </div>
                                          <div className="text-center">
                                                 <p className="text-3xl font-bold text-[#1e232c]">12</p>
                                                 <p className="text-gray-500 text-sm">Applications</p>
                                          </div>
                                          <div className="text-center">
                                                 <p className="text-3xl font-bold text-[#1e232c]">3</p>
                                                 <p className="text-gray-500 text-sm">Interviews</p>
                                          </div>
                                   </div>
                                   <Button className="bg-[#161616] text-white px-6 py-4 h-auto rounded-xl hover:bg-black w-full xl:w-auto whitespace-nowrap text-sm lg:text-base">
                                          Complete Profile
                                   </Button>
                            </div>
                     </section>

                     {/* Quick Action Cards */}
                     <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Placement Card */}
                            <Link href="/my-journey" className="block h-full">
                                   <Card className="bg-black text-white h-[253px] flex flex-col items-center justify-center text-center p-6 rounded-[24px] cursor-pointer hover:bg-black/90 transition-colors">
                                          <Rocket className="size-12 mb-4 text-[#FF9E44]" />
                                          <p className="text-xl font-bold leading-tight">Your Placement<br />Preparation Journey</p>
                                   </Card>
                            </Link>

                            {/* Find Mentors */}
                            <ActionCard
                                   title="Find Mentors"
                                   icon={<Users className="size-6" />}
                                   badges={["Diagnostic Interview", "Practice Interview", "Resume Review"]}
                                   color="bg-[#FFF5ED]"
                                   iconColor="text-[#FF9E44]"
                            />

                            {/* Build Resume */}
                            <ActionCard
                                   title="Build Resume"
                                   icon={<BookOpen className="size-6" />}
                                   badges={["Template Library", "AI Suggestions", "Export PDF"]}
                                   color="bg-white"
                                   locked
                            />

                            {/* Find Courses */}
                            <ActionCard
                                   title="Find Courses"
                                   icon={<GraduationCap className="size-6" />}
                                   badges={["Web Dev", "Data Science", "UI/UX Design"]}
                                   color="bg-white"
                                   locked
                            />

                            {/* Find a Job */}
                            <ActionCard
                                   title="Find a Job"
                                   icon={<Briefcase className="size-6" />}
                                   badges={["Full-time", "Remote", "Internship"]}
                                   color="bg-white"
                                   locked
                            />

                            {/* Find Projects */}
                            <ActionCard
                                   title="Find Projects"
                                   icon={<LayoutPanelLeft className="size-6" />}
                                   badges={["Open Source", "Client Work", "Skill Building"]}
                                   color="bg-[#FFF5ED]"
                                   locked
                            />

                            {/* AI Mock Interview */}
                            <ActionCard
                                   title="AI Mock Interview"
                                   icon={<MessageSquareText className="size-6" />}
                                   badges={["Real-time feedback", "Speech Analysis", "Score Report"]}
                                   color="bg-white"
                                   locked
                            />

                     </section>




              </div>
       )
}

function ActionCard({ title, icon, badges, color, iconColor = "text-gray-400", locked }: any) {
       return (
              <Card className={`h-[253px] rounded-[24px] border-none shadow-sm ${color} p-6 relative flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all`}>
                     <div className="absolute top-6 right-6 flex items-center gap-2">
                            {locked && (
                                   <div className="size-8 rounded-full bg-[#FF9E44] flex items-center justify-center shadow-sm">
                                          <Lock className="size-4 text-white" />
                                   </div>
                            )}
                            <div className="p-2 rounded-full border border-gray-100 bg-white shadow-sm text-gray-400">
                                   {icon}
                            </div>
                     </div>
                     <div className="space-y-3 mt-12">
                            <div className="flex flex-wrap gap-2">
                                   {badges.map((b: string) => (
                                          <span key={b} className="bg-white/80 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-medium text-gray-500 border border-gray-100">
                                                 {b}
                                          </span>
                                   ))}
                            </div>
                            <p className="text-xl font-bold text-[#1e232c]">{title}</p>
                     </div>
              </Card>
       )
}

function CourseCard({ title, instructor, level, duration, students, progress, buttonText }: any) {
       return (
              <Card className="rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-6">
                     <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                   <h3 className="font-bold text-lg text-[#1e232c] line-clamp-1">{title}</h3>
                                   <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full tracking-wider">{level}</span>
                            </div>
                            <p className="text-gray-400 text-sm">By {instructor}</p>
                     </div>

                     <div className="flex items-center gap-6 text-xs text-gray-400 font-medium">
                            <span className="flex items-center gap-1.5"><ArrowRight className="size-3" /> {duration}</span>
                            <span className="flex items-center gap-1.5"><Users className="size-3" /> {students}</span>
                     </div>

                     {progress && (
                            <div className="space-y-2">
                                   <div className="flex items-center justify-between text-xs font-bold">
                                          <span className="text-gray-400">Progress</span>
                                          <span className="text-black">{progress}%</span>
                                   </div>
                                   <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                          <div className="h-full bg-[#FF9E44]" style={{ width: `${progress}%` }} />
                                   </div>
                            </div>
                     )}

                     <Button className={`w-full py-6 rounded-xl font-bold ${buttonText === "Continue" ? "bg-black text-white" : "bg-white border-2 border-black text-black hover:bg-black hover:text-white"}`}>
                            {buttonText}
                     </Button>
              </Card>
       )
}

function ProjectCard({ title, company, duration, type, stack }: any) {
       return (
              <Card className="rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-6">
                     <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                   <h3 className="font-bold text-lg text-[#1e232c] line-clamp-1">{title}</h3>
                                   <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full tracking-wider">Intermediate</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                   <div className="size-5 bg-gray-100 rounded p-1" />
                                   {company}
                            </div>
                     </div>

                     <div className="flex items-center gap-4">
                            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{duration}</span>
                            <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{type}</span>
                     </div>

                     <div className="flex flex-wrap gap-2">
                            {stack.map((s: string) => (
                                   <span key={s} className="text-[10px] font-bold text-gray-500 bg-white border border-gray-100 px-3 py-1 rounded-full">
                                          {s}
                                   </span>
                            ))}
                     </div>

                     <Button className="w-full py-6 rounded-xl font-bold bg-black text-white">
                            View Project
                     </Button>
              </Card>
       )
}

function UpdateCard({ category, title, time, tag, icon }: any) {
       return (
              <Card className="rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-6">
                     <div className="flex gap-6">
                            <div className="text-3xl mt-1">{icon}</div>
                            <div className="space-y-4 flex-1">
                                   <div className="space-y-2">
                                          <h4 className="font-bold text-[#1e232c] leading-tight">{category}</h4>
                                          <p className="text-gray-400 text-sm line-clamp-2 md:line-clamp-none">{title}</p>
                                   </div>
                                   <div className="flex items-center justify-between">
                                          <span className="text-xs font-medium text-gray-400">{time}</span>
                                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">{tag}</span>
                                   </div>
                            </div>
                     </div>
                     <Button className="w-full py-6 rounded-xl font-bold bg-black text-white">
                            Read More
                     </Button>
              </Card>
       )
}


