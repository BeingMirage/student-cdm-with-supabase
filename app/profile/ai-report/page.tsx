"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle } from "lucide-react"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       InterviewTranscript,
} from "../report-components"

// ─── Data ────────────────────────────────────────────────────────────

const overallScores = [
       { label: "Overall Score", value: 87, color: "bg-[#FF9E44]", bgLight: "bg-orange-50", status: "Great", statusColor: "text-green-600" },
       { label: "Speech Score", value: 90, color: "bg-green-500", bgLight: "bg-green-50", status: "Great", statusColor: "text-green-600" },
       { label: "Content Score", value: 70, color: "bg-blue-500", bgLight: "bg-blue-50", status: "Good", statusColor: "text-blue-600" },
       { label: "Presentation", value: 65, color: "bg-red-400", bgLight: "bg-red-50", status: "Needs Work", statusColor: "text-red-500" },
]

const skillBreakdown = [
       { name: "Communication", score: "85/100", tag: "Excellent", tagColor: "bg-green-100 text-green-700" },
       { name: "Technical Depth", score: "78/100", tag: "Very Good", tagColor: "bg-blue-100 text-blue-700" },
       { name: "Problem Solving", score: "82/100", tag: "Excellent", tagColor: "bg-green-100 text-green-700" },
       { name: "Confidence", score: "48/100", tag: "Average", tagColor: "bg-orange-100 text-orange-700" },
       { name: "Clarity", score: "91/100", tag: "Very Good", tagColor: "bg-blue-100 text-blue-700" },
]

const questions = [
       {
              number: 1,
              category: "Interview Question",
              score: "8/10",
              question: "Can you tell me a little about yourself and what motivated you to apply for this position?",
              feedback: "Your response demonstrated a solid good understanding of your background and motivation. You effectively communicated your passion for technology and software development. However, consider adding more specific examples of projects or achievements that showcase your skills. Structure your response using a clear framework/background/skills and fit into requirements.",
              strengths: [
                     "Clear articulation of career narrative",
                     "Self-motivated fit for the role",
                     "Good vocal delivery and pace",
              ],
              improvements: [
                     "Add specific project examples",
                     "Connect your experience more directly to role requirements",
                     "Include measurable achievements",
              ],
              suggestedResponse: "\"I'm a final year Computer Science student at IIT Delhi with a strong passion for building scalable software solutions. During my internship at TechCorp, I developed a feature that improved application performance by 35%, which reinforced my interest in backend engineering. I'm particularly drawn to this role because it aligns with my technical strengths and aspirations to contribute to large-scale systems.\"",
       },
       {
              number: 2,
              category: "Technical Question",
              score: "7/10",
              question: "Explain how you would design a URL shortening service like bitly.",
              feedback: "You demonstrated a solid understanding of system design fundamentals. You mentioned key concepts like load balancing, database design, and scalability. To improve, dive more into specific trade-offs and design decisions you would make. Also structure your answer with clear sections:  requirements, high-level design, detailed components, and considerations for maintainability.",
              strengths: [
                     "Solid grasp of basic system design concepts",
                     "Mentioned important components like database and API",
                     "Considered scalability aspects",
              ],
              improvements: [
                     "Discuss trade-offs between different approaches",
                     "Address edge cases and failure scenarios",
                     "Provide more specifics on technology choices with justification",
              ],
              suggestedResponse: "\"For a URL shortening service, first, for requirements: we need to generate short, unique URLs, redirect users quickly, and handle high read traffic. For the architecture, I'd design a REST API for creating and accessing URLs, a key generation service for unique short codes, and a NoSQL Database like Cassandra for fast reads. For the algorithm, I'd use base62 encoding on a unique ID. For scalability, I'd implement caching with Redis for frequently accessed URLs, use a CDN for global distribution, and partition the database by hash ranges. We'd also need rate limiting to prevent abuse and an analytics tracking for URL statistics.\"",
       },
]

const recommendations = [
       {
              icon: "📚",
              title: "Continue Practicing",
              text: "Take more mock interviews to improve your content scores. Focus on structuring your answers using frameworks like STAR method.",
       },
       {
              icon: "🗣️",
              title: "Leverage Your Strengths",
              text: "Your speech and communication skills are excellent. Use this confidence to deliver more impactful content in your responses.",
       },
       {
              icon: "🔄",
              title: "Find More",
              text: "Review matched responses provided, practice answering similar questions, and attempt the AI interview again to track your progress.",
       },
]

// ─── Page Component ──────────────────────────────────────────────────

export default function AIReportPage() {
       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader title="AI Interview Assessment Report" subtitle="Comprehensive AI-powered evaluation of interview performance and skills readiness" />

                     <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                            <BackToProfile />
                            <CandidateDetails />

                            {/* Overall Assessment */}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-6">Overall Assessment</h3>
                                   <div className="grid grid-cols-4 gap-4">
                                          {overallScores.map((s, i) => (
                                                 <div key={i} className="flex flex-col items-center">
                                                        <div className={`w-full h-36 ${s.bgLight} rounded-xl relative overflow-hidden flex items-end`}>
                                                               <div
                                                                      className={`w-full ${s.color} rounded-xl flex items-end justify-center pb-3 text-white font-bold text-2xl`}
                                                                      style={{ height: `${s.value}%` }}
                                                               >
                                                                      {s.value}
                                                               </div>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-2">{s.label}</p>
                                                        <span className={`text-xs font-medium mt-0.5 ${s.statusColor}`}>{s.status}</span>
                                                 </div>
                                          ))}
                                   </div>

                                   {/* Alert */}
                                   <div className="mt-5 bg-orange-50 border border-orange-200 rounded-xl p-4">
                                          <p className="text-sm text-orange-700">
                                                 ⚠️ You need to practice quite hard to crack this job profile. You should take multiple attempts to get better & improve yourself. Check our detailed feedback for each question, discover areas to improve, and find resources to help you grow!
                                          </p>
                                   </div>
                            </Card>

                            {/* Skill Breakdown */}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-4">Skill Breakdown</h3>
                                   <div className="space-y-3">
                                          {skillBreakdown.map((skill, i) => (
                                                 <div key={i} className="flex items-center gap-4">
                                                        <span className="text-sm text-gray-700 w-40 shrink-0">{skill.name}</span>
                                                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                               <div className="h-full bg-[#FF9E44] rounded-full" style={{ width: `${parseInt(skill.score)}%` }} />
                                                        </div>
                                                        <span className="text-sm font-bold text-[#1e232c] w-16 text-right">{skill.score}</span>
                                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${skill.tagColor}`}>{skill.tag}</span>
                                                 </div>
                                          ))}
                                   </div>
                            </Card>

                            {/* Question by Question Analysis */}
                            <div className="space-y-6">
                                   <h2 className="text-xl font-bold text-[#1e232c]">Question by Question Analysis</h2>

                                   {questions.map((q) => (
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
                                                                             {q.strengths.map((s, si) => (
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
                                                                             {q.improvements.map((im, ii) => (
                                                                                    <li key={ii} className="text-sm text-red-600 flex items-start gap-1.5">
                                                                                           <span className="mt-1.5 size-1.5 rounded-full bg-red-400 shrink-0" />
                                                                                           {im}
                                                                                    </li>
                                                                             ))}
                                                                      </ul>
                                                               </div>
                                                        </div>

                                                        {/* Suggested Response */}
                                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                                               <h5 className="text-sm font-bold text-blue-700 mb-2">💡 Suggested Improved Response</h5>
                                                               <p className="text-sm text-blue-800 leading-relaxed italic">{q.suggestedResponse}</p>
                                                        </div>
                                                 </div>
                                          </Card>
                                   ))}
                            </div>

                            {/* Final Recommendations */}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-4">Final Recommendations</h3>
                                   <div className="space-y-4">
                                          {recommendations.map((rec, i) => (
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

                            {/* Interview Transcript */}
                            <InterviewTranscript />
                     </div>
              </div>
       )
}
