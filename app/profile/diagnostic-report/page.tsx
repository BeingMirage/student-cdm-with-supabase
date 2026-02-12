"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       MentorDetailsSection,
       ChecklistSection,
} from "../report-components"

// ─── Helpers ─────────────────────────────────────────────────────────

/** Convert a CSV "Yes"/"No" value to a boolean */
function yn(val: string | undefined | null): boolean {
       if (!val) return false
       const v = val.toString().trim().toLowerCase()
       return v === "yes" || v.startsWith("yes")
}

/** Case-insensitive, trim-aware key lookup in the detailed_scores object */
function getVal(scores: Record<string, string>, searchKey: string): string | undefined {
       const sk = searchKey.toLowerCase().trim()
       for (const [k, v] of Object.entries(scores)) {
              if (k.toLowerCase().trim() === sk) return v
       }
       return undefined
}

// ─── Page Component ──────────────────────────────────────────────────

export default function DiagnosticReportPage() {
       const { user, profile } = useAuth()
       const [report, setReport] = useState<any>(null)
       const [loading, setLoading] = useState(true)
       const supabase = createClient()

       useEffect(() => {
              const fetchReport = async () => {
                     if (!user) return
                     setLoading(true)
                     const { data, error } = await supabase
                            .from("diagnostic_reports")
                            .select("*")
                            .eq("student_id", user.id)
                            .order("created_at", { ascending: false })
                            .limit(1)
                            .maybeSingle()
                     if (!error && data) setReport(data)
                     setLoading(false)
              }
              fetchReport()
       }, [user, supabase])

       if (loading) {
              return (
                     <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
                            <p className="text-gray-500">Loading diagnostic report…</p>
                     </div>
              )
       }

       if (!report) {
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

       const d: Record<string, string> = report.detailed_scores || {}

       // ─── Descriptive Questions ────────────────────────────────────
       const descriptiveQuestions = [
              {
                     question: "Where do you believe improvements are needed?",
                     subtitle: "( Summary of Candidate - areas where they need to work on )",
                     answer: report.improvement_areas,
              },
              {
                     question: "What are the top 2–3 roles the student is currently targeting?",
                     subtitle: "What reasons has the student shared for their role preferences?",
                     answer: report.targeted_roles,
              },
              {
                     question: "Has the candidate shown clarity about their past roles and learnings? Are they able to clearly state what they want to do next?",
                     answer: getVal(d, "Has the candidate shown clarity about their past roles and learnings?  Are they able to clearly state what they want to do next?"),
              },
              {
                     question: "What are the strongest aspects of the candidate?",
                     answer: report.strongest_aspects,
              },
              {
                     question: "Based on your assessment, which 2–3 job families would the student fit best in?",
                     answer: report.fit_job_families,
              },
              {
                     question: "What could be their Plan B and Plan C roles?",
                     answer: report.backup_roles,
              },
       ]

       // ─── Ratings ─────────────────────────────────────────────────
       const avgRating = report.average_rating || 0
       const realismRating = report.realism_rating || 0

       // ─── Checklist Sections ───────────────────────────────────────

       const communicationQuality = {
              title: "Communication Quality",
              rating: realismRating,
              items: [
                     { text: "Lack of linguistic clarity (e.g., grammar, sentence structure, word choice)", value: yn(getVal(d, "Lack of linguistic clarity (e.g., grammar, sentence structure, word choice)")) },
                     { text: "Lack of conceptual clarity (e.g., unclear thoughts, vague expressions)", value: yn(getVal(d, "Lack of conceptual clarity (e.g., unclear thoughts, vague expressions)")) },
                     { text: "Poor organization of ideas (e.g., information not logically structured)", value: yn(getVal(d, "Poor organization of ideas (e.g., information not logically structured)")) },
                     { text: "Provided generic details without specifying achievements or experiences", value: yn(getVal(d, "Provided generic details without specifying achievements or experiences")) },
                     { text: "Over-explained or added irrelevant information that diluted the message", value: yn(getVal(d, "Over-explained or added irrelevant information that diluted the message")) },
              ],
       }

       const relevanceRating = parseInt(getVal(d, "Relevance of Content: How well does their content align with the domain they wish to pursue?") || "0")
       const relevanceOfContent = {
              title: "Relevance of Content: How well does their content align with the domain they wish to pursue?",
              rating: relevanceRating,
              items: [
                     { text: "Content reflects strong understanding of the domain", value: yn(getVal(d, "Content reflects strong understanding of the domain")) },
                     { text: "Examples and experiences are relevant to the field they wish to pursue", value: yn(getVal(d, "Examples and experiences are relevant to the field they wish to pursue")) },
                     { text: "Shows clarity in career focus and goals", value: yn(getVal(d, "Shows clarity in career focus and goals")) },
                     { text: "Lacks connection between past experiences and future aspirations", value: yn(getVal(d, "Lacks connection between past experiences and future aspirations")) },
                     { text: "Content appears generic or misaligned with the chosen domain", value: yn(getVal(d, "Content appears generic or misaligned with the chosen domain")) },
                     { text: "Unclear or scattered focus across multiple, unrelated fields", value: yn(getVal(d, "Unclear or scattered focus across multiple, unrelated fields")) },
              ],
       }

       const clarityRating = parseInt(getVal(d, "Clarity of Thoughts : How clearly does the candidate express their thoughts during the interview?") || "0")
       const clarityOfThoughts = {
              title: "Clarity of Thoughts: How clearly does the candidate express their thoughts during the interview?",
              rating: clarityRating,
              items: [
                     { text: "Expressed ideas clearly and confidently", value: yn(getVal(d, "Expressed ideas clearly and confidently")) },
                     { text: "Maintained logical flow and structure while speaking", value: yn(getVal(d, "Maintained logical flow and structure while speaking")) },
                     { text: "Used simple and understandable language", value: yn(getVal(d, "Used simple and understandable language")) },
                     { text: "Avoided filler words and stayed focused on the point", value: yn(getVal(d, "Avoided filler words and stayed focused on the point")) },
                     { text: "Struggled to find the right words or frame responses", value: yn(getVal(d, "Struggled to find the right words or frame responses")) },
                     { text: "Ideas were scattered or lacked coherence", value: yn(getVal(d, "Ideas were scattered or lacked coherence")) },
                     { text: "Overused technical jargon or buzzwords unnecessarily", value: yn(getVal(d, "Overused technical jargon or buzzwords unnecessarily")) },
              ],
       }

       const domainRating = parseInt(getVal(d, "Domain Knowledge : How well does the candidate demonstrate knowledge in their domain or field of interest?") || "0")
       const domainKnowledge = {
              title: "Domain Knowledge: How well does the candidate demonstrate knowledge in their domain or field of interest?",
              rating: domainRating,
              items: [
                     { text: "Demonstrated strong understanding of key domain concepts", value: yn(getVal(d, "Demonstrated strong understanding of key domain concepts")) },
                     { text: "Was able to explain complex ideas clearly and accurately", value: yn(getVal(d, "Was able to explain complex ideas clearly and accurately")) },
                     { text: "Used relevant terminology appropriately and confidently", value: yn(getVal(d, "Used relevant terminology appropriately and confidently")) },
                     { text: "Provided examples or experiences that reflected applied knowledge", value: yn(getVal(d, "Provided examples or experiences that reflected applied knowledge")) },
                     { text: "Struggled to explain basic or advanced concepts in their field", value: yn(getVal(d, "Struggled to explain basic or advanced concepts in their field")) },
                     { text: "Failed to connect theoretical knowledge to practical applications", value: yn(getVal(d, "Failed to connect theoretical knowledge to practical applications")) },
              ],
       }

       const softSkillsRating = parseInt(getVal(d, "Soft Skills : Does the candidate display the required soft skills (communication, teamwork, problem-solving, etc.)?") || "0")
       const softSkills = {
              title: "Soft Skills: Does the candidate display the required soft skills (communication, teamwork, problem-solving, etc.)?",
              rating: softSkillsRating,
              items: [
                     { text: "Effective verbal communication (clear speech, appropriate tone and pace)", value: yn(getVal(d, "Effective verbal communication (clear speech, appropriate tone and pace)")) },
                     { text: "Confident body language and eye contact", value: yn(getVal(d, "Confident body language and eye contact")) },
                     { text: "Active listening and responsiveness to questions", value: yn(getVal(d, "Active listening and responsiveness to questions")) },
                     { text: "Demonstrated teamwork or collaboration mindset", value: yn(getVal(d, "Demonstrated teamwork or collaboration mindset")) },
                     { text: "Showed problem-solving ability through structured thinking", value: yn(getVal(d, "Showed problem-solving ability through structured thinking")) },
                     { text: "Displayed adaptability and openness to feedback", value: yn(getVal(d, "Displayed adaptability and openness to feedback")) },
                     { text: "Maintained a positive and respectful attitude", value: yn(getVal(d, "Maintained a positive and respectful attitude")) },
                     { text: "Struggled with verbal or non-verbal communication", value: yn(getVal(d, "Struggled with verbal or non-verbal communication")) },
                     { text: "Lacked interpersonal warmth or emotional intelligence", value: yn(getVal(d, "Lacked interpersonal warmth or emotional intelligence")) },
              ],
       }

       const feedbackRating = parseInt(getVal(d, "How open are they to feedback and guidance?") || "0")
       const opennessToFeedback = {
              title: "How open are they to feedback and guidance?",
              rating: feedbackRating,
              items: [
                     { text: "Actively listened and acknowledged feedback positively", value: yn(getVal(d, "Actively listened and acknowledged feedback positively")) },
                     { text: "Asked clarifying questions to understand feedback better", value: yn(getVal(d, "Asked clarifying questions to understand feedback better")) },
                     { text: "Demonstrated a growth mindset and willingness to improve", value: yn(getVal(d, "Demonstrated a growth mindset and willingness to improve")) },
                     { text: "Reflected on feedback shared during the conversation", value: yn(getVal(d, "Reflected on feedback shared during the conversation")) },
                     { text: "Seemed resistant or dismissive toward constructive criticism", value: yn(getVal(d, "Seemed resistant or dismissive toward constructive criticism")) },
                     { text: "Showed defensiveness or justification instead of openness", value: yn(getVal(d, "Showed defensiveness or justification instead of openness")) },
                     { text: "Gave examples of past learning from feedback or failures", value: yn(getVal(d, "Gave examples of past learning from feedback or failures")) },
              ],
       }

       const confidenceRating = parseInt(getVal(d, "Confidence & Emotional Readiness") || "0")
       const confidenceReadiness = {
              title: "Confidence & Emotional Readiness",
              rating: confidenceRating,
              items: [
                     { text: "Demonstrated a positive attitude and optimism throughout the conversation", value: yn(getVal(d, "Demonstrated a positive attitude and optimism throughout the conversation")) },
                     { text: "Exuded self-confidence without being overbearing", value: yn(getVal(d, "Exuded self-confidence without being overbearing")) },
                     { text: "Maintained a calm and composed demeanor, even when challenged", value: yn(getVal(d, "Maintained a calm and composed demeanor, even when challenged")) },
                     { text: "Displayed resilience and a solution-oriented mindset in discussions", value: yn(getVal(d, "Displayed resilience and a solution-oriented mindset in discussions")) },
                     { text: "Showed enthusiasm and motivation towards their career goals", value: yn(getVal(d, "Showed enthusiasm and motivation towards their career goals")) },
                     { text: "Had difficulty maintaining composure under pressure or stress", value: yn(getVal(d, "Had difficulty maintaining composure under pressure or stress")) },
                     { text: "Displayed uncertainty or lack of confidence in their responses", value: yn(getVal(d, "Displayed uncertainty or lack of confidence in their responses")) },
              ],
       }

       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader title="Diagnostic Interview Report" />

                     <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                            <BackToProfile />

                            <CandidateDetails
                                   name={profile?.full_name || d["Mentee Name"] || "Student"}
                                   id={user?.id?.substring(0, 10) || "—"}
                                   experience="—"
                                   role="Student"
                            />

                            <MentorDetailsSection
                                   mentorName={report.mentor_name || "—"}
                                   mentorRole="Diagnostic Interviewer"
                                   experience=""
                                   assessmentSummary={report.improvement_areas || "—"}
                                   progressNote={`Average Rating: ${avgRating.toFixed(1)} / 5  •  Score Range: ${report.score_range || "—"}`}
                            />

                            {/* ─── Rating Summary ───────────────────────────── */}
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                   <div className="bg-[#1e232c] px-5 py-4">
                                          <h4 className="text-white font-bold">Rating Summary</h4>
                                   </div>
                                   <div className="grid grid-cols-3 divide-x divide-gray-100">
                                          <div className="p-6 text-center">
                                                 <p className="text-xs text-gray-400 mb-1">Average Rating</p>
                                                 <p className="text-3xl font-bold text-[#FF9E44]">{avgRating.toFixed(1)}</p>
                                                 <p className="text-[10px] text-gray-400">out of 5.0</p>
                                          </div>
                                          <div className="p-6 text-center">
                                                 <p className="text-xs text-gray-400 mb-1">Realism & Alignment</p>
                                                 <p className="text-3xl font-bold text-[#1e232c]">{realismRating}</p>
                                                 <p className="text-[10px] text-gray-400">out of 5</p>
                                          </div>
                                          <div className="p-6 text-center">
                                                 <p className="text-xs text-gray-400 mb-1">Score Range</p>
                                                 <p className="text-lg font-bold text-[#1e232c]">{report.score_range || "—"}</p>
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
                                                               {q.answer && (
                                                                      <div className="border-l-4 border-orange-200 bg-orange-50/40 rounded-r-xl p-4">
                                                                             <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{q.answer}</p>
                                                                      </div>
                                                               )}
                                                               {!q.answer && (
                                                                      <p className="text-sm text-gray-400 italic">No response provided</p>
                                                               )}
                                                        </div>
                                                 ))}
                                          </div>
                                   </div>

                                   {/* Checklist Sections */}
                                   <ChecklistSection {...communicationQuality} />
                                   <ChecklistSection {...relevanceOfContent} />
                                   <ChecklistSection {...clarityOfThoughts} />
                                   <ChecklistSection {...domainKnowledge} />
                                   <ChecklistSection {...softSkills} />
                                   <ChecklistSection {...opennessToFeedback} />
                                   <ChecklistSection {...confidenceReadiness} />
                            </div>
                     </div>
              </div>
       )
}
