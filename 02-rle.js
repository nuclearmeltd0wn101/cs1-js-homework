let fs = require('fs');
const { argv } = require('process');
let arg = process.argv;

// RLE config
const rle_escapeSymbol_code  = 35;  // #
const rle_counter_upperbound = 127; // ASCII compat restriction

function rle_encode(inputStr)
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

        let posJump = repeats;
        while (repeats >= rle_counter_upperbound)
        {
            resultStr += makeEscSeq(inputStr.charAt(strIndexPos), rle_counter_upperbound);
            repeats -= rle_counter_upperbound;
        }

        if ((repeats > 3) || (inputStr.charCodeAt(strIndexPos) == rle_escapeSymbol_code))
            resultStr += makeEscSeq(inputStr.charAt(strIndexPos), repeats);
        else
            for (k = 0; k < repeats; k++)
                resultStr += inputStr.charAt(strIndexPos);
        
        strIndexPos += posJump;
    }
    return resultStr
}

function rle_decode(inputStr)
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

var actionArg = arg[2];
var inputFilePath = arg[3];
var outputFilePath = arg[4];

if (actionArg && inputFilePath && outputFilePath &&
    ((actionArg == "encode") || (actionArg == "decode")))
{
    var procFunc;
    var inputStr;
    var outputStr;

    try
    {
        inputStr = fs.readFileSync(inputFilePath).toString();
    }
    catch (exception)
    {
        console.error("Input file read error occurred: " + exception.message);
        return;
    }
    
    
    if (actionArg == "encode")
        procFunc = rle_encode
    else
        procFunc = rle_decode;

    outputStr = procFunc(inputStr);
    try
    {
        fs.writeFileSync(outputFilePath, outputStr);
    }
    catch (exception)
    {
        console.error("Output file write error occurred: " + exception.message);
        return;
    }
    console.log("Success");
}
else
    console.log(`Simple RLE escape encoder / eecoder

Usage: ${arg[1].split('\\').pop().split('/').pop()} encode/decode {input file path} {output file path}

Notice: Using "${String.fromCharCode(rle_escapeSymbol_code)}" (UTF-8 char code ${rle_escapeSymbol_code}) as escape symbol,
it can be changed by editing rle_escapeSymbol_code param in source`);
