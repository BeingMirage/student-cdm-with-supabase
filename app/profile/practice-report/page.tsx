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

// ─── Data ────────────────────────────────────────────────────────────

const overallScore = "3.7/5.0"

const skillBreakdown = [
       { name: "Structural Thinking", rating: 4 },
       { name: "Requirement Traceability", rating: 3 },
       { name: "Presentation", rating: 2 },
       { name: "Digital Transformation", rating: 3 },
       { name: "Strategy", rating: 4 },
       { name: "Messaging Team", rating: 3 },
       { name: "Consulting", rating: 4 },
       { name: "Problem Solving", rating: 3 },
]

const detailedAssessments = [
       {
              name: "Structural Thinking",
              rating: 4,
              knowledge: 75,
              clarity: 65,
              feedback: [
                     "Excellent framework application and logical flow",
                     "Consider using more visual aids to support complex structures",
                     "Practice breaking down problems into smaller components",
              ],
       },
       {
              name: "Requirement Traceability",
              rating: 4,
              knowledge: 60,
              clarity: 60,
              feedback: [
                     "Good understanding of requirement mapping",
                     "Need to improve documentation standards",
                     "Focus on stakeholder communication during requirement gathering",
              ],
       },
       {
              name: "Presentation",
              rating: 2,
              knowledge: 50,
              clarity: 45,
              feedback: [
                     "Work on voice modulation and pace",
                     "Improve slide design and visual hierarchy",
                     "Practice storytelling techniques for better engagement",
              ],
       },
]

const softSkillsAssessment = [
       { name: "Relevant Experience", score: "4.5/5" },
       { name: "Team Player", score: "4.0/5" },
       { name: "Confidence Level", score: "3.6/5" },
       { name: "Communication", score: "3.9/5" },
       { name: "Leadership", score: "3.8/5" },
]

// ─── Page Component ──────────────────────────────────────────────────

export default function PracticeReportPage() {
       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader title="Practice Interview Report" />

                     <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                            <BackToProfile />
                            <CandidateDetails />
                            <MentorDetailsSection />

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
                                                                      strokeDasharray={`${(3.7 / 5) * 314} 314`} strokeLinecap="round" />
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
                                                        {skillBreakdown.map((skill, i) => (
                                                               <div key={i} className="flex items-center justify-between">
                                                                      <span className="text-sm text-gray-700">{skill.name}</span>
                                                                      <div className="flex items-center gap-0.5">
                                                                             {Array.from({ length: 5 }, (_, si) => (
                                                                                    <Star key={si} className={`size-3.5 ${si < skill.rating ? "text-[#FF9E44] fill-[#FF9E44]" : "text-gray-200 fill-gray-200"}`} />
                                                                             ))}
                                                                      </div>
                                                               </div>
                                                        ))}
                                                 </div>
                                          </div>
                                   </div>
                            </Card>

                            {/* Key Remarks */}
                            <Card className="p-5 rounded-2xl border-orange-200 bg-orange-50 shadow-sm">
                                   <div className="flex items-start gap-3">
                                          <span className="text-lg">⭐</span>
                                          <div>
                                                 <p className="font-semibold text-[#1e232c] mb-1">Key Remarks</p>
                                                 <p className="text-sm text-gray-700 leading-relaxed">
                                                        Neha demonstrates strong analytical capabilities and shows promise in strategic thinking.{" "}
                                                        <span className="underline font-medium">Focus areas for development include presentation skills and client-facing communication.</span>{" "}
                                                        With targeted coaching in these areas, she has the potential to excel in senior consulting roles.
                                                 </p>
                                          </div>
                                   </div>
                            </Card>

                            {/* Detailed Skill Assessment */}
                            <div className="space-y-6">
                                   <h2 className="text-xl font-bold text-[#1e232c]">Detailed Skill Assessment</h2>

                                   {detailedAssessments.map((skill, i) => (
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
                                                                             {skill.feedback.map((f, fi) => (
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

                            {/* Soft Skills Assessment */}
                            <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                                   <h3 className="text-lg font-bold text-[#1e232c] mb-4">Soft Skills Assessment</h3>
                                   <div className="space-y-3">
                                          {softSkillsAssessment.map((skill, i) => (
                                                 <div key={i} className="flex items-center gap-4">
                                                        <span className="text-sm text-gray-700 w-44 shrink-0">{skill.name}</span>
                                                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                               <div
                                                                      className="h-full bg-[#FF9E44] rounded-full transition-all"
                                                                      style={{ width: `${(parseFloat(skill.score) / 5) * 100}%` }}
                                                               />
                                                        </div>
                                                        <span className="text-sm font-bold text-[#1e232c] w-12 text-right">{skill.score}</span>
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
