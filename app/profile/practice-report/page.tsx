"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       MentorDetailsSection,
       StarRating,
} from "../report-components"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

// ─── Page Component ──────────────────────────────────────────────────

export default function PracticeReportPage() {
       const { user, profile } = useAuth()
       const [report, setReport] = useState<Record<string, unknown> | null>(null)
       const [reportData, setReportData] = useState<Record<string, unknown> | null>(null)
       const [loading, setLoading] = useState(true)
       const supabase = createClient()

       useEffect(() => {
              const fetchReport = async () => {
                     if (!profile) return
                     setLoading(true)

                     try {
                            const { data: attendees } = await supabase
                                   .from('cdm_session_attendees')
                                   .select('id')
                                   .eq('student_id', profile.id)

                            if (!attendees || attendees.length === 0) {
                                   setLoading(false)
                                   return
                            }

                            const attendeeIds = attendees.map(a => a.id)

                            const { data: reports } = await supabase
                                   .from("cdm_student_reports")
                                   .select("*")
                                   .in("attendee_id", attendeeIds)
                                   .order("created_at", { ascending: false })

                            if (reports && reports.length > 0) {
                                   const practiceReport = reports.find(r =>
                                          (r.report_type || '').toLowerCase().includes('practice')
                                   )

                                   if (practiceReport) {
                                          setReport(practiceReport)
                                          setReportData(practiceReport.report_data || {})
                                   }
                            }
                     } catch (err) {
                            console.error("Error fetching report:", err)
                     } finally {
                            setLoading(false)
                     }
              }
              fetchReport()
       }, [profile, supabase])

       if (loading) {
              return (
                     <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
                            <p className="text-gray-500">Loading report...</p>
                     </div>
              )
       }

       if (!report || !reportData) {
              return (
                     <div className="min-h-screen bg-[#F8F9FB]">
                            <ReportHeader title="Practice Interview Report" />
                            <div className="max-w-[1400px] mx-auto px-8 py-6">
                                   <BackToProfile />
                                   <p className="text-gray-500 mt-8 text-center">No practice interview report available for your account.</p>
                            </div>
                     </div>
              )
       }

       const meta = reportData.meta || {}
       const sections: { title: string; rating: number }[] = reportData.sections || []
       const feedback = reportData.feedback_summary || {}
       const overallRating = meta.overall_rating || 0

       // Build feedback entries from feedback_summary
       const feedbackEntries = [
              { heading: "Overall Impression", content: feedback.overall_impression },
              { heading: "Strengths", content: feedback.strengths },
              { heading: "Additional Strengths", content: feedback.additional_strengths },
              { heading: "Areas for Improvement", content: feedback.areas_for_improvement },
              { heading: "Career Goals Articulation", content: feedback.career_goals_articulation },
              { heading: "Red Flags", content: feedback.red_flags },
              { heading: "Red Flag Remarks", content: feedback.red_flag_remarks },
       ].filter(e => e.content)

       // Calculate average section rating
       const avgSectionRating = sections.length > 0
              ? (sections.reduce((sum, s) => sum + s.rating, 0) / sections.length).toFixed(1)
              : "N/A"

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader
                            title="Practice Interview Report"
                            subtitle="Detailed HR interview practice evaluation and feedback"
                            date={meta.date}
                     />

                     <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                            <BackToProfile />

                            <CandidateDetails
                                   name={profile?.full_name || meta.mentee_name}
                                   id={profile?.enrollment_id || user?.id?.substring(0, 8)}
                                   role="Student"
                            />

                            <MentorDetailsSection
                                   mentorName={meta.mentor_name}
                                   mentorRole="Practice Interviewer"
                                   assessmentDate={meta.date}
                                   assessmentSummary={feedback.overall_impression}
                                   progressNote={`Overall Rating: ${typeof overallRating === 'number' ? overallRating.toFixed(1) : overallRating} / 5`}
                            />

                            {/* ─── Overall Assessment ──────────────────────────── */}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-6">Overall Assessment</h3>
                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                          {/* Overall Rating */}
                                          <div className="flex flex-col items-center justify-center bg-orange-50/60 rounded-2xl p-6">
                                                 <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Overall Rating</p>
                                                 <p className="text-5xl font-bold text-[#FF9E44]">{typeof overallRating === 'number' ? overallRating.toFixed(1) : overallRating}</p>
                                                 <p className="text-xs text-gray-400 mt-1">out of 5.0</p>
                                                 <div className="mt-3">
                                                        <StarRating rating={Math.round(overallRating)} />
                                                 </div>
                                          </div>

                                          {/* Average Section Score */}
                                          <div className="flex flex-col items-center justify-center bg-blue-50/60 rounded-2xl p-6">
                                                 <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Avg. Section Score</p>
                                                 <p className="text-5xl font-bold text-blue-500">{avgSectionRating}</p>
                                                 <p className="text-xs text-gray-400 mt-1">out of 5.0</p>
                                          </div>

                                          {/* Sections Evaluated */}
                                          <div className="flex flex-col items-center justify-center bg-green-50/60 rounded-2xl p-6">
                                                 <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Sections Evaluated</p>
                                                 <p className="text-5xl font-bold text-green-500">{sections.length}</p>
                                                 <p className="text-xs text-gray-400 mt-1">skill areas</p>
                                          </div>
                                   </div>
                            </Card>

                            {/* ─── Section-wise Skill Ratings ──────────────────── */}
                            {sections.length > 0 && (
                                   <div className="space-y-6">
                                          <h2 className="text-xl font-bold text-[#1e232c] flex items-center gap-2">
                                                 📊 Skill-wise Rating
                                          </h2>

                                          {/* Visual Bar Chart */}
                                          <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                                 <h3 className="font-bold text-[#1e232c] mb-6">Performance Overview</h3>
                                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                                        {sections.map((s, i) => (
                                                               <div key={i} className="flex flex-col items-center">
                                                                      <div className="w-full h-32 bg-orange-50 rounded-xl relative overflow-hidden flex items-end">
                                                                             <div
                                                                                    className="w-full bg-[#FF9E44] rounded-xl flex items-end justify-center pb-2 text-white font-bold text-sm transition-all"
                                                                                    style={{ height: `${(s.rating / 5) * 100}%` }}
                                                                             >
                                                                                    {s.rating}
                                                                             </div>
                                                                      </div>
                                                                      <p className="text-[10px] text-gray-500 mt-2 text-center leading-tight line-clamp-2">{s.title}</p>
                                                               </div>
                                                        ))}
                                                 </div>
                                          </Card>

                                          {/* Individual Skill Rating Cards */}
                                          <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
                                                 <div className="bg-[#1e232c] px-5 py-4">
                                                        <h4 className="text-white font-bold">Detailed Skill Ratings</h4>
                                                 </div>
                                                 <div className="p-6 space-y-4">
                                                        {sections.map((section, si) => (
                                                               <div key={si} className="flex items-center gap-4">
                                                                      <span className="text-sm text-gray-700 w-56 shrink-0 font-medium">{section.title}</span>
                                                                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                                             <div
                                                                                    className="h-full rounded-full transition-all"
                                                                                    style={{
                                                                                           width: `${(section.rating / 5) * 100}%`,
                                                                                           backgroundColor: section.rating >= 4 ? '#22c55e' : section.rating >= 3 ? '#FF9E44' : '#ef4444',
                                                                                    }}
                                                                             />
                                                                      </div>
                                                                      <div className="flex items-center gap-1 shrink-0">
                                                                             {Array.from({ length: 5 }, (_, i) => (
                                                                                    <Star
                                                                                           key={i}
                                                                                           className={`size-3.5 ${i < section.rating ? "text-[#FF9E44] fill-[#FF9E44]" : "text-gray-200 fill-gray-200"}`}
                                                                                    />
                                                                             ))}
                                                                             <span className="text-sm font-bold text-[#1e232c] ml-1 w-8">{section.rating}/5</span>
                                                                      </div>
                                                               </div>
                                                        ))}
                                                 </div>
                                          </Card>
                                   </div>
                            )}

                            {/* ─── Mentor Feedback Summary ─────────────────────── */}
                            {feedbackEntries.length > 0 && (
                                   <div className="space-y-6">
                                          <h2 className="text-xl font-bold text-[#1e232c] flex items-center gap-2">
                                                 📋 Mentor Feedback Summary
                                          </h2>

                                          {feedbackEntries.map((entry, i) => {
                                                 const isStrength = entry.heading.toLowerCase().includes('strength')
                                                 const isImprovement = entry.heading.toLowerCase().includes('improvement')
                                                 const isRedFlag = entry.heading.toLowerCase().includes('red flag')
                                                 const isImpression = entry.heading.toLowerCase().includes('impression')
                                                 const isGoals = entry.heading.toLowerCase().includes('goal')

                                                 let borderColor = 'border-[#FF9E44]'
                                                 let bgColor = 'bg-orange-50/40'

                                                 if (isStrength) { borderColor = 'border-green-300'; bgColor = 'bg-green-50/50' }
                                                 else if (isImprovement) { borderColor = 'border-red-300'; bgColor = 'bg-red-50/50' }
                                                 else if (isRedFlag) { borderColor = 'border-red-400'; bgColor = 'bg-red-50/60' }
                                                 else if (isImpression) { borderColor = 'border-blue-300'; bgColor = 'bg-blue-50/50' }
                                                 else if (isGoals) { borderColor = 'border-purple-300'; bgColor = 'bg-purple-50/50' }

                                                 return (
                                                        <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                                                               <div className="bg-[#1e232c] px-5 py-4">
                                                                      <h4 className="text-white font-bold">{entry.heading}</h4>
                                                               </div>
                                                               <div className="p-6">
                                                                      <div className={`border-l-4 ${borderColor} ${bgColor} rounded-r-xl p-4`}>
                                                                             <div className="space-y-2">
                                                                                    {entry.content.split('\n').filter(Boolean).map((line: string, li: number) => (
                                                                                           <p key={li} className="text-sm text-gray-700 leading-relaxed">
                                                                                                  {line.trim()}
                                                                                           </p>
                                                                                    ))}
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 )
                                          })}
                                   </div>
                            )}
                     </div>
              </div>
       )
}
