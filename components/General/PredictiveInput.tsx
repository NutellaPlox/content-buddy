import React, { useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

export default function PredictiveInput({
  placeholder,
  topicPlaceholder,
  predictFunction,
}: {
  placeholder: string
  topicPlaceholder: string
  predictFunction: any
}) {
  const [topic, setTopic] = useState("")
  const [prompt, setPrompt] = useState("")
  const [prediction, setPrediction] = useState("")
  const bodyText = useRef<HTMLSpanElement>(null)
  const fetchPrediction = useDebouncedCallback((text) => {
    predictFunction(topic, text).then((response: any) => {
      if (text[text.length - 1].replace(/\u00a0/g, " ") === " ") {
        setPrediction(response)
        return
      }
      setPrediction(response)
    })
  }, 500)

  const setCaretToEnd = () => {
    if (bodyText) {
      bodyText.current ? bodyText.current.focus() : ""
      if (
        typeof window.getSelection != "undefined" &&
        typeof document.createRange != "undefined"
      ) {
        var range = document.createRange()
        range.selectNodeContents(bodyText.current as Node)
        range.collapse(false)
        var sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  }

  const trimPrediction = (textValue: string) => {
    let curText = textValue
    let curPrediction = prediction

    if (curText.length === 0) return

    if (!curPrediction) {
      fetchPrediction(curText)
      return
    }

    // Normalize spaces
    const curTextLastChar = curText[curText.length - 1].replace(/\u00a0/g, " ")
    const predictionFirstChar = curPrediction[0].replace(/\u00a0/g, " ")

    console.log(curTextLastChar, predictionFirstChar)
    if (curTextLastChar === predictionFirstChar) {
      curPrediction = curPrediction.substring(1)
    } else {
      curPrediction = ""
      fetchPrediction(curText)
    }
    setPrediction(curPrediction)
  }

  const updatePrompt = (textValue: string) => {
    setPrompt(textValue)
    setCaretToEnd()
    trimPrediction(textValue)
  }

  const catchModifiers = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPhone/i)
    ) {
      if (e.key === "Enter") {
        e.preventDefault()
        const newText = `${prompt}${prediction}`
        bodyText.current!.innerText = newText
        setPrompt(newText)
        setPrediction("")
        setCaretToEnd()
        return
      }
    } else {
      if (e.key === "Tab") {
        e.preventDefault()
        const newText = `${prompt}${prediction}`
        bodyText.current!.innerText = newText
        setPrompt(newText)
        setPrediction("")
        setCaretToEnd()
        return
      }
    }
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
      <div className="flex flex-col w-full">
        <label className="font-semibold text-lg">Body </label>{" "}
        <p
          placeholder={placeholder}
          id="bodyText"
          style={{ minHeight: "10rem" }}
          className="w-full border-2 border-black rounded-lg p-3 focus:ring-0 focus:outline-none mt-2 hover:cursor-text break-words"
          onClick={() => {
            setCaretToEnd()
          }}
        >
          {bodyText.current?.textContent === "" && (
            <span
              suppressContentEditableWarning={true}
              className="absolute text-placeholder-gray"
            >
              {placeholder}
            </span>
          )}
          <span
            id="text"
            contentEditable="true"
            suppressContentEditableWarning={true}
            style={{ paddingRight: "1px" }}
            className="focus:outline-none whitespace-pre-line"
            ref={bodyText}
            onKeyDown={(e) => catchModifiers(e)}
            onInput={(e) => updatePrompt(e.currentTarget.textContent ?? "")}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => {
              if (topic === "") alert("Please specify a topic first")
            }}
          ></span>
          {bodyText.current?.textContent !== "" && (
            <span className="text-gray-500">{prediction}</span>
          )}
        </p>
      </div>
      <p className="text-normal mt-4">
        Press tab (Enter on mobile) to use suggestion. <br />
        New lines are kind of bugged
      </p>
    </div>
  )
}
