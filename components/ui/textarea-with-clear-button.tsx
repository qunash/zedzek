import { forwardRef } from "react"
import { Icons } from "../icons"
import { buttonVariants } from "./button"

const TextAreaWithClearButton = forwardRef<HTMLTextAreaElement, { value: string, onChange: any, onClear: any }>(({ value, onChange, onClear }, ref) => {
    return (
        <div className="flex w-full rounded-l-lg border-gray-800 p-4 md:h-96">
            <textarea
                ref={ref}
                className="h-full min-h-[150px] w-full resize-none bg-transparent p-2 text-xl focus:outline-none focus:ring-0"
                placeholder='Type to translate...'
                value={value}
                onChange={onChange}
            />
            {value && (
                <div
                    className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                        className: "items-center justify-end self-start p-4 text-slate-700 dark:text-slate-400 cursor-pointer",
                    })}
                    onClick={onClear}
                >
                    <Icons.close className="h-5 w-5 fill-current" />
                </div>
            )}
        </div>
    )
})

TextAreaWithClearButton.displayName = "TextAreaWithClearButton"

export default TextAreaWithClearButton
