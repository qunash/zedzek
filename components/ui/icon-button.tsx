import { cloneElement } from "react"
import { buttonVariants } from "./button"

const IconButton = ({ icon, isFilled = false, onClick }: { icon: JSX.Element, isFilled?: boolean, onClick: () => void }) => {

    return (
        <div
            className={
                buttonVariants({
                    size: "lg",
                    variant: "ghost",
                    className: "items-center justify-center min-w-10 min-h-10 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all duration-200",
                })
            }
            onClick={onClick}>
            {cloneElement(icon, {
                className: `h-5 w-5 ${isFilled ? "fill-current" : ""}`,
            })}
        </div>
    )
}

export default IconButton