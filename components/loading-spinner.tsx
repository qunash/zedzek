import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    className,
}) => (
    <div className={cn("flex h-full items-center justify-center", className)}>
        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
    </div>
)
