"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       MentorDetailsSection,
       StarRating,
} from "../report-components"

// ─── Page Component ──────────────────────────────────────────────────

export default function ResumeReportPage() {
       const { user, profile } = useAuth()
       const [report, setReport] = useState<Record<string, unknown> | null>(null)
       const [reportData, setReportData] = useState<Record<string, unknown> | null>(null)
       const [loading, setLoading] = useState(true)
       const supabase = createClient()
       const searchParams = useSearchParams()
       const reportId = searchParams.get('id')

       useEffect(() => {
              const fetchReport = async () => {
                     if (!profile) return
                     setLoading(true)

                     try {
                            // If a specific report ID is provided, fetch by ID directly
                            if (reportId) {
                                   const { data, error } = await supabase
                                          .from("cdm_student_reports")
                                          .select("*")
                                          .eq("id", reportId)
                                          .maybeSingle()

                                   if (!error && data) {
                                          setReport(data)
                                          setReportData(data.report_data || {})
                                   }
                                   return
                            }

                            // Fallback: find by type (legacy behavior)
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
                                   const resumeReport = reports.find(r =>
                                          (r.report_type || '').toLowerCase().includes('resume')
                                   )

                                   if (resumeReport) {
                                          setReport(resumeReport)
                                          setReportData(resumeReport.report_data || {})
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
                            <ReportHeader title="Resume Review Report" />
                            <div className="max-w-[1400px] mx-auto px-8 py-6">
                                   <BackToProfile />
                                   <p className="text-gray-500 mt-8 text-center">No resume review report available for your account.</p>
                            </div>
                     </div>
              )
       }

       const data = reportData as Record<string, any>
       const meta = data.meta || {}
       const sections: { title: string; rating: number; comments?: string }[] = Array.isArray(data.sections) ? data.sections : []
       const feedback = data.feedback_summary || {}
       const overallRating = meta.overall_rating || 0

       // Build feedback entries from feedback_summary
       const feedbackEntries = [
              { heading: "Strengths", content: feedback.strengths },
              { heading: "Areas for Improvement", content: feedback.areas_for_improvement },
              { heading: "Resume Alignment", content: feedback.resume_alignment },
              { heading: "Specific Recommendations", content: feedback.specific_recommendations },
              { heading: "Next Steps", content: feedback.next_steps },
              { heading: "Certifications / Tools / Courses", content: feedback.certifications_tools_courses },
       ].filter(e => e.content)

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader
                            title="Resume Review Report"
                            subtitle="Detailed evaluation of resume content, structure, and impact"
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
                                   mentorRole="Resume Reviewer"
                                   assessmentDate={meta.date}
                                   assessmentSummary={feedback.areas_for_improvement}
                                   progressNote={`Overall Rating: ${typeof overallRating === 'number' ? overallRating.toFixed(1) : overallRating} / 5`}
                            />

                            {/* ─── Overall Rating Summary ──────────────────────── */}
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                   <div className="bg-[#1e232c] px-5 py-4 flex items-center justify-between">
                                          <h4 className="text-white font-bold">Overall Rating</h4>
                                          <StarRating rating={Math.round(overallRating)} />
                                   </div>
                                   <div className="p-6 text-center">
                                          <p className="text-4xl font-bold text-[#FF9E44]">{typeof overallRating === 'number' ? overallRating.toFixed(1) : overallRating}</p>
                                          <p className="text-xs text-gray-400 mt-1">out of 5.0</p>
                                   </div>
                            </div>

                            {/* ─── Section-wise Ratings ─────────────────────────── */}
                            {sections.length > 0 && (
                                   <div className="space-y-6">
                                          <h2 className="text-xl font-bold text-[#1e232c] flex items-center gap-2">
                                                 📝 Section-wise Evaluation
                                          </h2>

                                          {/* Rating Bar Chart */}
                                          <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                                 <h3 className="font-bold text-[#1e232c] mb-6">Section Ratings</h3>
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

                                          {/* Individual Section Cards with Comments */}
                                          {sections.map((section, si) => (
                                                 <div key={si} className="border border-gray-100 rounded-2xl overflow-hidden">
                                                        <div className="bg-[#1e232c] px-5 py-4 flex items-center justify-between">
                                                               <h4 className="text-white font-bold text-sm leading-snug max-w-[65%]">{section.title}</h4>
                                                               <div className="flex items-center gap-1">
                                                                      {Array.from({ length: 5 }, (_, i) => (
                                                                             <Star
                                                                                    key={i}
                                                                                    className={`size-4 ${i < section.rating ? "text-[#FF9E44] fill-[#FF9E44]" : "text-gray-500 fill-gray-500"}`}
                                                                             />
                                                                      ))}
                                                                      <span className="text-sm font-bold text-white ml-2">{section.rating}/5</span>
                                                               </div>
                                                        </div>
                                                        <div className="p-6">
                                                               {section.comments ? (
                                                                      <div className="space-y-3">
                                                                             {section.comments.split('\n').filter(Boolean).map((comment: string, ci: number) => (
                                                                                    <div key={ci} className="border-l-4 border-[#FF9E44] bg-orange-50/50 rounded-r-xl px-5 py-3">
                                                                                           <div className="flex items-start gap-3">
                                                                                                  <span className="size-6 rounded-full bg-[#FF9E44] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                                                                                         {ci + 1}
                                                                                                  </span>
                                                                                                  <p className="text-sm text-gray-700 leading-relaxed">{comment.replace(/^\d+\.\s*/, '').trim()}</p>
                                                                                           </div>
                                                                                    </div>
                                                                             ))}
                                                                      </div>
                                                               ) : (
                                                                      <p className="text-sm text-gray-400 italic">No specific comments for this section.</p>
                                                               )}
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            )}

                            {/* ─── Detailed Feedback Summary ──────────────────── */}
                            {feedbackEntries.length > 0 && (
                                   <div className="space-y-6">
                                          <h2 className="text-xl font-bold text-[#1e232c] flex items-center gap-2">
                                                 📋 Mentor Feedback Summary
                                          </h2>

                                          {feedbackEntries.map((entry, i) => {
                                                 const isStrength = entry.heading.toLowerCase().includes('strength')
                                                 const isImprovement = entry.heading.toLowerCase().includes('improvement')
                                                 const borderColor = isStrength ? 'border-green-300' : isImprovement ? 'border-red-300' : 'border-[#FF9E44]'
                                                 const bgColor = isStrength ? 'bg-green-50/50' : isImprovement ? 'bg-red-50/50' : 'bg-orange-50/40'

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
