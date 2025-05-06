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
    keywords: "circassian, adyghe, kabardian, cherkess, circassian language, adyghe language, kabardian language, cherkess language, circassian translator, adyghe translator, kabardian translator, cherkess translator, circassian dictionary, adyghe dictionary, kabardian dictionary, cherkess dictionary, circassian words, adyghe words, kabardian words, cherkess words, circassian phrases, adyghe phrases, kabardian phrases, cherkess phrases, circassian sentences, adyghe sentences, kabardian sentences, cherkess sentences, circassian language translator, adyghe language translator, kabardian language translator, cherkess language translator, circassian language dictionary, adyghe language dictionary, kabardian language dictionary, cherkess language dictionary, circassian language words, adyghe language words, kabardian language words, cherkess language words, circassian language phrases, adyghe language phrases, kabardian language phrases, cherkess language phrases, circassian language sentences, adyghe language sentences, kabardian language sentences, cherkess language sentences, черкесский, адыгейский, кабардинский, черкесский язык, адыгейский язык, кабардинский язык, черкесский переводчик, адыгейский переводчик, русско-адыгейский переводчик, адыгейско-русский переводчик, переводчик на адыгейский, перевести на адыгейский, перевести с адыгейского, кабардинский переводчик, русско-кабардинский переводчик, кабардино-русский переводчик, переводчик на кабардинский, перевести на кабардинский, перевести с кабардинского, черкесский словарь, адыгейский словарь, кабардинский словарь, черкесские слова, адыгейские слова, кабардинские слова, черкесские фразы, адыгейские фразы, кабардинские фразы, черкесские предложения, адыгейские предложения, кабардинские предложения, черкесский язык переводчик, адыгейский язык переводчик, кабардинский язык переводчик, черкесский язык словарь, адыгейский язык словарь, кабардинский язык словарь, черкесский язык слова, адыгейский язык слова, кабардинский язык слова, черкесский язык фразы, адыгейский язык фразы, кабардинский язык фразы, черкесский язык предложения, адыгейский язык предложения, кабардинский язык предложения, çerkesçe, adığabze, kabardeyçe, çerkesçe dil, adığabze dil, kabardeyçe dil, çerkesçe çevirmen, adığabze çevirmen, kabardeyçe çevirmen, çerkesçe sözlük, adığabze sözlük, kabardeyçe sözlük, çerkesçe kelimeler, adığabze kelimeler, kabardeyçe kelimeler, çerkesçe cümleler, adığabze cümleler, kabardeyçe cümleler, çerkesçe dil çevirmen, adığabze dil çevirmen, kabardeyçe dil çevirmen, çerkesçe dil sözlük, adığabze dil sözlük, kabardeyçe dil sözlük, çerkesçe dil kelimeler, adığabze dil kelimeler, kabardeyçe dil kelimeler, çerkesçe dil cümleler, adığabze dil cümleler, kabardeyçe dil cümleler, çerkesçe dil sözlüğü, adığabze dil sözlüğü, kabardeyçe dil sözlüğü, çerkesçe dil kelimeleri, adığabze dil kelimeleri, kabardeyçe dil kelimeleri, çerkesçe dil cümleleri, adığabze dil cümleleri, kabardeyçe dil cümleleri, çerkesçe dil çevirmeni, adığabze dil çevirmeni, kabardeyçe dil çevirmeni, çerkesçe dil sözlüğü, adığabze dil sözlüğü, kabardeyçe dil sözlüğü, çerkesçe dil kelimeleri, adığabze dil kelimeleri, kabardeyçe dil kelimeleri, çerkesçe dil cümleleri, adığabze dil cümleleri, kabardeyçe dil cümleleri",
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