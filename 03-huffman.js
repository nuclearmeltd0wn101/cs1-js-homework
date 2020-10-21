// auxiliary functions

function HuffTreeNode(symbol, repeats, wasUsed = false, parent = null, code = null)
{
    this.symbol = symbol;
    this.repeats = repeats;
    this.wasUsed = wasUsed;
    this.parent = parent;
    this.code = code;
}

function makeEncodeTree(inputStr)
{
    let strCharsRepeats = new Array();
    let tree = new Array();

    for (i = 0; i < inputStr.length; i++)
    {
        strCharsRepeats[inputStr.charAt(i)] = 0;
    }
    for (i = 0; i < inputStr.length; i++)
    {
        strCharsRepeats[inputStr.charAt(i)]++;
    }
    for (i in strCharsRepeats)
    {
        tree.push(new HuffTreeNode(i, strCharsRepeats[i]))
    }
    tree.symbolsCount = tree.length;
    for (i = 0; i < tree.symbolsCount - 1; i++)
    {
        let minRepeatsCount1 = inputStr.length + 1;
        let minRepeatsCount2 = inputStr.length + 1;
        let minIndex1 = -1;
        let minIndex2 = -1;
        for (j = 0; j < tree.length; j++)
        {
            if (!tree[j].wasUsed)
            {
                if (tree[j].repeats <= minRepeatsCount1)
                {
                    minIndex2 = minIndex1;
                    minRepeatsCount2 = minRepeatsCount1;
                    minIndex1 = j;
                    minRepeatsCount1 = tree[j].repeats;
                }
                else if (tree[j].repeats <= minRepeatsCount2)
                {
                    minIndex2 = j;
                    minRepeatsCount2 = tree[j].repeats;
                }
            }
        }
        if ((minIndex1 != -1) && (minIndex2 != -1))
        {
            tree[minIndex1].wasUsed = tree[minIndex2].wasUsed = true;
            tree[minIndex1].code = 1;
            tree[minIndex2].code = 0;
            tree[minIndex1].parent = tree[minIndex2].parent = tree.length;
            tree.push(new HuffTreeNode(tree[minIndex1].symbol + tree[minIndex2].symbol,
                tree[minIndex1].repeats + tree[minIndex2].repeats));
        }
    }
    return tree;
}

function getCodeFromEncTree(tree, charIndex)
{
    let codeArray = new Array();
    let index = charIndex;
    while (tree[index].parent != null)
    {
        codeArray.push(tree[index].code);
        index = tree[index].parent;
    }
    return codeArray.reverse();
}

function makeHuffCodes(inputStr)
{
    let codes = new Array();
    tree = makeEncodeTree(inputStr);
    if (tree.symbolsCount == 1)
        codes[tree[0].symbol] = [0];
    else
        for (i = 0; i < tree.symbolsCount; i++)
            codes[tree[i].symbol] = getCodeFromEncTree(tree, i);
    
        return codes;
}

function makeDecodeTree(codes)
{
    let tree = new Array();
    for (let letter of Object.keys(codes))
    {
        let code = codes[letter];
        let currentBranch = tree;
        for (let i = 0; i < code.length; i++)
        {
            if (currentBranch[code[i]] == undefined)
                if (i < code.length - 1)
                    currentBranch[code[i]] = new Array();
                else
                    currentBranch[code[i]] = letter;
            currentBranch = currentBranch[code[i]];
        }
    }
    return tree;
}

// main functions

// returns Array of encoded bits sequence
// returned array has property codes - a dictionary array,
// which keys are symbols, and values are huffman codes
function huffEncode(inputStr) 
{
    let result = new Array();
    codes = makeHuffCodes(inputStr);
    for (let i = 0; i < inputStr.length ; i++)
        result = result.concat(codes[inputStr[i]]);
    result.codes = codes;
    return result;
}

// decodes data back
function huffDecode(huffCodesArray)
{
    let decodeTree = makeDecodeTree(huffCodesArray.codes);
    let result = new Array();
    let currentBranch = decodeTree;
    let bitsSequence = Object.assign(huffCodesArray);
    while (bitsSequence.length > 0)
    {
        currentBranch = currentBranch[bitsSequence.shift()];
        if (!(currentBranch instanceof Array))
        {
            result.push(currentBranch);
            currentBranch = decodeTree;
        }
    }
    return result.join('');
}


// sample echo test

const { argv } = require('process');
let arg = process.argv;

let testStr = arg[2];
if (testStr == undefined)
    testStr = `Usage: ${arg[1].split('\\').pop().split('/').pop()} your_phrase_to_test
If huffman encode & decode funcs works correct, program will echo your argument
If you look into program's structure, you'll be sure, that even these lines was
encoded, decoded back and only then printed ;)`;

let encData = huffEncode(testStr)

// as you can see it is actually encodes and decodes data
console.log("Encode result:");
console.log(encData)
console.log(`Decode result: "${huffDecode(encData)}"`); 
