const fs = require('fs');
const path = require('path')

function Token(type, value) {
    this.type = type;
    this.value = value;
}

function isDigit(x) {
    return x >= '0' && x <= '9';
}

function getTokens(source) {
    let prev = 0;
    let curr = 0;
    let len = source.length;
    let tokens = [];
    while (curr < len) {
        let c = source[curr];
        if (isDigit(c)) {
            while (curr + 1 < len && isDigit(source[curr + 1])) {
                curr += 1;
            }
            let value = source.substring(prev, curr + 1);
            let token = new Token('number', value);
            tokens.push(token);
        } else if (c === '+') {
            let token = new Token('plus');
            tokens.push(token);
        } else if (c === '-') {
            let token = new Token('minus');
            tokens.push(token);
        }
        curr += 1;
        prev = curr;
    }
    return tokens;
}

function PLUS_EXPRESSION(op, left, right) {
    this.op = op;
    this.left = left;
    this.right = right;
}
function MINUS_EXPRESSION(op, left, right) {
    this.op = op;
    this.left =left;
    this.right =right;
}


const ptable = {
    'minus': 1,
    'plus': 1
}
/**
 * plus expression: number [op plus expression]
 * minus expression: plus expression [op plus expression]
 * 1 + 1 - 1
 * 1 - 1 + 1
 * 
 */
function compile(tokens) {
    let curr = 0;
    let len = tokens.length;
    let p1 = tokens[curr];
    curr += 1;
    function compare(t1, t2) {
        let table = {
            'plus': 2,
            'minus': 2
        }
        let x1 = table[t1.type];
        let x2 = table[t2.type];
        return x1 - x2;
    }
    function isOp(t) {
        return t.type === 'plus' || t.type === 'minus';
    }
    function exp() {
        let p2 = tokens[curr];
        let exp = fn(p1, p2);
        console.log({p2, exp})
        curr += 1;
        if (curr <= tokens.length && isOp(tokens[curr])) {
            exp = fn(exp, tokens[curr]);
        }
        return exp;
    }
    function getExp(op, left, right) {
        let exp = op.type === 'plus' ? PLUS_EXPRESSION : MINUS_EXPRESSION;
        return new exp(op, left, right);
    }
    function fn(left, op) {
        curr += 1;
        let right = tokens[curr];
        console.log({right});
        if (curr + 1 >= tokens.length) return getExp(op, left, right);
        let tt = tokens[curr + 1];
        if (compare(op, tt) >= 0) return getExp(op, left, right)
        else return exp();
    }
    let exps = [];
    while(curr < len) {
        let e = exp();
        exps.push(e);
        curr += 1;
    }
    console.log({exps})
    return exps;
}

function evaluate(x) {
    if (x instanceof Token) {
        return Number(x.value);
    } else if (x instanceof PLUS_EXPRESSION) {
        return evaluate(x.left) + evaluate(x.right);
    } else if (x instanceof MINUS_EXPRESSION) {
        return evaluate(x.left) - evaluate(x.right);
    }
}

function execute(root) {
    let op = root.op;
    let {left, right} = root
    switch(op.type) {
        case 'plus': {
            let result = evaluate(left) + evaluate(right);
            console.log({result})
            break;
        }
        case 'minus': {
            let result = evaluate(left) - evaluate(right);
            console.log({result})
            break;
        }
    }
}

function main() {
    let file = process.argv[2];
    let rs = fs.createReadStream(path.join(__dirname, file));
    let source = ''
    rs.on('data', block => {
        source += block.toString();
    })
    rs.on('close', () => {
        let tokens = getTokens(source);
        console.log({tokens})
        let ast = compile(tokens);
        execute(ast[0]);
    })
}

main();