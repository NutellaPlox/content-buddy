import React, { useState } from "react"

export default function PromptInput({
  placeholder,
  clickFunction,
}: {
  placeholder: string
  clickFunction: any
}) {
  const [clicked, setClicked] = useState(false)
  const [prompt, setPrompt] = useState("")

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col w-full">
        <textarea
          placeholder={placeholder}
          className="w-full border-2 border-black rounded-lg p-3 focus:ring-0 focus:outline-none h-40 resize-none"
          onChange={(e) => {
            setPrompt(e.target.value)
          }}
        ></textarea>
        <div>
          <button
            onClick={async () => {
              setClicked(true)
              await clickFunction(prompt)
              setClicked(false)
            }}
            className="mt-6 md:mt-8 text-white font-semibold bg-black border border-black hover:bg-white hover:text-black rounded-full px-4 py-2 text-lg"
          >
            {clicked ? (
              <div className="flex items-center">
                Processing
                <svg
                  className="animate-spin ml-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
