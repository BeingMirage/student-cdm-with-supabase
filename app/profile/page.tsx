"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
       Mail, Phone, MapPin, FileText, Download, Share2,
       CheckCircle2, Star, Calendar, ExternalLink, ChevronRight,
       Clock, Award, TrendingUp, CheckCircle, AlertCircle
} from "lucide-react"
import Link from "next/link"

// ─── Data ────────────────────────────────────────────────────────────

const tabs = ["Overview", "Diagnostic Interview", "Resume Review", "Practice Interview", "AI Interview"] as const
type Tab = (typeof tabs)[number]

const journeyItems = [
       { title: "Diagnostic Interview", date: "2024-01-15", status: "Initial assessment completed", color: "bg-red-500" },
       { title: "Resume Review", date: "2024-01-22", status: "Resume updated", color: "bg-orange-500" },
       { title: "Practice Interview", date: "2024-02-05", status: "Significant improvement", color: "bg-orange-500" },
       { title: "AI Interview", date: "2024-02-12", status: "Strong performance", color: "bg-orange-500" },
       { title: "Final Preparation", date: "2025-03-01", status: "Ongoing", color: "bg-gray-300" },
       { title: "Mock Interview", date: "2024-03-15", status: "Scheduled", color: "bg-gray-300" },
]

const achievements = [
       { icon: "🏆", title: "Top Performer - DSA Module", date: "2024-01-30", bg: "bg-blue-900" },
       { icon: "⭐", title: "Perfect Attendance", date: "2024-02-01", bg: "bg-amber-500" },
       { icon: "❤️", title: "Peer Recognition Award", date: "2024-02-15", bg: "bg-pink-500" },
]

// ─── Main Component ──────────────────────────────────────────────────

export default function ProfilePage() {
       const [activeTab, setActiveTab] = useState<Tab>("Overview")

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     {/* Page Header */}
                     <div className="max-w-[1400px] mx-auto px-8">
                            <div className="flex items-center justify-between py-4">
                                   <div>
                                          <h1 className="text-2xl font-bold text-[#1e232c]">Student File</h1>
                                          <p className="text-sm text-[#FF9E44]">Comprehensive student profile and progress tracking</p>
                                   </div>
                                   <div className="flex items-center gap-3">
                                          <Button variant="outline" className="rounded-lg gap-2 text-sm font-medium border-gray-200">
                                                 <FileText className="size-4" /> View Resume
                                          </Button>
                                          <Button variant="outline" className="rounded-lg gap-2 text-sm font-medium border-gray-200">
                                                 <Download className="size-4" /> Download
                                          </Button>
                                          <Button variant="outline" className="rounded-lg gap-2 text-sm font-medium border-gray-200">
                                                 <Share2 className="size-4" /> Share
                                          </Button>
                                   </div>
                            </div>

                            {/* Student Info */}
                            <div className="flex items-center gap-5 pb-6">
                                   <div className="size-16 rounded-full bg-[#FFF5ED] border-2 border-[#FF9E44] flex items-center justify-center text-[#FF9E44] text-xl font-bold shrink-0">
                                          RK
                                   </div>
                                   <div>
                                          <h2 className="text-xl font-bold text-[#1e232c]">Rajesh Kumar</h2>
                                          <p className="text-sm text-gray-500">Indian Institute of Technology, Delhi • B.Tech - Computer Science</p>
                                          <p className="text-sm text-[#FF9E44] font-medium">2024 • Final Year</p>
                                          <div className="flex items-center gap-5 mt-1 text-xs text-gray-500">
                                                 <span className="flex items-center gap-1"><Mail className="size-3" /> rajesh.kumar@iitd.ac.in</span>
                                                 <span className="flex items-center gap-1"><Phone className="size-3" /> +91 98765 43210</span>
                                                 <span className="flex items-center gap-1"><MapPin className="size-3" /> New Delhi, India</span>
                                          </div>
                                   </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="flex items-center gap-1 border-b border-gray-200">
                                   {tabs.map((tab) => (
                                          <button
                                                 key={tab}
                                                 onClick={() => setActiveTab(tab)}
                                                 className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab
                                                        ? "bg-[#FF9E44] text-white"
                                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                                        }`}
                                          >
                                                 {tab}
                                          </button>
                                   ))}
                            </div>
                     </div>

                     {/* Content */}
                     <div className="max-w-[1400px] mx-auto px-8 py-8">
                            <div className="flex gap-8">
                                   {/* Left Sidebar */}
                                   <div className="w-[240px] shrink-0 space-y-6">
                                          <Sidebar />
                                   </div>

                                   {/* Main Content */}
                                   <div className="flex-1 min-w-0">
                                          {activeTab === "Overview" && <OverviewTab />}
                                          {activeTab === "Diagnostic Interview" && <DiagnosticInterviewTab />}
                                          {activeTab === "Resume Review" && <ResumeReviewTab />}
                                          {activeTab === "Practice Interview" && <PracticeInterviewTab />}
                                          {activeTab === "AI Interview" && <AIInterviewTab />}
                                   </div>
                            </div>
                     </div>
              </div>
       )
}

// ─── Sidebar ─────────────────────────────────────────────────────────

function Sidebar() {
       return (
              <>
                     {/* Student Journey */}
                     <Card className="p-5 rounded-2xl border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1e232c] mb-4">Student Journey</h3>
                            <div className="relative">
                                   <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                                   <div className="space-y-5">
                                          {journeyItems.map((item, i) => (
                                                 <div key={i} className="flex gap-3 relative">
                                                        <div className={`size-6 rounded-full ${item.color} shrink-0 z-10 flex items-center justify-center`}>
                                                               {item.color !== "bg-gray-300" && <CheckCircle2 className="size-3 text-white" />}
                                                        </div>
                                                        <div className="min-w-0">
                                                               <p className="text-sm font-semibold text-[#1e232c] leading-tight">{item.title}</p>
                                                               <p className="text-[10px] text-gray-400">{item.date}</p>
                                                               <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${item.color === "bg-gray-300"
                                                                      ? "bg-gray-100 text-gray-500"
                                                                      : "bg-orange-100 text-orange-600"
                                                                      }`}>
                                                                      {item.status}
                                                               </span>
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            </div>
                     </Card>

                     {/* Achievements */}
                     <Card className="p-5 rounded-2xl border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1e232c] mb-4">Achievements</h3>
                            <div className="space-y-3">
                                   {achievements.map((a, i) => (
                                          <div key={i} className={`${a.bg} text-white rounded-xl p-3 flex items-center gap-3`}>
                                                 <span className="text-lg">{a.icon}</span>
                                                 <div>
                                                        <p className="text-xs font-bold">{a.title}</p>
                                                        <p className="text-[10px] opacity-80">{a.date}</p>
                                                 </div>
                                          </div>
                                   ))}
                            </div>
                     </Card>
              </>
       )
}

// ─── Helper Components ───────────────────────────────────────────────

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
       return (
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${className}`}>
                     {children}
              </span>
       )
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
       return (
              <div className="grid grid-cols-5 gap-4">
                     {data.map((d, i) => (
                            <div key={i} className="flex flex-col items-center">
                                   <div className="w-full h-40 bg-orange-50 rounded-xl relative overflow-hidden flex items-end">
                                          <div
                                                 className="w-full bg-[#FF9E44] rounded-xl flex items-end justify-center pb-2 text-white font-bold text-sm transition-all"
                                                 style={{ height: `${d.value}%` }}
                                          >
                                                 {d.value}
                                          </div>
                                   </div>
                                   <p className="text-[11px] text-gray-500 mt-2 text-center leading-tight">{d.label}</p>
                            </div>
                     ))}
              </div>
       )
}

function BulletList({ items, color = "text-green-600", icon }: { items: string[]; color?: string; icon?: "check" | "dot" }) {
       return (
              <ul className="space-y-2.5">
                     {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                   {icon === "check" ? (
                                          <CheckCircle className={`size-4 mt-0.5 shrink-0 ${color}`} />
                                   ) : (
                                          <span className={`mt-1.5 size-1.5 rounded-full shrink-0 bg-gray-400`} />
                                   )}
                                   {item}
                            </li>
                     ))}
              </ul>
       )
}

function MentorNote({ name, role, date, note }: { name: string; role: string; date: string; note: string }) {
       return (
              <div className="border border-gray-100 rounded-2xl p-5 bg-white">
                     <div className="flex items-start justify-between mb-2">
                            <div>
                                   <p className="font-semibold text-[#1e232c]">{name}</p>
                                   <p className="text-xs text-gray-400">{role}</p>
                            </div>
                            <span className="text-xs text-[#FF9E44]">{date}</span>
                     </div>
                     <p className="text-sm text-gray-600 leading-relaxed">{note}</p>
              </div>
       )
}

// ─── Overview Tab ────────────────────────────────────────────────────

function OverviewTab() {
       return (
              <div className="space-y-6">
                     {/* Summary */}
                     <div>
                            <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Summary • About me</SectionLabel>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <p className="text-sm text-gray-600 leading-relaxed">
                                          Passionate software engineer with strong problem-solving skills and experience in full-stack development.
                                          Actively seeking opportunities in product development and system design. Proficient in React, Node.js,
                                          and cloud technologies. Led multiple hackathon teams to victory.
                                   </p>
                            </Card>
                     </div>

                     {/* Stats Row */}
                     <div className="grid grid-cols-3 gap-4">
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Average Rating of Learner</p>
                                   <div className="flex items-center justify-center gap-2">
                                          <Star className="size-5 text-[#FF9E44] fill-[#FF9E44]" />
                                          <span className="text-3xl font-bold text-[#1e232c]">4.2</span>
                                   </div>
                                   <p className="text-[10px] text-gray-400 mt-1">out of 5.0</p>
                            </Card>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Learner&apos;s Readiness</p>
                                   <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full">High</span>
                            </Card>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Batch Standing</p>
                                   <p className="text-3xl font-bold text-[#1e232c]">Top 15%</p>
                                   <p className="text-[10px] text-gray-400 mt-1">in the batch</p>
                            </Card>
                     </div>

                     {/* Subject Preferences & Job Targets */}
                     <div className="grid grid-cols-2 gap-4">
                            <div>
                                   <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Subject Preferences</SectionLabel>
                                   <div className="flex flex-wrap gap-2 mt-2">
                                          {["Software Development", "Product Management", "Data Science"].map((s) => (
                                                 <span key={s} className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700">{s}</span>
                                          ))}
                                   </div>
                            </div>
                            <div>
                                   <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Job Targets</SectionLabel>
                                   <div className="flex flex-wrap gap-2 mt-2">
                                          {["Backend Engineer", "Full Stack Developer", "Product Engineer", "DevOps Engineer"].map((s) => (
                                                 <span key={s} className="px-3 py-1.5 rounded-full border border-[#FF9E44] text-sm text-[#FF9E44]">{s}</span>
                                          ))}
                                   </div>
                            </div>
                     </div>

                     {/* Skills */}
                     <div>
                            <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Skills</SectionLabel>
                            <div className="space-y-3 mt-2">
                                   <div>
                                          <p className="text-xs font-semibold text-gray-500 mb-2">Technical Skills</p>
                                          <div className="flex flex-wrap gap-2">
                                                 {["React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "TypeScript", "System Design"].map((s) => (
                                                        <span key={s} className="px-3 py-1.5 rounded-full border border-blue-200 text-sm text-blue-700 bg-blue-50">{s}</span>
                                                 ))}
                                          </div>
                                   </div>
                                   <div>
                                          <p className="text-xs font-semibold text-gray-500 mb-2">Soft Skills</p>
                                          <div className="flex flex-wrap gap-2">
                                                 {["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Time Management"].map((s) => (
                                                        <span key={s} className="px-3 py-1.5 rounded-full border border-orange-200 text-sm text-orange-600 bg-orange-50">{s}</span>
                                                 ))}
                                          </div>
                                   </div>
                            </div>
                     </div>

                     {/* Diagnostic & Career Roadmap */}
                     <div>
                            <h3 className="text-lg font-bold text-[#1e232c] mb-4">Diagnostic & Career Roadmap</h3>
                            <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
                                   {[
                                          { label: "Diagnostic Interview", rating: 4.5 },
                                          { label: "Resume Review", rating: 4.5 },
                                          { label: "Practice Interview", rating: 4.5 },
                                          { label: "AI Interview Report", rating: null },
                                   ].map((item, i) => (
                                          <div key={i} className={`flex items-center justify-between px-6 py-4 ${i < 3 ? "border-b border-gray-100" : ""}`}>
                                                 <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-[#1e232c]">{item.label}</span>
                                                        {item.rating && (
                                                               <span className="flex items-center gap-1 text-sm text-gray-500">
                                                                      <Star className="size-3.5 text-[#FF9E44] fill-[#FF9E44]" /> {item.rating}
                                                               </span>
                                                        )}
                                                 </div>
                                                 <Button variant="outline" className="text-xs rounded-lg border-gray-200 h-8">
                                                        View Report
                                                 </Button>
                                          </div>
                                   ))}
                            </Card>
                     </div>

                     {/* Notes from Mentors */}
                     <div>
                            <SectionLabel className="bg-red-100 text-red-600 mb-3">Notes from Mentors</SectionLabel>
                            <div className="space-y-4 mt-2">
                                   <MentorNote
                                          name="Priya Sharma"
                                          role="Technical Mentor"
                                          date="2024-02-10"
                                          note="Excellent progress! Keep focusing on system design. Practice more behavioral questions. Your technical skills are improving significantly."
                                   />
                                   <MentorNote
                                          name="Rahul Verma"
                                          role="Career Coach"
                                          date="2024-02-15"
                                          note="Resume looks great. Updated work experience section as discussed. Added quantifiable achievements to make it more impactful."
                                   />
                            </div>
                     </div>
              </div>
       )
}

// ─── Diagnostic Interview Tab ────────────────────────────────────────

function DiagnosticInterviewTab() {
       return (
              <div className="space-y-6">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">Diagnostic Interview</h2>
                                   <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                          <Calendar className="size-3.5" /> Completed on 2024-01-15
                                   </p>
                            </div>
                            <Link href="/profile/diagnostic-report">
                                   <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                          <ExternalLink className="size-4" /> View Full Report
                                   </Button>
                            </Link>
                     </div>

                     {/* Parameter-wise rating */}
                     <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1e232c] mb-6">Parameter-wise rating</h3>
                            <BarChart data={[
                                   { label: "Communication Skills", value: 85 },
                                   { label: "Technical Skills", value: 78 },
                                   { label: "Problem Solving", value: 82 },
                                   { label: "Leadership & Team", value: 75 },
                                   { label: "Domain Knowledge", value: 88 },
                            ]} />
                     </Card>

                     {/* Strengths & Development Areas */}
                     <div className="grid grid-cols-2 gap-6">
                            <div>
                                   <SectionLabel className="bg-green-100 text-green-700 mb-3">Strengths</SectionLabel>
                                   <div className="mt-2">
                                          <BulletList icon="check" color="text-green-600" items={[
                                                 "Excellent grasp of data structures and algorithms",
                                                 "Strong coding skills with clean, maintainable code",
                                                 "Good understanding of software design patterns",
                                                 "Enthusiastic learner with growth mindset",
                                                 "Effective communication of technical concepts",
                                          ]} />
                                   </div>
                            </div>
                            <div>
                                   <SectionLabel className="bg-red-100 text-red-600 mb-3">Critical Development Areas</SectionLabel>
                                   <div className="mt-2">
                                          <BulletList icon="dot" items={[
                                                 "Needs more practice with system design scenarios",
                                                 "Should improve confidence in technical discussions",
                                                 "Time management during problem-solving",
                                                 "Behavioral response structure needs refinement",
                                                 "Mock interview practice for real-world scenarios",
                                          ]} />
                                   </div>
                            </div>
                     </div>

                     {/* Mentor Summary */}
                     <div>
                            <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Mentor Summary (by DI)</SectionLabel>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm mt-2">
                                   <p className="text-sm text-gray-500 mb-1">Mentor Name: <strong className="text-[#1e232c]">Dr. Priya Sharma</strong></p>
                                   <p className="text-sm text-gray-500 mb-3">Senior Technical Mentor</p>
                                   <p className="text-sm font-semibold text-[#1e232c] mb-1">Summary:</p>
                                   <p className="text-sm text-gray-600 leading-relaxed">
                                          Strong technical foundation with good communication skills. Shows initiative in problem-solving. Needs to work
                                          on confidence during technical discussions and presentation skills. Recommended focus areas: System design
                                          concepts and behavioral preparation.
                                   </p>
                            </Card>
                     </div>

                     {/* Updates from Placement Cell */}
                     <div>
                            <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Updates from Placement Cell</SectionLabel>
                            <div className="space-y-3 mt-2">
                                   <Card className="p-4 rounded-2xl border-gray-100 shadow-sm bg-orange-50">
                                          <p className="text-xs text-gray-400 mb-1">2024-02-20</p>
                                          <p className="text-sm text-gray-700">Shortlisted for Microsoft interview - Round 1 scheduled for March 5th</p>
                                   </Card>
                                   <Card className="p-4 rounded-2xl border-gray-100 shadow-sm bg-orange-50">
                                          <p className="text-xs text-gray-400 mb-1">2024-02-15</p>
                                          <p className="text-sm text-gray-700">Resume forwarded to 5 companies including Google, Amazon, and Flipkart</p>
                                   </Card>
                            </div>
                     </div>
              </div>
       )
}

// ─── Resume Review Tab ────────────────────────────────────────────────

function ResumeReviewTab() {
       return (
              <div className="space-y-6">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">Resume Review</h2>
                                   <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                          <Calendar className="size-3.5" /> Completed on 2024-01-22
                                   </p>
                            </div>
                            <Link href="/profile/resume-report">
                                   <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                          <ExternalLink className="size-4" /> View Full Report
                                   </Button>
                            </Link>
                     </div>

                     {/* Summary */}
                     <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1e232c] mb-3">Resume Feedback Summary</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                   Overall strong resume with good structure. Professional summary effectively highlights key competencies.
                                   Work experience sections could benefit from more quantifiable achievements and specific technology references.
                            </p>
                     </Card>

                     {/* Sections Reviewed */}
                     <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1e232c] mb-4">Sections Reviewed</h3>
                            <div className="space-y-3">
                                   {[
                                          { section: "Professional Summary", comments: 2, status: "Reviewed" },
                                          { section: "Professional Experience", comments: 5, status: "Reviewed" },
                                          { section: "Skills & Technologies", comments: 1, status: "Reviewed" },
                                          { section: "Education", comments: 0, status: "No Issues" },
                                   ].map((item, i) => (
                                          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                                                 <span className="text-sm font-medium text-[#1e232c]">{item.section}</span>
                                                 <div className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-400">{item.comments} comments</span>
                                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${item.status === "No Issues" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
                                                               }`}>{item.status}</span>
                                                 </div>
                                          </div>
                                   ))}
                            </div>
                     </Card>

                     {/* Mentor Summary */}
                     <div>
                            <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Mentor Summary</SectionLabel>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm mt-2">
                                   <p className="text-sm text-gray-500 mb-1">Mentor Name: <strong className="text-[#1e232c]">Dr. Sarah Johnson</strong></p>
                                   <p className="text-sm text-gray-500 mb-3">Senior Consulting Coach</p>
                                   <p className="text-sm text-gray-600 leading-relaxed">
                                          Strong analytical foundation with room for improvement in presentation delivery and client communication.
                                          Resume structure is well-organized. Focus on adding quantifiable metrics to experience sections.
                                   </p>
                            </Card>
                     </div>
              </div>
       )
}

// ─── Practice Interview Tab ──────────────────────────────────────────

function PracticeInterviewTab() {
       return (
              <div className="space-y-6">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">Practice Interview</h2>
                                   <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                          <Calendar className="size-3.5" /> Completed on 2024-02-05
                                   </p>
                            </div>
                            <Link href="/profile/practice-report">
                                   <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                          <ExternalLink className="size-4" /> View Full Report
                                   </Button>
                            </Link>
                     </div>

                     {/* Improvement Note */}
                     <Card className="p-5 rounded-2xl border-green-200 bg-green-50 shadow-sm">
                            <div className="flex items-start gap-3">
                                   <TrendingUp className="size-5 text-green-600 mt-0.5 shrink-0" />
                                   <div>
                                          <p className="font-semibold text-[#1e232c] mb-1">Improvement Note</p>
                                          <p className="text-sm text-green-700">
                                                 Notable progress in system design thinking and behavioral responses. Maintained code quality while
                                                 improving speed. Shows excellent trajectory of growth.
                                          </p>
                                   </div>
                            </div>
                     </Card>

                     {/* Parameter-wise rating */}
                     <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1e232c] mb-6">Parameter-wise rating</h3>
                            <BarChart data={[
                                   { label: "Communication Skills", value: 88 },
                                   { label: "Technical Skills", value: 85 },
                                   { label: "Problem Solving", value: 90 },
                                   { label: "Leadership & Team", value: 82 },
                                   { label: "Domain Knowledge", value: 92 },
                            ]} />
                     </Card>

                     {/* Strengths & Development Areas */}
                     <div className="grid grid-cols-2 gap-6">
                            <div>
                                   <SectionLabel className="bg-green-100 text-green-700 mb-3">Strengths</SectionLabel>
                                   <div className="mt-2">
                                          <BulletList icon="check" color="text-green-600" items={[
                                                 "Significantly improved confidence in technical discussions",
                                                 "Better articulation of thought process during problem solving",
                                                 "Strong system design fundamentals now evident",
                                                 "Behavioral responses are well-structured using STAR method",
                                                 "Good balance between speed and code quality",
                                          ]} />
                                   </div>
                            </div>
                            <div>
                                   <SectionLabel className="bg-red-100 text-red-600 mb-3">Critical Development Areas</SectionLabel>
                                   <div className="mt-2">
                                          <BulletList icon="dot" items={[
                                                 "Can optimize communication in high-pressure scenarios",
                                                 "Minor improvements needed in edge case handling",
                                                 "Could expand knowledge on distributed systems",
                                                 "Practice more mock interviews for consistency",
                                                 "Refine negotiation and salary discussion skills",
                                          ]} />
                                   </div>
                            </div>
                     </div>

                     {/* Mentor Summary */}
                     <div>
                            <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Mentor Summary (by PI)</SectionLabel>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm mt-2">
                                   <p className="text-sm text-gray-500 mb-1">Mentor Name: <strong className="text-[#1e232c]">Prof. Amit Singh</strong></p>
                                   <p className="text-sm text-gray-500 mb-3">Interview Coach</p>
                                   <p className="text-sm font-semibold text-[#1e232c] mb-1">Summary:</p>
                                   <p className="text-sm text-gray-600 leading-relaxed">
                                          Significant improvement from diagnostic interview. Shows readiness for mid-level positions. Confidence
                                          has improved notably. Technical skills are strong and consistent. Ready for interview process with
                                          tier 1 and tier 2 companies.
                                   </p>
                            </Card>
                     </div>

                     {/* Notes from Mentors */}
                     <div>
                            <SectionLabel className="bg-red-100 text-red-600 mb-3">Notes from Mentors</SectionLabel>
                            <div className="space-y-4 mt-2">
                                   <MentorNote
                                          name="Priya Sharma"
                                          role="Technical Mentor"
                                          date="2024-02-10"
                                          note="Excellent progress! Keep focusing on system design. Practice more behavioral questions. Your technical skills are improving significantly."
                                   />
                            </div>
                     </div>
              </div>
       )
}

// ─── AI Interview Tab ────────────────────────────────────────────────

function AIInterviewTab() {
       return (
              <div className="space-y-6">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">AI Interview Report</h2>
                                   <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                          <Calendar className="size-3.5" /> Completed on 2024-02-12
                                   </p>
                            </div>
                            <Link href="/profile/ai-report">
                                   <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                          <ExternalLink className="size-4" /> View Full Report
                                   </Button>
                            </Link>
                     </div>

                     {/* Performance Metrics */}
                     <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1e232c] mb-6">AI Interview Performance Metrics</h3>
                            <div className="grid grid-cols-3 gap-4">
                                   {[
                                          { label: "Overall Score", value: 87, sub: null, color: "bg-[#FF9E44]" },
                                          { label: "Speech Score", value: 90, sub: "Bravo", color: "bg-green-500" },
                                          { label: "Content Score", value: "7/10", sub: "Needs Improvement", color: "bg-red-500" },
                                   ].map((m, i) => (
                                          <div key={i} className="flex flex-col items-center">
                                                 <div className={`w-full h-44 rounded-xl relative overflow-hidden flex items-end ${i === 0 ? "bg-orange-50" : i === 1 ? "bg-green-50" : "bg-red-50"
                                                        }`}>
                                                        <div
                                                               className={`w-full ${m.color} rounded-xl flex items-end justify-center pb-3 text-white font-bold text-lg`}
                                                               style={{ height: `${typeof m.value === "number" ? m.value : 70}%` }}
                                                        >
                                                               {m.value}
                                                        </div>
                                                 </div>
                                                 <p className="text-sm text-gray-500 mt-2">{m.label}</p>
                                                 {m.sub && (
                                                        <span className={`text-xs mt-1 font-medium ${m.sub === "Bravo" ? "text-green-600" : "text-red-500"
                                                               }`}>
                                                               {m.sub}
                                                        </span>
                                                 )}
                                          </div>
                                   ))}
                            </div>
                     </Card>

                     {/* Preparation Status */}
                     <div>
                            <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Preparation Status</SectionLabel>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm mt-2">
                                   <p className="text-sm text-gray-500 mb-2">Score of all answers combined</p>
                                   <p className="text-sm font-bold text-[#1e232c] mb-2">65%</p>
                                   <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-green-400 to-gray-300" style={{ width: "65%" }} />
                                   </div>
                                   <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                                          <p className="text-sm text-red-700">
                                                 You need to practice quite hard to crack this job profile. You should take multiple attempts to get better & improve yourself.
                                          </p>
                                   </div>
                            </Card>
                     </div>

                     {/* Key Highlights */}
                     <div>
                            <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Key Highlights</SectionLabel>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                   {[
                                          "Excellent articulation and clarity",
                                          "Strong technical depth",
                                          "Good pace and structure",
                                          "Confident body language",
                                          "Clear problem-solving approach",
                                   ].map((h, i) => (
                                          <Card key={i} className="p-4 rounded-xl border-gray-100 shadow-sm flex items-center gap-2">
                                                 <CheckCircle className="size-4 text-green-500 shrink-0" />
                                                 <span className="text-sm text-gray-700">{h}</span>
                                          </Card>
                                   ))}
                            </div>
                     </div>

                     {/* Strengths & Development Areas */}
                     <div className="grid grid-cols-2 gap-6">
                            <div>
                                   <SectionLabel className="bg-green-100 text-green-700 mb-3">Strengths</SectionLabel>
                                   <div className="mt-2">
                                          <BulletList icon="check" color="text-green-600" items={[
                                                 "Outstanding verbal communication and articulation",
                                                 "Maintains composure and professionalism throughout",
                                                 "Demonstrates strong analytical thinking",
                                                 "Excellent use of examples to illustrate points",
                                                 "Natural and authentic communication style",
                                          ]} />
                                   </div>
                            </div>
                            <div>
                                   <SectionLabel className="bg-red-100 text-red-600 mb-3">Critical Development Areas</SectionLabel>
                                   <div className="mt-2">
                                          <BulletList icon="dot" items={[
                                                 "Could improve on conciseness in some responses",
                                                 "Occasional filler words during complex explanations",
                                                 "Body language could be more dynamic in virtual settings",
                                                 "Practice handling unexpected or tricky questions",
                                                 "Could work on varying voice modulation for emphasis",
                                          ]} />
                                   </div>
                            </div>
                     </div>
              </div>
       )
}
