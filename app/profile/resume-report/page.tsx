"use client"

import { Card } from "@/components/ui/card"
import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       MentorDetailsSection,
       FeedbackItem,
       InterviewTranscript,
} from "../report-components"

// ─── Data ────────────────────────────────────────────────────────────

const sections = [
       {
              title: "Professional Summary",
              color: "bg-[#FF9E44]",
              groups: [
                     {
                            heading: "Professional Summary",
                            commentCount: "2 comments",
                            items: [
                                   {
                                          number: 1,
                                          text: "Great summary, but consider highlighting your expertise in performance optimization more prominently. Your work on reducing load times by 70% is impressive and should be featured early.",
                                          time: "10:15 AM",
                                   },
                                   {
                                          number: 2,
                                          text: "The summary could benefit from mentioning your experience with specific modern JavaScript frameworks beyond React, such as Next.js or Vue, if applicable.",
                                          time: "10:18 AM",
                                   },
                            ],
                     },
              ],
       },
       {
              title: "Professional Experience",
              color: "bg-[#FF9E44]",
              groups: [
                     {
                            heading: "Senior Frontend Developer at TechCorp Inc.",
                            commentCount: "3 comments",
                            items: [
                                   {
                                          number: 1,
                                          text: "The microservices implementation is impressive. Consider adding specific technologies used like Module Federation and how you designed the shell application that orchestrates different micro-frontends.",
                                          time: "10:25 AM",
                                   },
                                   {
                                          number: 2,
                                          text: "For the mentoring achievement, specify what technologies or skills you helped junior developers learn, and any structured programs you implemented.",
                                          time: "10:28 AM",
                                   },
                                   {
                                          number: 3,
                                          text: "For the CI/CD implementation, mention specific tools used (e.g., Jenkins, GitHub Actions) and how you integrated automated testing (unit, integration, E2E).",
                                          time: "10:32 AM",
                                   },
                            ],
                     },
                     {
                            heading: "Frontend Developer at StartupXYZ",
                            commentCount: "2 comments",
                            items: [
                                   {
                                          number: 1,
                                          text: "For your StartupXYZ role, highlight the specific challenges of working in a startup environment and how you adapted to rapid changes in requirements and priorities.",
                                          time: "10:40 AM",
                                   },
                                   {
                                          number: 2,
                                          text: "The cross-functional collaboration point is good, but consider mentioning specific departments you worked with (design, product, marketing) and the outcomes of these collaborations.",
                                          time: "10:45 AM",
                                   },
                            ],
                     },
              ],
       },
]

// ─── Page Component ──────────────────────────────────────────────────

export default function ResumeReportPage() {
       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader title="Resume Review Report" date="02/02/2025, 4:28 PM" />

                     <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                            <BackToProfile />
                            <CandidateDetails />
                            <MentorDetailsSection />

                            {/* Detailed Section Feedback */}
                            <div className="space-y-6">
                                   <h2 className="text-xl font-bold text-[#1e232c] flex items-center gap-2">
                                          📝 Detailed Section Feedback
                                   </h2>

                                   {sections.map((section, si) => (
                                          <div key={si} className="space-y-0">
                                                 {/* Section Banner */}
                                                 <div className={`${section.color} px-5 py-3.5 rounded-t-2xl flex items-center justify-between`}>
                                                        <h3 className="text-white font-bold">{section.title}</h3>
                                                        <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">
                                                               {section.groups.reduce((acc, g) => acc + g.items.length, 0)} comments
                                                        </span>
                                                 </div>

                                                 {/* Groups */}
                                                 <Card className="rounded-t-none rounded-b-2xl border-gray-100 shadow-sm p-6 space-y-8">
                                                        {section.groups.map((group, gi) => (
                                                               <div key={gi} className="space-y-4">
                                                                      <div className="flex items-center justify-between">
                                                                             <h4 className="font-bold text-[#1e232c]">{group.heading}</h4>
                                                                             {group.commentCount && (
                                                                                    <span className="text-xs text-gray-400">{group.commentCount}</span>
                                                                             )}
                                                                      </div>
                                                                      <div className="space-y-3">
                                                                             {group.items.map((item) => (
                                                                                    <FeedbackItem key={item.number} {...item} />
                                                                             ))}
                                                                      </div>
                                                               </div>
                                                        ))}
                                                 </Card>
                                          </div>
                                   ))}
                            </div>

                            {/* Interview Transcript */}
                            <InterviewTranscript />
                     </div>
              </div>
       )
}
