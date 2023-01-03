import { NextApiHandler } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const TextGenerator: NextApiHandler = async (req, res) => {
  const openai = new OpenAIApi(configuration)
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res })
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    })

  const { prompt } = JSON.parse(req.body)
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: "1024x1024",
  })

  res.json(response.data.data[0].url)
}

export default TextGenerator
