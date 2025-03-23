import { getI18nCLient } from "@/app/locales/client"

export default function Examples(
    { onExampleClick }: { onExampleClick: (example: string) => void }
) {

    const t = getI18nCLient()

    const examples = [
        ["Мы живем на родине"],
        ["Дети играют во дворе"],
        ["Луна вращается вокруг Земли"],
        ["We live in a big house"],
        ["Bugün güzel bir gün"],
        ["Tu es une bonne personne."],
        ["أين تعيش؟"],
        ["Πού ζεις;"],
        ["איפה אתה גר?"],
        ["– Если я его отпущу, то ты вовек не сможешь его поймать, – заявил Сосруко."],
        ["Как только старик ушел, Сатаней пошла к Саусырыко."],
        ["我永远不会放弃你。"],
        ["우리는 소치에 살고 있습니다."],
        ["あなたの名前は何ですか？"],
        ["Zij zijn goede mensen."],
        ["آنها افراد خوبی هستند"],
        ["El cielo es azul."],
        ["Eu gosto de aprender línguas!"],
        ["Das Leben ist schön."],
        ["Il mondo è un libro, e chi non viaggia legge solo una pagina"],
    ]


    return (
        <div className="mt-4 max-w-4xl rounded-lg p-4 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
            <h2 className="mb-2 text-xl font-semibold">
                {t("translator.examples")}
            </h2>
            <ul className="flex flex-wrap gap-2 text-slate-700 dark:text-slate-300">
                {examples.map((example, index) => (
                    <li
                        key={index}
                        className="cursor-pointer rounded-lg bg-white p-3 text-base shadow-sm transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:hover:text-slate-100"
                        onClick={() => onExampleClick(example[0])}
                    >
                        {example[0]}
                    </li>
                ))}
            </ul>
        </div>
    )
}
