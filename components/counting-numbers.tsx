import { RefObject, useEffect, useRef, useState } from 'react'

export default function CountingNumbers({
    value,
    className,
    start = 0,
    interval = 10,
    duration = 800,
}: {
    value: number,
    className: string,
    reverse?: boolean,
    start?: number,
    interval?: number,
    duration?: number,
}
) {
    const [number, setNumber] = useState(start)
    const increment = Math.max(1, Math.floor(Math.abs(start - value) / (duration / interval)))
    const [ref, isInView] = useIsInView()

    useEffect(() => {
        if (isInView) {
            const updateNumber = () => {
                setNumber(prev => {
                    const nextNumber = prev + increment
                    return (nextNumber >= value) ? value : nextNumber
                })
            }

            const timer = setInterval(() => {
                if (number === value) {
                    clearInterval(timer)
                } else {
                    updateNumber()
                }
            }, interval)

            return () => clearInterval(timer)
        }
    }, [increment, interval, isInView, number, value])

    return <p className={className} ref={ref}>{Intl.NumberFormat().format(number)}</p>
}


function useIsInView(): [RefObject<HTMLParagraphElement>, boolean] {
    const [isInView, setIsInView] = useState(false)
    const ref = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const currentRef = ref.current
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        )

        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [])

    return [ref, isInView]
}  
