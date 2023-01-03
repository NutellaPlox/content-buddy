import { Auth, ThemeSupa } from "@supabase/auth-ui-react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import Head from "next/head"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <>
      <Head>
        <title>Content Buddy - Login</title>
        <meta name="description" content="Content Buddy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="w-full min-h-screen bg-dark flex items-center justify-center">
        <div className="w-100 rounded-lg bg-darker p-8 drop-shadow-lmd">
          {!session && (
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#151515",
                      brandAccent: "#171717",
                      messageText: "white",
                    },
                  },
                },
              }}
              theme="dark"
            />
          )}
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = async (ctx: any) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
