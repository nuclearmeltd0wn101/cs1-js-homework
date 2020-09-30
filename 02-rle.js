let fs = require('fs');
const { argv } = require('process');
let arg = process.argv;

const rle_escapeSymbol_code  = 35;  // #
const rle_counterLimit       = 127; // ASCII compat restriction
const rle_jump_SequenceLimit = 127;

function rle_escape_encode(inputStr)
{
    escapeSym = String.fromCharCode(rle_escapeSymbol_code)

    function makeEscSeq(symbol, repeats)
    {
        return escapeSym + String.fromCharCode(repeats) + symbol;
    }

    let strIndexPos = 0;
    let resultStr = '';
    while (strIndexPos < inputStr.length)
    {
        let repeats = 1;
        while (inputStr.charAt(strIndexPos) == inputStr.charAt(strIndexPos+repeats))
            repeats++;

        console.log(inputStr.charAt(strIndexPos)," - ", repeats);

        let posJump = repeats;
        while (repeats >= rle_counterLimit)
        {
            resultStr += makeEscSeq(inputStr.charAt(strIndexPos), rle_counterLimit);
            repeats -= rle_counterLimit;
        }

        if ((repeats > 3) || (inputStr.charCodeAt(strIndexPos) == rle_escapeSymbol_code))
            resultStr += makeEscSeq(inputStr.charAt(strIndexPos), repeats);
        else
            for (k = 0; k < repeats; k++)
                resultStr += inputStr.charAt(strIndexPos);
        
        strIndexPos += posJump;
    }
    console.log(resultStr.split(''))
    //console.log(resultStr.split('').map((x) => { return x.charCodeAt(0) }))
    return resultStr
}

function rle_escape_decode(inputStr)
{
    if (inputStr.length < 3) return inputStr;   
    var strIndexPos = 0;
    resultStr = '';
    while (strIndexPos < inputStr.length)
    {
        if ((inputStr.length - strIndexPos >= 3)
            && (inputStr.charCodeAt(strIndexPos) == rle_escapeSymbol_code))
        {
            resultStr += inputStr.charAt(strIndexPos + 2).repeat(inputStr.charCodeAt(strIndexPos + 1));
            strIndexPos += 2;
        }
        else
        resultStr += inputStr.charAt(strIndexPos);
        strIndexPos++;
    }
    return resultStr;
}

// ToDo: cli-friendly interface
// ToDo: RLE jump encoder/decoder (if neccesary)

inText = arg[2]
console.log(inText.length);
console.log(rle_escape_decode(rle_escape_encode(inText)))

// inText = fs.readFileSync(arg[2]);
// inText = inText.toString();