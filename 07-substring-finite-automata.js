function SearchAutomata(needle)
{
    this.startState = 0;
    this.endState = needle.length;

    alphabet = new Array();
    for (let i = 0; i < needle.length; i++)
        alphabet[needle[i]] = 0;
    
    // initialize two dimensional array, where we will store states transition table 
    this.statesTransitionTable = new Array(this.endState + 1);
    for (let i = 0; i <= needle.length; i++)
        this.statesTransitionTable[i] = new Array();
    
    // initialize states transition table itself
    for (let i in alphabet)
        this.statesTransitionTable[0][i] = 0;
    
    // compose states transition table
    let prev;
    for (let i = 0; i < needle.length; i++)
    {
        prev = this.statesTransitionTable[i][needle[i]];
        this.statesTransitionTable[i][needle[i]] = i + 1;
        for (let j in alphabet)
            this.statesTransitionTable[i+1][j] = this.statesTransitionTable[prev][j];
    }
}

function SubstringSearchAutomata(haystack, needle)
{
    let result = new Array();
    
    if (haystack.length < needle.length)
        return result;
    
    let automata = new SearchAutomata(needle);
    
    let currentState = automata.startState;
    for (let i = 0; i < haystack.length; i++)
    {
        currentState = automata.statesTransitionTable[currentState][haystack[i]] || automata.startState;
        if (currentState == automata.endState)
            result.push(i + 1 - automata.endState);
    }
    return result;
}

console.log(SubstringSearchAutomata('akekketykek', 'kek'));