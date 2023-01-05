import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import ImageComponent from "../../components/Image/ImageComponent"
import PredictiveTextComponent from "../../components/Text/PredictiveTextComponent"
import TextComponent from "../../components/Text/TextComponent"

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [isText, setIsText] = useState(true)
  const [isImage, setIsImage] = useState(false)
  const [isPredict, setIsPredict] = useState(false)

  return (
    <>
      <Head>
        <title>Content Buddy</title>
        <meta name="description" content="Content Buddy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="w-full min-h-screen bg-black flex justify-center">
        <div className="flex flex-col w-full xl:w-8/12 relative bg-white min-h-screen items-center">
          <div className="absolute top-6 right-8">
            {session && (
              <button
                onClick={() => {
                  supabase.auth.signOut()
                  router.push("/")
                }}
                className="bg-black border border-black rounded-full px-6 pt-2 pb-3 font-semibold text-white hover:bg-white hover:text-black"
              >
                Logout
              </button>
            )}
          </div>
          <div className="text-5xl font-semibold pt-24 pb-8 md:pb-4 text-center md:text-left">
            <button
              onClick={() => {
                setIsText(true)
                setIsImage(false)
                setIsPredict(false)
              }}
              className={`${isText ? "underline" : ""}`}
            >
              Text
            </button>{" "}
            |{" "}
            <button
              onClick={() => {
                setIsText(false)
                setIsImage(false)
                setIsPredict(true)
              }}
              className={`${isPredict ? "underline" : ""}`}
            >
              Predictive Text
            </button>{" "}
            |{" "}
            <button
              onClick={() => {
                setIsText(false)
                setIsImage(true)
                setIsPredict(false)
              }}
              className={`${isImage ? "underline" : ""}`}
            >
              Image
            </button>
          </div>
          {isText && <TextComponent />}
          {isPredict && <PredictiveTextComponent />}
          {isImage && <ImageComponent />}
        </div>
      </main>
    </>
  )
}
