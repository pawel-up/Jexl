const poolNames = {
    functions: 'Jexl Function',
    transforms: 'Transform'
};
export default class Evaluator {
    _grammar;
    _context;
    _relContext;
    constructor(grammar, context, relativeContext) {
        this._grammar = grammar;
        this._context = context || {};
        this._relContext = relativeContext || this._context;
    }
    async eval(ast) {
        switch (ast.type) {
            case 'ArrayLiteral':
                return this._handleArrayLiteral(ast);
            case 'BinaryExpression':
                return this._handleBinaryExpression(ast);
            case 'ConditionalExpression':
                return this._handleConditionalExpression(ast);
            case 'FilterExpression':
                return this._handleFilterExpression(ast);
            case 'Identifier':
                return this._handleIdentifier(ast);
            case 'Literal':
                return this._handleLiteral(ast);
            case 'ObjectLiteral':
                return this._handleObjectLiteral(ast);
            case 'FunctionCall':
                return this._handleFunctionCall(ast);
            case 'UnaryExpression':
                return this._handleUnaryExpression(ast);
            default:
                throw new Error(`Unknown AST node type: ${ast.type}`);
        }
    }
    evalArray(arr) {
        return Promise.all(arr.map((elem) => this.eval(elem)));
    }
    async evalMap(map) {
        const keys = Object.keys(map);
        const result = {};
        const asts = keys.map((key) => {
            const ast = map[key];
            if (!ast) {
                throw new Error(`No AST found for key: ${key}`);
            }
            return this.eval(ast);
        });
        const vals = await Promise.all(asts);
        vals.forEach((val, idx) => {
            const key = keys[idx];
            if (key !== undefined) {
                result[key] = val;
            }
        });
        return result;
    }
    async _filterRelative(subject, expr) {
        const promises = [];
        let subjectArray;
        if (!Array.isArray(subject)) {
            subjectArray = subject === undefined ? [] : [subject];
        }
        else {
            subjectArray = subject;
        }
        subjectArray.forEach((elem) => {
            const evalInst = new Evaluator(this._grammar, this._context, elem);
            promises.push(evalInst.eval(expr));
        });
        const values = await Promise.all(promises);
        const results = [];
        values.forEach((value, idx) => {
            if (value) {
                results.push(subjectArray[idx]);
            }
        });
        return results;
    }
    async _filterStatic(subject, expr) {
        const res = await this.eval(expr);
        if (typeof res === 'boolean') {
            return res ? subject : undefined;
        }
        if (subject != null && (typeof subject === 'object' || Array.isArray(subject))) {
            return subject[res];
        }
        return undefined;
    }
    async _handleArrayLiteral(ast) {
        return this.evalArray(ast.value);
    }
    async _handleBinaryExpression(ast) {
        const grammarOp = this._grammar.elements[ast.operator];
        if (!grammarOp) {
            throw new Error(`Unknown binary operator: ${ast.operator}`);
        }
        if ('evalOnDemand' in grammarOp && grammarOp.evalOnDemand) {
            const wrap = (subAst) => ({ eval: () => this.eval(subAst) });
            return grammarOp.evalOnDemand(wrap(ast.left), wrap(ast.right));
        }
        if ('eval' in grammarOp && grammarOp.eval) {
            const [leftVal, rightVal] = await Promise.all([
                this.eval(ast.left),
                this.eval(ast.right)
            ]);
            return grammarOp.eval(leftVal, rightVal);
        }
        throw new Error(`Binary operator ${ast.operator} has no eval function`);
    }
    async _handleConditionalExpression(ast) {
        const res = await this.eval(ast.test);
        if (res) {
            if (ast.consequent) {
                return this.eval(ast.consequent);
            }
            return res;
        }
        return this.eval(ast.alternate);
    }
    async _handleFilterExpression(ast) {
        const subject = await this.eval(ast.subject);
        if (ast.relative) {
            return this._filterRelative(subject, ast.expr);
        }
        return this._filterStatic(subject, ast.expr);
    }
    async _handleIdentifier(ast) {
        if (!ast.from) {
            return ast.relative ? this._relContext[ast.value] : this._context[ast.value];
        }
        const context = await this.eval(ast.from);
        if (context === undefined || context === null) {
            return undefined;
        }
        let targetContext = context;
        if (Array.isArray(context)) {
            targetContext = context[0];
        }
        return targetContext?.[ast.value];
    }
    _handleLiteral(ast) {
        return ast.value;
    }
    async _handleObjectLiteral(ast) {
        return this.evalMap(ast.value);
    }
    async _handleFunctionCall(ast) {
        const poolName = poolNames[ast.pool];
        if (!poolName) {
            throw new Error(`Corrupt AST: Pool '${ast.pool}' not found`);
        }
        const pool = this._grammar[ast.pool];
        const func = pool[ast.name];
        if (!func) {
            throw new Error(`${poolName} ${ast.name} is not defined.`);
        }
        const args = await this.evalArray(ast.args || []);
        return func(...args);
    }
    async _handleUnaryExpression(ast) {
        const right = await this.eval(ast.right);
        const grammarOp = this._grammar.elements[ast.operator];
        if (!grammarOp) {
            throw new Error(`Unknown unary operator: ${ast.operator}`);
        }
        if ('eval' in grammarOp && grammarOp.eval) {
            return grammarOp.eval(right);
        }
        throw new Error(`Unary operator ${ast.operator} has no eval function`);
    }
}
