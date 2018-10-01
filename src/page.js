const MAX_VARS_TO_RENDER_TABLE = 10;

// This function is called when DOM is loaded
const $expression = document.getElementById('expression');
const $table = document.getElementById('outcome-table');
const $graph = document.getElementById('graph-renderer');
const $isTautology = document.querySelector('.is-tautology .is');
const $isNotTautology = document.querySelector('.is-tautology .is-not');

// Set last valid expression
$expression.focus();
if (localStorage.lastExpression !== undefined) {
  $expression.value = localStorage.lastExpression;
}

function renderGraph(rpn) {
  const data = createGraph(rpn);
  const options = {
    interaction: {
      dragView: true,
      zoomView: true,
      dragNodes: false,
      selectable: false,
    },
    layout: {
      hierarchical: {
        direction: 'UD',
      },
    },
  };

  new vis.Network($graph, data, options); // eslint-disable-line no-new
}

// This function is called when the calculate button is pressed
// TODO: Add the same behaviour when user presses return in expression textbox
function onCalculatePress() {
  // Get the expression
  const val = $expression.value;

  // Save current expression in local storage
  // TODO: Only save valid expressions
  localStorage.lastExpression = $expression.value;

  if (val === '') {
    window.alert('Formuła nie może być pusta!');
    return;
  }

  // Show all of the hidden stuff
  document.querySelector('.is-tautology').style.display = 'block';
  document.querySelector('.graph').style.display = 'block';
  document.querySelector('.table').style.display = 'block';

  // Convert the expression to RPN
  const rpn = convertToRpn(val);
  const varList = getVariableInfo(rpn);

  // All possible combinations: 2 to the power of (varList.length)
  const combinations = (2 ** varList.length);

  // Render the graph
  renderGraph(rpn);

  const decToBin = (dec) => {
    let bin = (dec >>> 0).toString(2); // eslint-disable-line no-bitwise

    // Add leading zeros
    while (bin.length !== varList.length) {
      bin = `0${bin}`;
    }

    return bin;
  };

  // Prepare table header
  if (varList.length < MAX_VARS_TO_RENDER_TABLE) {
    let tableHtml = '<tr class="title">';
    for (let i = 0; i < varList.length; i += 1) {
      tableHtml += `<th>${varList[i]}</th>`;
    }

    tableHtml += '<th>Wynik</th></tr>';
    $table.innerHTML = tableHtml;
  } else {
    $table.innerHTML = '';
  }

  // Check for all possible combinations
  let isTautology = true;
  const vars = {};
  let bin;
  let result;
  let row;
  let resultCell;

  console.time('calculations');
  for (let current = 0; current < combinations; current += 1) {
    bin = decToBin(current);

    // Create vars object with <varName>:<value> pairs
    for (let i = 0; i < varList.length; i += 1) {
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

      for (let i = 0; i < varList.length; i += 1) {
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

function onKeyPress(event) {
  if (event.key === 'Enter') {
    onCalculatePress();
  }

  return false;
}

$expression.addEventListener('keydown', onKeyPress);
