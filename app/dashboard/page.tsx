import { ArrowRight, BookOpen, Briefcase, GraduationCap, LayoutPanelLeft, LineChart, Lock, MessageSquareText, Rocket, Sparkles, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
       return (
              <div className="max-w-[1440px] mx-auto p-8 space-y-12 pb-24">

                     {/* Welcome Section */}
                     <section className="bg-white rounded-[24px] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm border border-gray-100">
                            <div className="flex items-center gap-8">
                                   <div className="w-16 h-16 rounded-full bg-[#FF9E44] flex items-center justify-center text-white text-2xl font-bold">
                                          JD
                                   </div>
                                   <div className="space-y-1">
                                          <h1 className="text-3xl font-bold text-[#1e232c] flex items-center gap-2">
                                                 Welcome Back, John! <span className="text-2xl">👋</span>
                                          </h1>
                                          <p className="text-gray-500 font-medium">Senior Frontend Developer</p>
                                          <p className="text-gray-400 text-sm">Here&apos;s your space to explore opportunities and grow faster.</p>
                                   </div>
                            </div>

                            <div className="flex items-center gap-12 mt-8 md:mt-0">
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
                                   <Button className="bg-[#161616] text-white px-8 py-6 rounded-xl hover:bg-black">
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

                            {/* Industry Updates */}
                            <ActionCard
                                   title="Industry Updates"
                                   icon={<TrendingUp className="size-6" />}
                                   badges={["Tech Trends", "Market News", "Company Insights"]}
                                   color="bg-white"
                                   locked
                            />
                     </section>

                     {/* Main Grid: Courses & Side Sidebar */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                            {/* Left: Recommended Courses & Projects */}
                            <div className="lg:col-span-2 space-y-12">

                                   {/* Recommended Courses */}
                                   <div className="space-y-6">
                                          <div className="flex items-center justify-between">
                                                 <h2 className="text-2xl font-bold text-[#1e232c]">Recommended Courses</h2>
                                                 <Link href="#" className="text-[#FF9E44] font-semibold flex items-center gap-1">
                                                        View all <ArrowRight className="size-4" />
                                                 </Link>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                 <CourseCard
                                                        title="Full-Stack Web Development"
                                                        instructor="Dr. Sarah Johnson"
                                                        level="Intermediate"
                                                        duration="12 weeks"
                                                        students="2.4k students"
                                                        progress={60}
                                                        buttonText="Continue"
                                                 />
                                                 <CourseCard
                                                        title="Data Science Fundamentals"
                                                        instructor="Prof. Mark Chen"
                                                        level="Beginner"
                                                        duration="8 weeks"
                                                        students="1.8k students"
                                                        buttonText="Enroll Now"
                                                 />
                                                 <CourseCard
                                                        title="Digital Marketing Mastery"
                                                        instructor="Emma Williams"
                                                        level="Intermediate"
                                                        duration="6 weeks"
                                                        students="3.2k students"
                                                        buttonText="Enroll Now"
                                                 />
                                                 <CourseCard
                                                        title="UX/UI Design Principles"
                                                        instructor="Alex Thompson"
                                                        level="Intermediate"
                                                        duration="10 weeks"
                                                        students="1.5k students"
                                                        buttonText="Enroll Now"
                                                 />
                                          </div>
                                   </div>

                                   {/* Featured Projects */}
                                   <div className="space-y-6">
                                          <div className="flex items-center justify-between">
                                                 <h2 className="text-2xl font-bold text-[#1e232c]">Featured Projects</h2>
                                                 <Link href="#" className="text-[#FF9E44] font-semibold flex items-center gap-1">
                                                        View all <ArrowRight className="size-4" />
                                                 </Link>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                 <ProjectCard
                                                        title="E-commerce Website Builder"
                                                        company="TechCorp"
                                                        duration="3-6 months"
                                                        type="Remote"
                                                        stack={["React", "Node.js", "MongoDB"]}
                                                 />
                                                 <ProjectCard
                                                        title="Data Analytics Dashboard"
                                                        company="DataViz Inc."
                                                        duration="2-4 months"
                                                        type="Hybrid"
                                                        stack={["Python", "PowerBI", "SQL"]}
                                                 />
                                          </div>
                                   </div>
                            </div>

                            {/* Right: Trending Industry Updates */}
                            <div className="space-y-12">
                                   <div className="space-y-6">
                                          <div className="flex items-center justify-between">
                                                 <h2 className="text-2xl font-bold text-[#1e232c]">Industry Updates</h2>
                                                 <Link href="#" className="text-[#FF9E44] font-semibold">View all</Link>
                                          </div>

                                          <div className="space-y-6">
                                                 <UpdateCard
                                                        category="Artificial Intelligence"
                                                        title="AI Bootcamp: Emerging from Leading Tech Accelerators"
                                                        time="Yesterday"
                                                        tag="Hot"
                                                        icon="💡"
                                                 />
                                                 <UpdateCard
                                                        category="Career AI"
                                                        title="New Career Path in AI/ML Companies: Entry-Level Guide"
                                                        time="Yesterday"
                                                        tag="Hot"
                                                        icon="🚀"
                                                 />
                                                 <UpdateCard
                                                        category="Technology"
                                                        title="What Developers Need to Know about AI in 2025"
                                                        time="2 days ago"
                                                        tag="Featured"
                                                        icon="📰"
                                                 />
                                          </div>
                                   </div>
                            </div>
                     </div>

                     {/* Personalized Recommendations */}
                     <section className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                          <Sparkles className="size-6 text-[#FF9E44]" />
                                          <h2 className="text-2xl font-bold text-[#1e232c]">Personalized Recommendations</h2>
                                          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ml-2">AI-Powered</span>
                                   </div>
                            </div>

                            <div className="space-y-4">
                                   <RecommendationItem
                                          title="Focus on Communication Skills"
                                          priority="high"
                                          description="Based on your profile bottlenecks, improving communication will help with interviews."
                                          action="View Courses"
                                          icon={<LineChart className="size-6 text-orange-500" />}
                                   />
                                   <RecommendationItem
                                          title="Advanced Data Analytics Course"
                                          priority="medium"
                                          description="Matches your interest in Data Analyst roles and Technology sector."
                                          action="Enroll Now"
                                          icon={<BookOpen className="size-6 text-blue-500" />}
                                   />
                                   <RecommendationItem
                                          title="Connect with Sarah Chen"
                                          priority="high"
                                          description="Senior Data Analyst at Google - Great match for your career goals."
                                          action="Book Session"
                                          icon={<Users className="size-6 text-purple-500" />}
                                   />
                            </div>

                            <div className="bg-[#FFF5ED] p-4 rounded-xl flex items-center justify-center gap-2 text-sm text-[#FF9E44] font-medium">
                                   💡 These recommendations update daily based on your activity and progress
                            </div>
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

function RecommendationItem({ title, priority, description, action, icon }: any) {
       return (
              <div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 gap-6">
                     <div className="flex items-center gap-6 flex-1 w-full">
                            <div className="size-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                                   {icon}
                            </div>
                            <div className="space-y-1">
                                   <div className="flex items-center gap-3">
                                          <h5 className="font-bold text-[#1e232c]">{title}</h5>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${priority === "high" ? "bg-red-50 text-red-500" : "bg-yellow-50 text-yellow-600"}`}>
                                                 {priority}
                                          </span>
                                   </div>
                                   <p className="text-gray-400 text-sm">{description}</p>
                            </div>
                     </div>
                     <Button className="whitespace-nowrap rounded-xl px-6 font-bold bg-black text-white hover:bg-black/90 w-full md:w-auto">
                            {action}
                     </Button>
              </div>
       )
}
