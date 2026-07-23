import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getPostAuthPath } from '@/lib/auth-utils';
import { getRequestAppOrigin } from '@/lib/app-origin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getRequestAppOrigin(request);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        const path = await getPostAuthPath(session.access_token);
        return NextResponse.redirect(`${origin}${path}`);
      }
      return NextResponse.redirect(`${origin}/policy`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
