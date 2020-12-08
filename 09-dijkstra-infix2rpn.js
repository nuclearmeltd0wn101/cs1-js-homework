// приорететы операций
const operatorsPriority = {"^": 2, "*": 1, "/": 1, "+": 0, "-": 0};

// принимает на вход выражение в инфиксной нотации
//   в виде массива, состоящего из операций "+", "-", "*", "/", "^",
//      приоритетных скобок "(", "), и операндов. операндами считаются
//      любые элементы массива, кроме строк "(", ")", "+", "-", "*", "/", "^"
// возвращает соответствующий массив выражения в обратной польской нотации
function infix2rpn(inputExpression)
{
    let resultExpression = new Array();
    const operators = Object.keys(operatorsPriority);
    let operatorsStack = new Array();
    let token;
    let operator;
    
    for (let i = 0; i < inputExpression.length; i++)
    {
        token = inputExpression[i];

        if (operators.includes(token)) // if token is an operator
        {
            // push operators from ops stack to resultExpression
            // until ops stack head op has lower priority, than token
            operator = operatorsStack.pop();

            while ((operatorsStack.length >= 0)
                && (operatorsPriority[operator] >= operatorsPriority[token]))
            {
                resultExpression.push(operator);
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
            // push operators from ops stack to resultExpression
            // until ops stack head is opening bracket
            operator = operatorsStack.pop();
            while ((operatorsStack.length >= 0) && (operator != "(") )
            {
                resultExpression.push(operator);
                operator = operatorsStack.pop();
            }
            continue;
        }

        resultExpression.push(token);
    }

    // push all from ops stack to resultExpression
    while (operatorsStack.length > 0)
        resultExpression.push(operatorsStack.pop());
        
    return resultExpression;
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
