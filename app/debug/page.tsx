"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function DebugPage() {
       const [envVars, setEnvVars] = useState<any>({})
       const [clientStatus, setClientStatus] = useState<string>("Initializing...")

       useEffect(() => {
              // Check env vars
              const vars = {
                     NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
                     NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?
                            `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` : "(missing)",
              }
              setEnvVars(vars)

              // Try initializing client
              try {
                     const supabase = createClient()
                     setClientStatus("Client initialized successfully")
              } catch (err: any) {
                     setClientStatus(`Client initialization failed: ${err.message}`)
              }
       }, [])

       return (
              <div className="p-8 font-mono text-sm">
                     <h1 className="text-xl font-bold mb-4">Connection Debugging</h1>

                     <div className="mb-6">
                            <h2 className="font-bold mb-2">Environment Variables</h2>
                            <pre className="bg-gray-100 p-4 rounded">
                                   {JSON.stringify(envVars, null, 2)}
                            </pre>
                     </div>

                     <div>
                            <h2 className="font-bold mb-2">Supabase Client Status</h2>
                            <div className={`p-4 rounded ${clientStatus.includes("failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                   {clientStatus}
                            </div>
                     </div>
              </div>
       )
}
