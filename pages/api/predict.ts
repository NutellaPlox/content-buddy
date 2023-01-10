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

  const { prompt, topic }: { prompt: string; topic: string } = JSON.parse(
    req.body
  )

  if (!prompt && !topic) {
    return res.json({})
  }

  const query = `The topic of the essay is about ${topic[0].toLocaleLowerCase()}${topic.substring(
    1
  )}. Finish the rest of the last paragraph in this essay with at least two more sentences: ${prompt}`
  // model: "text-davinci-003",
  // prompt: query,
  // temperature: 0.7,
  // frequency_penalty: 0.54,
  // presence_penalty: 0.9,
  // max_tokens: 256,
  const response = await openai.createCompletion({
    model: "text-curie-001",
    prompt: query,
    temperature: 0.7,
    frequency_penalty: 1.19,
    presence_penalty: 1.89,
    max_tokens: 256,
  })

  res.json(response.data.choices[0].text?.replace(/\n/g, " "))
}

export default TextGenerator
