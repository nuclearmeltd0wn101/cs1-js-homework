function BMMakeShiftsDict(needle)
{
    let result = new Object(); // this object will serve as dictionary (associative array)
    let needleLength = needle.length;
    for (let i = 0; i < needleLength; i++)
        result[needle.charCodeAt(i)] = needleLength - i;    
    return result;
}

function SubstringSearchBM(haystack, needle)
{
    let needleLength = needle.length;
    
    let shiftsDict = BMMakeShiftsDict(needle);

    let compareStartPos, comparePosHaystack, comparePosNeedle;
    compareStartPos = comparePosHaystack = comparePosNeedle = needleLength;
    
    let result = new Array(); // occurrences first indexes
    while ((compareStartPos <= haystack.length) && (comparePosNeedle >= 0))
    {
        if (haystack[comparePosHaystack - 1] == needle[comparePosNeedle - 1])
        { // if letters match, moving on one step to the beginning
            comparePosHaystack -= 1;
            comparePosNeedle -= 1;
        }
        else
        { // otherwise, shifting to defined distance and starting again
            compareStartPos += shiftsDict[haystack.charCodeAt(compareStartPos)] || 1;
            comparePosHaystack = compareStartPos;
            comparePosNeedle = needleLength;
        }
        if (comparePosNeedle == 0) // reached occurrence
            result.push(comparePosHaystack);
    }

    return result;
}

console.log(SubstringSearchBM('akekketykek', 'kek'));