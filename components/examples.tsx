export default function Examples(
    { onExampleClick }: { onExampleClick: (example: string) => void }
) {

    const examples = [
        ["Мы идем домой"],
        ["Сегодня хорошая погода"],
        ["Дети играют во дворе"],
        ["We live in a big house"],
        ["Tu es une bonne personne."],
        ["أين تعيش؟"],
        ["Πού ζεις;"],
        ["איפה אתה גר?"],
        ["Bir şeyler yapmak istiyorum."],
        ["– Если я его отпущу, то ты вовек не сможешь его поймать, – заявил Сосруко."],
        ["Как только старик ушел, Сатаней пошла к Саусырыко."],
        ["我永远不会放弃你。"],
        ["우리는 소치에 살고 있습니다."],
        ["あなたの名前は何ですか？"],
    ]


    return (
        <div className="mt-4 max-w-4xl rounded-lg p-4">
            <h2 className="mb-2 text-xl font-semibold">
                {/* {t("examples", { locale })}: */}
                Examples:
            </h2>
            <ul className="flex flex-wrap gap-2 text-slate-700 dark:text-slate-400">
                {examples.map((example, index) => (
                    <li
                        key={index}
                        className="cursor-pointer rounded-lg bg-gray-100 p-3 text-base transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-slate-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-slate-100"
                        onClick={() => onExampleClick(example[0])}
                    >
                        {example[0]}
                    </li>
                ))}
            </ul>
        </div>
    )
}