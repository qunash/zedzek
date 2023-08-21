export default {
    metadata: {
        "name": "Zədzək",
        "description": "Zədzək - Çerkes diline demo çevirmen."
    },
    index: {
        "title": "Ana Sayfa",
        "description": "Zədzək - Çerkes diline demo çevirmen.",
        "header": "Çerkesçe çevirmen demosu",
        "profile": "Profil",
        "contribute": "Katkıda bulun"
    },
    faq: {
        "title": "Sıkça Sorulan Sorular",
        "q1": "Bu nedir?",
        "a1": "Bu, Rusça-Çerkesçe çevirmen uygulamasının bir demosudur. Rusça-Çerkes cümle çiftleri üzerine eğitilmiş bir makine öğrenimi modeli tarafından desteklenmektedir ve doğruluk farklılık gösterse de 100'den fazla başka dilden çeviri de yapabilir. Bu demonun amacı, makine öğrenimindeki son gelişmelerin Çerkes dili için bir çevirmen oluşturmayı mümkün kıldığını göstermek ve ilgilenenleri gelişimine katkıda bulunma konusunda daha fazla bilgi edinmeye davet etmektir.",
        "q2": "Çeviriler yanlış!",
        "a2": "Bu, nihai ürün değil, çevirmenin yalnızca bir demo sürümüdür. Test ve gösterim amaçları dışında kullanılmak üzere tasarlanmamıştır. Üzerinde çalıştığı model, nispeten az sayıda cümle çifti (~ 44K) üzerinde eğitilirken, optimal bir minimum genellikle yüzbinlerce veya daha fazla olarak kabul edilir. Modelin performansını iyileştirmeye yardımcı olmak istiyorsanız, <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">geliştirmek için malzeme toplama çabasına</a> katılabilirsiniz.",
        "q3": "Neden sadece Kabardey lehçesi için?",
        "a3": "Dil modeli Rus-Kabardey cümle çiftleri üzerinde eğitildi. Bununla birlikte, yeterli ek eğitim verisi ile gelecekte diğer Çerkes lehçelerine çevrilmek üzere kolayca uyarlanabilir. Asıl zorluk, modeli etkili bir şekilde eğitmek için bu lehçelerde yeterli metin toplamaktır. Daha fazla metin toplamaya ve modelin performansını iyileştirmeye yardımcı olmakla ilgileniyorsanız, <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">katkıda bulunabilirsiniz</a>.",
        "q4": "Teknik ayrıntılar",
        "a4": "Bu demo, <a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">facebook/m2m100_418M</a> modelinin ince ayarlı bir sürümünü kullanıyor. Modelin ince ayarı yapıldı kitaplardan, ders kitaplarından, sözlüklerden vb. ~44 bin cümleden oluşan \"ru-kbd\" veri setinde İnce ayarlı model değerlendirme setinde 22.389 BLEU puanı elde etti. Model hakkında daha fazla bilgi bulabilirsiniz. ve aşağıdaki bağlantılardaki veri kümesi:<br><br>Temel m2m100_418M Model: <a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/facebook/m2m100_418M</a><br>ru-kbd model: <a href=\"https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44K\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44K</a><br>Araştırma Makalesi: <a href=\"https://arxiv.org/abs/2010.11125\" style=\"text-decoration: underline; color: inherit;\">https://arxiv.org/abs/2010.11125</a><br>Veri Kümesi: <a href=\"https://huggingface.co/datasets/anzorq/kbd-ru\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/datasets/anzorq/kbd-ru</a>",
        "q5": "<a href=\"#how-can-i-help\" id=\"how-can-i-help\" style=\"cursor: default;\">Nasıl yardımcı olabilirim?</a>",
        "a5": "Çevirilerin kalitesi, modelin eğitildiği metin miktarıyla doğru orantılıdır. Modelin mevcut versiyonu çok az sayıda cümle çifti üzerinde eğitildi, ~ 44K. İyi çeviri sonuçları elde etmek için çok daha fazla veriye ihtiyaç var. Eğitim için daha fazla veri toplamaya katkıda bulunarak çeviri doğruluğunu artırmaya yardımcı olabilirsiniz. Örneğin, herhangi bir Çerkes lehçesinde tek dilli bir metin veya Çerkes dilinde yazılmış ve başka bir dile çevrilmiş veya tam tersi bir kitap gibi iki dilli bir metin vb. Metin düz metin, PDF veya metni içeren web sayfalarına bağlantılar olabilir. Ayrıca Çerkes dilinde kitap tarama ve/veya taranan belgeleri metne dönüştürme (OCR) konusunda da yardımcı olabilirsiniz. Bu projeye katılmakla ilgileniyorsanız Discord sunucumuza katılın: <a href=\"https://discord.gg/ppmwTNUZQb\" style=\"text-decoration: underline; color: inherit;\">https://discord.gg/ppmwTNUZQb</a>"
    },
    translator: {
        "type_to_translate": "Çevirmek için yazın…",
        "alternatives": "Çeviri seçenekleri:",
        "examples": "Örnekler",
    },
    buttons: {
        "submit": "Gönder",
        "sign_in": "Giriş yap",
        "sign_out": "Çıkış yap",
        "retry": "Tekrar dene",
        "undo": "Geri al",
        "skip": "Atla",
        "correct": "Doğru",
        "incorrect": "Yanlış",
        "keep_going": "Devam et",
        "done": "Bitti",
    },
    contribute: {
        "tasks": "Görevler",
        "validate_translations": "Çevirinin doğruluğunu onaylayın",
        "translate": "Sözcükleri ve ifadeleri çevirin",
        "stats": "İstatistikler",
        "your_contributions": "Katkılarınız",
        "contributions_by_all_users": "Sizin ve topluluğunuzun yaptığı katkılar",
        "is_this_translation_correct": "Bu çeviri doğru mu?",
        "thank_you_for_your_help": "Yardımınız için teşekkür ederiz!",
        "no_more_translations": "Şu anda daha fazla çeviri yok. Daha sonra tekrar gelin!"
    },
    edit_translations: {
        "choose_correct_translations": "Doğru çevirileri seçin",
        "or_add_your_own": "Veya kendi çevirinizi ekleyin",
    }
} as const