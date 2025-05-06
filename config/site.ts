interface SiteConfig {
    url: string
    name: string
    description: string
    keywords: string
    mainNav: { title: string, href?: string }[]
    links: {
        discord: string
        github: string
    }
}

export const siteConfig: SiteConfig = {
    url: "https://zedzek.com",
    name: "Zədzək",
    description: "Zədzək is an online Circassian translator.",
    keywords: "Circassian, Adyghe, Kabardian, Cherkess, Circassian language, Adyghe language, Kabardian language, Cherkess language, Circassian translator, Adyghe translator, Kabardian translator, Cherkess translator, Circassian dictionary, Adyghe dictionary, Kabardian dictionary, Cherkess dictionary, Circassian words, Adyghe words, Kabardian words, Cherkess words, Circassian phrases, Adyghe phrases, Kabardian phrases, Cherkess phrases, Circassian sentences, Adyghe sentences, Kabardian sentences, Cherkess sentences, Circassian language translator, Adyghe language translator, Kabardian language translator, Cherkess language translator, Circassian language dictionary, Adyghe language dictionary, Kabardian language dictionary, Cherkess language dictionary, Circassian language words, Adyghe language words, Kabardian language words, Cherkess language words, Circassian language phrases, Adyghe language phrases, Kabardian language phrases, Cherkess language phrases, Circassian language sentences, Adyghe language sentences, Kabardian language sentences, Cherkess language sentences, Черкесский, Адыгейский, Кабардинский, Черкесский язык, Адыгейский язык, Кабардинский язык, Черкесский переводчик, Адыгейский переводчик, Кабардинский переводчик, Черкесский словарь, Адыгейский словарь, Кабардинский словарь, Черкесские слова, Адыгейские слова, Кабардинские слова, Черкесские фразы, Адыгейские фразы, Кабардинские фразы, Черкесские предложения, Адыгейские предложения, Кабардинские предложения, Черкесский язык переводчик, Адыгейский язык переводчик, Кабардинский язык переводчик, Черкесский язык словарь, Адыгейский язык словарь, Кабардинский язык словарь, Черкесский язык слова, Адыгейский язык слова, Кабардинский язык слова, Черкесский язык фразы, Адыгейский язык фразы, Кабардинский язык фразы, Черкесский язык предложения, Адыгейский язык предложения, Кабардинский язык предложения, Çerkesçe, Adığabze, Kabardeyçe, Çerkesçe dil, Adığabze dil, Kabardeyçe dil, Çerkesçe çevirmen, Adığabze çevirmen, Kabardeyçe çevirmen, Çerkesçe sözlük, Adığabze sözlük, Kabardeyçe sözlük, Çerkesçe kelimeler, Adığabze kelimeler, Kabardeyçe kelimeler, Çerkesçe cümleler, Adığabze cümleler, Kabardeyçe cümleler, Çerkesçe dil çevirmen, Adığabze dil çevirmen, Kabardeyçe dil çevirmen, Çerkesçe dil sözlük, Adığabze dil sözlük, Kabardeyçe dil sözlük, Çerkesçe dil kelimeler, Adığabze dil kelimeler, Kabardeyçe dil kelimeler, Çerkesçe dil cümleler, Adığabze dil cümleler, Kabardeyçe dil cümleler, Çerkesçe dil sözlüğü, Adığabze dil sözlüğü, Kabardeyçe dil sözlüğü, Çerkesçe dil kelimeleri, Adığabze dil kelimeleri, Kabardeyçe dil kelimeleri, Çerkesçe dil cümleleri, Adığabze dil cümleleri, Kabardeyçe dil cümleleri, Çerkesçe dil çevirmeni, Adığabze dil çevirmeni, Kabardeyçe dil çevirmeni, Çerkesçe dil sözlüğü, Adığabze dil sözlüğü, Kabardeyçe dil sözlüğü, Çerkesçe dil kelimeleri, Adığabze dil kelimeleri, Kabardeyçe dil kelimeleri, Çerkesçe dil cümleleri, Adığabze dil cümleleri, Kabardeyçe dil cümleleri",
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Contribute",
            href: "/contribute",
        },
    ],
    links: {
        discord: "https://discord.gg/ppmwTNUZQb",
        github: "https://github.com/qunash/zedzek",
    },
}