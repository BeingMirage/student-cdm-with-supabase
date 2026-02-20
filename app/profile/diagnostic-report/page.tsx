"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       MentorDetailsSection,
       ChecklistSection,
} from "../report-components"

// ─── Types ───────────────────────────────────────────────────────────

type SectionItem = {
       label: string
       value: boolean
       is_positive: boolean
}

type ReportSection = {
       title: string
       rating: number
       items: SectionItem[]
}

type ReportData = {
       meta: {
              date: string
              mentee_name: string
              mentor_name: string
              overall_rating: number
              alignment_score: number
       }
       sections: ReportSection[]
       feedback_summary: {
              job_fit: string
              plan_b_c: string
              target_roles: string
              strongest_aspects: string
              areas_for_improvement: string
       }
}

// ─── Page Component ──────────────────────────────────────────────────

export default function DiagnosticReportPage() {
       const { user, profile } = useAuth()
       const [report, setReport] = useState<Record<string, unknown> | null>(null)
       const [reportData, setReportData] = useState<ReportData | null>(null)
       const [loading, setLoading] = useState(true)
       const supabase = createClient()
       const searchParams = useSearchParams()
       const reportId = searchParams.get('id')

       useEffect(() => {
              const fetchReport = async () => {
                     if (!profile) return
                     setLoading(true)

                     // If a specific report ID is provided, fetch by ID directly
                     if (reportId) {
                            const { data, error } = await supabase
                                   .from("cdm_student_reports")
                                   .select("*")
                                   .eq("id", reportId)
                                   .maybeSingle()

                            if (!error && data) {
                                   setReport(data)
                                   setReportData(data.report_data as ReportData)
                            }
                            setLoading(false)
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

                     const { data, error } = await supabase
                            .from("cdm_student_reports")
                            .select("*")
                            .in("attendee_id", attendeeIds)
                            .ilike("report_type", "%diagnostic%")
                            .order("created_at", { ascending: false })
                            .limit(1)
                            .maybeSingle()

                     if (!error && data) {
                            setReport(data)
                            setReportData(data.report_data as ReportData)
                     }
                     setLoading(false)
              }
              fetchReport()
       }, [profile, supabase])

       if (loading) {
              return (
                     <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
                            <p className="text-gray-500">Loading diagnostic report…</p>
                     </div>
              )
       }

       if (!report || !reportData) {
              return (
                     <div className="min-h-screen bg-[#F8F9FB]">
                            <ReportHeader title="Diagnostic Interview Report" />
                            <div className="max-w-[1400px] mx-auto px-8 py-6">
                                   <BackToProfile />
                                   <p className="text-gray-500 mt-8 text-center">No diagnostic report available for your account.</p>
                            </div>
                     </div>
              )
       }

       const meta = reportData.meta || {}
       const feedback = reportData.feedback_summary || {}
       const sections = reportData.sections || []

       // ─── Descriptive Questions ────────────────────────────────────
       const descriptiveQuestions = [
              {
                     question: "Where do you believe improvements are needed?",
                     subtitle: "( Summary of Candidate - areas where they need to work on )",
                     answer: feedback.areas_for_improvement,
              },
              {
                     question: "What are the top 2–3 roles the student is currently targeting?",
                     subtitle: "What reasons has the student shared for their role preferences?",
                     answer: feedback.target_roles,
              },
              {
                     question: "What are the strongest aspects of the candidate?",
                     answer: feedback.strongest_aspects,
              },
              {
                     question: "Based on your assessment, which 2–3 job families would the student fit best in?",
                     answer: feedback.job_fit,
              },
              {
                     question: "What could be their Plan B and Plan C roles?",
                     answer: feedback.plan_b_c,
              },
       ]

       // ─── Ratings ─────────────────────────────────────────────────
       const avgRating = meta.overall_rating || 0
       const alignmentScore = meta.alignment_score || 0

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     {/* Pass raw date or undefined. Component handles N/A */}
                     <ReportHeader
                            title="Diagnostic Interview Report"
                            date={meta.date}
                     />

                     <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                            <BackToProfile />

                            <CandidateDetails
                                   name={profile?.full_name || meta.mentee_name}
                                   id={profile?.enrollment_id || user?.id?.substring(0, 8)}
                                   experience={undefined} // No field for experience in DB yet
                                   role="Student"
                            />

                            <MentorDetailsSection
                                   mentorName={meta.mentor_name}
                                   mentorRole="Diagnostic Interviewer"
                                   experience={undefined}
                                   assessmentDate={meta.date}
                                   assessmentSummary={feedback.areas_for_improvement}
                                   progressNote={`Average Rating: ${avgRating.toFixed(1)} / 5  •  Alignment Score: ${alignmentScore} / 5`}
                            />

                            {/* ─── Rating Summary ───────────────────────────── */}
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                   <div className="bg-[#1e232c] px-5 py-4">
                                          <h4 className="text-white font-bold">Rating Summary</h4>
                                   </div>
                                   <div className="grid grid-cols-2 divide-x divide-gray-100">
                                          <div className="p-6 text-center">
                                                 <p className="text-xs text-gray-400 mb-1">Average Rating</p>
                                                 <p className="text-3xl font-bold text-[#FF9E44]">{avgRating.toFixed(1)}</p>
                                                 <p className="text-[10px] text-gray-400">out of 5.0</p>
                                          </div>
                                          <div className="p-6 text-center">
                                                 <p className="text-xs text-gray-400 mb-1">Alignment Score</p>
                                                 <p className="text-3xl font-bold text-[#1e232c]">{alignmentScore}</p>
                                                 <p className="text-3xl font-bold text-[#1e232c]">/ 5</p>
                                          </div>
                                   </div>
                            </div>

                            {/* ─── Detailed Mentor Feedback ──────────────────── */}
                            <div className="space-y-6">
                                   <h2 className="text-xl font-bold text-[#1e232c] flex items-center gap-2">
                                          📋 Detailed Mentor Feedback
                                   </h2>

                                   {/* Descriptive Questions */}
                                   <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                          <div className="bg-[#1e232c] px-5 py-4">
                                                 <h4 className="text-white font-bold">Descriptive Questions</h4>
                                          </div>
                                          <div className="p-6 space-y-8">
                                                 {descriptiveQuestions.map((q, qi) => (
                                                        <div key={qi} className="space-y-3">
                                                               <h5 className="font-bold text-[#1e232c]">{q.question}</h5>
                                                               {q.subtitle && (
                                                                      <p className="text-sm text-gray-500">{q.subtitle}</p>
                                                               )}
                                                               {q.answer ? (
                                                                      <div className="border-l-4 border-orange-200 bg-orange-50/40 rounded-r-xl p-4">
                                                                             <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{q.answer}</p>
                                                                      </div>
                                                               ) : (
                                                                      <p className="text-sm text-gray-400 italic">No response provided</p>
                                                               )}
                                                        </div>
                                                 ))}
                                          </div>
                                   </div>

                                   {/* Checklist Sections — dynamically rendered from report_data.sections */}
                                   {sections.map((section: ReportSection, si: number) => (
                                          <ChecklistSection
                                                 key={si}
                                                 title={section.title}
                                                 rating={section.rating}
                                                 items={(section.items ?? []).map(item => ({
                                                        text: item.label,
                                                        value: item.value,
                                                        is_positive: item.is_positive,
                                                 }))}
                                          />
                                   ))}
                            </div>
                     </div>
              </div>
       )
}
