import { getI18nCLient } from "@/app/locales/client"
import { TargetLanguage } from "./languageSelector"

export default function Examples(
    { onExampleClick }: { onExampleClick: (example: string, targetLanguage: TargetLanguage) => void }
) {

    const t = getI18nCLient()

    const examples = [
        // Foreign language to Circassian examples
        ["Мы живем на родине", "kbd"],
        ["Дети играют во дворе", "ady"],
        ["Луна вращается вокруг Земли", "kbd"],
        ["What is your name?", "ady"],
        ["Yarın okula gidiyoruz", "kbd"],
        ["Tu es une bonne personne.", "ady"],
        ["А ешӀэ-ешъом къыхэкӀыкӀэ унэшъо пытэ зэдашӀи, мэзиш пӀалъэу кӀалэм ратыгъ. Ащ нэс кӀалэм зпухьазырышъ, мэзищ зыхъукӀэ ежьэнышъ хыгъунэм кӀонэу, адрэхэри ащ къекӀолӀэнхэу. Хыр зыришъукӀэ ямылъкухэр къыратынхэу, зыримышъукӀэ кӀалэм имылъку аритынэу зээгъыхи зэбгъодэкӀыжьыгъэх.", "ru"],
        ["أين تعيش؟", "kbd"],
        ["Πού ζεις;", "ady"],
        ["שלום, מה שלומך?", "kbd"],
        ["– Если я его отпущу, то ты вовек не сможешь его поймать, – заявил Сосруко.", "ady"],
        ["Как только старик ушел, Сатаней пошла к Саусырыко.", "kbd"],
        ["我永远不会放弃你。", "ady"],
        ["Волк был страшно голоден и не собирался отступать. Он отправился к кузнецу и уговорил того наковать приятный, тонкий голос. Затем вернулся, постучал в дверь и сказал: — Козлятки, откройте дверь, ваша мама пришла, молочка принесла! Но волк положил свою большую, черную лапу на окно, а козлятки увидели это и закричали: — Мы не откроем дверь, ты не наша мама, ты — волк!", "kbd"],
        ["우리는 소치에 살고 있습니다.", "kbd"],
        ["あなたの名前は何ですか？", "ady"],
        ["Zij zijn goede mensen.", "kbd"],
        ["آنها افراد خوبی هستند", "ady"],
        ["El cielo es azul.", "kbd"],
        ["Жили-были три добрых друга. Один из них обзавелся семьей. Вечером двое его друзей пришли к нему в гости и за разговором один юноша обратился к другому: – Друг, раз наш третий друг женился, мы обязаны уделить внимание его супруге, а раз так, давай пойдем завтра в лес и принесем ей медвежью шкуру, чтобы, вставая с кровати, она могла ступить на мягкую подстилку.", "ady"],
        ["Eu gosto de aprender línguas!", "ady"],
        ["Das Leben ist schön.", "kbd"],
        ["Il mondo è un libro, e chi non viaggia legge solo una pagina.", "ady"],
        ["Нэмыс зиӀэм насып иӀэщ", "ru"],
        ["Гупсысэ къэгъэщIыгъэхэм щIэгъэхуэбжьауэ зэрызаужьым и щыхьэт наIуэщ иужьрей илъэсхэм технологиемрэ бжыгъэрылъанэ Iэмалхэмрэ шэщIауэ щIэныгъэ зэмылIэужьыгъуэхэм къызэрыщыхалъхьэр, абыхэм я фIыгъэкIэ къэхутэныгъэщIэхэр ирагъэкIуэкI зэрыхъур. Гу лъыботэ апхуэдэ Iэмалхэр халъхьэкIэрэ щIэныгъэхэм я зэпылъыпIэхэм щIэщыгъуэхэр къызэрыщIагъэщым, иджыри къыздэсым щхьэхуэ-щхьэхуэу къахута хъуахэм ящIыIужкIэ зыщымыгъуэза куэд къызэрызэIуахым.", "ru"],
    ] as [string, TargetLanguage][]


    return (
        <div className="mt-4 max-w-4xl rounded-lg p-4 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
            <h2 className="mb-2 text-xl font-semibold">
                {t("translator.examples")}
            </h2>
            <ul className="flex flex-wrap gap-2 text-slate-700 dark:text-slate-300">
                {examples.map((example, index) => (
                    <li
                        key={index}
                        className="group relative cursor-pointer rounded-lg bg-white p-3 text-base shadow-sm transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:hover:text-slate-100"
                        onClick={() => onExampleClick(example[0], example[1])}
                        title={example[0].length > 75 ? example[0] : ""}
                    >
                        {example[0].length > 75 ? (
                            <>
                                {example[0].slice(0, 75)}...
                                <div className="absolute inset-x-0 bottom-0 h-1/2 w-full rounded-b-lg bg-gradient-to-t from-white to-transparent dark:from-zinc-800"></div>
                            </>
                        ) : (
                            example[0]
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
