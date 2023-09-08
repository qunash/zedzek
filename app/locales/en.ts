export default {
    metadata: {
        "name": "Zədzək",
        "description": "Zədzək is a demo translator into Circassian language."
    },
    index: {
        "title": "Home",
        "header": "Circassian translator demo",
        "info": "This is a demo of a translator to the Circassian language. Translations can be incorrect. <a href=\"#faq\" style=\"text-decoration: underline; color: inherit;\">Learn more</a>",
        "profile": "Profile",
        "contribute": "Contribute",
        "language": "Language",
        "english": "English",
        "russian": "Русский",
        "arabic": "العربية",
        "turkish": "Türkçe",
    },
    faq: {
        "title": "<a href=\"#faq\" id=\"faq\" style=\"cursor: default;\">FAQ</a>",
        "q1": "What is this?",
        "a1": "This is a demo of a machine learning-powered Russian-Circassian translator. It's a proof of concept that aims to invite contributions for development.",
        "q2": "Translations are wrong!",
        "a2": "This is the first version of the model trained on only ~44 thousand sentence pairs. As the amount of training data increases, the accuracy of translations will only increase. To improve it, you can help by <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">contributing data</a>.",
        "q3": "Why is it only for Kabardian dialect?",
        "a3": "We started with Russian-Kabardian pairs due to data availability. With more data, we can easily extend it to other Circassian dialects. <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">Learn how to help</a>.",
        "q4": "Technical details",
        "a4": "This demo utilizes a version of the <b>facebook/m2m100_418M</b> model that's been fine-tuned on Russian-Kabardian translation pairs. It was trained on the <b>ru-kbd</b> dataset comprising ~44K sentence pairs. It achieved a BLEU score of 22.389 for its translation accuracy. More details are available at the following links: <a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">Base Model</a>, <a href=\"https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44K\" style=\"text-decoration: underline; color: inherit;\">Fine-tuned Model</a>, and <a href=\"https://arxiv.org/abs/2010.11125\" style=\"text-decoration: underline; color: inherit;\">Related Paper</a>.",
        "q5": "<a href=\"#how-can-i-help\" id=\"how-can-i-help\" style=\"cursor: default;\">How can I help?</a>",
        "a5": "More (good) data leads to better translations. You can help by contributing text in Circassian, scanning books, or helping with OCR. If you're interested in contributing, join our <a href=\"https://discord.gg/ppmwTNUZQb\" style=\"text-decoration: underline; color: inherit;\">Discord</a> or <a href=\"/contribute\" style=\"text-decoration: underline; color: inherit;\">validate translations</a>."
    },
    translator: {
        "type_to_translate": "Type to translate…",
        "alternatives": "Alternatives:",
        "examples": "Examples",
    },
    buttons: {
        "submit": "Submit",
        "sign_in": "Sign in",
        "sign_out": "Sign out",
        "retry": "Retry",
        "undo": "Undo",
        "skip": "Skip",
        "correct": "Correct",
        "incorrect": "Incorrect",
        "keep_going": "Keep going",
        "done": "Done"
    },
    contribute: {
        "tasks": "Tasks",
        "validate_translations": "Validate translations for accuracy",
        "translate": "Translate words and phrases",
        "stats": "Stats",
        "your_contributions": "Your contributions",
        "contributions_by_all_users": "Contributions by all users",
        "is_this_translation_correct": "Is this translation correct?",
        "thank_you_for_your_help": "Thank you for your help!",
        "no_more_translations": "No more translations at the moment. Come back later!",
        "translate_the_following_text": "Translate the following text:",
        "enter_translation": "Enter text translation…",
        "auto_translate": "Auto-translate (Alt+T)",
        "report_bad_sentences": "These sentences were automatically collected from a public database. Please report any inappropriate or incorrect sentences.",
    },
    edit_translations: {
        "choose_correct_translations": "Choose correct translations",
        "or_add_your_own": "Or add your own",
    }
} as const
