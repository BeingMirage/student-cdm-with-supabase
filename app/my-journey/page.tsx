"use client"

import { Calendar, Clock, Users, CheckCircle2, Star, X } from "lucide-react"
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

type Particular = {
       id: string
       particulars: string
       start_date: string | null
       end_date: string | null
}

export default function MyJourneyPage() {
       const { profile, isLoading: authLoading } = useAuth()
       const [particulars, setParticulars] = useState<Particular[]>([])
       const [instituteName, setInstituteName] = useState<string | null>(null)
       const [isLoading, setIsLoading] = useState(true)
       const [selectedParticular, setSelectedParticular] = useState<Particular | null>(null)
       const [diagnosticReport, setDiagnosticReport] = useState<any>(null)
       const [isLoadingReport, setIsLoadingReport] = useState(false)
       const supabase = createClient()

       useEffect(() => {
              if (authLoading || !profile) return

              const fetchParticulars = async () => {
                     setIsLoading(true)
                     try {
                            const instName = profile.institute_name
                            if (!instName) {
                                   setIsLoading(false)
                                   return
                            }

                            setInstituteName(instName)

                            // Get institute ID
                            const { data: institute, error: instError } = await supabase
                                   .from('institutes')
                                   .select('id')
                                   .eq('name', instName)
                                   .maybeSingle()

                            if (instError || !institute) {
                                   console.error('Error fetching institute:', instError?.message)
                                   setIsLoading(false)
                                   return
                            }

                            // Get all particulars for this institute
                            const { data: parts, error: partsError } = await supabase
                                   .from('institute_particulars')
                                   .select('id, particulars, start_date, end_date')
                                   .eq('institute_id', institute.id)
                                   .order('created_at', { ascending: true })

                            if (partsError) {
                                   console.error('Error fetching particulars:', partsError.message)
                            } else {
                                   setParticulars(parts || [])
                            }
                     } catch (err) {
                            console.error('Unexpected error:', err)
                     } finally {
                            setIsLoading(false)
                     }
              }

              fetchParticulars()
       }, [authLoading, profile])

       // Fetch diagnostic report when a diagnostic interview card is clicked
       const handleCardClick = async (particular: Particular) => {
              setSelectedParticular(particular)
              const isDiagnostic = particular.particulars?.toLowerCase().includes('diagnostic interview')

              if (isDiagnostic && !diagnosticReport) {
                     setIsLoadingReport(true)
                     try {
                            const { data, error } = await supabase
                                   .from('diagnostic_reports')
                                   .select('*')
                                   .eq('student_id', profile?.id)
                                   .order('created_at', { ascending: false })
                                   .limit(1)
                                   .maybeSingle()

                            if (!error && data) {
                                   setDiagnosticReport(data)
                            }
                     } catch (err) {
                            console.error('Error fetching diagnostic report:', err)
                     } finally {
                            setIsLoadingReport(false)
                     }
              }
       }

       // Compute overall start/end dates from all particulars
       const overallDates = computeOverallDates(particulars)

       // Since all DB particulars are completed, everything = completed
       const totalSessions = particulars.length
       const completedSessions = totalSessions
       const inProgressSessions = 0
       const upcomingSessions = 0
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
                                                 particular={p}
                                                 onClick={() => handleCardClick(p)}
                                          />
                                   ))}
                            </div>
                     )}

                     {/* Session Details Dialog */}
                     <SessionDetailsDialog
                            particular={selectedParticular}
                            diagnosticReport={diagnosticReport}
                            isLoadingReport={isLoadingReport}
                            open={!!selectedParticular}
                            onOpenChange={(open) => {
                                   if (!open) setSelectedParticular(null)
                            }}
                     />
              </div>
       )
}

// ─── Module Card ──────────────────────────────────────────────────────

function ModuleCard({ particular, onClick }: { particular: Particular; onClick: () => void }) {
       return (
              <div
                     className="p-6 rounded-[20px] border border-gray-100 bg-white space-y-4 hover:shadow-md transition-shadow cursor-pointer"
                     onClick={onClick}
              >
                     <div className="space-y-1">
                            <h4 className="font-bold text-[#1e232c] leading-tight">{particular.particulars}</h4>
                     </div>

                     <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                            {particular.start_date && (
                                   <span className="flex items-center gap-1.5">
                                          <Calendar className="size-3" />
                                          Start: {formatDate(particular.start_date)}
                                   </span>
                            )}
                            {particular.end_date && (
                                   <span className="flex items-center gap-1.5">
                                          <Calendar className="size-3" />
                                          End: {formatDate(particular.end_date)}
                                   </span>
                            )}
                            {!particular.start_date && !particular.end_date && (
                                   <span className="text-gray-400">Dates TBD</span>
                            )}
                     </div>
              </div>
       )
}

// ─── Session Details Dialog ───────────────────────────────────────────

function SessionDetailsDialog({
       particular,
       diagnosticReport,
       isLoadingReport,
       open,
       onOpenChange,
}: {
       particular: Particular | null
       diagnosticReport: any
       isLoadingReport: boolean
       open: boolean
       onOpenChange: (open: boolean) => void
}) {
       if (!particular) return null

       const isDiagnostic = particular.particulars?.toLowerCase().includes('diagnostic interview')
       const startDate = formatDate(particular.start_date)
       const endDate = formatDate(particular.end_date)

       return (
              <Dialog open={open} onOpenChange={onOpenChange}>
                     <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-2xl">
                            {/* Header */}
                            <DialogHeader className="px-6 py-5 border-b border-gray-200">
                                   <DialogTitle className="text-2xl font-semibold text-[#0f172b]">
                                          Session Details
                                   </DialogTitle>
                                   <DialogDescription className="sr-only">
                                          Details for {particular.particulars}
                                   </DialogDescription>
                            </DialogHeader>

                            {/* Body */}
                            <div className="px-6 py-6 space-y-8">
                                   {/* Session Info Card (orange) */}
                                   <div className="bg-[#FF9E44]/8 border border-[#ffd4a8] rounded-[14px] p-6 space-y-4">
                                          <h3 className="text-xl font-semibold text-[#0f172b]">
                                                 {particular.particulars}
                                          </h3>

                                          <div className="grid grid-cols-2 gap-4">
                                                 {startDate && (
                                                        <div className="flex items-center gap-2">
                                                               <Calendar className="size-5 text-[#FF9E44]" />
                                                               <div>
                                                                      <p className="text-xs text-gray-500">Start Date</p>
                                                                      <p className="text-base font-medium text-[#0f172b]">{startDate}</p>
                                                               </div>
                                                        </div>
                                                 )}
                                                 {endDate && (
                                                        <div className="flex items-center gap-2">
                                                               <Calendar className="size-5 text-[#FF9E44]" />
                                                               <div>
                                                                      <p className="text-xs text-gray-500">End Date</p>
                                                                      <p className="text-base font-medium text-[#0f172b]">{endDate}</p>
                                                               </div>
                                                        </div>
                                                 )}
                                                 {isDiagnostic && (
                                                        <>
                                                               <div className="flex items-center gap-2">
                                                                      <Clock className="size-5 text-[#FF9E44]" />
                                                                      <div>
                                                                             <p className="text-xs text-gray-500">Duration</p>
                                                                             <p className="text-base font-medium text-[#0f172b]">1 hour</p>
                                                                      </div>
                                                               </div>
                                                               <div className="flex items-center gap-2">
                                                                      <Users className="size-5 text-[#FF9E44]" />
                                                                      <div>
                                                                             <p className="text-xs text-gray-500">Session Type</p>
                                                                             <p className="text-base font-medium text-[#0f172b]">1-on-1 Interview</p>
                                                                      </div>
                                                               </div>
                                                        </>
                                                 )}
                                          </div>
                                   </div>

                                   {/* Diagnostic-specific content */}
                                   {isDiagnostic && (
                                          <>
                                                 {/* Mentor Section */}
                                                 {isLoadingReport ? (
                                                        <div className="text-center py-4">
                                                               <p className="text-sm text-gray-400">Loading report data...</p>
                                                        </div>
                                                 ) : diagnosticReport?.mentor_name ? (
                                                        <div className="space-y-4">
                                                               <h3 className="text-lg font-semibold text-[#0f172b]">Your Mentor</h3>
                                                               <div className="border border-gray-200 rounded-[14px] p-6 space-y-4">
                                                                      {/* Mentor Info */}
                                                                      <div className="flex items-center gap-4">
                                                                             <div className="size-16 rounded-full bg-gradient-to-b from-[#FF9E44] to-[#ff7e1a] flex items-center justify-center text-white text-2xl font-semibold shrink-0">
                                                                                    {diagnosticReport.mentor_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                                                             </div>
                                                                             <div>
                                                                                    <h4 className="text-lg font-semibold text-[#0f172b]">{diagnosticReport.mentor_name}</h4>
                                                                                    {diagnosticReport.average_rating != null && (
                                                                                           <div className="flex items-center gap-1 mt-1">
                                                                                                  <div className="bg-[#fef3e6] text-[#FF9E44] text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                                                                                         <Star className="size-3 fill-[#FF9E44]" />
                                                                                                         {diagnosticReport.average_rating.toFixed(1)} rating
                                                                                                  </div>
                                                                                           </div>
                                                                                    )}
                                                                             </div>
                                                                      </div>

                                                                      {/* Strongest Aspects as expertise */}
                                                                      {diagnosticReport.strongest_aspects && (
                                                                             <div className="space-y-2">
                                                                                    <p className="text-base font-medium text-[#0f172b]">Key Strengths</p>
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                           {diagnosticReport.strongest_aspects.split(',').map((tag: string, i: number) => (
                                                                                                  <span key={i} className="bg-gray-100 text-[#0f172b] text-sm px-3 py-1.5 rounded-[10px]">
                                                                                                         {tag.trim()}
                                                                                                  </span>
                                                                                           ))}
                                                                                    </div>
                                                                             </div>
                                                                      )}

                                                                      {/* Improvement areas as about */}
                                                                      {diagnosticReport.improvement_areas && (
                                                                             <div className="space-y-2">
                                                                                    <p className="text-base font-medium text-[#0f172b]">Summary</p>
                                                                                    <p className="text-sm text-gray-500 leading-relaxed">
                                                                                           {diagnosticReport.improvement_areas}
                                                                                    </p>
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        </div>
                                                 ) : null}

                                                 {/* Session Agenda */}
                                                 <div className="space-y-4">
                                                        <h3 className="text-lg font-semibold text-[#0f172b]">Session Agenda</h3>
                                                        <div className="space-y-3">
                                                               {DIAGNOSTIC_AGENDA.map((item, i) => (
                                                                      <div key={i} className="flex gap-3 items-start">
                                                                             <div className="size-8 rounded-full bg-[#FF9E44] flex items-center justify-center text-white text-sm font-medium shrink-0">
                                                                                    {i + 1}
                                                                             </div>
                                                                             <div>
                                                                                    <p className="text-base font-medium text-[#0f172b]">{item.title}</p>
                                                                                    <p className="text-sm text-gray-500">{item.description}</p>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>

                                                 {/* How to Prepare */}
                                                 <div className="space-y-4">
                                                        <h3 className="text-lg font-semibold text-[#0f172b]">How to Prepare</h3>
                                                        <div className="bg-gray-50 border border-gray-200 rounded-[14px] p-5 space-y-3">
                                                               {DIAGNOSTIC_PREP_TIPS.map((tip, i) => (
                                                                      <div key={i} className="flex items-start gap-3">
                                                                             <CheckCircle2 className="size-5 text-[#FF9E44] shrink-0 mt-0.5" />
                                                                             <p className="text-sm text-gray-500">{tip}</p>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>
                                          </>
                                   )}

                                   {/* Non-diagnostic: simple info */}
                                   {!isDiagnostic && (
                                          <div className="text-center py-4">
                                                 <p className="text-sm text-gray-400">
                                                        No additional details available for this session yet.
                                                 </p>
                                          </div>
                                   )}
                            </div>

                            {/* Footer */}
                            <DialogFooter className="px-6 py-4 border-t border-gray-200">
                                   <DialogClose asChild>
                                          <Button variant="outline" className="w-full rounded-[14px] h-12 text-base font-medium border-gray-200">
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
       // Otherwise return as-is (e.g. "October Week 6")
       return dateStr
}

function computeOverallDates(particulars: Particular[]): { start: string | null, end: string | null } {
       const isoDates = particulars
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
