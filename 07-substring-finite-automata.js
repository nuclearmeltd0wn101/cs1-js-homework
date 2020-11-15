function SearchAutomata(query)
{
    this.startState = 0;
    this.endState = query.length;

    alphabet = new Array();
    for (let i = 0; i < query.length; i++)
        alphabet[query[i]] = 0;
    
    // initialize two dimensional array, where we will store states transition table 
    this.statesTransitionTable = new Array(this.endState + 1);
    for (let i = 0; i <= query.length; i++)
        this.statesTransitionTable[i] = new Array();
    
    // initialize states transition table itself
    for (let i in alphabet)
        this.statesTransitionTable[0][i] = 0;
    
    // compose states transition table
    let prev;
    for (let i = 0; i < query.length; i++)
    {
        prev = this.statesTransitionTable[i][query[i]];
        this.statesTransitionTable[i][query[i]] = i + 1;
        for (let j in alphabet)
            this.statesTransitionTable[i+1][j] = this.statesTransitionTable[prev][j];
    }
}

function SubstringSearchAutomata(target, query)
{
    let result = new Array();
    
    if (target.length < query.length)
        return result;
    
    let automata = new SearchAutomata(query);
    
    let currentState = automata.startState;
    for (let i = 0; i < target.length; i++)
    {
        currentState = automata.statesTransitionTable[currentState][target[i]] || automata.startState;
        if (currentState == automata.endState)
            result.push(i + 1 - automata.endState);
    }
    return result;
}

console.log(SubstringSearchAutomata('akekketykek', 'kek'));