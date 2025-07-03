const numericRegex = /^-?(?:(?:[0-9]*\.[0-9]+)|[0-9]+)$/;
const identRegex = /^[a-zA-Zа-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$][a-zA-Zа-яА-Я0-9_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$]*$/;
const escEscRegex = /\\\\/;
const whitespaceRegex = /^\s*$/;
const preOpRegexElems = [
    "'(?:(?:\\\\')|[^'])*'",
    '"(?:(?:\\\\")|[^"])*"',
    '\\s+',
    '\\btrue\\b',
    '\\bfalse\\b'
];
const postOpRegexElems = [
    '[a-zA-Zа-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\\$][a-zA-Z0-9а-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\\$]*',
    '(?:(?:[0-9]*\\.[0-9]+)|[0-9]+)'
];
const minusNegatesAfter = [
    'binaryOp',
    'unaryOp',
    'openParen',
    'openBracket',
    'question',
    'colon'
];
export default class Lexer {
    _grammar;
    _splitRegex;
    constructor(grammar) {
        this._grammar = grammar;
    }
    getElements(str) {
        const regex = this._getSplitRegex();
        return str.split(regex).filter((elem) => {
            return elem;
        });
    }
    getTokens(elements) {
        const tokens = [];
        let negate = false;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (!element)
                continue;
            if (this._isWhitespace(element)) {
                if (tokens.length > 0) {
                    tokens[tokens.length - 1].raw += element;
                }
            }
            else if (element === '-' && this._isNegative(tokens)) {
                negate = true;
            }
            else {
                if (negate) {
                    elements[i] = '-' + element;
                    negate = false;
                }
                tokens.push(this._createToken(elements[i]));
            }
        }
        if (negate) {
            tokens.push(this._createToken('-'));
        }
        return tokens;
    }
    tokenize(str) {
        const elements = this.getElements(str);
        return this.getTokens(elements);
    }
    _createToken(element) {
        const token = {
            type: 'literal',
            value: element,
            raw: element
        };
        if (element[0] === '"' || element[0] === "'") {
            token.value = this._unquote(element);
        }
        else if (element.match(numericRegex)) {
            token.value = parseFloat(element);
        }
        else if (element === 'true' || element === 'false') {
            token.value = element === 'true';
        }
        else if (this._grammar.elements[element]) {
            token.type = this._grammar.elements[element].type;
        }
        else if (element.match(identRegex)) {
            token.type = 'identifier';
        }
        else {
            throw new Error(`Invalid expression token: ${element}`);
        }
        return token;
    }
    _escapeRegExp(str) {
        str = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (str.match(identRegex)) {
            str = '\\b' + str + '\\b';
        }
        return str;
    }
    _getSplitRegex() {
        if (!this._splitRegex) {
            const elemArray = Object.keys(this._grammar.elements)
                .sort((a, b) => {
                return b.length - a.length;
            })
                .map((elem) => {
                return this._escapeRegExp(elem);
            }, this);
            this._splitRegex = new RegExp('(' +
                [
                    preOpRegexElems.join('|'),
                    elemArray.join('|'),
                    postOpRegexElems.join('|')
                ].join('|') +
                ')');
        }
        return this._splitRegex;
    }
    _isNegative(tokens) {
        if (!tokens.length)
            return true;
        const lastToken = tokens[tokens.length - 1];
        if (!lastToken)
            return true;
        return minusNegatesAfter.some((type) => type === lastToken.type);
    }
    _isWhitespace(str) {
        return !!str.match(whitespaceRegex);
    }
    _unquote(str) {
        const quote = str[0];
        if (!quote) {
            throw new Error('Cannot unquote empty string');
        }
        const escQuoteRegex = new RegExp('\\\\' + quote, 'g');
        return str
            .substr(1, str.length - 2)
            .replace(escQuoteRegex, quote)
            .replace(escEscRegex, '\\');
    }
}
