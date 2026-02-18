"use client"

import { Card } from "@/components/ui/card"
import { Star, CheckCircle2 } from "lucide-react"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       MentorDetailsSection,
       StarRating,
       InterviewTranscript,
} from "../report-components"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

// ─── Page Component ──────────────────────────────────────────────────

export default function PracticeReportPage() {
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
                                   // Find the first report that is of type 'Practice' (case-insensitive)
                                   const practiceReport = reports.find(r =>
                                          r.report_type.toLowerCase().includes('practice')
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
       const overallScore = meta.overall_score || "N/A"
       const skillBreakdown = reportData.skill_breakdown || []
       const detailedAssessments = reportData.detailed_assessments || []
       const softSkillsAssessment = reportData.soft_skills || []

       // Helper to parse "3.7/5.0" to ratio
       const getScoreRatio = (scoreStr: string) => {
              if (!scoreStr) return 0
              try {
                     const parts = scoreStr.split('/')
                     if (parts.length === 2) {
                            return parseFloat(parts[0]) / parseFloat(parts[1])
                     }
                     return parseFloat(scoreStr) / 5
              } catch (e) {
                     return 0
              }
       }

       const overallRatio = getScoreRatio(overallScore)

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader title="Practice Interview Report" date={meta.date} />

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
                            />

                            {/* Overall Assessment */}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-6">Overall Assessment</h3>
                                   <div className="grid grid-cols-2 gap-8">
                                          {/* Score Circle */}
                                          <div className="flex flex-col items-center justify-center">
                                                 <div className="relative size-40">
                                                        <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                                                               <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                                                               <circle cx="60" cy="60" r="50" fill="none" stroke="#FF9E44" strokeWidth="10"
                                                                      strokeDasharray={`${overallRatio * 314} 314`} strokeLinecap="round" />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                               <span className="text-3xl font-bold text-[#FF9E44]">{overallScore}</span>
                                                        </div>
                                                 </div>
                                                 {/* Radar-like labels */}
                                                 <div className="flex flex-wrap justify-center gap-2 mt-4 text-[10px] text-gray-500">
                                                        <span>COMMUNICATION</span>
                                                        <span>•</span>
                                                        <span>ATTITUDE</span>
                                                        <span>•</span>
                                                        <span>TECHNICAL SKILLS</span>
                                                        <span>•</span>
                                                        <span>SOFT SKILLS</span>
                                                        <span>•</span>
                                                        <span>ENTHUSIASM</span>
                                                 </div>
                                          </div>

                                          {/* Skill Breakdown */}
                                          <div>
                                                 <h4 className="font-bold text-[#1e232c] mb-4">Skill Breakdown</h4>
                                                 <div className="grid grid-cols-2 gap-3">
                                                        {skillBreakdown.length > 0 ? (
                                                               skillBreakdown.map((skill: any, i: number) => (
                                                                      <div key={i} className="flex items-center justify-between">
                                                                             <span className="text-sm text-gray-700">{skill.name}</span>
                                                                             <div className="flex items-center gap-0.5">
                                                                                    {Array.from({ length: 5 }, (_, si) => (
                                                                                           <Star key={si} className={`size-3.5 ${si < (skill.rating || 0) ? "text-[#FF9E44] fill-[#FF9E44]" : "text-gray-200 fill-gray-200"}`} />
                                                                                    ))}
                                                                             </div>
                                                                      </div>
                                                               ))
                                                        ) : (
                                                               <p className="text-sm text-gray-500 italic">No breakdown available</p>
                                                        )}
                                                 </div>
                                          </div>
                                   </div>
                            </Card>

                            {/* Key Remarks */}
                            {reportData.key_remarks && (
                                   <Card className="p-5 rounded-2xl border-orange-200 bg-orange-50 shadow-sm">
                                          <div className="flex items-start gap-3">
                                                 <span className="text-lg">⭐</span>
                                                 <div>
                                                        <p className="font-semibold text-[#1e232c] mb-1">Key Remarks</p>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                               {reportData.key_remarks}
                                                        </p>
                                                 </div>
                                          </div>
                                   </Card>
                            )}

                            {/* Detailed Skill Assessment */}
                            {detailedAssessments.length > 0 && (
                                   <div className="space-y-6">
                                          <h2 className="text-xl font-bold text-[#1e232c]">Detailed Skill Assessment</h2>

                                          {detailedAssessments.map((skill: any, i: number) => (
                                                 <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                                                        {/* Header */}
                                                        <div className="bg-[#1e232c] px-5 py-4 flex items-center justify-between">
                                                               <h4 className="text-white font-bold">{skill.name}</h4>
                                                               <StarRating rating={skill.rating} />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="p-6">
                                                               <div className="grid grid-cols-2 gap-8">
                                                                      {/* Progress Bars */}
                                                                      <div className="space-y-4">
                                                                             <div>
                                                                                    <div className="flex items-center justify-between mb-1">
                                                                                           <span className="text-sm text-gray-500">Knowledge</span>
                                                                                           <span className="text-sm font-bold text-[#1e232c]">{skill.knowledge}%</span>
                                                                                    </div>
                                                                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                                                           <div className="h-full bg-[#FF9E44] rounded-full" style={{ width: `${skill.knowledge}%` }} />
                                                                                    </div>
                                                                             </div>
                                                                             <div>
                                                                                    <div className="flex items-center justify-between mb-1">
                                                                                           <span className="text-sm text-gray-500">Clarity of Thought</span>
                                                                                           <span className="text-sm font-bold text-[#1e232c]">{skill.clarity}%</span>
                                                                                    </div>
                                                                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                                                           <div className="h-full bg-[#FF9E44] rounded-full" style={{ width: `${skill.clarity}%` }} />
                                                                                    </div>
                                                                             </div>
                                                                      </div>

                                                                      {/* Feedback Points */}
                                                                      <div>
                                                                             <h5 className="text-sm font-bold text-[#1e232c] mb-3">Feedback Points</h5>
                                                                             <ul className="space-y-2">
                                                                                    {skill.feedback?.map((f: string, fi: number) => (
                                                                                           <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                                                                                                  <CheckCircle2 className={`size-4 mt-0.5 shrink-0 ${fi === 0 ? "text-green-500" : fi === 1 ? "text-orange-400" : "text-blue-400"}`} />
                                                                                                  {f}
                                                                                           </li>
                                                                                    ))}
                                                                             </ul>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            )}

                            {/* Soft Skills Assessment */}
                            {softSkillsAssessment.length > 0 && (
                                   <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                          <h3 className="text-lg font-bold text-[#1e232c] mb-4">Soft Skills Assessment</h3>
                                          <div className="space-y-3">
                                                 {softSkillsAssessment.map((skill: any, i: number) => (
                                                        <div key={i} className="flex items-center gap-4">
                                                               <span className="text-sm text-gray-700 w-44 shrink-0">{skill.name}</span>
                                                               <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                                      <div
                                                                             className="h-full bg-[#FF9E44] rounded-full transition-all"
                                                                             style={{ width: `${getScoreRatio(skill.score) * 100}%` }}
                                                                      />
                                                               </div>
                                                               <span className="text-sm font-bold text-[#1e232c] w-12 text-right">{skill.score}</span>
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
