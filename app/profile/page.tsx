"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
       Mail, Phone, MapPin, FileText, Download, Share2,
       CheckCircle2, Star, Calendar, ExternalLink,
       Clock, AlertCircle, ChevronDown, LogOut
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"

// ─── Constants ───────────────────────────────────────────────────────

const REPORT_TYPES = ["Diagnostic Interview", "Resume Review", "Practice Interview", "AI Interview"] as const
type ReportType = (typeof REPORT_TYPES)[number]

type Tab = "Overview" | ReportType
type ReportFlags = Record<ReportType, boolean>

// ─── Main Component ──────────────────────────────────────────────────

type Particular = {
       id: number
       particulars: string
       start_date: string | null
       end_date: string | null
}

export default function ProfilePage() {
       const [activeTab, setActiveTab] = useState<Tab>("Overview")
       const { user, profile, isLoading: authLoading } = useAuth()
       const [diagnosticReport, setDiagnosticReport] = useState<any>(null)
       const [allReports, setAllReports] = useState<Record<string, any>>({})
       const [isLoadingReport, setIsLoadingReport] = useState(false)
       const [reportFlags, setReportFlags] = useState<ReportFlags>({
              "Diagnostic Interview": false,
              "Resume Review": false,
              "Practice Interview": false,
              "AI Interview": false,
       })
       const [particularsData, setParticularsData] = useState<Particular[]>([])
       const [isLoadingParticulars, setIsLoadingParticulars] = useState(true)
       const supabase = createClient()

       const handleLogout = async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
       }

       // Fetch institute particulars to determine which report types exist
       useEffect(() => {
              const fetchParticulars = async () => {
                     // Wait for auth to load
                     if (authLoading) return

                     if (!profile?.institute_name) {
                            setIsLoadingParticulars(false)
                            return
                     }

                     try {
                            // Get institute ID from cdm_institutes
                            const { data: institute } = await supabase
                                   .from('cdm_institutes')
                                   .select('id')
                                   .eq('name', profile.institute_name)
                                   .maybeSingle()

                            if (!institute) {
                                   setIsLoadingParticulars(false)
                                   return
                            }

                            // Get learning journeys for this institute
                            const { data: journeys } = await supabase
                                   .from('cdm_learning_journeys')
                                   .select('id')
                                   .eq('institute_id', institute.id)

                            if (!journeys || journeys.length === 0) {
                                   setIsLoadingParticulars(false)
                                   return
                            }

                            const journeyIds = journeys.map(j => j.id)

                            // Get all journey items (particulars) for these journeys
                            const { data: particulars } = await supabase
                                   .from('cdm_learning_journey_items')
                                   .select('id, particulars, start_date, end_date')
                                   .in('learning_journey_id', journeyIds)

                            if (particulars) {
                                   setParticularsData(particulars)
                                   const allNames = particulars.map(p => p.particulars?.toLowerCase() || '')
                                   const flags: ReportFlags = {
                                          "Diagnostic Interview": allNames.some(n => n.includes('diagnostic interview')),
                                          "Resume Review": allNames.some(n => n.includes('resume review')),
                                          "Practice Interview": allNames.some(n => n.includes('practice interview')),
                                          "AI Interview": allNames.some(n => n.includes('ai interview')),
                                   }
                                   setReportFlags(flags)
                            }
                     } catch (err) {
                            console.error('Error fetching journey items:', err)
                     } finally {
                            setIsLoadingParticulars(false)
                     }
              }

              fetchParticulars()
       }, [profile, authLoading])

       // Fetch ALL reports from cdm_student_reports via cdm_session_attendees
       useEffect(() => {
              const fetchAllReports = async () => {
                     if (authLoading) return
                     if (!profile) return
                     setIsLoadingReport(true)
                     try {
                            // Find session attendees for this student
                            const { data: attendees } = await supabase
                                   .from('cdm_session_attendees')
                                   .select('id')
                                   .eq('student_id', profile.id)

                            if (!attendees || attendees.length === 0) {
                                   setIsLoadingReport(false)
                                   return
                            }

                            const attendeeIds = attendees.map(a => a.id)

                            // Get ALL reports linked to these attendees
                            const { data: reports, error } = await supabase
                                   .from('cdm_student_reports')
                                   .select('*')
                                   .in('attendee_id', attendeeIds)
                                   .order('created_at', { ascending: false })

                            if (error) {
                                   console.error('Error fetching reports:', error)
                            } else if (reports && reports.length > 0) {
                                   const reportsMap: Record<string, any> = {}

                                   for (const data of reports) {
                                          const type = (data.report_type || '').toLowerCase()
                                          // Keep first (latest) per type
                                          if (!reportsMap[type]) {
                                                 const rd = data.report_data || {}
                                                 reportsMap[type] = {
                                                        ...data,
                                                        mentor_name: rd.meta?.mentor_name,
                                                        average_rating: rd.meta?.overall_rating,
                                                        overall_score: rd.meta?.overall_score,
                                                        improvement_areas: rd.feedback_summary?.areas_for_improvement,
                                                        targeted_roles: rd.feedback_summary?.target_roles,
                                                        strongest_aspects: rd.feedback_summary?.strongest_aspects,
                                                        fit_job_families: rd.feedback_summary?.job_fit,
                                                        backup_roles: rd.feedback_summary?.plan_b_c,
                                                        sections: rd.sections || [],
                                                 }
                                          }
                                   }

                                   setAllReports(reportsMap)

                                   // Set diagnosticReport for backward compatibility
                                   const diagKey = Object.keys(reportsMap).find(k => k.includes('diagnostic'))
                                   if (diagKey) {
                                          setDiagnosticReport(reportsMap[diagKey])
                                   }
                            }
                     } catch (err) {
                            console.error('Unexpected error fetching reports:', err)
                     } finally {
                            setIsLoadingReport(false)
                     }
              }

              fetchAllReports()
       }, [profile, authLoading])

       // Helper: find particular matching a report type
       const findParticular = (type: ReportType): Particular | undefined => {
              return particularsData.find(p => p.particulars?.toLowerCase().includes(type.toLowerCase()))
       }

       // Helper: find report by type keyword
       const findReportByType = (typeKeyword: string): any | null => {
              return Object.entries(allReports).find(([key]) => key.includes(typeKeyword.toLowerCase()))?.[1] || null
       }

       // Build tabs dynamically: Overview always + only report types that exist
       const activeTabs: Tab[] = ["Overview", ...REPORT_TYPES.filter(r => reportFlags[r])]

       // Build journey items dynamically
       const journeyItems = REPORT_TYPES
              .filter(r => reportFlags[r])
              .map(r => {
                     const p = findParticular(r)
                     return {
                            title: p?.particulars || r,
                            color: "bg-orange-500",
                            status: "Completed",
                     }
              })

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     {/* Page Header */}
                     <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                            <div className="flex items-center justify-between py-4">
                                   <div>
                                          <h1 className="text-xl md:text-2xl font-bold text-[#1e232c]">Student File</h1>
                                          <p className="text-xs md:text-sm text-[#FF9E44]">Comprehensive student profile and progress tracking</p>
                                   </div>
                                   <div className="flex items-center gap-2 md:gap-3">
                                          <Button variant="outline" className="rounded-lg gap-2 text-sm font-medium border-gray-200 hidden sm:flex">
                                                 <FileText className="size-4" /> View Resume
                                          </Button>
                                          <Button variant="outline" className="rounded-lg gap-2 text-sm font-medium border-gray-200 hidden sm:flex">
                                                 <Download className="size-4" /> Download
                                          </Button>
                                          <Button variant="outline" className="rounded-lg gap-2 text-sm font-medium border-gray-200 hidden sm:flex">
                                                 <Share2 className="size-4" /> Share
                                          </Button>
                                          <Button onClick={handleLogout} variant="outline" className="rounded-lg gap-2 text-sm font-medium border-red-300 text-red-600 hover:bg-red-50 hidden sm:flex">
                                                 <LogOut className="size-4" /> Logout
                                          </Button>
                                          {/* Mobile: icon-only buttons */}
                                          <Button variant="outline" size="icon" className="rounded-lg border-gray-200 sm:hidden">
                                                 <FileText className="size-4" />
                                          </Button>
                                          <Button variant="outline" size="icon" className="rounded-lg border-gray-200 sm:hidden">
                                                 <Download className="size-4" />
                                          </Button>
                                          <Button variant="outline" size="icon" className="rounded-lg border-gray-200 sm:hidden">
                                                 <Share2 className="size-4" />
                                          </Button>
                                          <Button onClick={handleLogout} variant="outline" size="icon" className="rounded-lg border-red-300 text-red-600 hover:bg-red-50 sm:hidden">
                                                 <LogOut className="size-4" />
                                          </Button>
                                   </div>
                            </div>

                            {/* Student Info */}
                            <div className="flex items-center gap-4 md:gap-5 pb-6">
                                   <div className="size-12 md:size-16 rounded-full bg-[#FFF5ED] border-2 border-[#FF9E44] flex items-center justify-center text-[#FF9E44] text-base md:text-xl font-bold shrink-0">
                                          {profile?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "ST"}
                                   </div>
                                   <div className="min-w-0">
                                          <h2 className="text-lg md:text-xl font-bold text-[#1e232c] truncate">{profile?.full_name || "Student Name"}</h2>
                                          <p className="text-xs md:text-sm text-gray-500 truncate">{profile?.institute_name || "Institute"} • Student Profile</p>
                                          <p className="text-xs md:text-sm text-[#FF9E44] font-medium">2025 • Student</p>
                                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                                 <span className="flex items-center gap-1"><Mail className="size-3" /> <span className="truncate max-w-[140px] sm:max-w-none">{profile?.email || "email@institute.ac.in"}</span></span>
                                                 <span className="flex items-center gap-1 hidden sm:flex"><Phone className="size-3" /> {profile?.phone || "+91 --- --- ----"}</span>
                                                 <span className="flex items-center gap-1 hidden sm:flex"><MapPin className="size-3" /> India</span>
                                          </div>
                                   </div>
                            </div>

                            {/* Tab Navigation — scrollable on mobile */}
                            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
                                   {activeTabs.map((tab) => (
                                          <button
                                                 key={tab}
                                                 onClick={() => setActiveTab(tab)}
                                                 className={`px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap shrink-0 ${activeTab === tab
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
                     <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-8">
                            {/* Mobile Journey Dropdown — visible only below lg */}
                            <div className="lg:hidden mb-6">
                                   <MobileJourneyDropdown journeyItems={journeyItems} isLoading={isLoadingParticulars} />
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                                   {/* Left Sidebar — hidden on mobile, shown on md+ */}
                                   <div className="hidden lg:block w-[240px] shrink-0 space-y-6">
                                          <Sidebar journeyItems={journeyItems} isLoading={isLoadingParticulars} />
                                   </div>

                                   {/* Main Content */}
                                   <div className="flex-1 min-w-0">
                                          {activeTab === "Overview" && <OverviewTab diagnosticReport={diagnosticReport} reportFlags={reportFlags} allReports={allReports} />}
                                          {activeTab === "Diagnostic Interview" && <DiagnosticInterviewTab report={diagnosticReport} isLoading={isLoadingReport} particular={findParticular("Diagnostic Interview")} />}
                                          {activeTab === "Resume Review" && <ResumeReviewTab report={findReportByType('resume')} isLoading={isLoadingReport} particular={findParticular("Resume Review")} />}
                                          {activeTab === "Practice Interview" && <PracticeInterviewTab report={findReportByType('practice')} isLoading={isLoadingReport} particular={findParticular("Practice Interview")} />}
                                          {activeTab === "AI Interview" && <AIInterviewTab report={findReportByType('ai')} isLoading={isLoadingReport} particular={findParticular("AI Interview")} />}
                                   </div>
                            </div>
                     </div>
              </div>
       )
}

// ─── Sidebar ─────────────────────────────────────────────────────────

function Sidebar({ journeyItems, isLoading }: { journeyItems: { title: string; color: string; status: string }[]; isLoading: boolean }) {
       return (
              <Card className="p-5 rounded-2xl border-gray-100 shadow-sm">
                     <h3 className="font-bold text-[#1e232c] mb-4">Student Journey</h3>
                     {isLoading ? (
                            <p className="text-sm text-gray-400">Loading...</p>
                     ) : journeyItems.length === 0 ? (
                            <p className="text-sm text-gray-400">No journey items found for this institute.</p>
                     ) : (
                            <div className="relative">
                                   <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                                   <div className="space-y-5">
                                          {journeyItems.map((item, i) => (
                                                 <div key={i} className="flex gap-3 relative">
                                                        <div className={`size-6 rounded-full ${item.color} shrink-0 z-10 flex items-center justify-center`}>
                                                               <CheckCircle2 className="size-3 text-white" />
                                                        </div>
                                                        <div className="min-w-0">
                                                               <p className="text-sm font-semibold text-[#1e232c] leading-tight">{item.title}</p>
                                                               <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                                                                      {item.status}
                                                               </span>
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            </div>
                     )}
              </Card>
       )
}

// ─── Mobile Journey Dropdown ─────────────────────────────────────────

function MobileJourneyDropdown({ journeyItems, isLoading }: { journeyItems: { title: string; color: string; status: string }[]; isLoading: boolean }) {
       const [isOpen, setIsOpen] = useState(false)

       return (
              <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
                     <button
                            onClick={() => setIsOpen(prev => !prev)}
                            className="flex items-center justify-between w-full p-4 text-left"
                     >
                            <h3 className="font-bold text-[#1e232c]">Student Journey</h3>
                            <ChevronDown className={`size-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                     </button>

                     <div
                            className="transition-all duration-300 ease-in-out overflow-hidden"
                            style={{ maxHeight: isOpen ? "500px" : "0px" }}
                     >
                            <div className="px-4 pb-4">
                                   {isLoading ? (
                                          <p className="text-sm text-gray-400">Loading...</p>
                                   ) : journeyItems.length === 0 ? (
                                          <p className="text-sm text-gray-400">No journey items found for this institute.</p>
                                   ) : (
                                          <div className="relative">
                                                 <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                                                 <div className="space-y-4">
                                                        {journeyItems.map((item, i) => (
                                                               <div key={i} className="flex gap-3 relative">
                                                                      <div className={`size-6 rounded-full ${item.color} shrink-0 z-10 flex items-center justify-center`}>
                                                                             <CheckCircle2 className="size-3 text-white" />
                                                                      </div>
                                                                      <div className="min-w-0">
                                                                             <p className="text-sm font-semibold text-[#1e232c] leading-tight">{item.title}</p>
                                                                             <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                                                                                    {item.status}
                                                                             </span>
                                                                      </div>
                                                               </div>
                                                        ))}
                                                 </div>
                                          </div>
                                   )}
                            </div>
                     </div>
              </Card>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
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



// ─── Date Formatter Helper ───────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string | null {
       if (!dateStr) return null
       try {
              return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
       } catch {
              return dateStr
       }
}

// ─── Overview Tab ────────────────────────────────────────────────────

function OverviewTab({ diagnosticReport, reportFlags, allReports }: { diagnosticReport: any; reportFlags: ReportFlags; allReports: Record<string, any> }) {
       const hasDiagnostic = !!diagnosticReport
       const avgRating = diagnosticReport?.average_rating
       const readiness = avgRating >= 4 ? "High" : avgRating >= 3 ? "Medium" : "Developing"
       const readinessColor = readiness === "High" ? "bg-green-100 text-green-700" : readiness === "Medium" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"

       // Count available reports
       const availableReportCount = Object.keys(allReports).length

       // Build roadmap items from report flags, adding actual data from allReports
       const roadmapItems = [
              { label: "Diagnostic Interview", typeKey: "diagnostic", link: "/profile/diagnostic-report" },
              { label: "Resume Review", typeKey: "resume", link: "/profile/resume-report" },
              { label: "Practice Interview", typeKey: "practice", link: "/profile/practice-report" },
              { label: "AI Interview Report", typeKey: "ai", link: "/profile/ai-report" },
       ].filter(item => {
              const key = item.label.replace(' Report', '') as ReportType
              return reportFlags[key] !== undefined ? reportFlags[key] : false
       }).map(item => {
              const report = Object.entries(allReports).find(([k]) => k.includes(item.typeKey))?.[1]
              return {
                     ...item,
                     rating: report?.average_rating ?? report?.report_data?.meta?.overall_rating ?? null,
                     score: report?.report_data?.meta?.overall_score ?? null,
                     hasReport: !!report,
              }
       })

       return (
              <div className="space-y-6">
                     {/* Summary - only if diagnostic report has data */}
                     {hasDiagnostic && diagnosticReport.improvement_areas && (
                            <div>
                                   <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Summary • About me</SectionLabel>
                                   <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                          <p className="text-sm text-gray-600 leading-relaxed">
                                                 {diagnosticReport.improvement_areas}
                                          </p>
                                   </Card>
                            </div>
                     )}

                     {/* Stats Row - only if diagnostic data exists */}
                     {hasDiagnostic && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                   {avgRating != null && (
                                          <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                                 <p className="text-xs text-gray-400 mb-2">Average Rating of Learner</p>
                                                 <div className="flex items-center justify-center gap-2">
                                                        <Star className="size-5 text-[#FF9E44] fill-[#FF9E44]" />
                                                        <span className="text-3xl font-bold text-[#1e232c]">{avgRating.toFixed(1)}</span>
                                                 </div>
                                                 <p className="text-[10px] text-gray-400 mt-1">out of 5.0</p>
                                          </Card>
                                   )}
                                   {avgRating != null && (
                                          <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                                 <p className="text-xs text-gray-400 mb-2">Learner&apos;s Readiness</p>
                                                 <span className={`inline-block ${readinessColor} text-sm font-bold px-4 py-1.5 rounded-full`}>{readiness}</span>
                                          </Card>
                                   )}
                                   <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                          <p className="text-xs text-gray-400 mb-2">Modules Completed</p>
                                          <p className="text-3xl font-bold text-[#1e232c]">{Object.values(reportFlags).filter(Boolean).length}</p>
                                          <p className="text-[10px] text-gray-400 mt-1">of {REPORT_TYPES.length} report types</p>
                                   </Card>
                            </div>
                     )}

                     {/* Only show modules count if no diagnostic */}
                     {!hasDiagnostic && (
                            <div className="grid grid-cols-1 gap-4">
                                   <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                          <p className="text-xs text-gray-400 mb-2">Modules Completed</p>
                                          <p className="text-3xl font-bold text-[#1e232c]">{Object.values(reportFlags).filter(Boolean).length}</p>
                                          <p className="text-[10px] text-gray-400 mt-1">of {REPORT_TYPES.length} report types</p>
                                   </Card>
                            </div>
                     )}

                     {/* Strongest Aspects & Job Targets - only from diagnostic report */}
                     {hasDiagnostic && (diagnosticReport.strongest_aspects || diagnosticReport.targeted_roles) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   {diagnosticReport.strongest_aspects && (
                                          <div>
                                                 <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Strongest Aspects</SectionLabel>
                                                 <div className="mt-2">
                                                        <p className="text-sm text-gray-600">{diagnosticReport.strongest_aspects}</p>
                                                 </div>
                                          </div>
                                   )}
                                   {diagnosticReport.targeted_roles && (
                                          <div>
                                                 <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Job Targets</SectionLabel>
                                                 <div className="flex flex-wrap gap-2 mt-2">
                                                        {diagnosticReport.targeted_roles.split(',').map((s: string) => (
                                                               <span key={s} className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600">{s.trim()}</span>
                                                        ))}
                                                 </div>
                                          </div>
                                   )}
                            </div>
                     )}

                     {/* Fit Job Families - only from diagnostic report */}
                     {hasDiagnostic && diagnosticReport.fit_job_families && (
                            <div>
                                   <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Fit Job Families</SectionLabel>
                                   <div className="mt-2">
                                          <p className="text-sm text-gray-600">{diagnosticReport.fit_job_families}</p>
                                   </div>
                            </div>
                     )}

                     {/* Diagnostic & Career Roadmap */}
                     {roadmapItems.length > 0 && (
                            <div>
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-4">Diagnostic & Career Roadmap</h3>
                                   <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
                                          {roadmapItems.map((item, i) => (
                                                 <div key={i} className={`flex items-center justify-between px-6 py-4 ${i < roadmapItems.length - 1 ? "border-b border-gray-100" : ""}`}>
                                                        <div className="flex items-center gap-3">
                                                               <span className={`size-2 rounded-full ${item.hasReport ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                               <span className="text-sm font-medium text-[#1e232c]">{item.label}</span>
                                                               {item.rating != null && (
                                                                      <span className="flex items-center gap-1 text-sm text-gray-500">
                                                                             <Star className="size-3.5 text-[#FF9E44] fill-[#FF9E44]" /> {Number(item.rating).toFixed(1)}
                                                                      </span>
                                                               )}
                                                               {item.score != null && (
                                                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                                             Score: {item.score}
                                                                      </span>
                                                               )}
                                                               {!item.hasReport && (
                                                                      <span className="text-[10px] text-gray-400 italic">Pending</span>
                                                               )}
                                                        </div>
                                                        {item.hasReport ? (
                                                               <Link href={item.link}>
                                                                      <Button variant="outline" className="text-xs rounded-lg border-gray-200 h-8">
                                                                             View Report
                                                                      </Button>
                                                               </Link>
                                                        ) : (
                                                               <Button variant="outline" className="text-xs rounded-lg border-gray-200 h-8" disabled>
                                                                      Not Available
                                                               </Button>
                                                        )}
                                                 </div>
                                          ))}
                                   </Card>
                            </div>
                     )}

                     {/* Empty state if nothing at all */}
                     {!hasDiagnostic && roadmapItems.length === 0 && (
                            <Card className="p-8 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-gray-400">No report data available yet. Data will appear here as assessments are completed.</p>
                            </Card>
                     )}
              </div>
       )
}

// ─── Diagnostic Interview Tab ────────────────────────────────────────

function DiagnosticInterviewTab({ report, isLoading, particular }: { report: any; isLoading: boolean; particular?: Particular }) {
       if (isLoading) return <div className="p-8 text-center text-gray-500">Loading diagnostic report...</div>
       if (!report) return <div className="p-8 text-center text-gray-500">No diagnostic report available.</div>

       // Build chart data from report_data.sections[]
       const sections: { title: string; rating: number; items: any[] }[] = report.sections || []

       const chartData = sections
              .filter((s: any) => s.rating > 0)
              .map((s: any) => ({
                     label: s.title,
                     value: Math.round((s.rating / 5) * 100),
              }))

       // Determine date to show
       const completedDate = particular?.end_date
              ? formatDate(particular.end_date)
              : report.created_at
                     ? new Date(report.created_at).toLocaleDateString()
                     : null

       return (
              <div className="space-y-6">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">Diagnostic Interview</h2>
                                   {completedDate && (
                                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                                 <Calendar className="size-3.5" /> Completed on {completedDate}
                                          </p>
                                   )}
                                   {particular?.start_date && (
                                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                                                 <Clock className="size-3.5" /> Started {formatDate(particular.start_date)}
                                          </p>
                                   )}
                            </div>
                            <Link href="/profile/diagnostic-report">
                                   <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                          <ExternalLink className="size-4" /> View Full Report
                                   </Button>
                            </Link>
                     </div>

                     {/* Parameter-wise rating - only if scores exist */}
                     {chartData.length > 0 && (
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="font-bold text-[#1e232c] mb-6">Parameter-wise rating</h3>
                                   <BarChart data={chartData} />
                            </Card>
                     )}

                     {/* Strengths & Development Areas - only if data exists */}
                     {(report.strongest_aspects || report.improvement_areas) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                   {report.strongest_aspects && (
                                          <div>
                                                 <SectionLabel className="bg-green-100 text-green-700 mb-3">Strengths</SectionLabel>
                                                 <div className="mt-2">
                                                        <p className="text-sm text-gray-600">{report.strongest_aspects}</p>
                                                 </div>
                                          </div>
                                   )}
                                   {report.improvement_areas && (
                                          <div>
                                                 <SectionLabel className="bg-red-100 text-red-600 mb-3">Critical Development Areas</SectionLabel>
                                                 <div className="mt-2">
                                                        <p className="text-sm text-gray-600">{report.improvement_areas}</p>
                                                 </div>
                                          </div>
                                   )}
                            </div>
                     )}

                     {/* Mentor Summary - only if mentor data exists */}
                     {(report.mentor_name || report.targeted_roles || report.fit_job_families) && (
                            <div>
                                   <SectionLabel className="bg-orange-100 text-orange-600 mb-3">Mentor Summary (by DI)</SectionLabel>
                                   <Card className="p-6 rounded-2xl border-gray-100 shadow-sm mt-2">
                                          {report.mentor_name && (
                                                 <>
                                                        <p className="text-sm text-gray-500 mb-1">Mentor Name: <strong className="text-[#1e232c]">{report.mentor_name}</strong></p>
                                                        <p className="text-sm text-gray-500 mb-3">Diagnostic Interviewer</p>
                                                 </>
                                          )}
                                          {report.targeted_roles && (
                                                 <>
                                                        <p className="text-sm font-semibold text-[#1e232c] mb-1">Targeted Roles:</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                                               {report.targeted_roles}
                                                        </p>
                                                 </>
                                          )}
                                          {report.fit_job_families && (
                                                 <>
                                                        <p className="text-sm font-semibold text-[#1e232c] mb-1">Fitment:</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                               Fits best in: {report.fit_job_families}{report.backup_roles ? `. Backup roles: ${report.backup_roles}` : ''}
                                                        </p>
                                                 </>
                                          )}
                                   </Card>
                            </div>
                     )}
              </div>
       )
}

// ─── Generic Report Tab (for tabs without dedicated DB data) ─────────

function GenericReportTab({ title, particular, reportLink }: { title: string; particular?: Particular; reportLink?: string }) {
       const startDate = formatDate(particular?.start_date)
       const endDate = formatDate(particular?.end_date)
       const hasAnyDate = startDate || endDate

       return (
              <div className="space-y-6">
                     {/* Header */}
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">{particular?.particulars || title}</h2>
                                   {endDate && (
                                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                                 <Calendar className="size-3.5" /> End Date: {endDate}
                                          </p>
                                   )}
                                   {startDate && (
                                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                                                 <Clock className="size-3.5" /> Start Date: {startDate}
                                          </p>
                                   )}
                            </div>
                            {reportLink && (
                                   <Link href={reportLink}>
                                          <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                                 <ExternalLink className="size-4" /> View Full Report
                                          </Button>
                                   </Link>
                            )}
                     </div>

                     {/* Date Info Card */}
                     {hasAnyDate && (
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="font-bold text-[#1e232c] mb-4">Schedule</h3>
                                   <div className="grid grid-cols-2 gap-4">
                                          {startDate && (
                                                 <div className="border border-gray-100 rounded-xl p-4">
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Start Date</p>
                                                        <p className="text-sm font-semibold text-[#1e232c]">{startDate}</p>
                                                 </div>
                                          )}
                                          {endDate && (
                                                 <div className="border border-gray-100 rounded-xl p-4">
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">End Date</p>
                                                        <p className="text-sm font-semibold text-[#1e232c]">{endDate}</p>
                                                 </div>
                                          )}
                                   </div>
                            </Card>
                     )}

                     {/* Empty state */}
                     <Card className="p-8 rounded-2xl border-gray-100 shadow-sm text-center">
                            <AlertCircle className="size-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">
                                   Detailed report data for {title} is not yet available. Report details will appear here once the assessment data is uploaded.
                            </p>
                     </Card>
              </div>
       )
}

// ─── Resume Review Tab ────────────────────────────────────────────────

function ResumeReviewTab({ report, isLoading, particular }: { report: any; isLoading: boolean; particular?: Particular }) {
       if (isLoading) return <div className="p-8 text-center text-gray-500">Loading resume review report...</div>
       if (!report) return <GenericReportTab title="Resume Review" particular={particular} reportLink="/profile/resume-report" />

       const rd = report.report_data || {}
       const meta = rd.meta || {}
       const sections = rd.sections || []
       const totalComments = sections.reduce((acc: number, s: any) =>
              acc + ((s.groups || []).reduce((g: number, gr: any) => g + (gr.items?.length || 0), 0)), 0)

       return (
              <div className="space-y-6">
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">Resume Review</h2>
                                   {meta.date && (
                                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                                 <Calendar className="size-3.5" /> Reviewed on {meta.date}
                                          </p>
                                   )}
                            </div>
                            <Link href="/profile/resume-report">
                                   <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                          <ExternalLink className="size-4" /> View Full Report
                                   </Button>
                            </Link>
                     </div>

                     {meta.mentor_name && (
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="font-bold text-[#1e232c] mb-3">Reviewer</h3>
                                   <p className="text-sm text-gray-600">Reviewed by <strong>{meta.mentor_name}</strong></p>
                            </Card>
                     )}

                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Sections Reviewed</p>
                                   <p className="text-3xl font-bold text-[#1e232c]">{sections.length}</p>
                            </Card>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Total Comments</p>
                                   <p className="text-3xl font-bold text-[#1e232c]">{totalComments}</p>
                            </Card>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Report Status</p>
                                   <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full">Available</span>
                            </Card>
                     </div>

                     {sections.length > 0 && (
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="font-bold text-[#1e232c] mb-4">Review Sections</h3>
                                   <div className="space-y-3">
                                          {sections.map((s: any, i: number) => (
                                                 <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                                        <span className="text-sm text-gray-700">{s.title}</span>
                                                        <span className="text-xs text-gray-400">
                                                               {(s.groups || []).reduce((acc: number, g: any) => acc + (g.items?.length || 0), 0)} comments
                                                        </span>
                                                 </div>
                                          ))}
                                   </div>
                            </Card>
                     )}
              </div>
       )
}

// ─── Practice Interview Tab ──────────────────────────────────────────

function PracticeInterviewTab({ report, isLoading, particular }: { report: any; isLoading: boolean; particular?: Particular }) {
       if (isLoading) return <div className="p-8 text-center text-gray-500">Loading practice interview report...</div>
       if (!report) return <GenericReportTab title="Practice Interview" particular={particular} reportLink="/profile/practice-report" />

       const rd = report.report_data || {}
       const meta = rd.meta || {}
       const overallScore = meta.overall_score || 'N/A'
       const skillBreakdown = rd.skill_breakdown || []
       const keyRemarks = rd.key_remarks

       return (
              <div className="space-y-6">
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">Practice Interview</h2>
                                   {meta.date && (
                                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                                 <Calendar className="size-3.5" /> Completed on {meta.date}
                                          </p>
                                   )}
                            </div>
                            <Link href="/profile/practice-report">
                                   <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                          <ExternalLink className="size-4" /> View Full Report
                                   </Button>
                            </Link>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Overall Score</p>
                                   <p className="text-3xl font-bold text-[#FF9E44]">{overallScore}</p>
                            </Card>
                            {meta.mentor_name && (
                                   <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                          <p className="text-xs text-gray-400 mb-2">Interviewer</p>
                                          <p className="text-lg font-bold text-[#1e232c]">{meta.mentor_name}</p>
                                   </Card>
                            )}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Skills Assessed</p>
                                   <p className="text-3xl font-bold text-[#1e232c]">{skillBreakdown.length}</p>
                            </Card>
                     </div>

                     {skillBreakdown.length > 0 && (
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="font-bold text-[#1e232c] mb-4">Skill Breakdown</h3>
                                   <div className="grid grid-cols-2 gap-3">
                                          {skillBreakdown.map((skill: any, i: number) => (
                                                 <div key={i} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-700">{skill.name}</span>
                                                        <div className="flex items-center gap-0.5">
                                                               {Array.from({ length: 5 }, (_, si) => (
                                                                      <Star key={si} className={`size-3.5 ${si < (skill.rating || 0) ? "text-[#FF9E44] fill-[#FF9E44]" : "text-gray-200 fill-gray-200"}`} />
                                                               ))}
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            </Card>
                     )}

                     {keyRemarks && (
                            <Card className="p-5 rounded-2xl border-orange-200 bg-orange-50 shadow-sm">
                                   <div className="flex items-start gap-3">
                                          <span className="text-lg">⭐</span>
                                          <div>
                                                 <p className="font-semibold text-[#1e232c] mb-1">Key Remarks</p>
                                                 <p className="text-sm text-gray-700 leading-relaxed">{keyRemarks}</p>
                                          </div>
                                   </div>
                            </Card>
                     )}
              </div>
       )
}

// ─── AI Interview Tab ────────────────────────────────────────────────

function AIInterviewTab({ report, isLoading, particular }: { report: any; isLoading: boolean; particular?: Particular }) {
       if (isLoading) return <div className="p-8 text-center text-gray-500">Loading AI interview report...</div>
       if (!report) return <GenericReportTab title="AI Interview" particular={particular} reportLink="/profile/ai-report" />

       const rd = report.report_data || {}
       const meta = rd.meta || {}
       const overallScores = rd.overall_scores || []
       const skillBreakdown = rd.skill_breakdown || []
       const questions = rd.questions || []

       return (
              <div className="space-y-6">
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-xl font-bold text-[#1e232c]">AI Interview</h2>
                                   {meta.date && (
                                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                                 <Calendar className="size-3.5" /> Completed on {meta.date}
                                          </p>
                                   )}
                            </div>
                            <Link href="/profile/ai-report">
                                   <Button variant="outline" className="rounded-lg gap-2 text-sm border-gray-200">
                                          <ExternalLink className="size-4" /> View Full Report
                                   </Button>
                            </Link>
                     </div>

                     {overallScores.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                   {overallScores.map((s: any, i: number) => {
                                          const color = s.value >= 80 ? 'text-green-600 bg-green-50' : s.value >= 60 ? 'text-blue-600 bg-blue-50' : 'text-red-500 bg-red-50'
                                          return (
                                                 <Card key={i} className="p-4 rounded-2xl border-gray-100 shadow-sm text-center">
                                                        <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                                                        <p className={`text-2xl font-bold ${color.split(' ')[0]}`}>{s.value}%</p>
                                                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>
                                                               {s.status || (s.value >= 80 ? 'Great' : s.value >= 60 ? 'Good' : 'Needs Work')}
                                                        </span>
                                                 </Card>
                                          )
                                   })}
                            </div>
                     )}

                     {skillBreakdown.length > 0 && (
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="font-bold text-[#1e232c] mb-4">Skill Breakdown</h3>
                                   <div className="space-y-3">
                                          {skillBreakdown.map((skill: any, i: number) => {
                                                 const scoreVal = parseInt(skill.score) || 0
                                                 return (
                                                        <div key={i} className="flex items-center gap-4">
                                                               <span className="text-sm text-gray-700 w-40 shrink-0">{skill.name}</span>
                                                               <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                                      <div className="h-full bg-[#FF9E44] rounded-full" style={{ width: `${scoreVal}%` }} />
                                                               </div>
                                                               <span className="text-sm font-bold text-[#1e232c] w-16 text-right">{skill.score}</span>
                                                        </div>
                                                 )
                                          })}
                                   </div>
                            </Card>
                     )}

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Questions Assessed</p>
                                   <p className="text-3xl font-bold text-[#1e232c]">{questions.length}</p>
                            </Card>
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm text-center">
                                   <p className="text-xs text-gray-400 mb-2">Report Status</p>
                                   <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full">Available</span>
                            </Card>
                     </div>
              </div>
       )
}
