function HuffTreeNode(symbol, repeats, wasUsed = false, parent = null, code = '')
{
    this.symbol = symbol;
    this.repeats = repeats;
    this.wasUsed = wasUsed;
    this.parent = parent;
    this.code = code;
}

function makeHuffTree(inputStr)
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
            tree[minIndex1].code = '0';
            tree[minIndex2].code = '1';
            tree[minIndex1].parent = tree[minIndex2].parent = tree.length;
            tree.push(new HuffTreeNode(tree[minIndex1].symbol + tree[minIndex2].symbol,
                tree[minIndex1].repeats + tree[minIndex2].repeats));
        }
    }
    return tree;
}

function getCodeFromTree(tree, charIndex)
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

let testStr = "abrakadabra";
function makeHuffCodes(inputStr)
{
    let codes = new Array();
    tree = makeHuffTree(testStr);
    for (i = 0; i < tree.symbolsCount; i++)
        codes[tree[i].symbol] = getCodeFromTree(tree, i);
    return codes;
}


function huffEncode(inputStr)
{
    let result = new Array();
    codes = makeHuffCodes(inputStr);
    for (let i = 0; i < inputStr.length ; i++)
        result = result.concat(codes[inputStr[i]]);
    result.codes = codes;
    return result;
}
console.log(huffEncode(testStr))

function huffDecode(huffCodesArray)
{
    return '';
}