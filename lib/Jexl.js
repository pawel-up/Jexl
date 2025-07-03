import Expression from './Expression.js';
import { getGrammar } from './grammar.js';
export class Jexl {
    _grammar;
    constructor() {
        this.expr = this.expr.bind(this);
        this._grammar = getGrammar();
    }
    addBinaryOp(operator, precedence, fn, manualEval) {
        const element = {
            type: 'binaryOp',
            precedence: precedence,
        };
        if (manualEval) {
            element.evalOnDemand = fn;
        }
        else {
            element.eval = fn;
        }
        this._addGrammarElement(operator, element);
    }
    addFunction(name, fn) {
        this._grammar.functions[name] = fn;
    }
    addFunctions(map) {
        for (const key in map) {
            if (Object.prototype.hasOwnProperty.call(map, key)) {
                const fn = map[key];
                if (fn) {
                    this._grammar.functions[key] = fn;
                }
            }
        }
    }
    addUnaryOp(operator, fn) {
        const element = {
            type: 'unaryOp',
            weight: Infinity,
            eval: fn
        };
        this._addGrammarElement(operator, element);
    }
    addTransform(name, fn) {
        this._grammar.transforms[name] = fn;
    }
    addTransforms(map) {
        for (const key in map) {
            if (Object.prototype.hasOwnProperty.call(map, key)) {
                const fn = map[key];
                if (fn) {
                    this._grammar.transforms[key] = fn;
                }
            }
        }
    }
    compile(expression) {
        const exprObj = this.createExpression(expression);
        return exprObj.compile();
    }
    createExpression(expression) {
        return new Expression(this._grammar, expression);
    }
    getFunction(name) {
        const fn = this._grammar.functions[name];
        if (!fn) {
            throw new Error(`Function '${name}' is not defined`);
        }
        return fn;
    }
    getTransform(name) {
        const fn = this._grammar.transforms[name];
        if (!fn) {
            throw new Error(`Transform '${name}' is not defined`);
        }
        return fn;
    }
    eval(expression, context = {}) {
        const exprObj = this.createExpression(expression);
        return exprObj.eval(context);
    }
    evalSync(_expression, _context = {}) {
        throw new Error('Synchronous evaluation is no longer supported. Use eval() instead for asynchronous evaluation.');
    }
    expr(strs, ...args) {
        const exprStr = strs.reduce((acc, str, idx) => {
            const arg = idx < args.length ? args[idx] : '';
            acc += str + arg;
            return acc;
        }, '');
        return this.createExpression(exprStr);
    }
    removeOp(operator) {
        if (this._grammar.elements[operator] &&
            (this._grammar.elements[operator].type === 'binaryOp' ||
                this._grammar.elements[operator].type === 'unaryOp')) {
            delete this._grammar.elements[operator];
        }
    }
    _addGrammarElement(str, obj) {
        this._grammar.elements[str] = obj;
    }
}
