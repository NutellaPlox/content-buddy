import dynamic from "next/dynamic"
import React, { useEffect, useState } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { EditorState } from "lexical/LexicalEditorState"
import { LexicalEditor } from "lexical/LexicalEditor"
import { SuggestionNode } from "./Nodes/SuggestionNode"
import SuggestionPlugin from "./Plugins/SuggestionPlugin"
import TreeViewPlugin from "./Plugins/TreeViewPlugin"

export default function Editor({
  placeholder,
  predictFunction,
  setPrompt,
  topic,
}: {
  placeholder: string
  predictFunction?: any
  setPrompt?: any
  topic?: string
}) {
  const placeHolderElement = () => {
    return (
      <div className="absolute select-none top-3 left-3 pointer-events-none text-gray-500">
        {placeholder}
      </div>
    )
  }
  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {}
  const onError = (e: Error) => {
    console.log(e)
  }
  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      paragraph: "editor-paragraph",
    },
    onError,
    nodes: [SuggestionNode],
  }

  return (
    <div className="w-full border-2 border-black rounded-lg hover:cursor-text">
      <div className="relative" style={{ minHeight: "10rem" }}>
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={placeHolderElement}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <SuggestionPlugin
            predictFunction={predictFunction}
            topic={topic as string}
          />
          {/* <TreeViewPlugin  /> */}
        </LexicalComposer>
      </div>
    </div>
  )
}
