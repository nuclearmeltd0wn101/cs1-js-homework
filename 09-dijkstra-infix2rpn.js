// приорететы операций
const operatorsPriority = {"^": 2, "*": 1, "/": 1, "+": 0, "-": 0};

// принимает на вход выражение в инфиксной нотации
//   в виде массива, состоящего из операций "+", "-", "*", "/", "^",
//      приоритетных скобок "(", "), и операндов. операндами считаются
//      любые элементы массива, кроме строк "(", ")", "+", "-", "*", "/", "^"
// возвращает соответствующий массив в обратной польской нотации
function infix2rpn(inputStack)
{
    let resultStack = new Array();
    const operators = Object.keys(operatorsPriority);
    let operatorsStack = new Array();
    let token;
    let operator;
    
    for (let i = 0; i < inputStack.length; i++)
    {
        token = inputStack[i];

        if (operators.includes(token))
        {
            operator = operatorsStack.pop();

            while ((operatorsStack.length >= 0)
                && (operatorsPriority[operator] >= operatorsPriority[token]))
            {
                resultStack.push(operator);
                operator = operatorsStack.pop();
            }

            if ((operator === "(")
                || (operatorsPriority[operator] <= operatorsPriority[token]))
                operatorsStack.push(operator);
            
            operatorsStack.push(token);
            continue;
        }

        if ((token === "(") )
        {
            operatorsStack.push(token);
            continue;
        }
        
        if (token === ")")
        {
            operator = operatorsStack.pop();
            while ((operatorsStack.length >= 0) && (operator != "(") )
            {
                resultStack.push(operator);
                operator = operatorsStack.pop();
            }
            continue;
        }

        resultStack.push(token);
    }

    while (operatorsStack.length > 0)
        resultStack.push(operatorsStack.pop());
        
    return resultStack;
}

// тестики для отладки
let tests = new Array(
    [2, "+", "(", 3, "*", 4, ")"], // => 2 3 4 * +
    ["(",2, "+", 3, ")", "*", 4], // => 2 3 + 4 *
    [3, "+", 4, "*", 2, "/", "(", 1, "-", 5, ")", "^", 2], // => 3 4 2 * 1 5 - 2 ^ / +
    ["(", 1, "+", 2, ")", "*", 4, "+", 3] // => 1 2 + 4 * 3 +
);

tests.forEach(function(element)
{
    console.log(`Infix: ${element.join(' ')}  =>  RPN: ${infix2rpn(element).join(' ')}`);
});
