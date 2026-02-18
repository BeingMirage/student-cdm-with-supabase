"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle } from "lucide-react"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       InterviewTranscript,
} from "../report-components"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

// ─── Helper Functions ────────────────────────────────────────────────

// Get color scheme based on score (0-100)
const getScoreColor = (score: number) => {
       if (score >= 80) return {
              bg: "bg-green-500",
              bgLight: "bg-green-50",
              text: "text-green-600",
              tagBg: "bg-green-100",
              tagText: "text-green-700",
              tagLabel: "Great"
       }
       if (score >= 60) return {
              bg: "bg-blue-500",
              bgLight: "bg-blue-50",
              text: "text-blue-600",
              tagBg: "bg-blue-100",
              tagText: "text-blue-700",
              tagLabel: "Good"
       }
       return {
              bg: "bg-red-400",
              bgLight: "bg-red-50",
              text: "text-red-500",
              tagBg: "bg-red-100",
              tagText: "text-red-700",
              tagLabel: "Needs Work"
       }
}

// ─── Page Component ──────────────────────────────────────────────────

export default function AIReportPage() {
       const { user, profile } = useAuth()
       const [report, setReport] = useState<any>(null)
       const [reportData, setReportData] = useState<any>(null)
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

                            // Fetch all reports for these attendees
                            const { data: reports, error } = await supabase
                                   .from("cdm_student_reports")
                                   .select("*")
                                   .in("attendee_id", attendeeIds)
                                   .order("created_at", { ascending: false })

                            if (reports && reports.length > 0) {
                                   // Find the first report that is of type 'AI' (case-insensitive)
                                   const aiReport = reports.find(r =>
                                          r.report_type.toLowerCase().includes('ai')
                                   )

                                   if (aiReport) {
                                          setReport(aiReport)
                                          setReportData(aiReport.report_data || {})
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
                            <ReportHeader title="AI Interview Assessment Report" />
                            <div className="max-w-[1400px] mx-auto px-8 py-6">
                                   <BackToProfile />
                                   <p className="text-gray-500 mt-8 text-center">No AI interview report available for your account.</p>
                            </div>
                     </div>
              )
       }

       const meta = reportData.meta || {}
       const overallScores = reportData.overall_scores || []
       const skillBreakdown = reportData.skill_breakdown || []
       const questions = reportData.questions || []
       const recommendations = reportData.recommendations || []
       const alertMessage = reportData.alert_message

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader title="AI Interview Assessment Report" subtitle="Comprehensive AI-powered evaluation of interview performance and skills readiness" date={meta.date} />

                     <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                            <BackToProfile />

                            <CandidateDetails
                                   name={profile?.full_name || meta.mentee_name}
                                   id={profile?.enrollment_id || user?.id?.substring(0, 8)}
                                   role="Student"
                            />

                            {/* Overall Assessment */}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-6">Overall Assessment</h3>
                                   <div className="grid grid-cols-4 gap-4">
                                          {overallScores.length > 0 ? (
                                                 overallScores.map((s: any, i: number) => {
                                                        const colors = getScoreColor(s.value)
                                                        return (
                                                               <div key={i} className="flex flex-col items-center">
                                                                      <div className={`w-full h-36 ${colors.bgLight} rounded-xl relative overflow-hidden flex items-end`}>
                                                                             <div
                                                                                    className={`w-full ${colors.bg} rounded-xl flex items-end justify-center pb-3 text-white font-bold text-2xl`}
                                                                                    style={{ height: `${s.value}%` }}
                                                                             >
                                                                                    {s.value}
                                                                             </div>
                                                                      </div>
                                                                      <p className="text-sm text-gray-500 mt-2">{s.label}</p>
                                                                      <span className={`text-xs font-medium mt-0.5 ${colors.text}`}>{s.status || colors.tagLabel}</span>
                                                               </div>
                                                        )
                                                 })
                                          ) : (
                                                 <p className="col-span-4 text-center text-gray-500 italic">No overall scores available</p>
                                          )}
                                   </div>

                                   {/* Alert */}
                                   {alertMessage && (
                                          <div className="mt-5 bg-orange-50 border border-orange-200 rounded-xl p-4">
                                                 <p className="text-sm text-orange-700">
                                                        ⚠️ {alertMessage}
                                                 </p>
                                          </div>
                                   )}
                            </Card>

                            {/* Skill Breakdown */}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-4">Skill Breakdown</h3>
                                   <div className="space-y-3">
                                          {skillBreakdown.length > 0 ? (
                                                 skillBreakdown.map((skill: any, i: number) => {
                                                        const scoreVal = parseInt(skill.score) || 0
                                                        const colors = getScoreColor(scoreVal)
                                                        return (
                                                               <div key={i} className="flex items-center gap-4">
                                                                      <span className="text-sm text-gray-700 w-40 shrink-0">{skill.name}</span>
                                                                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                                             <div className="h-full bg-[#FF9E44] rounded-full" style={{ width: `${scoreVal}%` }} />
                                                                      </div>
                                                                      <span className="text-sm font-bold text-[#1e232c] w-16 text-right">{skill.score}</span>
                                                                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors.tagBg} ${colors.tagText}`}>
                                                                             {skill.tag || colors.tagLabel}
                                                                      </span>
                                                               </div>
                                                        )
                                                 })
                                          ) : (
                                                 <p className="text-sm text-gray-500 italic">No skill breakdown available</p>
                                          )}
                                   </div>
                            </Card>

                            {/* Question by Question Analysis */}
                            {questions.length > 0 && (
                                   <div className="space-y-6">
                                          <h2 className="text-xl font-bold text-[#1e232c]">Question by Question Analysis</h2>

                                          {questions.map((q: any) => (
                                                 <Card key={q.number} className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
                                                        {/* Question Header */}
                                                        <div className="px-6 py-4 border-b border-gray-100">
                                                               <div className="flex items-center gap-3 mb-2">
                                                                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium">Question {q.number}</span>
                                                                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{q.category}</span>
                                                                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">Score: {q.score}</span>
                                                               </div>
                                                               <p className="font-bold text-[#1e232c]">{q.question}</p>
                                                        </div>

                                                        <div className="p-6 space-y-5">
                                                               {/* Feedback */}
                                                               <div>
                                                                      <h5 className="text-sm font-bold text-[#1e232c] mb-2">Interviewer&apos;s Feedback</h5>
                                                                      <p className="text-sm text-gray-600 leading-relaxed">{q.feedback}</p>
                                                               </div>

                                                               {/* Strengths & Improvements */}
                                                               <div className="grid grid-cols-2 gap-6">
                                                                      <div className="bg-green-50 rounded-xl p-4">
                                                                             <h5 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1.5">
                                                                                    <CheckCircle2 className="size-4" /> Strengths
                                                                             </h5>
                                                                             <ul className="space-y-1.5">
                                                                                    {q.strengths?.map((s: string, si: number) => (
                                                                                           <li key={si} className="text-sm text-green-700 flex items-start gap-1.5">
                                                                                                  <span className="mt-1.5 size-1.5 rounded-full bg-green-500 shrink-0" />
                                                                                                  {s}
                                                                                           </li>
                                                                                    ))}
                                                                             </ul>
                                                                      </div>
                                                                      <div className="bg-red-50 rounded-xl p-4">
                                                                             <h5 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-1.5">
                                                                                    <AlertCircle className="size-4" /> Areas for Improvement
                                                                             </h5>
                                                                             <ul className="space-y-1.5">
                                                                                    {q.improvements?.map((im: string, ii: number) => (
                                                                                           <li key={ii} className="text-sm text-red-600 flex items-start gap-1.5">
                                                                                                  <span className="mt-1.5 size-1.5 rounded-full bg-red-400 shrink-0" />
                                                                                                  {im}
                                                                                           </li>
                                                                                    ))}
                                                                             </ul>
                                                                      </div>
                                                               </div>

                                                               {/* Suggested Response */}
                                                               {q.suggestedResponse && (
                                                                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                                                             <h5 className="text-sm font-bold text-blue-700 mb-2">💡 Suggested Improved Response</h5>
                                                                             <p className="text-sm text-blue-800 leading-relaxed italic">{q.suggestedResponse}</p>
                                                                      </div>
                                                               )}
                                                        </div>
                                                 </Card>
                                          ))}
                                   </div>
                            )}

                            {/* Final Recommendations */}
                            {recommendations.length > 0 && (
                                   <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                          <h3 className="text-lg font-bold text-[#1e232c] mb-4">Final Recommendations</h3>
                                          <div className="space-y-4">
                                                 {recommendations.map((rec: any, i: number) => (
                                                        <div key={i} className="flex items-start gap-3">
                                                               <span className="text-lg">{rec.icon}</span>
                                                               <div>
                                                                      <p className="font-semibold text-[#1e232c] text-sm">{rec.title}</p>
                                                                      <p className="text-sm text-gray-600 mt-0.5">{rec.text}</p>
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   </Card>
                            )}

                            {/* Interview Transcript */}
                            <InterviewTranscript
                                   messages={reportData.transcript?.messages}
                                   duration={reportData.transcript?.duration}
                                   length={reportData.transcript?.length}
                            />
                     </div>
              </div>
       )
}
