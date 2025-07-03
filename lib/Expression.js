import Evaluator from './evaluator/Evaluator.js';
import Lexer from './Lexer.js';
import Parser from './parser/Parser.js';
export default class Expression {
    _grammar;
    _exprStr;
    _ast;
    constructor(grammar, exprStr) {
        this._grammar = grammar;
        this._exprStr = exprStr;
        this._ast = null;
    }
    compile() {
        const lexer = new Lexer(this._grammar);
        const parser = new Parser(this._grammar);
        const tokens = lexer.tokenize(this._exprStr);
        parser.addTokens(tokens);
        const result = parser.complete();
        this._ast = result;
        return this;
    }
    eval(context = {}) {
        return this._eval(context);
    }
    evalSync(_context = {}) {
        throw new Error('Synchronous evaluation is not supported. Use eval() for asynchronous evaluation.');
    }
    async _eval(context) {
        const ast = this._getAst();
        if (!ast) {
            throw new Error('No AST available for evaluation. Expression may not be compiled.');
        }
        const evaluator = new Evaluator(this._grammar, context, context);
        return evaluator.eval(ast);
    }
    _getAst() {
        if (!this._ast) {
            this.compile();
        }
        return this._ast;
    }
}
