let table;

function loaded() {
  table = document.querySelector('#outcome-table');
}

function convertToRPN(input) {
  let queue = [];
  let stack = [];
  let vars = {};

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

    if (token.match(/[a-z]/i)) {
      queue.push(token);
      vars[token] = 0;
    } else if ('&|>='.indexOf(token) !== -1) {
      let o1 = token;
      let o2 = stack[stack.length - 1];

      while ('&|>='.indexOf(o2) !== -1) {
        queue.push(stack.pop());
        o2 = stack[stack.length - 1];
      }

      stack.push(o1);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack[stack.length - 1] !== '(') {
        queue.push(stack.pop());
      }

      stack.pop();
    }
  }

  while (stack.length > 0) {
    queue.push(stack.pop());
  }

  return { rpn: queue, variables: vars };
}

function setVariables(rpnInfo) {
  const rpn = rpnInfo.rpn;
  let vars = rpnInfo.variables;
  let keys = Object.keys(vars);
  let combinations = Math.pow(2, keys.length);

  let dec2bin = (dec) => {
    return (dec >>> 0).toString(2);
  };

  let tableHtml = '<tr>';
  for (let i = 0; i < keys.length; i++) {
    tableHtml += `<th>${keys[i]}</th>`;
  }
  tableHtml += '<th>Wynik</th></tr>';

  for (let current = 0; current < combinations; current++) {
    let bin = dec2bin(current);

    // Add leading zeros
    while (bin.length !== keys.length) {
      bin = '0' + bin;
    }

    for (let i = 0; i < keys.length; i++) {
      vars[keys[i]] = bin[i];
    }

    let readyRpn = rpn.slice();
    for (let i = 0; i < readyRpn.length; i++) {
      if (readyRpn[i].match(/[a-z]/i)) {
        readyRpn[i] = vars[readyRpn[i]];
      }
    }

    let outcome = calculate(readyRpn);
    console.log(outcome);

    tableHtml += '<tr>';
    for (let i = 0; i < keys.length; i++) {
      tableHtml += `<td>${vars[keys[i]]}</td>`;
    }
    tableHtml += `<td>${outcome}</td></tr>`;
  }

  table.innerHTML = tableHtml;
}

function calculate(rpn) {
  let stack = [];
  while (rpn.length !== 0) {
    let symbol = rpn.shift();

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

function onCalculatePress() {
  let val = document.querySelector('#expression').value;

  let rpnInfo = convertToRPN(val);
  setVariables(rpnInfo);
}
