"use client"

import { ArrowRight, Calendar, Check, CheckCircle2, Circle, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function MyJourneyPage() {
       return (
              <div className="max-w-[1440px] mx-auto p-8 space-y-8 pb-24">

                     {/* Program Summary Card */}
                     <Card className="bg-[#FFF5ED] border-[#FF9E44]/20 p-8 rounded-[24px]">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[#FF9E44]/20">
                                   <div>
                                          <p className="text-[#FF9E44] text-xs font-bold uppercase tracking-wider mb-2">Total Modules</p>
                                          <p className="text-3xl font-bold text-[#1e232c]">10</p>
                                   </div>
                                   <div>
                                          <p className="text-[#FF9E44] text-xs font-bold uppercase tracking-wider mb-2">Program Duration</p>
                                          <p className="text-3xl font-bold text-[#1e232c]">12 weeks</p>
                                   </div>
                                   <div>
                                          <p className="text-[#FF9E44] text-xs font-bold uppercase tracking-wider mb-2">Start Date</p>
                                          <p className="text-xl font-bold text-[#1e232c]">Nov 1, 2025</p>
                                   </div>
                                   <div>
                                          <p className="text-[#FF9E44] text-xs font-bold uppercase tracking-wider mb-2">End Date</p>
                                          <p className="text-xl font-bold text-[#1e232c]">Jan 20, 2026</p>
                                   </div>
                            </div>
                     </Card>

                     {/* Title */}
                     <div className="text-center space-y-2">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">PGP • 1st Year</p>
                            <h1 className="text-4xl font-bold text-[#1e232c]">Career Development Module</h1>
                     </div>

                     {/* Progress Section */}
                     <Card className="p-8 rounded-[24px] border-gray-100 shadow-sm space-y-8">
                            <div className="space-y-4">
                                   <div className="flex items-center justify-between">
                                          <div>
                                                 <h3 className="text-lg font-bold text-[#1e232c]">Your Progress</h3>
                                                 <p className="text-gray-400 text-sm">3 of 18 sessions completed</p>
                                          </div>
                                          <span className="text-2xl font-bold text-[#1e232c]">16%</span>
                                   </div>
                                   <Progress value={16} className="h-2 bg-gray-100 [&>div]:bg-[#1e232c]" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <StatusCard count={3} label="Completed" />
                                   <StatusCard count={1} label="In Progress" />
                                   <StatusCard count={3} label="Upcoming" />
                            </div>
                     </Card>

                     {/* Up Next Card */}
                     <div className="bg-black text-white p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            <div className="space-y-4 z-10">
                                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Up Next</span>
                                   <div>
                                          <h3 className="text-2xl font-bold mb-2">Diagnostic Interview with Industry Mentor</h3>
                                          <p className="text-[#FF9E44] font-bold text-sm">19h 56m until session starts</p>
                                   </div>
                                   <div className="flex items-center gap-6 text-sm text-gray-400">
                                          <span className="flex items-center gap-2"><Calendar className="size-4" /> Feb 10</span>
                                          <span className="flex items-center gap-2"><Clock className="size-4" /> 10:00 AM</span>
                                          <span className="flex items-center gap-2"><Clock className="size-4" /> 1h duration</span>
                                   </div>
                            </div>
                            <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 font-bold z-10">
                                   View Details <ArrowRight className="size-4 ml-2" />
                            </Button>
                     </div>

                     {/* Filters */}
                     <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Filter:</span>
                            <div className="flex gap-2">
                                   <Button variant="default" className="bg-black text-white rounded-full h-8 text-xs font-medium">All</Button>
                                   <Button variant="outline" className="rounded-full h-8 text-xs font-medium border-gray-200 text-gray-600">Completed</Button>
                                   <Button variant="outline" className="rounded-full h-8 text-xs font-medium border-gray-200 text-gray-600">In Progress</Button>
                                   <Button variant="outline" className="rounded-full h-8 text-xs font-medium border-gray-200 text-gray-600">Upcoming</Button>
                            </div>
                     </div>

                     {/* Module Accordions */}
                     <div className="space-y-4">
                            <ModuleAccordion
                                   title="Clarity"
                                   completed={3}
                                   total={7}
                                   percentage={42}
                                   color="bg-[#FF9E44]"
                                   isOpen={true}
                            >
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                                          <SessionCard
                                                 status="completed"
                                                 type="session"
                                                 title="Orientation"
                                                 date="Nov 1"
                                                 duration="2h"
                                          />
                                          <SessionCard
                                                 status="completed"
                                                 type="session"
                                                 title="Know Yourself Test"
                                                 date="Nov 5"
                                                 duration="1h"
                                          />
                                          <SessionCard
                                                 status="completed"
                                                 type="session"
                                                 title="Domain Skill Assessment by AI"
                                                 date="Nov 8"
                                                 duration="1.5h"
                                          />
                                          <SessionCard
                                                 status="in-progress"
                                                 type="session"
                                                 title="Diagnostic Interview with Industry Mentor"
                                                 date="Feb 10"
                                                 duration="2h"
                                                 isHighlight
                                          />
                                          <SessionCard
                                                 status="upcoming"
                                                 type="session"
                                                 title="Career Roadmap with Industry Mentor"
                                                 date="Nov 29"
                                                 duration="2h"
                                          />
                                          <SessionCard
                                                 status="upcoming"
                                                 type="session"
                                                 title="Role Workshops"
                                                 date="Dec 3"
                                                 duration="3h"
                                          />
                                          <SessionCard
                                                 status="upcoming"
                                                 type="session"
                                                 title="Sectoral Workshops"
                                                 date="Dec 6"
                                                 duration="2h"
                                          />
                                   </div>
                            </ModuleAccordion>

                            <ModuleAccordion
                                   title="Prep"
                                   completed={0}
                                   total={4}
                                   percentage={0}
                                   color="bg-[#FF9E44]"
                                   isOpen={false}
                            />

                            <ModuleAccordion
                                   title="Last-Mile Help"
                                   completed={0}
                                   total={8}
                                   percentage={0}
                                   color="bg-[#FF9E44]"
                                   isOpen={false}
                            />
                     </div>

              </div>
       )
}

function StatusCard({ count, label }: { count: number, label: string }) {
       return (
              <div className="text-center p-6 border border-gray-100 rounded-2xl">
                     <p className="text-3xl font-bold text-[#1e232c] mb-1">{count}</p>
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
              </div>
       )
}

function ModuleAccordion({ title, completed, total, percentage, color, children, isOpen: defaultOpen = false }: any) {
       const [isOpen, setIsOpen] = useState(defaultOpen)

       return (
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-gray-100 rounded-[24px] bg-white overflow-hidden shadow-sm">
                     <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                   <div className="relative size-12 flex items-center justify-center">
                                          <div className={`size-10 rounded-full ${percentage > 0 ? color : 'bg-gray-100'} text-white flex items-center justify-center text-xs font-bold ${percentage === 0 && 'text-gray-400'}`}>
                                                 {percentage > 0 ? `${percentage}%` : '0%'}
                                          </div>
                                   </div>
                                   <div className="text-left">
                                          <h3 className="font-bold text-lg text-[#1e232c]">{title}</h3>
                                          <p className="text-gray-400 text-xs">{completed} of {total} completed</p>
                                   </div>
                            </div>

                            <div className="flex items-center gap-4">
                                   {/* Progress Bar for Accordion Header */}
                                   <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden hidden md:block">
                                          <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
                                   </div>
                                   {isOpen ? <ChevronUp className="size-5 text-gray-400" /> : <ChevronDown className="size-5 text-gray-400" />}
                            </div>
                     </CollapsibleTrigger>
                     <CollapsibleContent>
                            <div className="border-t border-gray-100">
                                   {children}
                            </div>
                     </CollapsibleContent>
              </Collapsible>
       )
}

function SessionCard({ status, type, title, date, duration, isHighlight }: any) {
       const isCompleted = status === "completed"
       const isInProgress = status === "in-progress"

       return (
              <div className={`p-6 rounded-[20px] border ${isHighlight ? 'border-[#FF9E44] bg-white ring-1 ring-[#FF9E44]/20' : 'border-gray-100 bg-white'} space-y-4 relative group hover:shadow-md transition-shadow`}>
                     <div className="flex justify-between items-start">
                            <div className={`size-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-[#FF9E44]' : (isInProgress ? 'bg-white border-2 border-[#FF9E44]' : 'bg-gray-100')}`}>
                                   {isCompleted && <Check className="size-4 text-white" />}
                                   {isInProgress && <div className="size-2 rounded-full bg-[#FF9E44]" />}
                                   {!isCompleted && !isInProgress && <div className="size-2 rounded-full bg-gray-300" />}
                            </div>
                            <span className="text-xs font-medium text-gray-400">{duration}</span>
                     </div>

                     <div className="space-y-1">
                            <h4 className="font-bold text-[#1e232c] leading-tight">{title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                   <Calendar className="size-3" /> {date}
                            </div>
                     </div>

                     <div className="pt-2">
                            {isCompleted && (
                                   <span className="bg-[#FFF5ED] text-[#FF9E44] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Completed</span>
                            )}
                            {isInProgress && (
                                   <span className="bg-[#FF9E44] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">In Progress</span>
                            )}
                            {!isCompleted && !isInProgress && (
                                   <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Upcoming</span>
                            )}
                     </div>
              </div>
       )
}
