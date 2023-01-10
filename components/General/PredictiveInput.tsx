import React, { useState } from "react"
import Editor from "../Editor/Editor"

export default function PredictiveInput({
  placeholder,
  topicPlaceholder,
}: {
  placeholder: string
  topicPlaceholder: string
}) {
  const [topic, setTopic] = useState("")
  const requestPrediction = async (topic: string, text: string) => {
    if (topic === "") {
      alert("Please enter a topic")
      return ""
    }
    const response = await fetch("/api/predict", {
      method: "POST",
      body: JSON.stringify({ topic, prompt: text }),
    })
    let data = await response.json()
    if (text[text.length - 1] === " ") {
      return data.trim()
    }
    return data
  }

  return (
    <div className="flex justify-center w-full flex-col">
      <div>
        <label htmlFor="topicText" className="font-semibold text-lg">
          Topic
        </label>
        <input
          type="text"
          name="topicText"
          id="topicText"
          className="w-full border-2 border-black rounded-lg px-3 py-2 focus:ring-0 focus:outline-none mt-2 mb-4"
          placeholder={topicPlaceholder}
          onInput={(e) => setTopic(e.currentTarget.value)}
        />
      </div>
      <div>
        <Editor
          placeholder={placeholder}
          predictFunction={requestPrediction}
          topic={topic}
        />
      </div>

      <p className="text-normal mt-4">
        Press tab or right arrow (swipe right on mobile) to use suggestion.{" "}
        <br />
      </p>
    </div>
  )
}
