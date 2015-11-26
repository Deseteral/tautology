
function toRPN(input) {
  let queue = [];
  let stack = [];

  while (input.length !== 0) {
    let first = input[0];

    input = input.substr(1);

    if (first === '0' || first === '1') {
      // If the symbol is a value, add it to the queue
      queue.push(first);
    } else if (first === '&' || first === '|') {
      // If the symbol is an operator

      // Top of the stack
      let o2 = stack[stack.length - 1];

      while (stack.length !== 0 && o2 !== '(') {
        queue.push(stack.pop());
      }

      stack.push(first);
    } else if (first === '(') {
      stack.push(first);
    } else if (first === ')') {
      let top = stack.pop();

      while (top !== '(' && top !== undefined) {
        queue.push(top);
        top = stack.pop();
      }
    }
  }

  // Add the rest of the operators to the queue
  while (stack.length !== 0) {
    queue.push(stack.pop());
  }

  return queue.join(' ');
}
