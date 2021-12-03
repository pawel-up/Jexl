export interface Grammar {
  elements: Record<string, any>,
  functions: any,
  transforms: any,
}

export const getGrammar: () => Grammar;
