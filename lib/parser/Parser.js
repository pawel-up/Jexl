import { states } from './states.js';
export default class Parser {
    _grammar;
    _state;
    _tree;
    _exprStr;
    _relative;
    _stopMap;
    _subParser;
    _parentStop;
    _cursor;
    _nextIdentEncapsulate;
    _nextIdentRelative;
    _curObjKey;
    constructor(grammar, prefix, stopMap = {}) {
        this._grammar = grammar;
        this._state = 'expectOperand';
        this._tree = null;
        this._exprStr = prefix || '';
        this._relative = false;
        this._stopMap = stopMap;
    }
    addToken(token) {
        if (this._state === 'complete') {
            throw new Error('Cannot add a new token to a completed Parser');
        }
        const state = states[this._state];
        if (!state) {
            throw new Error(`Invalid parser state: ${this._state}`);
        }
        const startExpr = this._exprStr;
        this._exprStr += token.raw;
        if (state.subHandler) {
            if (!this._subParser) {
                this._startSubExpression(startExpr);
            }
            const stopState = this._subParser.addToken(token);
            if (stopState) {
                this._endSubExpression();
                if (this._parentStop)
                    return stopState;
                this._state = stopState;
            }
        }
        else if (state.tokenTypes && state.tokenTypes[token.type]) {
            const typeOpts = state.tokenTypes[token.type];
            if (!typeOpts) {
                throw new Error(`No type options for token ${token.type}`);
            }
            if (typeOpts.handler) {
                const handlerMethod = this._getTokenHandlerMethod(typeOpts.handler);
                if (handlerMethod) {
                    handlerMethod(token);
                }
            }
            else {
                const handlerMethod = this._getHandlerMethod(token.type);
                if (handlerMethod) {
                    handlerMethod(token);
                }
            }
            if (typeOpts.toState) {
                this._state = typeOpts.toState;
            }
        }
        else if (this._stopMap[token.type]) {
            return this._stopMap[token.type];
        }
        else {
            throw new Error(`Token ${token.raw} (${token.type}) unexpected in expression: ${this._exprStr}`);
        }
        return false;
    }
    addTokens(tokens) {
        tokens.forEach(this.addToken, this);
    }
    complete() {
        const currentState = states[this._state];
        if (this._cursor && (!currentState || !currentState.completable)) {
            throw new Error(`Unexpected end of expression: ${this._exprStr}`);
        }
        if (this._subParser) {
            this._endSubExpression();
        }
        this._state = 'complete';
        return this._cursor ? this._tree : null;
    }
    isRelative() {
        return this._relative;
    }
    _endSubExpression() {
        const currentState = states[this._state];
        if (!currentState || !currentState.subHandler) {
            throw new Error(`Invalid state for ending subexpression: ${this._state}`);
        }
        const subHandlerName = currentState.subHandler;
        const handlerMethod = this._getSubHandlerMethod(subHandlerName);
        if (handlerMethod) {
            handlerMethod(this._subParser.complete());
        }
        this._subParser = null;
    }
    _placeAtCursor(node) {
        if (!this._cursor) {
            this._tree = node;
        }
        else {
            this._cursor.right = node;
            this._setParent(node, this._cursor);
        }
        this._cursor = node;
    }
    _placeBeforeCursor(node) {
        this._cursor = this._cursor?._parent;
        this._placeAtCursor(node);
    }
    _setParent(node, parent) {
        Object.defineProperty(node, '_parent', {
            value: parent,
            writable: true
        });
    }
    _startSubExpression(exprStr) {
        let endStates = states[this._state].endStates;
        if (!endStates) {
            this._parentStop = true;
            endStates = this._stopMap;
        }
        this._subParser = new Parser(this._grammar, exprStr, endStates);
    }
    argVal(ast) {
        if (ast) {
            this._cursor?.args?.push(ast);
        }
    }
    arrayStart() {
        this._placeAtCursor({
            type: 'ArrayLiteral',
            value: []
        });
    }
    arrayVal(ast) {
        const { _cursor } = this;
        if (ast && _cursor && Array.isArray(_cursor.value)) {
            _cursor.value.push(ast);
        }
    }
    binaryOp(token) {
        const precedence = this._grammar.elements[token.value]?.precedence || 0;
        let parent = this._cursor?._parent;
        while (parent &&
            parent.operator &&
            this._grammar.elements[parent.operator]?.precedence >= precedence) {
            this._cursor = parent;
            parent = parent._parent;
        }
        const node = {
            type: 'BinaryExpression',
            operator: token.value,
            left: this._cursor
        };
        this._setParent(this._cursor, node);
        this._cursor = parent;
        this._placeAtCursor(node);
    }
    dot() {
        this._nextIdentEncapsulate = Boolean(this._cursor &&
            this._cursor.type !== 'UnaryExpression' &&
            (this._cursor.type !== 'BinaryExpression' ||
                (this._cursor.type === 'BinaryExpression' && this._cursor.right)));
        this._nextIdentRelative =
            !this._cursor || (this._cursor && !this._nextIdentEncapsulate);
        if (this._nextIdentRelative) {
            this._relative = true;
        }
    }
    filter(ast) {
        this._placeBeforeCursor({
            type: 'FilterExpression',
            expr: ast,
            relative: this._subParser.isRelative(),
            subject: this._cursor
        });
    }
    functionCall() {
        this._placeBeforeCursor({
            type: 'FunctionCall',
            name: this._cursor?.value,
            args: [],
            pool: 'functions'
        });
    }
    identifier(token) {
        const node = {
            type: 'Identifier',
            value: token.value
        };
        if (this._nextIdentEncapsulate) {
            node.from = this._cursor;
            this._placeBeforeCursor(node);
            this._nextIdentEncapsulate = false;
        }
        else {
            if (this._nextIdentRelative) {
                node.relative = true;
                this._nextIdentRelative = false;
            }
            this._placeAtCursor(node);
        }
    }
    literal(token) {
        this._placeAtCursor({
            type: 'Literal',
            value: token.value
        });
    }
    objKey(token) {
        this._curObjKey = token.value;
    }
    objStart() {
        this._placeAtCursor({
            type: 'ObjectLiteral',
            value: {}
        });
    }
    objVal(ast) {
        if (this._cursor && this._curObjKey) {
            this._cursor.value[this._curObjKey] = ast;
        }
    }
    subExpression(ast) {
        this._placeAtCursor(ast);
    }
    ternaryEnd(ast) {
        if (this._cursor) {
            this._cursor.alternate = ast;
        }
    }
    ternaryMid(ast) {
        if (this._cursor) {
            this._cursor.consequent = ast;
        }
    }
    ternaryStart() {
        this._tree = {
            type: 'ConditionalExpression',
            test: this._tree || undefined
        };
        this._cursor = this._tree;
    }
    transform(token) {
        this._placeBeforeCursor({
            type: 'FunctionCall',
            name: token.value,
            args: this._cursor ? [this._cursor] : [],
            pool: 'transforms'
        });
    }
    unaryOp(token) {
        this._placeAtCursor({
            type: 'UnaryExpression',
            operator: token.value
        });
    }
    _getHandlerMethod(tokenType) {
        switch (tokenType) {
            case 'binaryOp':
                return this.binaryOp.bind(this);
            case 'dot':
                return () => this.dot();
            case 'identifier':
                return this.identifier.bind(this);
            case 'literal':
                return this.literal.bind(this);
            case 'unaryOp':
                return this.unaryOp.bind(this);
            default:
                return undefined;
        }
    }
    _getTokenHandlerMethod(handlerName) {
        switch (handlerName) {
            case 'arrayStart':
                return () => this.arrayStart();
            case 'functionCall':
                return () => this.functionCall();
            case 'objKey':
                return this.objKey.bind(this);
            case 'objStart':
                return () => this.objStart();
            case 'ternaryStart':
                return () => this.ternaryStart();
            case 'transform':
                return this.transform.bind(this);
            default:
                return undefined;
        }
    }
    _getSubHandlerMethod(handlerName) {
        switch (handlerName) {
            case 'argVal':
                return this.argVal.bind(this);
            case 'arrayVal':
                return this.arrayVal.bind(this);
            case 'filter':
                return this.filter.bind(this);
            case 'objVal':
                return this.objVal.bind(this);
            case 'subExpression':
                return this.subExpression.bind(this);
            case 'ternaryEnd':
                return this.ternaryEnd.bind(this);
            case 'ternaryMid':
                return this.ternaryMid.bind(this);
            default:
                return undefined;
        }
    }
}
