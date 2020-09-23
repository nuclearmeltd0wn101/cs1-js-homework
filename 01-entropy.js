let fs = require('fs');
let arg = process.argv;
let filePath = arg[2];

function entropy(s)
{
    alph = new Array();
    n = 0;
    h = 0;
    for (i = 0; i < s.length; i++)
    {
        letter = s.charCodeAt(i);
        if (alph[letter])
            alph[letter]++
        else
        {
            alph[letter] = 1;
            n++;
        }
    }
    for (let i in alph)
    {
        p = alph[i] / s.length;
        h -= p * Math.log2(p);
    }
    // если строка состоит из одних и тех же символов,
    // n = 1 => log2(n) = 0, а т.к. мы на него делим, получим NaN
    // в этом случае h = 0 и деление не требуется
    h /= Math.log2(n) || 1;
    return h;
}

if (filePath)
    fs.readFile(filePath, function(err, data)
        {       
            if (err)
            {
                console.error("File read error occurred: " + err.message)
                return;
            }
            line = data.toString().split('\n')[0];
            console.log(`Entropy of line "${line}" is ${entropy(line)}`);
        }
    )
else
    console.log(`Usage: ${arg[1].split('\\').pop().split('/').pop()} {file path}`);