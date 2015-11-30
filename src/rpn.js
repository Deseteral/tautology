
// Converts infix notation to RPN
// Returns array of RPN tokens
function convertToRpn(input) {
  let queue = [];
  let stack = [];

  input = input.replace(/\s+/g, '');
  input = input.split(/([\&\|\=\>\<\(\)\!])/);

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
    } else if ('&|><=!'.indexOf(token) !== -1) {
      let o1 = token;
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
function calculateExpression(rpn, vars) {
  let stack = [];

  // Replace variables with acutal values
  for (let i = 0; i < rpn.length; i++) {
    if (rpn[i].match(/[a-z]/i)) {
      rpn[i] = vars[rpn[i]];
    }
  }

  // Calculate
  while (rpn.length !== 0) {
    let symbol = rpn.shift();

    let a;
    let b;

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

  return parseInt(stack);
}

// Returns the array of variable tokens in RPN expression
function getVariableInfo(rpn) {
  let vars = [];

  for (let i = 0; i < rpn.length; i++) {
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

function createGraph(rpn) {

  // Create nodes
  let nodes = [];

  for (let i = 0; i < rpn.length; i++) {

    let col;

    if (rpn[i].match(/[a-z]/i)) {
      col = '#AED581';
    } else {
      col = '#7CB342';
    }

    nodes.push({ id: i, label: rpn[i], level: 0, color: col });
  }

  // Create connections between nodes
  let edges = [];
  let connectTo = rpn.length - 1;
  let connectionsNo = [];
  let level = 1;

  for (let i = 0; i < rpn.length; i++) {
    connectionsNo.push(0);
  }

  for (let i = rpn.length - 2; i >= 0; i--) {
    // Operator
    if (rpn[i].match(/([\&\|\=\>\<\!])/i)) {
      edges.push({ from: connectTo, to: i });
      connectionsNo[connectTo]++;
      connectTo = i;
      nodes[i].level = level;
      level++;
    }

    // Variable
    if (rpn[i].match(/[a-z]/i)) {
      edges.push({ from: connectTo, to: i });
      connectionsNo[connectTo]++;
      nodes[i].level = level;

      if (connectionsNo[connectTo] === 2 ||
        (nodes[connectTo].label === '!' && connectionsNo[connectTo] === 1)) {

        for (let j = 0; j < edges.length; j++) {
          if (edges[j].to === connectTo) {
            connectTo = edges[j].from;
            level--;
            break;
          }
        }
      }
    }
  }

  // Reverse the edges
  edges.reverse();

  // Create data sets
  let nodeDataSet = new vis.DataSet(nodes);
  let edgesDataSet = new vis.DataSet(edges);

  let data = {
    nodes: nodeDataSet,
    edges: edgesDataSet
  };

  return data;
}
