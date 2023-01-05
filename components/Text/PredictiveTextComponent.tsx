import React, { useState } from "react"
import PredictiveInput from "../General/PredictiveInput"

export default function PredictiveTextComponent() {
  const requestPrediction = async (topic: string, text: string) => {
    const response = await fetch("/api/predict", {
      method: "POST",
      body: JSON.stringify({ topic, prompt: text }),
    })
    const data = await response.json()
    return data
  }
  return (
    <div className="flex flex-col w-full px-4 md:w-4/6">
      <PredictiveInput
        topicPlaceholder="What your essay will be about (e.g. The effect that the great drepession had on the economy)"
        placeholder="Start writing your essay here to use the predictive text feature."
        predictFunction={requestPrediction}
      />
    </div>
  )
}
