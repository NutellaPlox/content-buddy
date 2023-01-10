import React, { useState } from "react"
import PredictiveInput from "../General/PredictiveInput"
// import PredictiveInput from "../General/PredictiveInput"

export default function PredictiveTextComponent() {
  return (
    <div className="flex flex-col w-full px-4 md:w-4/6">
      <PredictiveInput
        topicPlaceholder="What your essay will be about (e.g. The effect that the great drepession had on the economy)"
        placeholder="Start writing your essay here to use the predictive text feature."
      />
    </div>
  )
}
