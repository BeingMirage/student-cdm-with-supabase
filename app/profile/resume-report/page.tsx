"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       MentorDetailsSection,
       FeedbackItem,
       InterviewTranscript,
} from "../report-components"

// ─── Data ────────────────────────────────────────────────────────────

export default function ResumeReportPage() {
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
                                   // Find the first report that is of type 'Resume' (case-insensitive)
                                   const resumeReport = reports.find(r =>
                                          r.report_type.toLowerCase().includes('resume')
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

       const meta = reportData.meta || {}
       const sections = reportData.sections || []

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader title="Resume Review Report" date={meta.date} />

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
                            />

                            {/* Detailed Section Feedback */}
                            {sections.length > 0 && (
                                   <div className="space-y-6">
                                          <h2 className="text-xl font-bold text-[#1e232c] flex items-center gap-2">
                                                 📝 Detailed Section Feedback
                                          </h2>

                                          {sections.map((section: any, si: number) => (
                                                 <div key={si} className="space-y-0">
                                                        {/* Section Banner */}
                                                        <div className={`${section.color || "bg-[#FF9E44]"} px-5 py-3.5 rounded-t-2xl flex items-center justify-between`}>
                                                               <h3 className="text-white font-bold">{section.title}</h3>
                                                               {section.groups && (
                                                                      <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">
                                                                             {section.groups.reduce((acc: number, g: any) => acc + (g.items?.length || 0), 0)} comments
                                                                      </span>
                                                               )}
                                                        </div>

                                                        {/* Groups */}
                                                        <Card className="rounded-t-none rounded-b-2xl border-gray-100 shadow-sm p-6 space-y-8">
                                                               {section.groups?.map((group: any, gi: number) => (
                                                                      <div key={gi} className="space-y-4">
                                                                             <div className="flex items-center justify-between">
                                                                                    <h4 className="font-bold text-[#1e232c]">{group.heading}</h4>
                                                                                    {group.commentCount && (
                                                                                           <span className="text-xs text-gray-400">{group.commentCount}</span>
                                                                                    )}
                                                                             </div>
                                                                             <div className="space-y-3">
                                                                                    {group.items?.map((item: any) => (
                                                                                           <FeedbackItem key={item.number} {...item} />
                                                                                    ))}
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </Card>
                                                 </div>
                                          ))}
                                   </div>
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
