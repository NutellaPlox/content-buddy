import Image from "next/image"
import React, { useState } from "react"
import PromptInput from "../General/PromptInput"

export default function ImageComponent() {
  const [output, setOutput] = useState(null)
  const requestImage = async (text: string) => {
    const response = await fetch("/api/image", {
      method: "POST",
      body: JSON.stringify({ prompt: text }),
    })
    const data = await response.json()
    setOutput(data)
  }

  return (
    <div className="flex flex-col w-full px-4 md:w-4/6">
      <PromptInput
        placeholder="Show me an impressionistic painting of the sunset in the hills with a reflection in the lake."
        clickFunction={requestImage}
      />
      {output !== null && (
        <div className="flex justify-center w-full my-6 md:my-16">
          <Image src={output} width="1024" height="1024" alt="Output image" />
        </div>
      )}
    </div>
  )
}
