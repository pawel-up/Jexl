export const states = {
    expectOperand: {
        tokenTypes: {
            literal: { toState: 'expectBinOp' },
            identifier: { toState: 'identifier' },
            unaryOp: {},
            openParen: { toState: 'subExpression' },
            openCurl: { toState: 'expectObjKey', handler: 'objStart' },
            dot: { toState: 'traverse' },
            openBracket: { toState: 'arrayVal', handler: 'arrayStart' }
        }
    },
    expectBinOp: {
        tokenTypes: {
            binaryOp: { toState: 'expectOperand' },
            pipe: { toState: 'expectTransform' },
            dot: { toState: 'traverse' },
            question: { toState: 'ternaryMid', handler: 'ternaryStart' }
        },
        completable: true
    },
    expectTransform: {
        tokenTypes: {
            identifier: { toState: 'postTransform', handler: 'transform' }
        }
    },
    expectObjKey: {
        tokenTypes: {
            literal: { toState: 'expectKeyValSep', handler: 'objKey' },
            identifier: { toState: 'expectKeyValSep', handler: 'objKey' },
            closeCurl: { toState: 'expectBinOp' }
        }
    },
    expectKeyValSep: {
        tokenTypes: {
            colon: { toState: 'objVal' }
        }
    },
    postTransform: {
        tokenTypes: {
            openParen: { toState: 'argVal' },
            binaryOp: { toState: 'expectOperand' },
            dot: { toState: 'traverse' },
            openBracket: { toState: 'filter' },
            pipe: { toState: 'expectTransform' }
        },
        completable: true
    },
    postArgs: {
        tokenTypes: {
            binaryOp: { toState: 'expectOperand' },
            dot: { toState: 'traverse' },
            openBracket: { toState: 'filter' },
            pipe: { toState: 'expectTransform' }
        },
        completable: true
    },
    identifier: {
        tokenTypes: {
            binaryOp: { toState: 'expectOperand' },
            dot: { toState: 'traverse' },
            openBracket: { toState: 'filter' },
            openParen: { toState: 'argVal', handler: 'functionCall' },
            pipe: { toState: 'expectTransform' },
            question: { toState: 'ternaryMid', handler: 'ternaryStart' }
        },
        completable: true
    },
    traverse: {
        tokenTypes: {
            identifier: { toState: 'identifier' }
        }
    },
    filter: {
        subHandler: 'filter',
        endStates: {
            closeBracket: 'identifier'
        }
    },
    subExpression: {
        subHandler: 'subExpression',
        endStates: {
            closeParen: 'expectBinOp'
        }
    },
    argVal: {
        subHandler: 'argVal',
        endStates: {
            comma: 'argVal',
            closeParen: 'postArgs'
        }
    },
    objVal: {
        subHandler: 'objVal',
        endStates: {
            comma: 'expectObjKey',
            closeCurl: 'expectBinOp'
        }
    },
    arrayVal: {
        subHandler: 'arrayVal',
        endStates: {
            comma: 'arrayVal',
            closeBracket: 'expectBinOp'
        }
    },
    ternaryMid: {
        subHandler: 'ternaryMid',
        endStates: {
            colon: 'ternaryEnd'
        }
    },
    ternaryEnd: {
        subHandler: 'ternaryEnd',
        completable: true
    }
};
