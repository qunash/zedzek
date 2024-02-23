const instructions = [
    {
        instruction:
            "Когда у слова/предложения несколько вариантов перевода, разбиваем их на отдельные строки.",
        examples: [
            {
                original:
                    "исключить😀къыхэдзын, къыхэгъэкIын, къыщIэхун, къыщIэгъэкIын",
                split: [
                    "исключить😀къыхэдзын",
                    "исключить😀къыхэгъэкIын",
                    "исключить😀къыщIэхун",
                    "исключить😀къыщIэгъэкIын",
                ],
            },
            {
                original: "подобрать волосы😀щхьэцыр зэщIэкъуэн, зэхуэхьэсын",
                split: [
                    "подобрать волосы😀щхьэцыр зэщIэкъуэн",
                    "подобрать волосы😀щхьэцыр зэхуэхьэсын",
                ],
            },
            {
                original: "подработать отчет😀отчетым хэплъэжын, гъэхьэзырыжын",
                split: [
                    "подработать отчет😀отчетым хэплъэжын",
                    "подработать отчет😀отчетыр гъэхьэзырыжын",
                ],
            },
        ],
    },
    {
        instruction:
            "Если в преводе есть необязательные части или альтернативные варианты, указанные в скобках, разбиваем строку на все возможные варианты.",
        examples: [
            {
                original: "пододвинуть😀(хуэ)гъэкІуэтэн",
                split: [
                    "пододвинуть😀гъэкІуэтэн",
                    "пододвинуть😀хуэгъэкІуэтэн",
                ],
            },
            {
                original:
                    "тесто должно подойти😀тхьэвыр (хупцІынэр) (къэ)тэджын хуейщ",
                split: [
                    "тесто должно подойти😀тхьэвыр тэджын хуейщ",
                    "тесто должно подойти😀тхьэвыр къэтэджын хуейщ",
                    "тесто должно подойти😀хупцІынэр тэджын хуейщ",
                    "тесто должно подойти😀хупцІынэр къэтэджын хуейщ",
                ],
            },
        ],
    },
    {
        instruction:
            "Если в исходном слове/предложении указаны синонимы (через запятую или в скобках), разбиваем строку на все возможные варианты.",
        examples: [
            {
                original: "подбить (прибить снизу)😀кIэщIэIулIэн",
                split: ["подбить😀кIэщIэIулIэн", "прибить снизу😀кIэщIэIулIэн"],
            },
            {
                original: "подплыть, пристать😀къыIухьэн",
                split: ["подплыть😀къыIухьэн", "пристать😀къыIухьэн"],
            },
            {
                original: "часть, раздел (чего-нибудь)😀Iыхьэ",
                split: [
                    "часть😀Iыхьэ",
                    "часть чего-нибудь😀зыгуэрым и Iыхьэ",
                    "раздел😀Iыхьэ",
                    "раздел чего-нибудь😀зыгуэрым и Iыхьэ",
                ],
            },
        ],
    },
    {
        instruction:
            "Если в переводе есть определение/толкование в скобках, переносим его на новую строку.",
        examples: [
            {
                original:
                    "наука😀щIэныгъэ (щIэныгъэ системэ, апхуэдэу абы и унэтIыныгъэ щхьэхуэ)",
                split: [
                    "наука😀щIэныгъэ",
                    "щIэныгъэ системэ, апхуэдэу абы и унэтIыныгъэ щхьэхуэ",
                ],
            },
        ],
    },
]

interface ExampleProps {
    original: string
    split: string[]
}

function Example({ original, split }: ExampleProps) {
    return (
        <div className="border p-2">
            <p>{original}</p>
            <p>⬇️</p>
            {split.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    )
}

export default function TranslationInstructions() {
    return (
        <div className="w-full scroll-m-20 px-4 md:w-2/3">
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-5xl">
                Инструкция по вычитке
            </h1>
            <p className="text-base leading-7 lg:text-2xl [&:not(:first-child)]:mt-6">
                Задача состоит <b>не в переводе текста</b>, а в вычитке -
                проверке его на наличие опечаток, лишних символов, на
                соответствие текста переводу. Главное правило - одна строка -
                один перевод.
            </p>
            <div className="my-6 w-full overflow-y-auto">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="m-0 border-t p-0 even:bg-muted">
                            <th className="w-1/3 border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                Инструкция
                            </th>
                            <th className="w-2/3 border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                Примеры
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {instructions.map((item, index) => (
                            <tr
                                key={index}
                                className="m-0 border-t p-0 even:bg-muted"
                            >
                                <td className="border px-4 py-8 align-top text-sm lg:text-base">
                                    {item.instruction}
                                </td>
                                <td className="border p-1 text-sm lg:p-2 lg:text-base">
                                    {item.examples.map(
                                        (example, exampleIndex) => (
                                            <Example
                                                key={exampleIndex}
                                                {...example}
                                            />
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
