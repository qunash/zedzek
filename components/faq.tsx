import { getI18nCLient } from "@/app/locales/client"
import { getI18nServer } from "@/app/locales/server"

export default async function Faq() {
    const t = await getI18nServer()

    const faqData = [
        { question: t("faq.q1"), answer: t("faq.a1") },
        { question: t("faq.q2"), answer: t("faq.a2") },
        { question: t("faq.q3"), answer: t("faq.a3") },
        { question: t("faq.q4"), answer: t("faq.a4") },
    ]

    return (
        <div className="flex max-w-4xl flex-col p-4 md:py-10">
            <h2 className="pb-4 text-2xl font-bold"
                dangerouslySetInnerHTML={{ __html: t("faq.title") }} />
            <div className="flex flex-col gap-4 pl-2">
                {faqData.map((faq, index) => (
                    <div className="flex flex-col gap-2" key={index}>
                        <h3 className="text-lg font-bold"
                            dangerouslySetInnerHTML={{ __html: faq.question }} />
                        <p
                            className="pl-4 text-base text-gray-600 dark:text-gray-400"
                            style={{ overflowWrap: "anywhere" }}
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                        ></p>
                    </div>
                ))}
            </div>
        </div>
    )
}
