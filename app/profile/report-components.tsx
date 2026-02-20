"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Star, CheckCircle2, XCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"

export function ReportHeader({
       title,
       subtitle = "Comprehensive evaluation to identify strengths and growth areas",
       date,
}: {
       title: string
       subtitle?: string
       date?: string
}) {
       const handleDownload = () => {
              window.print()
       }

       return (
              <div className="bg-[#1e232c] text-white">
                     <div className="max-w-[1400px] mx-auto px-8">
                            <div className="flex items-center justify-between py-4">
                                   <div>
                                          <h1 className="text-xl font-bold">{title}</h1>
                                          <p className="text-sm text-gray-400">{subtitle}</p>
                                   </div>
                                   <div id="report-actions" className="flex items-center gap-3 print:hidden">
                                          <Button
                                                 onClick={handleDownload}
                                                 className="rounded-lg gap-2 text-sm font-medium bg-[#FF9E44] hover:bg-[#e88d3a] text-white"
                                          >
                                                 <Download className="size-4" /> Download Report
                                          </Button>
                                   </div>
                            </div>
                            <p className="text-xs text-gray-500 pb-3">Generated on {date || "N/A"}</p>
                     </div>
              </div>
       )
}

// ─── Back Link ────────────────────────────────────────────────────────

export function BackToProfile() {
       return (
              <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF9E44] transition-colors mb-4">
                     <ChevronLeft className="size-4" /> Back to Student File
              </Link>
       )
}

// ─── Candidate Details ───────────────────────────────────────────────

export function CandidateDetails({
       name,
       id,
       experience,
       role,
       skills,
}: {
       name?: string
       id?: string
       experience?: string
       role?: string
       skills?: string[]
}) {
       const displayName = name || "N/A"
       const displayId = id || "N/A"
       const displayExp = experience || "N/A"
       const displayRole = role || "N/A"

       return (
              <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                     <h3 className="text-lg font-bold text-[#1e232c] mb-4">Candidate Details</h3>
                     <div className="flex items-start gap-6">
                            <div className="flex items-center gap-4">
                                   <div className="size-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold shrink-0">
                                          {displayName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                   </div>
                                   <div>
                                          <p className="text-lg font-bold text-[#1e232c]">{displayName}</p>
                                          <p className="text-sm text-gray-500">ID: {displayId}</p>
                                   </div>
                            </div>
                            <div className="ml-8 space-y-2">
                                   <div className="flex items-center gap-2 text-sm">
                                          <span className="text-gray-500">📋 Experience:</span>
                                          <span className="font-medium text-[#1e232c]">{displayExp}</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-sm">
                                          <span className="text-gray-500">👤 Role:</span>
                                          <span className="font-medium text-[#1e232c]">{displayRole}</span>
                                   </div>
                                   <div className="flex items-start gap-2 text-sm">
                                          <span className="text-gray-500 shrink-0">⚙️ Skills Assessed:</span>
                                          <div className="flex flex-wrap gap-1.5">
                                                 {skills && skills.length > 0 ? (
                                                        skills.map((s) => (
                                                               <span key={s} className="px-2.5 py-0.5 rounded-full border border-[#FF9E44] text-xs text-[#FF9E44]">
                                                                      {s}
                                                               </span>
                                                        ))
                                                 ) : (
                                                        <span className="text-gray-400 italic">N/A</span>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </div>
              </Card>
       )
}

// ─── Mentor Details ──────────────────────────────────────────────────

export function MentorDetailsSection({
       mentorName,
       mentorRole,
       experience,
       assessmentDate,
       assessmentSummary,
       progressNote,
}: {
       mentorName?: string
       mentorRole?: string
       experience?: string
       assessmentDate?: string
       assessmentSummary?: string
       progressNote?: string
}) {
       return (
              <Card className="p-6 rounded-2xl border-gray-100 shadow-sm">
                     <h3 className="text-lg font-bold text-[#1e232c] mb-4 flex items-center gap-2">
                            👨‍🏫 Mentor Details
                     </h3>
                     <div className="grid grid-cols-2 gap-6">
                            <div>
                                   <p className="text-lg font-bold text-[#1e232c]">{mentorName || "N/A"}</p>
                                   <p className="text-sm text-[#FF9E44] font-medium">{mentorRole || "N/A"}</p>
                                   <p className="text-sm text-gray-500 mt-1">{experience || "N/A"}</p>
                                   <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                                          📅 Assessment Date: <span className="font-medium text-[#1e232c]">{assessmentDate || "N/A"}</span>
                                   </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                   <h4 className="text-sm font-bold text-[#1e232c] mb-2">Assessment Summary</h4>
                                   <p className="text-sm text-gray-600 leading-relaxed">{assessmentSummary || "N/A"}</p>
                                   {progressNote && (
                                          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                                 <p className="text-xs text-green-700">{progressNote}</p>
                                          </div>
                                   )}
                            </div>
                     </div>
              </Card>
       )
}

// ─── Star Rating ─────────────────────────────────────────────────────

export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
       return (
              <div className="flex items-center gap-1">
                     {Array.from({ length: max }, (_, i) => (
                            <Star
                                   key={i}
                                   className={`size-5 ${i < rating ? "text-[#FF9E44] fill-[#FF9E44]" : "text-gray-200 fill-gray-200"}`}
                            />
                     ))}
                     <span className="text-sm font-bold text-[#1e232c] ml-2">{rating}/{max}</span>
              </div>
       )
}

// ─── Checklist Section ───────────────────────────────────────────────

export function ChecklistSection({
       title,
       rating,
       items,
}: {
       title: string
       rating?: number
       items: { text: string; value: boolean; is_positive?: boolean }[]
}) {
       return (
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                     <div className="bg-[#1e232c] px-5 py-4 flex items-center justify-between">
                            <h4 className="text-white font-bold text-sm leading-snug max-w-[75%]">{title}</h4>
                            {rating !== undefined && <StarRating rating={rating} />}
                     </div>
                     <div className="divide-y divide-gray-100">
                            {items && items.length > 0 ? (
                                   items.map((item, i) => {
                                          // Determine if this result is "good" or "bad":
                                          // Positive trait + Yes = good | Positive trait + No = bad
                                          // Negative trait + Yes = bad  | Negative trait + No = good
                                          const isPositive = item.is_positive ?? true
                                          const isGood = isPositive ? item.value : !item.value

                                          return (
                                                 <div key={i} className="flex items-center justify-between px-6 py-3.5">
                                                        <p className="text-sm text-gray-700 flex-1">{item.text}</p>
                                                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${isGood
                                                               ? "bg-green-50 text-green-600"
                                                               : "bg-red-50 text-red-500"
                                                               }`}>
                                                               {item.value ? (
                                                                      <><CheckCircle2 className="size-3.5" /> Yes</>
                                                               ) : (
                                                                      <><XCircle className="size-3.5" /> No</>
                                                               )}
                                                        </span>
                                                 </div>
                                          )
                                   })
                            ) : (
                                   <div className="px-6 py-3.5 text-sm text-gray-500 italic">No checklist items available</div>
                            )}
                     </div>
              </div>
       )
}

// ─── Feedback Item (numbered, for Resume Review) ─────────────────────

export function FeedbackItem({
       number,
       text,
       time,
       label = "Mentor Feedback",
}: {
       number: number
       text: string
       time?: string
       label?: string
}) {
       return (
              <div className="border-l-4 border-[#FF9E44] bg-orange-50/50 rounded-r-xl px-5 py-4 space-y-2">
                     <div className="flex items-start gap-3">
                            <span className="size-7 rounded-full bg-[#FF9E44] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                   {number}
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed">{text || "N/A"}</p>
                     </div>
                     <div className="flex items-center justify-between pl-10">
                            {time && <p className="text-[11px] text-gray-400">Added at {time}</p>}
                            <span className="text-[11px] text-[#FF9E44] font-medium">{label}</span>
                     </div>
              </div>
       )
}

// ─── Interview Transcript ────────────────────────────────────────────

export function InterviewTranscript({
       messages,
       duration,
       length,
}: {
       messages?: { speaker: string; color: "red" | "orange"; text: string }[]
       duration?: string
       length?: string | number
}) {
       const displayDuration = duration || "N/A"
       const displayLength = length || "N/A"
       const displayMessages = messages || []

       return (
              <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
                     <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-[#1e232c] flex items-center gap-2">
                                   🎙️ Interview Transcript
                            </h3>
                            <Button className="rounded-lg gap-2 text-sm bg-[#FF9E44] hover:bg-[#e88d3a] text-white">
                                   <Download className="size-4" /> Download PDF
                            </Button>
                     </div>
                     <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                            {displayMessages.length > 0 ? (
                                   displayMessages.map((msg, i) => (
                                          <div key={i}>
                                                 <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md mb-1.5 ${msg.color === "red"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-orange-100 text-orange-600"
                                                        }`}>
                                                        {msg.speaker}
                                                 </span>
                                                 <p className="text-sm text-gray-700 leading-relaxed pl-1">{msg.text}</p>
                                          </div>
                                   ))
                            ) : (
                                   <p className="text-sm text-gray-500 italic">No transcript available.</p>
                            )}
                     </div>
                     <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-4">
                            <span>⏱ Interview Duration: {displayDuration}</span>
                            <span>📝 Transcript Length: {displayLength}</span>
                     </div>
              </Card>
       )
}
