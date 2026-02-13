"use client"

import { Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
                                          <ModuleCard key={p.id} particular={p} />
                                   ))}
                            </div>
                     )}

              </div>
       )
}

function ModuleCard({ particular }: { particular: Particular }) {
       return (
              <div className="p-6 rounded-[20px] border border-gray-100 bg-white space-y-4 hover:shadow-md transition-shadow">
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

function formatDate(dateStr: string): string {
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
