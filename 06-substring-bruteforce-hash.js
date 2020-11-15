function SubstringSearchBruteforce(target, query)
{
    let result = new Array();
    let mismatchFound;
    for (let i = 0; i < target.length - query.length + 1; i++)
    {   
        mismatchFound = false;
        for (let j = 0; j < query.length; j++)
        {
            if (target[i+j] != query[j])
            {
                mismatchFound = true;
                break;
            }
        }
        if (mismatchFound)
            continue;
        result.push(i);
    }
    return result;   
}

function SubstringSearchHash(target, query)
{
    // notice: the implemented hash function below is a polynomial
    // rolling hash function, with all operations applied in modular field

    // any of thsese two parameters below may vary, but both of them should be prime numbers
    let polynomialBase = 37;
    let modularFieldBase = 999809;

    let result = new Array();
    
    // do not compute anything further if it's unneccessary
    if (target.length < query.length)
        return result;
    
    // evaluate polynomial leading term multiplier
    let multiplier = 1
    for (let i = 0; i < query.length - 1; i++)
    {
        multiplier *= polynomialBase;
        multiplier %= modularFieldBase;
    }

    // evaluate query string hash
    let queryHash = 0;
    for (let i = 0; i < query.length; i++)
    {
        queryHash += query.charCodeAt(i) * Math.pow(polynomialBase, i);
        queryHash %= modularFieldBase;
    }

    let currentHash = 0;
    let mismatchNotFound;
    let previousElement;
    for (let i = 0; i < target.length - query.length + 1; i++)
    {
        if (i == 0) // fully evaluate the first substring hash
            for (let j = 0; j < query.length; j++)
            {
                currentHash += target.charCodeAt(j) * Math.pow(polynomialBase, j);
                currentHash %= modularFieldBase;
            }
        else // but, starting with the second one, use rolling hash recurrent model
            currentHash = ((currentHash + modularFieldBase - previousElement) % modularFieldBase)
                / polynomialBase + target.charCodeAt(query.length - 1 + i) * multiplier;

        previousElement = target.charCodeAt(i);

        if (queryHash == currentHash)
        { // if hashes match, perform actual comparison
            mismatchNotFound = true;
            for (let j = 0; j < query.length; j++)
                if (target[i + j] != query[j])
                    mismatchNotFound = false;
            if (mismatchNotFound)
                result.push(i);
        }
    }
    return result;
}
console.log(SubstringSearchBruteforce('akekketykek', 'kek'));
console.log(SubstringSearchHash('akekketykek', 'kek'));