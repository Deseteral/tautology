
function convertToRPN(input) {
  let queue = '';
  let stack = [];

  input = input.replace(/\s+/g, '');
  input = input.split(/([\&\|\=\>\(\)])/);

  // Clean the array
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '') {
      input.splice(i, 1);
    }
  }

  for (let i = 0; i < input.length; i++) {
    let token = input[i];

    if (token === '0' || token === '1') {
      queue += token + ' ';
    } else if ('&|>='.indexOf(token) !== -1) {
      let o1 = token;
      let o2 = stack[stack.length - 1];
      while ('&|>='.indexOf(o2) !== -1) {
        queue += stack.pop() + ' ';
        o2 = stack[stack.length - 1];
      }

      stack.push(o1);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack[stack.length - 1] !== '(') {
        queue += stack.pop() + ' ';
      }

      stack.pop();
    }
  }

  while (stack.length > 0) {
    queue += stack.pop() + ' ';
  }

  return queue;
}

function calculate(rpn) {
  let stack = [];

  while (rpn.length !== 0) {
    let symbol = rpn[0];
    rpn = rpn.substr(1);

    let a;
    let b;
    let val;

    // If symbol is a value
    switch (symbol) {
      case '0':
        stack.push(0);
        break;
      case '1':
        stack.push(1);
        break;
      case '&':
        a = stack.pop();
        b = stack.pop();
        stack.push(b && a);
        break;
      case '|':
        a = stack.pop();
        b = stack.pop();
        stack.push(b || a);
        break;
      case '=':
        a = stack.pop();
        b = stack.pop();
        val = (b === a) ? 1 : 0;

        stack.push(val);
        break;
      case '>':
        a = stack.pop();
        b = (!(stack.pop())) ? 1 : 0;
        val = (b || a) ? 1 : 0;

        stack.push(val);
        break;
      default:
        break;
    }
  }

  return parseInt(stack);
}
