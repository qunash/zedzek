import { forwardRef } from "react"
import { Icons } from "../icons"
import { buttonVariants } from "./button"

const TextAreaWithClearButton = forwardRef<HTMLTextAreaElement, { 
    value: string, 
    placeholder: string, 
    onChange: any, 
    onClear: any,
    fontSize?: 'text-3xl' | 'text-2xl' | 'text-xl' 
}>(({ value, placeholder, onChange, onClear, fontSize = 'text-3xl' }, ref) => {
    return (
        <div className="relative flex w-full overflow-y-auto rounded-l-lg border-gray-800 p-4 md:h-[28rem]">
            <textarea
                ref={ref}
                className={`h-full min-h-[150px] w-full resize-none bg-transparent p-2 pr-10 ${fontSize} focus:outline-none focus:ring-0`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {value && (
                <div
                    className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                        className: "absolute right-4 top-4 items-center justify-end p-4 text-slate-700 dark:text-slate-400 cursor-pointer",
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
