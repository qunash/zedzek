export default {
    metadata: {
        "name": "Zədzək",
        "description": "Демо переводчик на черкесский язык. Русско-черкесский переводчик. Кабардинский переводчик. Русско-кабардинский переводчик."
    },
    index: {
        "title": "Главная",
        "description": "Zədzək – демо переводчик на черкесский язык.",
        "header": "Демо переводчик на черкесский язык",
        "info": "Это демо-версия переводчика на черкесский язык. Переводы могут быть неправильными. <a href=\"#faq\" style=\"text-decoration: underline; color: inherit;\">Узнать больше</a>",
        "profile": "Профиль",
        "contribute": "Участвовать"
    },
    faq: {
        "title": "<a href=\"#faq\" id=\"faq\" style=\"cursor: default;\">Часто задаваемые вопросы</a>",
        "q1": "Что это?",
        "a1": "Это демо-версия русско-черкесского переводчика. Он работает на основе модели машинного обучения, обученной на русско-черкесских парах предложений, а также может выполнять переводы с более чем 100 других языков, хотя точность может варьироваться. Цель этого демо - показать, что благодаря последним достижениям в области машинного обучения стало возможным создание переводчика для черкесского языка, и привлечь всех желающих принять участие в его разработке.",
        "q2": "Переводы неправильные!",
        "a2": "Эта первая версия модели, обученная всего на ~44 тыс. пар предложений. По мере увеличения объема данных для обучения точность переводов будет только расти. Если вы хотите помочь улучшить точность модели, вы можете <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">присоединиться к работе по сбору материала</a> для ее улучшения.",
        "q3": "Почему переводчик только на кабардинском диалекте?",
        "a3": "Языковая модель была обучена на русско-кабардинских парах предложений из-за доступности данных. Она может быть легко адаптирована для перевода на другие черкесские диалекты при наличии достаточного количества данных для обучения. Основной задачей является сбор достаточного количества текстов на этих диалектах для эффективного обучения модели. Если вы заинтересованы в том, чтобы помочь собрать больше текста и улучшить точность модели, вы можете <a href=\"#how-can-i-help\" style=\"text-decoration: underline; color: inherit;\">присоединиться к работе по сбору материала</a>.",
        "q4": "Технические детали",
        "a4": "В этом демо используется доработанная (fine-tuned) версия модели <a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">facebook/m2m100_418M</a>. Модель была обучена на наборе данных \"ru-kbd\", который состоит из ~44 тыс. предложений, собранных из книг, учебников, словарей и т.д. Доработанная модель достигла оценки BLEU в 22.389 баллов. Более подробную информацию о модели и наборе данных можно найти по следующим ссылкам:<br><br>Базовая модель m2m100_418M:<br><a href=\"https://huggingface.co/facebook/m2m100_418M\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/facebook/m2m100_418M</a><br>Модель ru-kbd: <a href=\"https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44 тыс.\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44 тыс.</a><br>Научная статья: <a href=\"https://arxiv.org/abs/2010.11125\" style=\"text-decoration: underline; color: inherit;\">https://arxiv.org/abs/2010.11125</a><br>Набор данных: <a href=\"https://huggingface.co/datasets/anzorq/kbd-ru\" style=\"text-decoration: underline; color: inherit;\">https://huggingface.co/datasets/anzorq/kbd-ru</a><br><br><b>Синтез речи</b><br>Для синтеза речи используется доработанная (fine-tuned) <a href=\"https://huggingface.co/anzorq/kbd-vits-tts-male\" style=\"text-decoration: underline; color: inherit;\">версия</a> модели <a href=\"https://github.com/jaywalnut310/vits\" style=\"text-decoration: underline; color: inherit;\">VITS</a>, обученная на <a href=\"https://huggingface.co/datasets/anzorq/kbd_speech\" style=\"text-decoration: underline; color: inherit;\">~16 тысячах коротких текстов</a>, озвученных носителем языка.",
        "q5": "<a href=\"#how-can-i-help\" id=\"how-can-i-help\" style=\"cursor: default;\">Как я могу помочь?</a>",
        "a5": "<b>Короткий ответ:</b> присоединяйтесь к нашему <a href=\"https://discord.gg/ppmwTNUZQb\" style=\"text-decoration: underline; color: inherit;\">Discord-серверу</a> или <a href=\"/contribute\" style=\"text-decoration: underline; color: inherit;\">помогите в оценке существующих переводов</a>.<br><br><b>Развернутый ответ:</b> Качество переводов прямо пропорционально количеству текста, на котором обучена модель. Текущая версия модели была обучена на минимальном количестве пар предложений - ~44 тыс. Для достижения хороших результатов перевода требуется гораздо больше данных. Вы можете помочь повысить точность перевода, помогая собирать больше данных для обучения. Например, одноязычный текст на любом черкесском диалекте или двуязычный текст, например, книга, написанная на черкесском языке и переведенная на другой язык или наоборот, и т.д. Текст может быть в виде обычного текста, PDF или ссылок на веб-страницы, содержащие текст. Вы также можете помочь со сканированием книг на черкесском языке и/или преобразованием отсканированных документов в текст (OCR). Если вы заинтересованы в участии в этом проекте, присоединяйтесь к нашему <a href=\"https://discord.gg/ppmwTNUZQb\" style=\"text-decoration: underline; color: inherit;\">Discord-серверу</a> или <a href=\"/contribute\" style=\"text-decoration: underline; color: inherit;\">помогите в оценке существующих переводов</a>."
    },
    translator: {
        "type_to_translate": "Введите текст для перевода…",
        "alternatives": "Варианты перевода:",
        "examples": "Примеры",
    },
    buttons: {
        "submit": "Отправить",
        "sign_in": "Войти",
        "sign_out": "Выйти",
        "retry": "Попробовать еще раз",
        "undo": "Вернуться",
        "skip": "Пропустить",
        "correct": "Правильно",
        "incorrect": "Неправильно",
        "keep_going": "Продолжить",
        "done": "Закончить"
    },
    contribute: {
        "tasks": "Задания",
        "validate_translations": "Проверка точности переводов",
        "translate": "Перевод слов и фраз",
        "stats": "Статистика",
        "your_contributions": "Ваш вклад",
        "contributions_by_all_users": "Вклад всех пользователей",
        "is_this_translation_correct": "Правильный ли это перевод?",
        "thank_you_for_your_help": "Спасибо за помощь!",
        "no_more_translations": "На данный момент переводов больше нет. Возвращайтесь позже!",
        "translate_the_following_text": "Переведите следующий текст:",
        "enter_translation": "Введите перевод текста…",
        "auto_translate": "Перевести автоматически (Alt+T)",
        "report_bad_sentences": "Предложения для перевода автоматически загружены из публичной базы данных. Пожалуйста, сообщайте о любых неуместных или неправильных предложениях.",
    },
    edit_translations: {
        "choose_correct_translations": "Выберите правильные переводы",
        "or_add_your_own": "Или добавьте свой",
    }
} as const
