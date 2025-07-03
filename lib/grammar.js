export const getGrammar = () => ({
    elements: {
        '.': { type: 'dot' },
        '[': { type: 'openBracket' },
        ']': { type: 'closeBracket' },
        '|': { type: 'pipe' },
        '{': { type: 'openCurl' },
        '}': { type: 'closeCurl' },
        ':': { type: 'colon' },
        ',': { type: 'comma' },
        '(': { type: 'openParen' },
        ')': { type: 'closeParen' },
        '?': { type: 'question' },
        '+': {
            type: 'binaryOp',
            precedence: 30,
            eval: (left, right) => left + right
        },
        '-': {
            type: 'binaryOp',
            precedence: 30,
            eval: (left, right) => left - right
        },
        '*': {
            type: 'binaryOp',
            precedence: 40,
            eval: (left, right) => left * right
        },
        '/': {
            type: 'binaryOp',
            precedence: 40,
            eval: (left, right) => left / right
        },
        '//': {
            type: 'binaryOp',
            precedence: 40,
            eval: (left, right) => Math.floor(left / right)
        },
        '%': {
            type: 'binaryOp',
            precedence: 50,
            eval: (left, right) => left % right
        },
        '^': {
            type: 'binaryOp',
            precedence: 50,
            eval: (left, right) => Math.pow(left, right)
        },
        '==': {
            type: 'binaryOp',
            precedence: 20,
            eval: (left, right) => left == right
        },
        '!=': {
            type: 'binaryOp',
            precedence: 20,
            eval: (left, right) => left != right
        },
        '>': {
            type: 'binaryOp',
            precedence: 20,
            eval: (left, right) => left > right
        },
        '>=': {
            type: 'binaryOp',
            precedence: 20,
            eval: (left, right) => left >= right
        },
        '<': {
            type: 'binaryOp',
            precedence: 20,
            eval: (left, right) => left < right
        },
        '<=': {
            type: 'binaryOp',
            precedence: 20,
            eval: (left, right) => left <= right
        },
        '&&': {
            type: 'binaryOp',
            precedence: 10,
            evalOnDemand: (left, right) => {
                return left.eval().then((leftVal) => {
                    if (!leftVal)
                        return leftVal;
                    return right.eval();
                });
            }
        },
        '||': {
            type: 'binaryOp',
            precedence: 10,
            evalOnDemand: (left, right) => {
                return left.eval().then((leftVal) => {
                    if (leftVal)
                        return leftVal;
                    return right.eval();
                });
            }
        },
        in: {
            type: 'binaryOp',
            precedence: 20,
            eval: (left, right) => {
                if (typeof right === 'string') {
                    return right.indexOf(left) !== -1;
                }
                if (Array.isArray(right)) {
                    return right.some((elem) => elem === left);
                }
                return false;
            }
        },
        '!': {
            type: 'unaryOp',
            precedence: Infinity,
            eval: (right) => !right
        }
    },
    functions: {},
    transforms: {}
});
