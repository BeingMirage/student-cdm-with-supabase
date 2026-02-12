'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Profile = {
       id: string
       full_name: string | null
       email: string | null
       phone_number: string | null
       has_changed_password: boolean | null
       institute_name: string | null
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
                                   console.log("AuthProvider: Session found, fetching profile...", session.user.id)
                                   setSession(session)
                                   setUser(session.user)
                                   await fetchProfile(session.user.id)
                            } else {
                                   console.log("AuthProvider: No session found.")
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
                            setSession(session)
                            setUser(session?.user ?? null)

                            if (session?.user) {
                                   await fetchProfile(session.user.id)
                            } else {
                                   setProfile(null)
                            }

                            setIsLoading(false)

                            if (event === 'SIGNED_OUT') {
                                   router.refresh()
                            }
                     }
              )

              return () => {
                     subscription.unsubscribe()
              }
       }, [supabase, router])

       const fetchProfile = async (userId: string) => {
              try {
                     const { data, error } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', userId)
                            .single()

                     if (error) {
                            console.error('Error fetching profile:', error)
                     } else {
                            setProfile(data)
                     }
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
