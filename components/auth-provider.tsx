'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Profile = {
       id: string
       full_name: string | null
       email: string | null
       phone: string | null
       batch_id: string | null
       gender: string | null
       enrollment_id: string | null
       institute_name?: string | null  // derived from cdm_batches → cdm_institutes
}

type AuthContextType = {
       user: User | null
       session: Session | null
       profile: Profile | null
       isLoading: boolean
       signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
       const [user, setUser] = useState<User | null>(null)
       const [session, setSession] = useState<Session | null>(null)
       const [profile, setProfile] = useState<Profile | null>(null)
       const [isLoading, setIsLoading] = useState(true)
       const router = useRouter()
       const supabase = createClient()

       useEffect(() => {
              let isCancelled = false

              // onAuthStateChange fires INITIAL_SESSION on every page load/refresh
              // with the current session from cookies — this is the correct way to
              // initialize auth state in Next.js with @supabase/ssr
              const { data: { subscription } } = supabase.auth.onAuthStateChange(
                     async (event: string, session: Session | null) => {
                            if (isCancelled) return

                            if (event === 'INITIAL_SESSION') {
                                   // Fires once on mount with the current session from cookies
                                   if (session?.user) {
                                          setSession(session)
                                          setUser(session.user)
                                          await fetchProfile(session.user.email!)
                                   }
                                   if (!isCancelled) setIsLoading(false)
                            } else if (event === 'SIGNED_IN') {
                                   setSession(session)
                                   setUser(session?.user ?? null)
                                   if (session?.user) {
                                          await fetchProfile(session.user.email!)
                                   }
                                   setIsLoading(false)
                            } else if (event === 'SIGNED_OUT') {
                                   setSession(null)
                                   setUser(null)
                                   setProfile(null)
                                   setIsLoading(false)
                            } else if (event === 'TOKEN_REFRESHED') {
                                   // Just update session/user, don't re-fetch profile
                                   setSession(session)
                                   setUser(session?.user ?? null)
                            }
                     }
              )

              return () => {
                     isCancelled = true
                     subscription.unsubscribe()
              }
              // eslint-disable-next-line react-hooks/exhaustive-deps
       }, [])

       const fetchProfile = async (userEmail: string) => {
              try {
                     // Fetch student record from cdm_students by email
                     const { data, error } = await supabase
                            .from('cdm_students')
                            .select('*')
                            .eq('email', userEmail)
                            .maybeSingle()

                     if (error) {
                            console.error('Error fetching profile from cdm_students:', error)
                            // Fallback to minimal profile from Auth user if DB fetch fails
                            setProfile({
                                   id: userEmail,
                                   email: userEmail,
                                   full_name: userEmail.split('@')[0],
                                   phone: null,
                                   batch_id: null,
                                   gender: null,
                                   enrollment_id: null,
                                   institute_name: null
                            } as Profile)
                            return
                     }

                     if (!data) {
                            console.error('Profile not found in cdm_students for email:', userEmail)
                            // Fallback to minimal profile from Auth user if DB fetch fails
                            setProfile({
                                   id: userEmail,
                                   email: userEmail,
                                   full_name: userEmail.split('@')[0],
                                   phone: null,
                                   batch_id: null,
                                   gender: null,
                                   enrollment_id: null,
                                   institute_name: null
                            } as Profile)
                            return
                     }

                     // Derive institute_name from cdm_batches → cdm_institutes
                     let institute_name: string | null = null
                     try {
                            if (data.batch_id) {
                                   const { data: batch } = await supabase
                                          .from('cdm_batches')
                                          .select('institute_id')
                                          .eq('id', data.batch_id)
                                          .maybeSingle()

                                   if (batch?.institute_id) {
                                          const { data: institute } = await supabase
                                                 .from('cdm_institutes')
                                                 .select('name')
                                                 .eq('id', batch.institute_id)
                                                 .maybeSingle()

                                          institute_name = institute?.name ?? null
                                   }
                            }
                     } catch (err) {
                            console.warn("Could not fetch institute details (likely RLS), proceeding with null institute_name", err)
                     }

                     setProfile({ ...data, institute_name })
              } catch (error) {
                     console.error('Unexpected error fetching profile:', error)
              }
       }

       const signOut = async () => {
              await supabase.auth.signOut()
              router.push('/login')
       }

       return (
              <AuthContext.Provider value={{ user, session, profile, isLoading, signOut }}>
                     {children}
              </AuthContext.Provider>
       )
}

export const useAuth = () => {
       const context = useContext(AuthContext)
       if (context === undefined) {
              throw new Error('useAuth must be used within an AuthProvider')
       }
       return context
}
