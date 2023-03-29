import { useTranslations } from "next-intl"
import { useRouter } from "next/router"

const Faq = () => {
    const t = useTranslations('faq')
    const { locale } = useRouter()

    return (
        <div className="flex max-w-4xl flex-col p-4 md:py-10">
            <h2 className="pb-4 text-2xl font-bold">{t('title', { locale })}</h2>
            <div className="flex flex-col gap-4 pl-2">
                {Array.from(Array(5).keys()).map((index) => (
                    <div className="flex flex-col gap-2" key={index}>
                        <h3 className="text-lg font-bold"
                            dangerouslySetInnerHTML={{ __html: t.raw(`q${index + 1}`) }}
                        />
                        <p className="pl-4 text-base text-gray-600 dark:text-gray-400"
                            dangerouslySetInnerHTML={{ __html: t.raw(`a${index + 1}`) }}
                            style={{ overflowWrap: "anywhere" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Faq
