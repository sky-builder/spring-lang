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

/**
 * plus expression: number op plus expression
 * 
 */
function compile(tokens) {
    let prev = 0;
    let curr = 0;
    let len = tokens.length;
    function plusExpression() {
        if (curr >= len) return;
        let left = tokens[curr];
        curr += 1;
        if (curr >= len) return left;
        let op = tokens[curr];
        curr += 1;
        let right = plusExpression();
        return new PLUS_EXPRESSION(op, left, right);
    }
    let node = plusExpression();
    console.log({node})
    return node;
}

function evaluate(x) {
    if (x instanceof Token) {
        return Number(x.value);
    } else if (x instanceof PLUS_EXPRESSION) {
        return evaluate(x.left) + evaluate(x.right);
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
        execute(ast);
    })
}

main();