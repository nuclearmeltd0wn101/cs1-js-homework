function BMMakeBadSymbolDict(needle)
{
    let result = new Object(); // this object will serve as dictionary (associative array),
    let needleLength = needle.length;

    for (let i = 0; i < needleLength; i++)
        result[needle.charCodeAt(i)] = i + 1;
    
    return result;
}

function BMMakeGoodSuffixShiftsTable(needle)
{ // makes good suffix shifts table (f: mismatchNeedlePosition -> shift) using prefixes
    let result = new Array();
    let needleLength = needle.length;
    let lastFoundPrefixPosition = needleLength;
 
    for (let i = 0; i < needleLength; i++)
    {
        // if substring needle[0..needleLength - i] is needle prefix, save its position
        if (BMCheckIsPrefix(needle, needleLength - i))
            lastFoundPrefixPosition = needleLength - i;
        
        // and fill array with last prefix position plus step
        result.push(lastFoundPrefixPosition + i);
    }
 
    for (let i = 0; i < needleLength; i++) // evaluating shifts by good suffix shifts definition
        ((suffixLength) => result[suffixLength] = suffixLength + needleLength - 1 - i)(BMEvalSuffixLength(needle, i));
    
    return result;
}

function BMCheckIsPrefix(string, startPos)
{ // naive prefix check (is string[startPos .. stringLength-1] === string[0 .. stringLength - startPos])
    for (let i = startPos; i < string.length; i++)
        if (string.charCodeAt(i) != string.charCodeAt(startPos - i))
            return false;

    return true;
}

function BMEvalSuffixLength(string, startPos)
{ // naive suffix length evaluation
    let stringLastCharPos = string.length - 1;
    let result = 0;
    
    while ((string.charCodeAt(stringLastCharPos - result)
            == string.charCodeAt(startPos - result))
        && (result <= startPos))
        result++;
    
    return result;
}


function SubstringSearchBM(haystack, needle)
{
    let result = new Array(); // occurrences first indexes
    
    let haystackLength = haystack.length;
    let needleLength = needle.length;

    if (needleLength > haystackLength)
        return result;

    let badSymbolDict = BMMakeBadSymbolDict(needle);
    let goodSuffixTable = BMMakeGoodSuffixShiftsTable(needle);

    let comparePosHaystack, comparePosNeedle, shift1, shift2;
    comparePosHaystack = needleLength - 1;
    while (comparePosHaystack < haystackLength)
    {
        comparePosNeedle = needle.length - 1;
 
        while ((haystack[comparePosHaystack] === needle[comparePosNeedle])
            && (comparePosNeedle >= 0))
        { // while letters match, moving on one step to the beginning
            comparePosHaystack--;
            comparePosNeedle--;
        }

        if (comparePosNeedle == -1)
        { // if it had moved through needle beginning, this is occurrence
            comparePosHaystack++; // moving one step back
            comparePosNeedle++;
            result.push(comparePosHaystack);
        }
        
        shift1 = needle.length;
        if (badSymbolDict.hasOwnProperty(haystack.charCodeAt(comparePosHaystack)))
            shift1 -= badSymbolDict[haystack.charCodeAt(comparePosHaystack)] + comparePosNeedle; 
        // if bad char not found in table, assuming needle length as table value
        shift1 = Math.max(1, shift1);
        
        shift2 = goodSuffixTable[needle.length - (comparePosNeedle + 1)];
 
        comparePosHaystack += Math.max(shift1, shift2);
    }
    return result;
}

console.log(SubstringSearchBM('kek', 'kek'));
console.log(SubstringSearchBM('akekketykek', 'akek'));
console.log(SubstringSearchBM('akekketykek', 'kek'));
console.log(SubstringSearchBM('цыган на цыпочках цыпленку цыкнул: цыц!', 'цы'));
console.log(SubstringSearchBM('WHICH_FINALLY_HALTS.__AT_THAT_PIONT', 'AT_THAT'));
console.log(SubstringSearchBM('bcdbcabcdbcabcabcabcabcabcbc', 'bcdbcabcabc'));