import {
  EditorConfig,
  NodeKey,
  DecoratorNode,
  SerializedLexicalNode,
  LexicalNode,
} from "lexical"
import type { Spread } from "lexical"
import * as React from "react"

export type SerializedSuggestionNode = Spread<
  {
    type: "suggestion"
    version: 1
  },
  SerializedLexicalNode
>

export class SuggestionNode extends DecoratorNode<JSX.Element | null> {
  __className: string
  __text: string
  __new: boolean

  constructor(text: string, key?: NodeKey) {
    super(key)
    this.__className = "editor-suggestion"
    this.__text = text
    this.__new = true
  }

  static getType(): string {
    return "suggestion"
  }

  static clone(node: SuggestionNode) {
    return new SuggestionNode(node.__text, node.__key)
  }

  static importJSON(): SuggestionNode {
    const node = $createSuggestionNode("")
    return node
  }

  isNew(): boolean {
    const self = this.getLatest()
    return self.__new
  }

  getTextContent(): string {
    const self = this.getLatest()
    return self.__text
  }

  setOld() {
    const self = this.getWritable()
    self.__new = false
  }
  setTextContent(text: string) {
    const self = this.getWritable()
    self.__text = text
  }

  exportJSON(): SerializedSuggestionNode {
    return {
      ...super.exportJSON(),
      type: "suggestion",
      version: 1,
    }
  }

  updateDOM(
    prevNode: unknown,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    return false
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span")
    span.className = "editor-suggestion"
    return span
  }

  decorate(): JSX.Element | null {
    return <SuggestionComponent suggestionText={this.getTextContent()} />
  }
}

export function $isSuggestionNode(node: LexicalNode) {
  return node instanceof SuggestionNode
}

export function $createSuggestionNode(suggestionText: string) {
  return new SuggestionNode(suggestionText)
}

function SuggestionComponent({
  suggestionText,
}: {
  suggestionText: string
}): JSX.Element {
  const isMobile = /Android|iPhone/i.test(navigator.userAgent)
  return <span spellCheck="false">{suggestionText}</span>
}
