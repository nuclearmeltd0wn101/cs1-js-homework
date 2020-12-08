
const frequencies_en = { // частоты символов русского и английского алфавитов
    'a': 0.0817, 'b': 0.0149, 'c': 0.0278, 'd': 0.0425, 'e': 0.127, 'f': 0.0223,
    'g': 0.0202, 'h': 0.0609, 'i': 0.0697, 'j': 0.0015, 'k': 0.0077, 'l': 0.0403,
    'm': 0.0241, 'n': 0.0675, 'o': 0.0751, 'p': 0.0193, 'q': 0.001, 'r': 0.0599,
    's': 0.0633, 't': 0.0906, 'u': 0.0276, 'v': 0.0098, 'w': 0.0236, 'x': 0.0015,
    'y': 0.0197, 'z': 0.0005
};
const frequencies_ru = {
    'а': 0.0801, 'б': 0.0159, 'в': 0.0454, 'г': 0.0170, 'д': 0.0298, 'е': 0.0845,
    'ё': 0.0004, 'ж': 0.0094, 'з': 0.0165, 'и': 0.0735, 'й': 0.0121, 'к': 0.0349,
    'л': 0.044, 'м': 0.0321, 'н': 0.067, 'о': 0.1097, 'п': 0.0281, 'р': 0.0473,
    'с': 0.0547, 'т': 0.0626, 'у': 0.0262, 'ф': 0.0026, 'х': 0.0097, 'ц': 0.0048,
    'ч': 0.0144, 'ш': 0.0073, 'щ': 0.0036, 'ъ': 0.0004, 'ы': 0.019, 'ь': 0.0174,
    'э': 0.0032, 'ю': 0.0064, 'я': 0.0201
};

function caesar_decrypt(frequencies, text)
{
    let letters = Object.keys(frequencies);
    let textLettersCount = 0;
    let textFrequencies = {};
    let letter;

    letters.forEach((letter => textFrequencies[letter] = 0));
    for (let i = 0; i < text.length; i++)
    {
        letter = text[i].toLowerCase();
        if (letters.includes(letter))
        {
            textLettersCount++;
            textFrequencies[letter]++;
        }
    }
    letters.forEach((letter) => textFrequencies[letter] /= textLettersCount );

    let minValue = Number.POSITIVE_INFINITY;
    let shift = 0;
    let functionalResult;
    for (let i = 0; i < letters.length; i++)
    {
        functionalResult = 0;
        for (let j = 0; j < letters.length; j++)
            functionalResult += Math.abs(frequencies[letters[j]]
                - textFrequencies[letters[(j + i) % letters.length]]);
        if (functionalResult < minValue)
        {
            minValue = functionalResult;
            shift = i;
        }
    }

    console.log('the most probable shift is '+shift);

    let result = "";
    for (let i = 0; i < text.length; i++)
        if (letters.includes(text[i].toLowerCase()))
            result += letters[ (letters.indexOf(text[i].toLowerCase()) + letters.length - shift) % letters.length];
        else
            result += text[i];
    return result;
}


console.log(caesar_decrypt(frequencies_ru, `Эрьхюмыяэд влюд ыюпшп Рюфбхп слья вхэм ьхг. Яю хфтр дэхь зщгргм, юя ющзхуя юх шюрь. Яю эюяуях ахбхчщь аявьх нгяуя фюп, абщясбхгрп шюрющп, юрсьофргхьмюявгм, яалгюявгм; юя хчхьщ сл яю тьрфхь гяуфр твхэщ нгщэщ аявьх абщясбхгхююлэщ ваявясюявгпэщ, яю юх эяу сл ьдзих, уьдсчх аяюпгм твх шюрзхющх гяъ вжхюл, ыягябдо яю тщфхь эхчфд ягжяэ, ыюпчюяъ Эрбмхъ щ Юргрихъ, зхэ яю хх аяюпь гхахбм. Яю твх аяюпь щ, юх аьрзр, тлихь щш ыяэюргл, эяьзр аяфяихь ы Юргрих, тлихфихъ шр ющэ, шрвгхюзщтя тшуьпюдь юр юхх шрфдэзщтлэщ абхыбрвюлэщ уьршрэщ; абщаяфюпгрп бдэпюрп тхбёюпп удср хуя фбяуюдьр, яю абщвьяющьвп ы юхъ уяьятяъ щ шраьрырь.`));