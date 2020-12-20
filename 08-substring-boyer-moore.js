function BMMakeBadSymbolShiftsDict(needle)
{
    let result = new Object(); // this object will serve as dictionary (associative array)
    let needleLength = needle.length;

    for (let i = 0; i < needleLength; i++)
        result[needle.charCodeAt(i)] = needleLength - 1 - i;
     
    return result;
}

function BMMakeGoodSuffixShiftsTable(needle)
{
    let result = new Array();
    let needleLength = needle.length;
    let lastPrefix = needleLength;
 
    for (let i = 0; i < needleLength; i++)
    {
        if (BMIsPrefix(needle, needleLength - i))
            lastPrefix = needleLength - i;
        
        result.push(lastPrefix + i);
    }
 
    for (let i = 0; i < needleLength; i++)
    {
        let suffixLength = BMGetSuffixLength(needle, i);
        result[suffixLength] = suffixLength + needleLength - 1 - i;
    }
    return result;
}

function BMIsPrefix(string, startPos)
{
    for (let i = startPos; i < string.length; i++)
        if (string.charCodeAt(i) != string.charCodeAt(startPos - i))
            return false;

    return true;
}

function BMGetSuffixLength(string, startPos)
{
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

    let shifts1 = BMMakeBadSymbolShiftsDict(needle);
    let shifts2 = BMMakeGoodSuffixShiftsTable(needle);

    let comparePosHaystack, comparePosNeedle, shift1, shift2;
    let compareStartPos = needleLength - 1;
    while (compareStartPos < haystackLength)
    {
        comparePosHaystack = compareStartPos;
        comparePosNeedle = needle.length - 1;
 
        while ((haystack[comparePosHaystack] === needle[comparePosNeedle])
            && (comparePosNeedle >= 0))
        { // while letters match, moving on one step to the beginning
            comparePosHaystack--;
            comparePosNeedle--;
        }

        if (comparePosNeedle == -1)
        { // if it had moved through needle beginning, this is occurrence
            comparePosHaystack++;
            comparePosNeedle++;
            result.push(comparePosHaystack);
        }
 
        shift2 = shifts2[needle.length - 1 - comparePosNeedle];
        // if bad char not found in table, assuming needle length as shift
        if (shifts1.hasOwnProperty(haystack.charCodeAt(compareStartPos)))
            shift1 = shifts1[haystack.charCodeAt(compareStartPos)]; 
        else
            shift1 = needle.length;
 
        compareStartPos += Math.max(shift1, shift2);
    }
    return result;
}

console.log(SubstringSearchBM('akekketykek', 'akek'));
console.log(SubstringSearchBM('akekketykek', 'kek'));
console.log(SubstringSearchBM('цыган на цыпочках цыпленку цыкнул: цыц!', 'цы'));