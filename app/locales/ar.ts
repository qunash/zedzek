export default {
    metadata: {
        "name": "Zədzək",
        "description": "مترجم تجريبي إلى الشركسية."
    },
    index: {
        "title": "الصفحة الرئيسية",
        "description": "Zədzək - مترجم تجريبي إلى الشركسية.",
        "header": "مترجم تجريبي للغة الشركسية",
        "profile": "ملف تعريف",
        "contribute": "مساهمة"
    },
    faq: {
        "title": "الأسئلة الشائعة",
        "q1": "ما هذا؟",
        "a1": "هذا عرض توضيحي لتطبيق مترجم روسي شركسي. إنه مدعوم من نموذج التعلم الآلي المدرب على أزواج الجمل الروسية الشركسية ويمكنه أيضًا إجراء ترجمات من أكثر من 100 لغة أخرى ، على الرغم من أن الدقة قد تختلف. الغرض من هذا العرض التوضيحي هو إظهار أن التطورات الحديثة في التعلم الآلي جعلت من الممكن إنشاء مترجم للغة الشركسية ودعوة المهتمين لمعرفة المزيد حول المساهمة في تطويرها.",
        "q2": "الترجمات خاطئة!",
        "a2": "هذه مجرد نسخة تجريبية من المترجم ، وليست المنتج النهائي. لا يُقصد استخدامها لأي شيء آخر غير أغراض الاختبار والتوضيح. تم تدريب النموذج الذي يعمل عليه على عدد صغير نسبيًا من أزواج الجمل (حوالي 44 كيلو بايت) ، بينما يعتبر الحد الأدنى الأمثل عادةً هو بمئات الآلاف أو أكثر. إذا كنت ترغب في المساعدة في تحسين أداء النموذج ، فيمكنك <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">الانضمام إلى الجهود لجمع المواد</a> لتحسين هو - هي.",
        "q3": "لماذا هي فقط لللهجة القباردية؟",
        "a3": "تم تدريب النموذج اللغوي على أزواج الجمل الروسية القباردية. ومع ذلك ، يمكن تكييفه بسهولة للترجمة إلى اللهجات الشركسية الأخرى في المستقبل مع بيانات تدريب إضافية كافية. التحدي الرئيسي هو جمع نص كافٍ في هذه اللهجات من أجل تدريب النموذج بشكل فعال. إذا كنت مهتمًا بالمساعدة في جمع المزيد من النصوص وتحسين أداء النموذج ، فنحن نرحب بك في <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">المساهمة</a>.",
        "q4": "التفاصيل الفنية",
        "a4": "يستخدم هذا العرض التوضيحي إصدارًا دقيقًا من طراز <a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">facebook/m2m100_418M</a>. تم ضبط النموذج بدقة في مجموعة البيانات \"ru-kbd\" ، والتي تتكون من حوالي 44 ألف جمل من الكتب والكتب المدرسية والقواميس وما إلى ذلك. حقق النموذج الدقيق درجة BLEU من 22.389 في مجموعة التقييم. يمكنك العثور على مزيد من المعلومات حول النموذج ومجموعة البيانات على الروابط التالية:<br><br>Base m2m100_418M Model: <a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/facebook/m2m100_418M</a><br>ru-kbd model: <a href=\"https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44K\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44K</a><br>Paper: <a href=\"https://arxiv.org/abs/2010.11125\" style=\"text-decoration: underline; color: inherit;\">https://arxiv.org/abs/2010.11125</a><br>Dataset: <a href=\"https://huggingface.co/datasets/anzorq/kbd-ru\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/datasets/anzorq/kbd-ru</a>",
        "q5": "<a href=\"#how-can-i-help\" id=\"how-can-i-help\" style=\"cursor: default;\">كيف يمكنني المساعدة؟</a>",
        "a5": "جودة الترجمات تتناسب طرديًا مع مقدار النص الذي يتم تدريب النموذج عليه. تم تدريب الإصدار الحالي من النموذج على أقل عدد ممكن من أزواج الجمل ، حوالي 44 كيلو بايت. من أجل تحقيق ترجمة جيدة النتائج ، هناك حاجة إلى المزيد من البيانات. يمكنك المساعدة في تحسين دقة الترجمة من خلال المساهمة في جمع المزيد من البيانات للتدريب. على سبيل المثال ، نص أحادي اللغة بأي لهجة شركسية أو نص ثنائي اللغة مثل كتاب مكتوب باللغة الشركسية ومترجم إلى لغة أخرى أو بالعكس ، وما إلى ذلك. يمكن أن يكون النص بنص عادي أو PDF أو روابط لصفحات الويب التي تحتوي على النص.يمكنك أيضًا المساعدة في مسح الكتب باللغة الشركسية و / أو تحويل المستندات الممسوحة ضوئيًا إلى نص (OCR). إذا كنت مهتمًا بالمشاركة في هذا المشروع ، انضم إلى خادم Discord الخاص بنا: <a href=\"https://discord.gg/ppmwTNUZQb\" style=\"text-decoration: underline; color: inherit;\">https://discord.gg/ppmwTNUZQb</a>"
    },
    translator: {
        "type_to_translate": "اكتب للترجمة…",
        "alternatives": ":ترجمات بديلة",
        "examples": "أمثلة",
    },
    buttons: {
        "submit": "إرسال",
        "sign_in": "تسجيل الدخول",
        "sign_out": "تسجيل الخروج",
        "retry": "Retry",
        "undo": "تراجع",
        "skip": "التخطّي",
        "correct": "صحيح",
        "incorrect": "غير صحيح",
        "keep_going": "استمر",
        "done": "تم",
    },
    contribute: {
        "tasks": "مهام",
        "validate_translations": "التحقّق من دقة الترجمات",
        "translate": "ترجمة كلمات وعبارات",
        "stats": "إحصائيات",
        "your_contributions": "مساهماتك",
        "contributions_by_all_users": "مساهماتك ومساهمات المنتدى",
        "is_this_translation_correct": "هل هذه الترجمة صحيحة؟",
        "thank_you_for_your_help": "شكرا لك على مساعدتك!",
        "no_more_translations": "لا يوجد المزيد من الترجمات في هذا الوقت. عد لاحقا!"
    },
    edit_translations: {
        "choose_correct_translations": "اختر الترجمات الصحيحة",
        "or_add_your_own": "أو أضف ما يخصك",
    }
} as const
