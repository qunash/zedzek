# Zədzək – Russian-Circassian Translator Demo

This is a demo of a Russian-Circassian translator app, which uses a machine learning model trained on Russian-Circassian sentence pairs. It is capable of translating from over 100 other languages, but accuracy may vary.

## Features

- Translates Russian to Kabardian dialect of Circassian
- Can translate from over 100 other languages with varying accuracy
- Uses a fine-tuned version of the [facebook/m2m100_418M](https://huggingface.co/facebook/m2m100_418M) model

## Techincal Details

The demo uses a fine-tuned version of the `facebook/m2m100_418M` model, which has been trained on the "ru-kbd" dataset, consisting of ~44K sentences from various sources. More information about the model and dataset can be found in the following links:

- Base m2m100_418M Model: https://huggingface.co/facebook/m2m100_418M
- ru-kbd model: https://huggingface.co/anzorq/m2m100_418M_ft_ru-kbd_44K
- Paper: https://arxiv.org/abs/2010.11125
- Dataset: https://huggingface.co/datasets/anzorq/kbd-ru

## How to Help

The quality of translations depends on the amount of training data. Currently, the model has been trained on ~44K sentence pairs. To improve translation accuracy, more training data is needed. You can help by collecting monolingual or bilingual text in any Circassian dialect. Contributions can be in the form of plain text, PDFs, or links to web pages containing the text.

To contribute, join our Discord server: https://discord.gg/ppmwTNUZQb

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).
