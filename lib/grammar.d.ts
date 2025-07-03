export type TransformFunction = (value: any, ...args: any[]) => any;
export type BinaryOpFunction = (left: any, right: any) => any;
export type UnaryOpFunction = (right: any) => any;
export type FunctionFunction = (value: any, ...args: any[]) => any;
export interface BaseASTNode {
    type: string;
}
export interface ArrayLiteralNode extends BaseASTNode {
    type: 'ArrayLiteral';
    value: ASTNode[];
}
export interface BinaryExpressionNode extends BaseASTNode {
    type: 'BinaryExpression';
    operator: string;
    left: ASTNode;
    right: ASTNode;
}
export interface ConditionalExpressionNode extends BaseASTNode {
    type: 'ConditionalExpression';
    test: ASTNode;
    consequent: ASTNode;
    alternate: ASTNode;
}
export interface FilterExpressionNode extends BaseASTNode {
    type: 'FilterExpression';
    subject: ASTNode;
    expr: ASTNode;
    relative: boolean;
}
export interface IdentifierNode extends BaseASTNode {
    type: 'Identifier';
    value: string;
    from?: ASTNode;
    relative?: boolean;
}
export interface LiteralNode extends BaseASTNode {
    type: 'Literal';
    value: any;
}
export interface ObjectLiteralNode extends BaseASTNode {
    type: 'ObjectLiteral';
    value: Record<string, ASTNode>;
}
export interface FunctionCallNode extends BaseASTNode {
    type: 'FunctionCall';
    name: string;
    args?: ASTNode[];
    pool: 'functions' | 'transforms';
}
export interface UnaryExpressionNode extends BaseASTNode {
    type: 'UnaryExpression';
    operator: string;
    right: ASTNode;
}
export type ASTNode = ArrayLiteralNode | BinaryExpressionNode | ConditionalExpressionNode | FilterExpressionNode | IdentifierNode | LiteralNode | ObjectLiteralNode | FunctionCallNode | UnaryExpressionNode;
export interface GrammarElement {
    type: 'dot' | 'openBracket' | 'closeBracket' | 'pipe' | 'openCurl' | 'closeCurl' | 'colon' | 'comma' | 'openParen' | 'closeParen' | 'question' | 'binaryOp' | 'unaryOp';
    raw?: string;
}
export interface BinaryElement extends GrammarElement {
    type: 'binaryOp';
    precedence?: number;
    eval?: BinaryOpFunction;
    evalOnDemand?: BinaryOpFunction;
}
export interface UnaryElement extends GrammarElement {
    type: 'unaryOp';
    weight?: number;
    precedence?: number;
    eval?: UnaryOpFunction;
}
export interface Grammar {
    elements: Record<string, GrammarElement | BinaryElement | UnaryElement>;
    functions: Record<string, FunctionFunction>;
    transforms: Record<string, TransformFunction>;
}
export declare const getGrammar: () => Grammar;
//# sourceMappingURL=grammar.d.ts.map