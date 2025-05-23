"use client"

import React, { useEffect, useState, useRef, useMemo } from "react"
import Keyboard, { type SimpleKeyboard } from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"
import Draggable from "react-draggable"

const circassianLayout = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "й ц у к е н г ш щ з х ъ Ӏ",
    "ф ы в а п р о л д ж э",
    "я ч с м и т ь б .",
    "{space}",
  ],
  shift: [
    "! \" № ; % : ? * ( ) {bksp}",
    "Й Ц У К Е Н Г Ш Щ З Х Ъ Ӏ",
    "Ф Ы В А П Р О Л Д Ж Э",
    "Я Ч С М И Т Ь Б ,",
    "{space}",
  ],
}

const keyCodeToCyrillic: {
  default: { [code: string]: string },
  shift: { [code: string]: string }
} = {
  default: {
    'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
    'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',
    'KeyQ': 'й', 'KeyW': 'ц', 'KeyE': 'у', 'KeyR': 'к', 'KeyT': 'е',
    'KeyY': 'н', 'KeyU': 'г', 'KeyI': 'ш', 'KeyO': 'щ', 'KeyP': 'з',
    'BracketLeft': 'х', 'BracketRight': 'ъ', 'KeyA': 'ф', 'KeyS': 'ы', 'KeyD': 'в',
    'KeyF': 'а', 'KeyG': 'п', 'KeyH': 'р', 'KeyJ': 'о', 'KeyK': 'л',
    'KeyL': 'д', 'Semicolon': 'ж', 'Quote': 'э', 'KeyZ': 'я', 'KeyX': 'ч',
    'KeyC': 'с', 'KeyV': 'м', 'KeyB': 'и', 'KeyN': 'т', 'KeyM': 'ь',
    'Comma': 'б', 'Period': 'ю', 'Slash': '.', 'Space': ' ', 'Enter': '{enter}', 'Backspace': '{bksp}', 'Backslash': 'Ӏ'
  },
  shift: {
    'Digit1': '!', 'Digit2': '"', 'Digit3': '№', 'Digit4': ';', 'Digit5': '%',
    'Digit6': ':', 'Digit7': '?', 'Digit8': '*', 'Digit9': '(', 'Digit0': ')',
    'KeyQ': 'Й', 'KeyW': 'Ц', 'KeyE': 'У', 'KeyR': 'К', 'KeyT': 'Е',
    'KeyY': 'Н', 'KeyU': 'Г', 'KeyI': 'Ш', 'KeyO': 'Щ', 'KeyP': 'З',
    'BracketLeft': 'Х', 'BracketRight': 'Ъ', 'KeyA': 'Ф', 'KeyS': 'Ы', 'KeyD': 'В',
    'KeyF': 'А', 'KeyG': 'П', 'KeyH': 'Р', 'KeyJ': 'О', 'KeyK': 'Л',
    'KeyL': 'Д', 'Semicolon': 'Ж', 'Quote': 'Э', 'KeyZ': 'Я', 'KeyX': 'Ч',
    'KeyC': 'С', 'KeyV': 'М', 'KeyB': 'И', 'KeyN': 'Т', 'KeyM': 'Ь',
    'Comma': 'Б', 'Period': 'Ю', 'Slash': ',', 'Space': ' ', 'Enter': '{enter}', 'Backspace': '{bksp}', 'Backslash': 'Ӏ'
  }
}

interface VirtualKeyboardProps {
  onKeyPress: (button: string) => void
  isVisible: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onClose?: () => void
}

const SHIFT_CODES = ["ShiftLeft", "ShiftRight"]

// Helper: Keyboard width/height for positioning
const KEYBOARD_WIDTH = 600;
const KEYBOARD_HEIGHT = 250;

const VirtualCircassianKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  isVisible,
  textareaRef,
  onClose
}) => {
  const [isShiftPressed, setIsShiftPressed] = useState(false)
  const [isCapsLockOn, setIsCapsLockOn] = useState(false)
  const keyboardRef = useRef<SimpleKeyboard | null>(null)

  const layoutMap = useMemo(
    () => keyCodeToCyrillic[isShiftPressed || isCapsLockOn ? "shift" : "default"],
    [isShiftPressed, isCapsLockOn]
  )

  const handleVirtualKeyPress = (button: string) => {
    if (button === "{shift}") {
      setIsShiftPressed(prev => !prev)
    } else if (button === "{capslock}") {
      setIsCapsLockOn(prev => !prev)
    } else {
      onKeyPress(button)
    }
  }

  // Handle physical keyboard input
  useEffect(() => {
    if (!isVisible || !textareaRef.current) return

    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement !== textareaRef.current) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (SHIFT_CODES.includes(e.code)) {
        if (e.type === "keydown") {
          setIsShiftPressed(true)
        } else if (e.type === "keyup") {
          setIsShiftPressed(false)
        }
        return
      }

      if (e.type === "keydown") {
        if (e.code === 'CapsLock') {
          setIsCapsLockOn(prev => !prev)
          return
        }

        const char = layoutMap[e.code]

        if (char) {
          e.preventDefault()
          const buttonElement = keyboardRef.current?.getButtonElement(char)
          if (buttonElement && buttonElement instanceof HTMLElement) {
            buttonElement.classList.add('hg-activeButton')
            setTimeout(() => {
              buttonElement.classList.remove('hg-activeButton')
            }, 200)
          }
          onKeyPress(char)
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKey)

    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKey)
    }
  }, [layoutMap, onKeyPress, isVisible, textareaRef, isShiftPressed, isCapsLockOn])

  // Robust default position for Draggable
  const [defaultPos, setDefaultPos] = useState<{ x: number; y: number } | null>(null);
  const [keyboardWidth, setKeyboardWidth] = useState(KEYBOARD_WIDTH);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const width = Math.min(window.innerWidth * 0.95, KEYBOARD_WIDTH);
      setKeyboardWidth(width);
      setDefaultPos({
        x: (window.innerWidth - width) / 2,
        y: window.innerHeight - KEYBOARD_HEIGHT - 24,
      });
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        .dark .hg-theme-default {
          background-color: hsl(var(--input));
        }
        .dark .hg-theme-default .hg-button {
          background-color: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
          border: 1px solid hsl(var(--border));
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms; /* transition-colors */
        }
        .dark .hg-theme-default .hg-button.hg-activeButton {
          background-color: #3f3f46; /* bg-zinc-700 */
        }
        .dark .hg-theme-default .hg-button.hg-selectedButton {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
      `}</style>
      {defaultPos && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Draggable
            handle=".vk-header"
            bounds="parent"
            defaultPosition={defaultPos}
          >
            <div
              style={{ width: keyboardWidth, maxWidth: '95vw' }}
              className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg absolute pointer-events-auto z-50"
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between px-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900 select-none">
                <div className="vk-header flex-1 py-2 cursor-move">
                  {/* You can add a label here if desired */}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close Keyboard"
                    className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg font-bold focus:outline-none select-none cursor-pointer"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="pt-1 pb-2 px-2">
                <Keyboard
                  keyboardRef={(r) => (keyboardRef.current = r)}
                  layout={circassianLayout}
                  layoutName={(isShiftPressed || isCapsLockOn) ? 'shift' : 'default'}
                  onKeyPress={handleVirtualKeyPress}
                  display={{
                    '{bksp}': '⌫',
                    '{space}': ' ',
                  }}
                  physicalKeyboardHighlight={false}
                />
              </div>
            </div>
          </Draggable>
        </div>
      )}
    </>
  )
}

export default VirtualCircassianKeyboard
