import { useSession } from "@supabase/auth-helpers-react"
import Head from "next/head"
import Link from "next/link"

export default function Home() {
  const session = useSession()

  return (
    <>
      <Head>
        <title>Content Buddy</title>
        <meta name="description" content="Content Buddy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="w-full min-h-screen">
        <div className="w-full min-h-screen flex">
          <div className="w-1/2 bg-black flex items-center justify-end pr-6">
            <h1 className="text-white text text-5xl font-semibold">Under</h1>
          </div>
          <div className="w-1/2 flex items-center pl-4">
            <h1 className="text text-5xl font-semibold">Construction</h1>
            <div className="absolute top-6 right-8">
              {!session && (
                <Link href="/auth/login">
                  <button className="bg-black border border-black rounded-full px-6 pt-2 pb-3 font-semibold text-white hover:bg-white hover:text-black">
                    Login
                  </button>
                </Link>
              )}
              {session && (
                <Link href="/app">
                  <button className="bg-black border border-black rounded-full px-6 pt-2 pb-3 font-semibold text-white hover:bg-white hover:text-black">
                    Dashboard
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
