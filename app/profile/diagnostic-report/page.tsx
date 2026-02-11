"use client"

import {
       ReportHeader,
       BackToProfile,
       CandidateDetails,
       MentorDetailsSection,
       ChecklistSection,
       InterviewTranscript,
} from "../report-components"

// ─── Data ────────────────────────────────────────────────────────────

const descriptiveQuestions = [
       {
              question: "Where do you believe improvements are needed?",
              subtitle: "( Summary of Candidate - areas where they need to work on )",
              answers: [
                     "Not very convincing answer on why candidate wants to do product management when he has good experience in Product Marketing role in past and for some good companies like Zoho.",
                     "Need to bridge the gap of PM role understanding. Have to be clear on what PM role entails and all his inclination is coming from talking to some knows.",
                     "Takes longer to set the context, need to be concise and to the point which is also important skillset for Product manager to continue to keep stakeholder interested in listening the story.",
                     "Sometime it feels that candidate is not open to feedback and thinks what he thinks is right. Need to take the feedback and do course correct.",
              ],
       },
       {
              question: "What are the top 2–3 roles the student is currently targeting?",
              options: [
                     { label: "Option 1", value: "Product management" },
                     { label: "Option 2", value: "Senior marketing role" },
              ],
       },
       {
              question: "Has the candidate shown clarity about their past roles and learnings?",
              sub: "Are they able to clearly state what they want to do next?",
              shortAnswer: "Yes",
       },
       {
              question: "What are the strongest aspects of the candidate?",
              answers: [
                     "Good pedigree of companies worked with Zoho, & Zomato.",
                     "Has a family business of cloud kitchen and has good exposure to do business.",
                     "In his startup did check Order patterns to decide on which items can be removed from the menu.",
                     "Candidate has very good understanding to evaluate the data and made meaning outcome from the data. Looked at trend charts as well as seasonality.",
                     "Anchor on looking for product metrics before improving any product feature.",
              ],
       },
       {
              question: "Based on your assessment, which 2–3 job families would the student fit best in?",
              answers: [
                     "Product Management",
                     "Marketing management.",
                     "Candidate need to enroll for Product school and be part of focussed groups to discuss PM skills, journey's and best practices. Candidate can also look for opportunities to pick a product manager role while he is in college.",
              ],
       },
]

const communicationQuality = {
       title: "Communication Quality",
       rating: 4,
       items: [
              { text: "Lack of linguistic clarity (e.g., grammar, sentence structure, word choice)", value: false },
              { text: "Lack of conceptual clarity (e.g., unclear thoughts, vague expressions)", value: false },
              { text: "Poor organisation of ideas (e.g., information not logically structured)", value: false },
              { text: "Provided generic details without specifying achievements or experiences", value: false },
              { text: "Over-explained or added irrelevant information that diluted the message", value: true },
       ],
}

const relevanceOfContent = {
       title: "Relevance of Content: How well does their content align with the domain they wish to pursue?",
       rating: 4,
       items: [
              { text: "Content reflects strong understanding of the domain", value: true },
              { text: "Examples and experiences are relevant to the field they wish to pursue", value: true },
              { text: "Shows clarity in career focus and goals", value: true },
              { text: "Lacks connection between past experiences and future aspirations", value: false },
              { text: "Content appears generic or misaligned with the chosen domain", value: false },
              { text: "Unclear or scattered focus across multiple, unrelated fields", value: false },
       ],
}

const clarityOfThoughts = {
       title: "Clarity of Thoughts: How clearly does the candidate express their thoughts during the interview?",
       rating: 4,
       items: [
              { text: "Expressed ideas clearly and confidently", value: true },
              { text: "Maintained logical flow and structure while speaking", value: true },
              { text: "Used simple and understandable language", value: true },
              { text: "Avoided filler words and stayed focused on the point", value: true },
              { text: "Struggled to find the right words or frame responses", value: false },
              { text: "Ideas were scattered or lacked coherence", value: false },
              { text: "Overused technical jargon or buzzwords unnecessarily", value: false },
       ],
}

const domainKnowledge = {
       title: "Domain Knowledge: How well does the candidate demonstrate knowledge in their domain or field of interest?",
       rating: 4,
       items: [
              { text: "Demonstrated strong understanding of key domain concepts", value: true },
              { text: "Was able to explain complex ideas clearly and accurately", value: true },
              { text: "Used relevant terminology appropriately and confidently", value: true },
              { text: "Provided examples or experiences that reflected applied knowledge", value: true },
              { text: "Struggled to explain basic or advanced concepts in their field", value: true },
              { text: "Failed to connect theoretical knowledge to practical applications", value: true },
       ],
}

const softSkills = {
       title: "Soft Skills: Does the candidate display required soft skills (communication, teamwork, problem-solving, etc.)?",
       rating: 4,
       items: [
              { text: "Effective verbal communication (clear speech, appropriate tone and pace)", value: true },
              { text: "Confident body language and eye contact", value: true },
              { text: "Active listening and responsiveness to questions", value: true },
              { text: "Demonstrated teamwork or collaboration mindset", value: false },
              { text: "Showed problem-solving ability through structured thinking", value: true },
              { text: "Displayed adaptability and openness to feedback", value: true },
              { text: "Maintained a positive and respectful attitude", value: true },
              { text: "Handled pressure or challenging questions gracefully", value: true },
       ],
}

const confidenceReadiness = {
       title: "Confidence & Emotional Readiness",
       rating: 4,
       items: [
              { text: "Demonstrated a calm and composed demeanor throughout", value: true },
              { text: "Spoke confidently without being overly aggressive or assertive", value: true },
              { text: "Handled challenging or unexpected questions with composure", value: true },
              { text: "Showed enthusiasm and passion towards the role or domain", value: true },
              { text: "Was able to articulate personal motivations clearly", value: true },
              { text: "Maintained a positive and respectful attitude", value: true },
              { text: "Recovered well from mistakes or moments of hesitation", value: true },
       ],
}

// ─── Page Component ──────────────────────────────────────────────────

export default function DiagnosticReportPage() {
       return (
              <div className="min-h-screen bg-[#F8F9FB]">
                     <ReportHeader title="Diagnostic Interview Report" />

                     <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                            <BackToProfile />
                            <CandidateDetails />
                            <MentorDetailsSection progressNote="Progress: 59/59 questions completed" />

                            {/* Detailed Mentor Feedback */}
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

                                                               {/* bullet answers */}
                                                               {q.answers && (
                                                                      <div className="border-l-4 border-orange-200 bg-orange-50/40 rounded-r-xl p-4 space-y-2">
                                                                             {q.answers.map((a, ai) => (
                                                                                    <p key={ai} className="text-sm text-gray-700 leading-relaxed">• {a}</p>
                                                                             ))}
                                                                      </div>
                                                               )}

                                                               {/* option choices */}
                                                               {q.options && (
                                                                      <div className="space-y-2">
                                                                             {q.options.map((o, oi) => (
                                                                                    <div key={oi} className="flex items-center gap-3">
                                                                                           <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium">{o.label}</span>
                                                                                           <span className="text-sm text-[#1e232c]">{o.value}</span>
                                                                                    </div>
                                                                             ))}
                                                                      </div>
                                                               )}

                                                               {/* short answer */}
                                                               {q.shortAnswer && q.sub && (
                                                                      <>
                                                                             <h5 className="font-bold text-[#1e232c]">{q.sub}</h5>
                                                                             <div className="border-l-4 border-orange-200 bg-orange-50/40 rounded-r-xl px-4 py-3">
                                                                                    <p className="text-sm text-gray-700">{q.shortAnswer}</p>
                                                                             </div>
                                                                      </>
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
                                   <ChecklistSection {...confidenceReadiness} />
                            </div>

                            {/* Interview Transcript */}
                            <InterviewTranscript />
                     </div>
              </div>
       )
}
