import React, { useState } from "react"
import PromptInput from "../General/PromptInput"

export default function TextComponent() {
  const [output, setOutput] = useState("")
  const requestText = async (text: string) => {
    const response = await fetch("/api/text", {
      method: "POST",
      body: JSON.stringify({ prompt: text }),
    })
    const data = await response.json()
    setOutput(data.trim())
  }
  return (
    <div className="flex flex-col w-4/6">
      <PromptInput
        placeholder="Write a song about jumping jacks."
        clickFunction={requestText}
      />
      {output !== "" && (
        <div className="w-full mt-8 bg-gray-200 rounded-lg py-4 px-6 whitespace-pre-line">
          {output}
        </div>
      )}
    </div>
  )
}
