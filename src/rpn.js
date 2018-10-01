
// Converts infix notation to RPN
// Returns array of RPN tokens
function convertToRpn(data) { // eslint-disable-line no-unused-vars
  const queue = [];
  const stack = [];

  let input = data.replace(/\s+/g, '');
  input = input.split(/([&|=><()!])/);

  // Clean the array
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] === '') {
      input.splice(i, 1);
    }
  }

  for (let i = 0; i < input.length; i += 1) {
    const token = input[i];

    if (token.match(/[a-z]/i)) {
      queue.push(token);
    } else if ('&|><=!'.indexOf(token) !== -1) {
      const o1 = token;
      let o2 = stack[stack.length - 1];

      while ('&|><=!'.indexOf(o2) !== -1) {
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

  return queue;
}

// Calculates the value of the expression expressed as RPN
// Returns 0 or 1, the result of calculations
function calculateExpression(rpn, vars) { // eslint-disable-line no-unused-vars
  const stack = [];
  let symbol;

  let a;
  let b;

  // Calculate
  for (let i = 0; i < rpn.length; i += 1) {
    symbol = rpn[i];

    // If the symbol is variable push its value on to the stack
    // If it's a operator, do necessary operation
    if (symbol.match(/[a-z]/i)) {
      stack.push(+(vars[symbol]));
    } else {
      switch (symbol) {
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
          stack.push(+(b === a));
          break;
        case '>':
          a = stack.pop();
          b = +(!(stack.pop()));
          stack.push(+(b || a));
          break;
        case '<':
          a = +(!(stack.pop()));
          b = stack.pop();
          stack.push(+(b || a));
          break;
        case '!':
          a = stack.pop();
          stack.push(+(!a));
          break;
        default:
          break;
      }
    }
  }

  return stack[0];
}

// Returns the array of variable tokens in RPN expression
function getVariableInfo(rpn) { // eslint-disable-line no-unused-vars
  const vars = [];

  for (let i = 0; i < rpn.length; i += 1) {
    // If the token is a variable (character)
    if (rpn[i].match(/[a-z]/i)) {
      // And it's not in vars array
      if (vars.indexOf(rpn[i]) === -1) {
        vars.push(rpn[i]);
      }
    }
  }

  return vars;
}

function createGraph(rpn) { // eslint-disable-line no-unused-vars
  // Create nodes
  const nodes = [];

  for (let i = 0; i < rpn.length; i += 1) {
    let col;

    if (rpn[i].match(/[a-z]/i)) {
      col = '#AED581';
    } else {
      col = '#7CB342';
    }

    nodes.push({
      id: i,
      label: rpn[i],
      level: 0,
      color: col,
    });
  }

  // Create connections between nodes
  const edges = [];
  let connectTo = rpn.length - 1;
  const connectionsNo = [];
  let level = 1;

  for (let i = 0; i < rpn.length; i += 1) {
    connectionsNo.push(0);
  }

  for (let i = rpn.length - 2; i >= 0; i -= 1) {
    // Operator
    if (rpn[i].match(/([&|=><!])/i)) {
      edges.push({ from: connectTo, to: i });
      connectionsNo[connectTo] += 1;
      connectTo = i;
      nodes[i].level = level;
      level += 1;
    }

    // Variable
    if (rpn[i].match(/[a-z]/i)) {
      edges.push({ from: connectTo, to: i });
      connectionsNo[connectTo] += 1;
      nodes[i].level = level;

      while (connectTo !== (nodes.length - 1)
        && (connectionsNo[connectTo] === 2
        || (nodes[connectTo].label === '!' && connectionsNo[connectTo] === 1))) {
        for (let j = 0; j < edges.length; j += 1) {
          if (edges[j].to === connectTo) {
            connectTo = edges[j].from;
            level -= 1;
            break;
          }
        }
      }
    }
  }

  // Reverse the edges
  edges.reverse();

  // Create data sets
  const nodeDataSet = new vis.DataSet(nodes);
  const edgesDataSet = new vis.DataSet(edges);

  const data = {
    nodes: nodeDataSet,
    edges: edgesDataSet,
  };

  return data;
}
