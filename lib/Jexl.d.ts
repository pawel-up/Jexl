import Expression, { type Context } from './Expression.js';
import { type BinaryOpFunction, type FunctionFunction, type UnaryOpFunction, type Grammar, type TransformFunction, GrammarElement } from './grammar.js';
export declare class Jexl {
    _grammar: Grammar;
    constructor();
    addBinaryOp(operator: string, precedence: number, fn: BinaryOpFunction, manualEval?: boolean): void;
    addFunction(name: string, fn: FunctionFunction): void;
    addFunctions(map: {
        [key: string]: FunctionFunction;
    }): void;
    addUnaryOp(operator: string, fn: UnaryOpFunction): void;
    addTransform(name: string, fn: TransformFunction): void;
    addTransforms(map: {
        [key: string]: TransformFunction;
    }): void;
    compile(expression: string): Expression;
    createExpression(expression: string): Expression;
    getFunction(name: string): FunctionFunction;
    getTransform(name: string): TransformFunction;
    eval(expression: string, context?: Context): Promise<unknown>;
    evalSync(_expression: string, _context?: Context): never;
    expr(strs: string[], ...args: any[]): Expression;
    removeOp(operator: string): void;
    _addGrammarElement(str: string, obj: GrammarElement): void;
}
//# sourceMappingURL=Jexl.d.ts.map