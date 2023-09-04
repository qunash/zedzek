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
        "contribute": "Contribute"
    },
    faq: {
        "title": "<a href=\"#faq\" id=\"faq\" style=\"cursor: default;\">FAQ</a>",
        "q1": "What is this?",
        "a1": "This is a demo of a Russian-Circassian translator app. It is powered by a machine learning model trained on Russian-Circassian sentence pairs and can also perform translations from over 100 other languages, though accuracy may vary. The purpose of this demo is to show that recent advances in machine learning have made it possible to create a translator for the Circassian language and to invite those interested to learn more about contributing to its development.",
        "q2": "Translations are wrong!",
        "a2": "This is just a demo version of the translator, not the final product. It is not intended to be used for anything other than testing and demonstration purposes. The model it runs on has been trained on a relatively small number of sentence pairs (~44K), whereas an optimal minimum is usually considered to be in the hundreds of thousands or more. If you would like to help improve the model's performance, you can <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">join the effort to gather material</a> to improve it.",
        "q3": "Why is it only for Kabardian dialect?",
        "a3": "The language model was trained on Russian-Kabardian sentence pairs. However, it could easily be adapted to translate to other Circassian dialects in the future with enough additional training data. The main challenge is collecting enough text in these dialects to train the model effectively. If you're interested in helping to collect more text and improve the model's performance, you're welcome to <a href=\"#how-can-i-help\">contribute</a>.",
        "q4": "Techincal details",
        "a4": "This demo uses a fine-tuned version of the <a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">facebook/m2m100_418M</a> model. The model was fine-tuned on the \"ru-kbd\" dataset, which consists of ~44K sentences from books, textbooks, dictionaries, etc. The fine-tuned model achieved a BLEU score of 22.389 on the evaluation set. You can find more information about the model and the dataset at the following links:<br><br>Base m2m100_418M model: <a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/facebook/m2m100_418M</a><br>ru-kbd model: <a href=\"https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44K\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44K</a><br>Paper: <a href=\"https://arxiv.org/abs/2010.11125\" style=\"text-decoration: underline; color: inherit;\">https://arxiv.org/abs/2010.11125</a><br>Dataset: <a href=\"https://huggingface.co/datasets/anzorq/kbd-ru\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/datasets/anzorq/kbd-ru</a>",
        "q5": "<a href=\"#how-can-i-help\" id=\"how-can-i-help\" style=\"cursor: default;\">How can I help?</a>",
        "a5": "<b>Short answer:</b> join our <a href=\"https://discord.gg/ppmwTNUZQb\" style=\"text-decoration: underline; color: inherit;\">Discord server</a> or <a href=\"/contribute\" style=\"text-decoration: underline; color: inherit;\">help validate existing translations</a>.<br><br><b>Long answer:</b> The quality of translations is directly proportional to the amount of text on which the model is trained. The current version of the model was trained on a very minimal number of sentence pairs, ~44K. In order to achieve good translation results, much more data is needed. You can help improve translation accuracy by contributing to collecting more data for training. For example, a monolingual text in any Circassian dialect or a bilingual text such as a book written in Circassian and translated into another language or vice versa, etc. The text can be in plain text, PDF or links to web pages containing the text. You can also help with scanning books in Circassian and/or converting scanned documents into text (OCR). If you are interested in participating in this project, join our <a href=\"https://discord.gg/ppmwTNUZQb\" style=\"text-decoration: underline; color: inherit;\">Discord server</a> or <a href=\"/contribute\" style=\"text-decoration: underline; color: inherit;\">help validate existing translations</a>."
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
