import { cloneElement } from "react"
import { buttonVariants } from "./button"

const IconButton = ({ icon, isFilled = false, onClick }: { icon: JSX.Element, isFilled?: boolean, onClick: () => void }) => {

    return (
        <div
            className={
                buttonVariants({
                    size: "lg",
                    variant: "ghost",
                    className: "items-center justify-end self-start text-slate-700 dark:text-slate-400 cursor-pointer",
                })
            }
            onClick={onClick}>
            {cloneElement(icon, {
                className: `h-4 w-4 ${isFilled ? "fill-current" : ""}`,
            })}
        </div>
    )
}

export default IconButton