"use client"

import { Calendar, Clock, Users, CheckCircle2, Star, X, Info, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
       Dialog,
       DialogContent,
       DialogHeader,
       DialogTitle,
       DialogFooter,
       DialogClose,
       DialogDescription,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Updated type to reflect the joined data structure
type JourneyItem = {
       id: string
       particulars: string
       start_date: string | null
       end_date: string | null
       status: string | null
       delivery_mode: string | null
       total_hours: number | null
       // Joined data
       cdm_products?: {
              product_code: string
              cdm_modules?: {
                     description: string | null
                     category: string | null
                     mode: string | null
              }
       }
}

// Map report_type to the full-report page route
function getReportRoute(reportType: string): string {
       const t = reportType.toLowerCase()
       if (t.includes('diagnostic')) return '/profile/diagnostic-report'
       if (t.includes('resume')) return '/profile/resume-report'
       if (t.includes('practice')) return '/profile/practice-report'
       if (t.includes('ai')) return '/profile/ai-report'
       return '/profile'
}

export default function MyJourneyPage() {
       const { profile, isLoading: authLoading } = useAuth()
       const [particulars, setParticulars] = useState<JourneyItem[]>([])
       const [instituteName, setInstituteName] = useState<string | null>(null)
       const [isLoading, setIsLoading] = useState(true)
       const [selectedParticular, setSelectedParticular] = useState<JourneyItem | null>(null)
       // All reports keyed by journey_item_id
       const [reportsByJourneyItem, setReportsByJourneyItem] = useState<Record<string, any>>({})
       const [isLoadingReports, setIsLoadingReports] = useState(false)
       const supabase = createClient()
       const router = useRouter()

       useEffect(() => {
              if (authLoading) return

              if (!profile) {
                     router.push('/login')
                     return
              }

              const fetchJourneyItems = async () => {
                     setIsLoading(true)
                     try {
                            const instName = profile.institute_name
                            if (!instName) {
                                   setIsLoading(false)
                                   return
                            }

                            setInstituteName(instName)

                            // Get institute ID from cdm_institutes
                            const { data: institute, error: instError } = await supabase
                                   .from('cdm_institutes')
                                   .select('id')
                                   .eq('name', instName)
                                   .maybeSingle()

                            if (instError || !institute) {
                                   console.error('Error fetching institute:', instError?.message)
                                   setIsLoading(false)
                                   return
                            }

                            // Get learning journeys for this institute
                            const { data: journeys } = await supabase
                                   .from('cdm_learning_journeys')
                                   .select('id')
                                   .eq('institute_id', institute.id)
                                   .eq('status', 'Active') // Optional: only active journeys

                            if (!journeys || journeys.length === 0) {
                                   setIsLoading(false)
                                   return
                            }

                            const journeyIds = journeys.map(j => j.id)

                            // Get all journey items (particulars) with joined product/module info
                            const { data: items, error: itemsError } = await supabase
                                   .from('cdm_learning_journey_items')
                                   .select(`
                                          id,
                                          particulars,
                                          start_date,
                                          end_date,
                                          status,
                                          delivery_mode,
                                          total_hours,
                                          cdm_products (
                                                 product_code,
                                                 cdm_modules (
                                                        description,
                                                        category,
                                                        mode
                                                 )
                                          )
                                   `)
                                   .in('learning_journey_id', journeyIds)
                                   .order('start_date', { ascending: true })

                            if (itemsError) {
                                   console.error('Error fetching journey items:', itemsError.message)
                            } else {
                                   setParticulars(items as unknown as JourneyItem[] || [])
                            }
                     } catch (err) {
                            console.error('Unexpected error:', err)
                     } finally {
                            setIsLoading(false)
                     }
              }

              fetchJourneyItems()
       }, [authLoading, profile, router])

       // Fetch ALL reports for this student once on load
       useEffect(() => {
              if (authLoading || !profile) return

              const fetchAllReports = async () => {
                     setIsLoadingReports(true)
                     try {
                            // Find session attendees for this student
                            const { data: attendees } = await supabase
                                   .from('cdm_session_attendees')
                                   .select('id, journey_item_id')
                                   .eq('student_id', profile.id)

                            if (!attendees || attendees.length === 0) {
                                   setIsLoadingReports(false)
                                   return
                            }

                            const attendeeIds = attendees.map(a => a.id)

                            const { data: reports, error } = await supabase
                                   .from('cdm_student_reports')
                                   .select('*')
                                   .in('attendee_id', attendeeIds)
                                   .order('created_at', { ascending: false })

                            if (!error && reports) {
                                   const reportsMap: Record<string, any> = {}
                                   for (const r of reports) {
                                          const jiId = r.journey_item_id
                                          if (jiId && !reportsMap[jiId]) {
                                                 const rd = r.report_data || {}
                                                 reportsMap[jiId] = {
                                                        ...r,
                                                        mentor_name: rd.meta?.mentor_name,
                                                        average_rating: rd.meta?.overall_rating,
                                                        overall_score: rd.meta?.overall_score,
                                                        improvement_areas: rd.feedback_summary?.areas_for_improvement,
                                                        strongest_aspects: rd.feedback_summary?.strongest_aspects,
                                                 }
                                          }
                                   }
                                   setReportsByJourneyItem(reportsMap)
                            }
                     } catch (err) {
                            console.error('Error fetching reports:', err)
                     } finally {
                            setIsLoadingReports(false)
                     }
              }

              fetchAllReports()
       }, [authLoading, profile])

       // Handle card click — report data is pre-fetched
       const handleCardClick = (item: JourneyItem) => {
              setSelectedParticular(item)
       }

       // Compute overall start/end dates from all particulars
       const overallDates = computeOverallDates(particulars)

       // Calculate stats
       const totalSessions = particulars.length
       // Assuming 'Completed' status in DB, or past end_date
       const completedSessions = particulars.filter(p =>
              p.status === 'Completed' || (p.end_date && new Date(p.end_date) < new Date())
       ).length
       const inProgressSessions = particulars.filter(p => p.status === 'In Progress').length
       const upcomingSessions = totalSessions - completedSessions - inProgressSessions
       const progressPercent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

       if (authLoading || isLoading) {
              return (
                     <div className="max-w-[1440px] mx-auto p-4 sm:p-8 flex items-center justify-center min-h-[60vh]">
                            <p className="text-gray-400 text-lg">Loading your journey...</p>
                     </div>
              )
       }

       if (!instituteName) {
              return (
                     <div className="max-w-[1440px] mx-auto p-4 sm:p-8 flex items-center justify-center min-h-[60vh]">
                            <p className="text-gray-400 text-lg">No institute assigned to your profile.</p>
                     </div>
              )
       }

       return (
              <div className="max-w-[1440px] mx-auto p-4 sm:p-8 space-y-6 sm:space-y-8 pb-24">

                     {/* Program Summary Card */}
                     <Card className="bg-[#FFF5ED] border-[#FF9E44]/20 p-4 sm:p-8 rounded-[16px] sm:rounded-[24px]">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center md:divide-x divide-[#FF9E44]/20">
                                   <div>
                                          <p className="text-[#FF9E44] text-xs font-bold uppercase tracking-wider mb-2">Total Modules</p>
                                          <p className="text-2xl sm:text-3xl font-bold text-[#1e232c]">{particulars.length}</p>
                                   </div>
                                   <div>
                                          <p className="text-[#FF9E44] text-xs font-bold uppercase tracking-wider mb-2">Institute</p>
                                          <p className="text-sm sm:text-lg font-bold text-[#1e232c] leading-tight">{instituteName}</p>
                                   </div>
                                   <div>
                                          <p className="text-[#FF9E44] text-xs font-bold uppercase tracking-wider mb-2">Start Date</p>
                                          <p className="text-lg sm:text-xl font-bold text-[#1e232c]">{overallDates.start || '—'}</p>
                                   </div>
                                   <div>
                                          <p className="text-[#FF9E44] text-xs font-bold uppercase tracking-wider mb-2">End Date</p>
                                          <p className="text-lg sm:text-xl font-bold text-[#1e232c]">{overallDates.end || '—'}</p>
                                   </div>
                            </div>
                     </Card>

                     {/* Your Progress Card */}
                     <Card className="border-gray-200 p-5 sm:p-8 rounded-[16px]">
                            {/* Header row */}
                            <div className="flex items-start justify-between mb-4">
                                   <div>
                                          <h3 className="text-lg font-semibold text-[#0f172b]">Your Progress</h3>
                                          <p className="text-sm text-gray-500 mt-0.5">
                                                 {completedSessions} of {totalSessions} sessions completed
                                          </p>
                                   </div>
                                   <p className="text-[28px] sm:text-[30px] font-semibold text-[#0f172b] leading-none">
                                          {progressPercent}%
                                   </p>
                            </div>

                            {/* Progress Bar */}
                            <Progress
                                   value={progressPercent}
                                   className="h-2 bg-[#e5e7eb] rounded-full"
                                   indicatorClassName="bg-[#374151]"
                            />

                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-6">
                                   <div className="border border-gray-200 rounded-[14px] p-4 text-center">
                                          <p className="text-2xl font-semibold text-[#0f172b]">{completedSessions}</p>
                                          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">Completed</p>
                                   </div>
                                   <div className="border border-gray-200 rounded-[14px] p-4 text-center">
                                          <p className="text-2xl font-semibold text-[#0f172b]">{inProgressSessions}</p>
                                          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">In Progress</p>
                                   </div>
                                   <div className="border border-gray-200 rounded-[14px] p-4 text-center">
                                          <p className="text-2xl font-semibold text-[#0f172b]">{upcomingSessions}</p>
                                          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">Upcoming</p>
                                   </div>
                            </div>
                     </Card>

                     {/* Title */}
                     <div className="text-center space-y-2">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{instituteName}</p>
                            <h1 className="text-2xl sm:text-4xl font-bold text-[#1e232c]">Career Development Module</h1>
                     </div>

                     {/* Module Cards Grid */}
                     {particulars.length === 0 ? (
                            <div className="text-center py-16">
                                   <p className="text-gray-400 text-lg">No modules found for your institute.</p>
                            </div>
                     ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                   {particulars.map((p) => (
                                          <ModuleCard
                                                 key={p.id}
                                                 item={p}
                                                 report={reportsByJourneyItem[p.id]}
                                                 onClick={() => handleCardClick(p)}
                                          />
                                   ))}
                            </div>
                     )}

                     {/* Session Details Dialog */}
                     <SessionDetailsDialog
                            item={selectedParticular}
                            report={selectedParticular ? reportsByJourneyItem[selectedParticular.id] : null}
                            isLoadingReport={isLoadingReports}
                            open={!!selectedParticular}
                            onOpenChange={(open) => {
                                   if (!open) setSelectedParticular(null)
                            }}
                     />
              </div>
       )
}

// ─── Module Card ──────────────────────────────────────────────────────

function ModuleCard({ item, report, onClick }: { item: JourneyItem; report?: any; onClick: () => void }) {
       const statusColor =
              item.status === 'Completed' ? 'text-green-600 bg-green-50' :
                     item.status === 'In Progress' ? 'text-blue-600 bg-blue-50' :
                            'text-gray-500 bg-gray-50'

       const hasReport = !!report

       return (
              <div
                     className="p-6 rounded-[20px] border border-gray-100 bg-white space-y-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-full"
                     onClick={onClick}
              >
                     <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                                   <h4 className="font-bold text-[#1e232c] leading-tight text-lg">{item.particulars}</h4>
                                   <div className="flex flex-col items-end gap-1">
                                          {item.status && (
                                                 <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${statusColor}`}>
                                                        {item.status}
                                                 </span>
                                          )}
                                          {hasReport && (
                                                 <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 text-orange-600 bg-orange-50">
                                                        Report Available
                                                 </span>
                                          )}
                                   </div>
                            </div>
                            {item.cdm_products?.cdm_modules?.description && (
                                   <p className="text-sm text-gray-500 line-clamp-2">
                                          {item.cdm_products.cdm_modules.description}
                                   </p>
                            )}
                            {/* Show rating if report has one */}
                            {report?.average_rating != null && (
                                   <div className="flex items-center gap-1.5">
                                          <Star className="size-4 fill-[#FF9E44] text-[#FF9E44]" />
                                          <span className="text-sm font-semibold text-[#1e232c]">{Number(report.average_rating).toFixed(1)}</span>
                                          <span className="text-xs text-gray-400">/ 5</span>
                                   </div>
                            )}
                     </div>

                     <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium mt-auto">
                            <div className="flex flex-col gap-1">
                                   {item.start_date && (
                                          <span className="flex items-center gap-1.5">
                                                 <Calendar className="size-3" />
                                                 {formatDate(item.start_date)}
                                          </span>
                                   )}
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                   {item.delivery_mode && (
                                          <span>{item.delivery_mode}</span>
                                   )}
                            </div>
                     </div>
              </div>
       )
}

// ─── Session Details Dialog ───────────────────────────────────────────

function SessionDetailsDialog({
       item,
       report,
       isLoadingReport,
       open,
       onOpenChange,
}: {
       item: JourneyItem | null
       report: any
       isLoadingReport: boolean
       open: boolean
       onOpenChange: (open: boolean) => void
}) {
       if (!item) return null

       const hasReport = !!report
       const reportRoute = report ? getReportRoute(report.report_type || '') : null
       const isDiagnostic = item.particulars?.toLowerCase().includes('diagnostic interview') ||
              item.cdm_products?.cdm_modules?.category?.toLowerCase() === 'diagnostic'

       const startDate = formatDate(item.start_date)
       const endDate = formatDate(item.end_date)
       const description = item.cdm_products?.cdm_modules?.description
       const moduleMode = item.cdm_products?.cdm_modules?.mode

       return (
              <Dialog open={open} onOpenChange={onOpenChange}>
                     <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-2xl">
                            {/* Header */}
                            <DialogHeader className="px-6 py-5 border-b border-gray-200">
                                   <DialogTitle className="text-2xl font-semibold text-[#0f172b]">
                                          Session Details
                                   </DialogTitle>
                                   <DialogDescription className="sr-only">
                                          Details for {item.particulars}
                                   </DialogDescription>
                            </DialogHeader>

                            {/* Body */}
                            <div className="px-6 py-6 space-y-8">
                                   {/* Session Info Card (orange) */}
                                   <div className="bg-[#FF9E44]/5 border border-[#ffd4a8]/50 rounded-[16px] p-6 space-y-5">
                                          <div>
                                                 <h3 className="text-xl font-bold text-[#0f172b] mb-2">
                                                        {item.particulars}
                                                 </h3>
                                                 {item.status && (
                                                        <span className="inline-block bg-white text-[#FF9E44] border border-[#FF9E44]/20 text-xs font-bold px-3 py-1 rounded-full">
                                                               {item.status}
                                                        </span>
                                                 )}
                                          </div>

                                          {description && (
                                                 <p className="text-sm text-gray-600 leading-relaxed">
                                                        {description}
                                                 </p>
                                          )}

                                          <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-2">
                                                 {startDate && (
                                                        <div className="flex items-start gap-3">
                                                               <div className="size-8 rounded-full bg-white border border-[#FF9E44]/20 flex items-center justify-center shrink-0">
                                                                      <Calendar className="size-4 text-[#FF9E44]" />
                                                               </div>
                                                               <div>
                                                                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Start Date</p>
                                                                      <p className="text-sm font-semibold text-[#0f172b]">{startDate}</p>
                                                               </div>
                                                        </div>
                                                 )}
                                                 {item.total_hours && (
                                                        <div className="flex items-start gap-3">
                                                               <div className="size-8 rounded-full bg-white border border-[#FF9E44]/20 flex items-center justify-center shrink-0">
                                                                      <Clock className="size-4 text-[#FF9E44]" />
                                                               </div>
                                                               <div>
                                                                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Duration</p>
                                                                      <p className="text-sm font-semibold text-[#0f172b]">{item.total_hours} Hours</p>
                                                               </div>
                                                        </div>
                                                 )}
                                                 {item.delivery_mode && (
                                                        <div className="flex items-start gap-3">
                                                               <div className="size-8 rounded-full bg-white border border-[#FF9E44]/20 flex items-center justify-center shrink-0">
                                                                      <Info className="size-4 text-[#FF9E44]" />
                                                               </div>
                                                               <div>
                                                                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Mode</p>
                                                                      <p className="text-sm font-semibold text-[#0f172b]">{item.delivery_mode}</p>
                                                               </div>
                                                        </div>
                                                 )}
                                                 {moduleMode && (
                                                        <div className="flex items-start gap-3">
                                                               <div className="size-8 rounded-full bg-white border border-[#FF9E44]/20 flex items-center justify-center shrink-0">
                                                                      <Users className="size-4 text-[#FF9E44]" />
                                                               </div>
                                                               <div>
                                                                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Type</p>
                                                                      <p className="text-sm font-semibold text-[#0f172b]">{moduleMode}</p>
                                                               </div>
                                                        </div>
                                                 )}
                                          </div>
                                   </div>

                                   {/* Report Data — shown for any module that has a report */}
                                   {isLoadingReport ? (
                                          <div className="text-center py-4">
                                                 <p className="text-sm text-gray-400 animate-pulse">Loading report data...</p>
                                          </div>
                                   ) : hasReport ? (
                                          <>
                                                 {/* Mentor Section */}
                                                 {report.mentor_name && (
                                                        <div className="space-y-4">
                                                               <h3 className="text-lg font-bold text-[#0f172b]">Your Mentor</h3>
                                                               <div className="border border-gray-200 rounded-[14px] p-5 space-y-4 shadow-sm">
                                                                      <div className="flex items-center gap-4">
                                                                             <div className="size-14 rounded-full bg-gradient-to-br from-[#FF9E44] to-[#F77F00] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                                                                                    {report.mentor_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                                                             </div>
                                                                             <div>
                                                                                    <h4 className="text-lg font-bold text-[#0f172b]">{report.mentor_name}</h4>
                                                                                    {report.average_rating != null && (
                                                                                           <div className="flex items-center gap-1 mt-1">
                                                                                                  <Star className="size-3.5 fill-[#FF9E44] text-[#FF9E44]" />
                                                                                                  <span className="text-sm font-semibold text-[#0f172b]">{Number(report.average_rating).toFixed(1)}</span>
                                                                                                  <span className="text-xs text-gray-500 ml-1">Rating</span>
                                                                                           </div>
                                                                                    )}
                                                                             </div>
                                                                      </div>

                                                                      {report.strongest_aspects && (
                                                                             <div className="space-y-2 pt-2 border-t border-gray-100">
                                                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Strengths Identified</p>
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                           {report.strongest_aspects.split(',').map((tag: string, i: number) => (
                                                                                                  <span key={i} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                                                                                                         {tag.trim()}
                                                                                                  </span>
                                                                                           ))}
                                                                                    </div>
                                                                             </div>
                                                                      )}

                                                                      {report.improvement_areas && (
                                                                             <div className="space-y-2 pt-2 border-t border-gray-100">
                                                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Feedback Summary</p>
                                                                                    <p className="text-sm text-gray-600 leading-relaxed italic">
                                                                                           "{report.improvement_areas}"
                                                                                    </p>
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        </div>
                                                 )}

                                                 {/* View Full Report Button */}
                                                 {reportRoute && (
                                                        <Link href={reportRoute}>
                                                               <Button className="w-full rounded-[12px] h-12 text-base font-medium bg-[#FF9E44] hover:bg-[#e88d3a] text-white">
                                                                      View Full Report
                                                               </Button>
                                                        </Link>
                                                 )}
                                          </>
                                   ) : (
                                          <div className="bg-gray-50 rounded-xl p-4 text-center border border-dashed border-gray-300">
                                                 <p className="text-sm text-gray-400">Report not available yet for this module.</p>
                                          </div>
                                   )}

                                   {/* Diagnostic-specific agenda & prep tips */}
                                   {isDiagnostic && (
                                          <>
                                                 <div className="space-y-4">
                                                        <h3 className="text-lg font-bold text-[#0f172b]">Session Agenda</h3>
                                                        <div className="space-y-4">
                                                               {DIAGNOSTIC_AGENDA.map((item, i) => (
                                                                      <div key={i} className="flex gap-4 items-start group">
                                                                             <div className="size-8 rounded-full bg-[#FFF5ED] text-[#FF9E44] border border-[#FF9E44]/20 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm group-hover:bg-[#FF9E44] group-hover:text-white transition-colors">
                                                                                    {i + 1}
                                                                             </div>
                                                                             <div>
                                                                                    <p className="text-base font-bold text-[#0f172b] group-hover:text-[#FF9E44] transition-colors">{item.title}</p>
                                                                                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>

                                                 <div className="space-y-4">
                                                        <h3 className="text-lg font-bold text-[#0f172b]">How to Prepare</h3>
                                                        <div className="bg-gray-50 border border-gray-200 rounded-[14px] p-5 space-y-3">
                                                               {DIAGNOSTIC_PREP_TIPS.map((tip, i) => (
                                                                      <div key={i} className="flex items-start gap-3">
                                                                             <CheckCircle2 className="size-5 text-[#FF9E44] shrink-0 mt-0.5" />
                                                                             <p className="text-sm text-gray-600 font-medium">{tip}</p>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>
                                          </>
                                   )}
                            </div>

                            {/* Footer */}
                            <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                                   <DialogClose asChild>
                                          <Button variant="outline" className="w-full rounded-[12px] h-12 text-base font-medium border-gray-200 hover:bg-white hover:border-[#FF9E44] hover:text-[#FF9E44] transition-all">
                                                 Close
                                          </Button>
                                   </DialogClose>
                            </DialogFooter>
                     </DialogContent>
              </Dialog>
       )
}

// ─── Static Content for Diagnostic Interview ─────────────────────────

const DIAGNOSTIC_AGENDA = [
       {
              title: "Introduction & Background (10 mins)",
              description: "Brief overview of your educational background and career aspirations",
       },
       {
              title: "Skills Assessment (20 mins)",
              description: "Discussion of your current skill set and identification of strengths",
       },
       {
              title: "Career Goals Discussion (15 mins)",
              description: "Exploration of short-term and long-term career objectives",
       },
       {
              title: "Action Plan & Next Steps (15 mins)",
              description: "Develop a personalized roadmap and identify immediate action items",
       },
]

const DIAGNOSTIC_PREP_TIPS = [
       "Review your resume and be prepared to discuss your experiences",
       "Prepare 2-3 questions about career paths in your field of interest",
       "Have a notepad ready to jot down key insights and action items",
       "Ensure a stable internet connection and a quiet environment",
       "Join 5 minutes before the scheduled time to test your audio/video",
]

// ─── Helpers ──────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string | null {
       if (!dateStr) return null
       // Try parsing YYYY-MM-DD format
       const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
       if (isoMatch) {
              const date = new Date(dateStr + 'T00:00:00')
              return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
       }
       // Otherwise return as-is
       return dateStr
}

function computeOverallDates(items: JourneyItem[]): { start: string | null, end: string | null } {
       const isoDates = items
              .flatMap(p => [p.start_date, p.end_date])
              .filter((d): d is string => !!d && /^\d{4}-\d{2}-\d{2}$/.test(d))
              .map(d => new Date(d + 'T00:00:00'))
              .filter(d => !isNaN(d.getTime()))

       if (isoDates.length === 0) return { start: null, end: null }

       const min = new Date(Math.min(...isoDates.map(d => d.getTime())))
       const max = new Date(Math.max(...isoDates.map(d => d.getTime())))

       const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

       return { start: fmt(min), end: fmt(max) }
}
