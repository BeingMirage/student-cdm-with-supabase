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
              const fetchSession = async () => {
                     try {
                            console.log("AuthProvider: Fetching session...")
                            const { data: { session } } = await supabase.auth.getSession()

                            if (session) {
                                   console.log("AuthProvider: Session found, fetching profile...", session.user.email)
                                   setSession(session)
                                   setUser(session.user)
                                   await fetchProfile(session.user.email!)
                            } else {
                                   console.log("AuthProvider: No session found.")
                                   setProfile(null)
                            }
                     } catch (error) {
                            console.error('Error fetching session:', error)
                     } finally {
                            console.log("AuthProvider: Finished loading")
                            setIsLoading(false)
                     }
              }

              fetchSession()

              const { data: { subscription } } = supabase.auth.onAuthStateChange(
                     async (event: string, session: Session | null) => {
                            console.log("AuthProvider: Auth state changed:", event)

                            if (event === 'SIGNED_OUT') {
                                   setSession(null)
                                   setUser(null)
                                   setProfile(null)
                                   return
                            }

                            setSession(session)
                            setUser(session?.user ?? null)

                            if (session?.user) {
                                   await fetchProfile(session.user.email!)
                            } else {
                                   setProfile(null)
                            }

                            setIsLoading(false)
                     }
              )

              return () => {
                     subscription.unsubscribe()
              }
       }, [supabase])

       const fetchProfile = async (userEmail: string) => {
              try {
                     // Fetch student record from cdm_students by email
                     const { data, error } = await supabase
                            .from('cdm_students')
                            .select('*')
                            .eq('email', userEmail)
                            .maybeSingle()

                     if (error) {
                            console.error('Error fetching profile:', error)
                            return
                     }

                     if (!data) {
                            console.error('Profile not found for email:', userEmail)
                            return
                     }

                     // Derive institute_name from cdm_batches → cdm_institutes
                     let institute_name: string | null = null
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
