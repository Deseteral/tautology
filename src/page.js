let $expression;
let $table;
let $graph;
let $isTautology;
let $isNotTautology;

const MAX_VARS_TO_RENDER_TABLE = 10;

// This function is called when DOM is loaded
function loaded() {
  $expression = document.querySelector('#expression');
  $table = document.querySelector('#outcome-table');
  $graph = document.querySelector('#graph');
  $isTautology = document.querySelector('#is-tautology');
  $isNotTautology = document.querySelector('#is-not-tautology');

  // Set last valid expression
  $expression.focus();
  if (localStorage.lastExpression !== undefined) {
    $expression.value = localStorage.lastExpression;
  }
}

function onEnterPress(e) {
  if (e.keyCode === 13) {
    onCalculatePress();
  }

  return false;
}

// This function is called when the calculate button is pressed
// TODO: Add the same behaviour when user presses return in expression textbox
function onCalculatePress() {
  // Get the expression and convert it to RPN
  const val = $expression.value;
  localStorage.lastExpression = $expression.value;

  if (val === '') {
    alert('Formuła nie może być pusta!');
    return;
  }

  const rpn = convertToRpn(val);
  const varList = getVariableInfo(rpn);

  // All possible combinations: 2 to the power of (varList.length)
  const combinations = (1 << varList.length);

  // Render the graph
  renderGraph(rpn);

  const decToBin = (dec) => {
    let bin = (dec >>> 0).toString(2);

    // Add leading zeros
    while (bin.length !== varList.length) {
      bin = '0' + bin;
    }

    return bin;
  };

  // Prepare table header
  if (varList.length < MAX_VARS_TO_RENDER_TABLE) {
    let tableHtml = '<tr class="title">';
    for (let i = 0; i < varList.length; i++) {
      tableHtml += `<th>${varList[i]}</th>`;
    }

    tableHtml += '<th>Wynik</th></tr>';
    $table.innerHTML = tableHtml;
  } else {
    $table.innerHTML = '';
  }

  // Check for all possible combinations
  let isTautology = true;
  let vars = {};
  let bin;
  let result;
  let row;
  let resultCell;

  console.time('calculations');
  for (let current = 0; current < combinations; current++) {
    bin = decToBin(current);

    // Create vars object with <varName>:<value> pairs
    for (let i = 0; i < varList.length; i++) {
      vars[varList[i]] = bin[i];
    }

    // Calculate the result
    result = calculateExpression(rpn, vars);

    // Check if the expression is tautology
    if (isTautology && result === 0) {
      isTautology = false;
    }

    // Add result to the array
    if (varList.length < MAX_VARS_TO_RENDER_TABLE) {
      row = $table.insertRow();

      if (result === 1) {
        row.className = 'true';
      }

      for (let i = 0; i < varList.length; i++) {
        row.insertCell().innerHTML = vars[varList[i]];
      }

      resultCell = row.insertCell();
      resultCell.innerHTML = result;
      resultCell.className = 'result';
    }
  }

  console.timeEnd('calculations');

  if (isTautology) {
    $isTautology.style.display = 'block';
    $isNotTautology.style.display = 'none';
  } else {
    $isTautology.style.display = 'none';
    $isNotTautology.style.display = 'block';
  }
}

function renderGraph(rpn) {
  let data = createGraph(rpn);
  let options = {
    interaction: {
      dragNodes: false,
      dragView: true,
      selectable: false,
      zoomView: true
    },
    layout: {
      hierarchical: {
        direction: 'UD'
      }
    }
  };

  new vis.Network($graph, data, options);
}
