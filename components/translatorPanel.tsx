import translate from '@/api/api'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { Icons } from './icons'
import TranslationPanel from './translationPanel'
import { buttonVariants } from './ui/button'

const TranslatorPanel = () => {
    const t = useTranslations('Translator')
    const { locale } = useRouter()

    const [textParam, setTextParam] = useQueryParam('text', withDefault(StringParam, ""))
    const [text, setText] = useState(textParam)
    const [translations, setTranslations] = useState([])
    const [duration, setDuration] = useState(0)
    const [loading, setLoading] = useState(false)
    const [timeoutId, setTimeoutId] = useState(null)
    const textareaRef = useRef<HTMLTextAreaElement>()
    const latestInputTextRef = useRef<string>()
    const examples = [
        ["Мы идем домой"],
        ["Сегодня хорошая погода"],
        ["Дети играют во дворе"],
        ["We live in a big house"],
        ["Tu es une bonne personne."],
        ["أين تعيش؟"],
        ["Bir şeyler yapmak istiyorum."],
        ["– Если я его отпущу, то ты вовек не сможешь его поймать, – заявил Сосруко."],
        ["Как только старик ушел, Сатаней пошла к Саусырыко."],
        ["我永远不会放弃你。"],
        ["우리는 소치에 살고 있습니다."],
    ]


    useEffect(() => {
        focusOnTextArea()
    }, [])

    useEffect(() => {
        setText(textParam)
    }, [textParam])

    useEffect(() => {
        if (text.length > 0) {
            setTimeoutId(setTimeout(() => api_translate(text), 500))
        } else {
            setTextParam(undefined, 'replaceIn')
            setTranslations([])
            setDuration(0)
            setLoading(false)
        }

    }, [text, setTextParam])

    const focusOnTextArea = () => textareaRef.current.focus()

    const onTextInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const currentText = event.currentTarget.value
        setText(currentText)
        setTextParam(currentText, 'replaceIn')
        clearTimeout(timeoutId)
    }

    const onClearClick = () => {
        setText('')
        focusOnTextArea()
    }

    const handleExampleClick = (example: string) => {
        window.scrollTo(0, 0)
        setText(example)
        setTextParam(example, 'replaceIn')
    }

    const api_translate = async (inputText: string) => {
        setLoading(true)
        latestInputTextRef.current = inputText
        translate(inputText)
            .then((response) => {
                if (latestInputTextRef.current === inputText) {
                    setTranslations(response.translations)
                    setDuration(response.duration)
                    setLoading(false)
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error)
            })
    }

    return (
        <div>
            <div className="flex max-w-4xl flex-col items-start rounded-lg border border-gray-800 shadow-lg md:flex-row">
                <div className="flex w-full rounded-l-lg border-gray-800 p-4 md:h-96">
                    <textarea
                        ref={textareaRef}
                        className="h-full min-h-[150px] w-full resize-none bg-transparent p-2 text-xl focus:outline-none focus:ring-0"
                        placeholder={t('type_to_translate', { locale })}
                        value={text}
                        onInput={onTextInput}
                    />
                    <div
                        className={buttonVariants({
                            size: "sm",
                            variant: "ghost",
                            className: `items-center justify-end self-start p-4 text-slate-700 dark:text-slate-400 cursor-pointer ${text.length == 0 ? "hidden" : ""}`,
                        })}
                        onClick={onClearClick}
                    >
                        <Icons.close className="h-5 w-5 fill-current" />
                    </div>
                </div>
                <div className="h-px w-full bg-gray-800 md:h-full md:w-px" />
                <TranslationPanel
                    loading={loading}
                    translations={translations}
                    duration={duration}
                />
            </div>
            <div className="mt-4 max-w-4xl rounded-lg p-4">
                <h2 className="mb-2 text-xl font-semibold">{t('examples', { locale })}:</h2>
                <ul className="flex flex-wrap gap-2 text-slate-700 dark:text-slate-400">
                    {examples.map((example, index) => (
                        <li key={index} className="cursor-pointer rounded-lg bg-gray-100 p-3 text-base transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-slate-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-slate-100"
                            onClick={() => handleExampleClick(example[0])}>
                            {example[0]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TranslatorPanel
