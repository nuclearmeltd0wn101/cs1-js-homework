// Memory structure: integers array
// [ 0:  instruction pointer,
//   1:  cmp result,
//   2 .. N+1: runtime variables (default N = 16)
//   N+2 .. endofarray: program ]
// Machine will read program, if find alc N, allocate N memory cells for variables, or allocate 16 cells otherwise,
// then load instructions into memory cells starting from 17 (or N+2), set IP to 17 or N+2 and then start instructions execution
// Machine commands:
// Notice: Memory cell addressess can be only within range [2, N+1]
// code  cmd  argsNum  args            desc
//  10   alc      1   {quantity}      Allocates {quantity} memory cells for variables.
//                                    Effective as the first command only, and ignored otherwise (argument will be ignored too)
//  11   set      2   {addr} {value}  Sets memory cell with address {addr} value {value}.
//  12   mov      2   {addr1} {addr2} Writes value of cell with address {addr2} to cell with address {addr1}
//  13   out      1   {address}       Writes integer to stdout from memory cell {address}
//  14   inc      1   {address}       Increments integer, stored at memory cell {address}
//  15   dec      1   {address}       Decrements integer, stored at memory cell {address}
//  16   add      2   {addr1} {addr2} Sums integers from memory cells {addr1} and {addr2}, then saves result at memory cell {addr1}
//  17   mul      2   {addr1} {addr2} Multiplies integers from memory cells {addr1} and {addr2}, then saves result at memory cell {addr1}
//  18   sub      2   {addr1} {addr2} Substracts integer from memory cells {addr2} from value in {addr1}, then saves result at memory cell {addr1}
//  19   div      2   {addr1} {addr2} Integer divides value from memory cell by value in and {addr2},
//                                      then saves result at memory cell {addr1}. If {addr2} is zero, program
//                                                                                              will be emergency stopped
//  20   mod      2   {addr1} {addr2} Evaluates remainder from integer division of value from memory cell by value in and {addr2},
//                                      then saves result at memory cell {addr1}. If {addr2} is zero, program
//                                                                                              will be emergency stopped
//  21   cmp      2   {addr1} {addr2} Compares values at cells {addr1} and {addr2}, writes result
//                                      to cmp result memory cell: 0 - equal, 1 - {addr1} is greater, 2 - {addr2} is greater
//  22   lip      1   {address}       Labels next command memory address by writing instruction pointer current value to memory cell {address}
//  23   jmp      1   {address}       Sets instruction pointer to memory cell {address}
//  24   jz       1   {address}       Sets instruction pointer to memory cell {address} if cmp result is zero
//  25   jnz      1   {address}       Sets instruction pointer to memory cell {address} if cmp result is not zero

let commandsCodes = {
    alc: 10, set: 11, mov: 12, out: 13, inc: 14, dec: 15, add: 16, mul: 17,
    sub: 18, div: 19, mod: 20, cmp: 21, lip: 22, jmp: 23, jz: 24, jnz: 25
};

function jasm(progText)
{
    let memory = new Array(2);

    if ((progText[0] == 10) || (((typeof progText[0]) == "string")
        && (commandsCodes[progText[0]] == 10)))
    {
        N = progText[1] * 1;
        progText = progText.slice(2);
    }
    else
        N = 16;

    for(let i = 0; i < N; i++)
        memory[2+i] = 0;

    for (let i = 0; i < progText.length; i++)
    {
        if (isNaN(parseInt(progText[i])))
            progText[i] = commandsCodes[progText[i]];
        else
            progText[i] *= 1;
    }
    memory = memory.concat(progText);

    memory[0] = N + 2; // set instruction pointer
    memory[1] = 0;
    while (memory[0] < memory.length)
    {
        switch (memory[memory[0]])
        {
            case 10: // alc
                memory[0]++; // ignore argument
                break;
            case 11: // set
                memory[memory[memory[0]+1]] = memory[memory[0]+2];
                memory[0]+=2;
                break;
            case 12: // mov
                memory[memory[memory[0]+1]] = memory[memory[memory[0]+2]];
                memory[0]+=2;
                break;
            case 13: // out
                console.log('out: '+memory[memory[memory[0]+1]]);
                memory[0]++;
                break;
            case 14: // inc
                memory[memory[memory[0]+1]]++;
                memory[0]++;
                break;
            case 15: // dec
                memory[memory[memory[0]+1]]--;
                memory[0]++;
                break;
            case 16: // add
                memory[memory[memory[0]+1]] += memory[memory[memory[0]+2]];
                memory[0]+=2;
                break;
            case 17: // mul
                memory[memory[memory[0]+1]] *= memory[memory[memory[0]+2]];
                memory[0]+=2;
                break;
            case 18: // sub
                memory[memory[memory[0]+1]] -= memory[memory[memory[0]+2]];
                memory[0]+=2;
                break;
            case 19: // div
                if (memory[memory[memory[0]+2]] == 0)
                {
                    console.log("Runtime Error: division by zero")
                    memory[0]=memory.length;
                }
                else
                {
                    memory[memory[memory[0]+1]] = Math.floor(memory[memory[memory[0]+1]] + memory[memory[memory[0]+2]]);
                    memory[0]+=2;
                }
                break;
            case 20: // mod
                if (memory[memory[memory[0]+2]] == 0)
                {
                    console.log("Runtime Error: division by zero")
                    memory[0]=memory.length;
                }
                else
                {
                    memory[memory[memory[0]+1]] %= memory[memory[memory[0]+2]];
                    memory[0]+=2;
                }
                break;
            case 21: // cmp
                if (memory[memory[memory[0]+1]] == memory[memory[memory[0]+2]])
                    memory[1] = 0;
                else if (memory[memory[memory[0]+1]] > memory[memory[memory[0]+2]])
                    memory[1] = 1;
                else
                    memory[1] = 2;
                memory[0]+=2;
                break;
            case 22: // lip
                memory[memory[memory[0]+1]] = memory[0]+2;
                memory[0]++;
                break;
            case 23: // jmp
                memory[0] = memory[memory[memory[0]+1]]-1;
                break;
            case 24: // jz
                if (memory[1]==0)
                    memory[0] = memory[memory[memory[0]+1]]-1;
                break;
            case 25: // jnz
                if (memory[1]!=0)
                    memory[0] = memory[memory[memory[0]+1]]-1;
                break;           
        }
        memory[0]++;
    }
}

let fs = require('fs');
const { argv } = require('process');
let arg = process.argv;

filePath = arg[2];
if (filePath)
    fs.readFile(filePath, function(err, data)
        {       
            if (err)
            {
                console.error("File read error occurred: " + err.message);
                return;
            }
            progText = data.toString().split(/\s/).filter(function(x){return x !== ''});
            jasm(progText);
        }
    )
else
    console.log(`Usage: ${arg[1].split('\\').pop().split('/').pop()} {.jasm file path}`);
