import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/my-journey']

export async function middleware(request: NextRequest) {
       let supabaseResponse = NextResponse.next({
              request,
       })

       const supabase = createServerClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              {
                     cookies: {
                            getAll() {
                                   return request.cookies.getAll()
                            },
                            setAll(cookiesToSet: any[]) {
                                   cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                                   supabaseResponse = NextResponse.next({
                                          request,
                                   })
                                   cookiesToSet.forEach(({ name, value, options }) =>
                                          supabaseResponse.cookies.set(name, value, options)
                                   )
                            },
                     },
              }
       )

       // IMPORTANT: Use getUser() not getSession() for security.
       // getUser() validates the token with the Supabase server.
       const { data: { user } } = await supabase.auth.getUser()

       const { pathname } = request.nextUrl

       // If the user is NOT logged in and tries to access a protected route, redirect to /login
       const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
       if (!user && isProtected) {
              const loginUrl = request.nextUrl.clone()
              loginUrl.pathname = '/login'
              return NextResponse.redirect(loginUrl)
       }

       return supabaseResponse
}

export const config = {
       matcher: [
              /*
               * Match all request paths except for the ones starting with:
               * - _next/static (static files)
               * - _next/image (image optimization files)
               * - favicon.ico (favicon file)
               */
              '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
       ],
}
