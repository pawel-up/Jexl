import { Grammar, ASTNode } from './grammar.js';
export type Context = Record<string, unknown>;
export default class Expression {
    _grammar: Grammar;
    _exprStr: string;
    _ast: ASTNode | null;
    constructor(grammar: Grammar, exprStr: string);
    compile(): this;
    eval(context?: Context): Promise<unknown>;
    evalSync(_context?: Context): never;
    _eval(context: Context): Promise<unknown>;
    _getAst(): ASTNode | null;
}
//# sourceMappingURL=Expression.d.ts.map