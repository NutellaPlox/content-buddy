import React, { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useDebouncedCallback } from "use-debounce"
import {
  TextNode,
  LexicalCommand,
  createCommand,
  KEY_TAB_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  $nodesOfType,
  $createTextNode,
  $getSelection,
  $getRoot,
  $isRangeSelection,
  $isParagraphNode,
} from "lexical"
import { mergeRegister } from "@lexical/utils"
import {
  $createSuggestionNode,
  SuggestionNode,
  $isSuggestionNode,
} from "../Nodes/SuggestionNode"

// Order
// ----------------
// Hooks/consts
// Functions
// Command functions
// Command creations
// Command registration

export default function SuggestionPlugin({
  predictFunction,
  topic,
}: {
  predictFunction: any
  topic: string
}) {
  const [editor] = useLexicalComposerContext()
  const updatePrediction = useDebouncedCallback(() => fetchPrediction(), 400)

  // Probably should use useCallback here
  const fetchPrediction = () => {
    const editorState = editor.getEditorState()
    let allText = ""
    editorState.read(() => {
      const root = $getRoot()
      allText = root.getTextContent()
    })
    predictFunction(topic, allText).then((prediction: string) => {
      console.log(prediction)
      editor.update(() => {
        const root = $getRoot()
        const lastDescendant = root.getLastDescendant()

        // If there is already a suggestion node
        if (lastDescendant && $isSuggestionNode(lastDescendant)) {
          lastDescendant.setTextContent(prediction)
          return
        }

        // Don't want to predict if empty paragraph with no suggestion node
        if ($isParagraphNode(lastDescendant)) {
          return
        }

        lastDescendant?.insertAfter($createSuggestionNode(prediction))

        // Insert empty text node so that when suggestion is updated, the actual text node won't get marked as dirty
        const emptyTextNode = $createTextNode("")
        emptyTextNode.toggleUnmergeable()
        lastDescendant?.insertAfter(emptyTextNode)
      })
    })
  }

  const chooseSuggestion = () => {
    const suggestionNodes = $nodesOfType(SuggestionNode)
    if (suggestionNodes.length > 0) {
      let textNode = suggestionNodes[0]
        .getPreviousSibling()
        ?.getPreviousSibling()
      const suggestionNode = suggestionNodes[0]
      if (textNode) {
        textNode = textNode.replace(
          $createTextNode(
            `${textNode.getTextContent()}${suggestionNode.getTextContent()}`
          )
        )
      }

      const selection = $getSelection()
      if (selection && $isRangeSelection(selection) && textNode) {
        const textLength = textNode.getTextContentSize()
        const textKey = textNode.getKey()
        selection.focus.set(textKey, textLength, "text")
        selection.anchor.set(textKey, textLength, "text")
      }
      {
        suggestionNode.getPreviousSibling()?.remove()
        suggestionNode.remove()
      }
    }
  }

  // Check if suggestion needs to be updated
  const handleTextNodeTransform = (node: TextNode) => {
    // 1. Add suggestion if typing in last node
    // 2. If character typed is equal to first character of suggestion, shorten suggestion
    // 3. Remove suggestion if node being updated isn't last text node
    const nextSibling = node.getNextSibling()
    const lastDescendant = $getRoot().getLastDescendant()
    const text = node.getTextContent()
    const selection = $getSelection()
    const secondToLast = lastDescendant?.getPreviousSibling()

    // Empty text node is used as buffer. Don't propogate changes if in buffer node
    if (secondToLast && secondToLast.getKey() === node.getKey()) return

    // If text is stil being updated, dispatch suggestion update
    if (
      lastDescendant &&
      $isSuggestionNode(lastDescendant) &&
      lastDescendant.getTextContent() === ""
    ) {
      editor.dispatchCommand(UPDATE_PREDICTION, null)
      return
    }

    // Suggestion already exists, compared
    if (
      (nextSibling && $isSuggestionNode(nextSibling)) ||
      (lastDescendant && $isSuggestionNode(lastDescendant))
    ) {
      const textLastChar = text[text.length - 1]
      const suggestionText = lastDescendant?.getTextContent()

      if (!suggestionText) return

      if (lastDescendant?.isNew()) {
        lastDescendant.setOld()
        return
      }

      const suggestionFirstChar = suggestionText[0]

      if (textLastChar === suggestionFirstChar) {
        // If char is equal to suggestion first character
        const newSuggestion = $createSuggestionNode(suggestionText.substring(1))
        newSuggestion.setOld()
        lastDescendant?.replace(newSuggestion)
      } else {
        lastDescendant?.setTextContent("")
        editor.dispatchCommand(UPDATE_PREDICTION, null)
      }
      return
    }

    // Is there is a selection highlighted, then don't predict
    if (
      selection &&
      $isRangeSelection(selection) &&
      (selection.anchor.key !== selection.focus.key ||
        selection.anchor.offset !== selection.focus.offset)
    )
      return

    // If selection is not last textNode, don't predict
    if (
      selection &&
      $isRangeSelection(selection) &&
      selection.focus.key !== lastDescendant?.getKey()
    )
      return

    if (text && text[text.length - 1] !== ".") {
      editor.dispatchCommand(UPDATE_PREDICTION, null)
    }
  }

  const handleSelectAll = (): boolean => {
    const suggestionNodes = $nodesOfType(SuggestionNode)
    if (suggestionNodes.length > 0) {
      suggestionNodes[0].getPreviousSibling()?.remove()
      suggestionNodes[0].remove()
    }
    return true
  }

  const handleTab = (event: KeyboardEvent): boolean => {
    event.preventDefault()
    chooseSuggestion()
    return true
  }

  // Needs to return false to preserve right arrow behavior. Idk why
  const handleRightArrow = (): boolean => {
    const selection = $getSelection()

    if (!selection) return false

    const selectionNodes = selection.getNodes()
    if (selectionNodes && selectionNodes.length === 0) return false

    const selectionNode = selectionNodes[0]
    const nextSibling = selectionNode.getNextSibling()
    const skipSibling = nextSibling?.getNextSibling()

    if (skipSibling && !$isSuggestionNode(skipSibling)) return false

    if (
      $isRangeSelection(selection) &&
      selection.focus.offset === selectionNode.getTextContentSize()
    ) {
      chooseSuggestion()
    }

    return false
  }

  const handleEnter = (event: KeyboardEvent | null): boolean => {
    if (event && event.key === "Enter") {
      const suggestionNodes = $nodesOfType(SuggestionNode)
      if (suggestionNodes.length > 0) {
        suggestionNodes[0].getPreviousSibling()?.remove()
        suggestionNodes[0].remove()
      }
    }
    return true
  }

  const selectAllListener = (rootElement: HTMLElement | null) => {
    rootElement?.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "a" && (event.ctrlKey || event.metaKey)) {
        editor.dispatchCommand(KEY_SELECT_ALL, event)
      }
    })
  }

  const KEY_SELECT_ALL: LexicalCommand<KeyboardEvent> = createCommand()
  const UPDATE_PREDICTION: LexicalCommand<null> = createCommand()

  useEffect(() => {
    mergeRegister(
      editor.registerNodeTransform(TextNode, handleTextNodeTransform),
      editor.registerRootListener((rootElement) =>
        selectAllListener(rootElement)
      ),
      editor.registerCommand(
        KEY_SELECT_ALL,
        () => handleSelectAll(),
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        UPDATE_PREDICTION,
        (payload) => {
          updatePrediction()
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (payload) => handleTab(payload),
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (payload) => handleEnter(payload),
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        () => handleRightArrow(),
        COMMAND_PRIORITY_EDITOR
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])
  return null
}
