let $expression;
let $table;

// This function is called when DOM is loaded
function loaded() {
  $expression = document.querySelector('#expression');
  $table = document.querySelector('#outcome-table');
}

// This function is called when the calculate button is pressed
// TODO: Add the same behaviour when user presses return in expression textbox
function onCalculatePress() {
  const val = $expression.value;
  const rpn = convertToRpn(val);
  const varList = getVariableInfo(rpn);
  const combinations = Math.pow(2, varList.length);

  const decToBin = (dec) => {
    let bin = (dec >>> 0).toString(2);

    // Add leading zeros
    while (bin.length !== varList.length) {
      bin = '0' + bin;
    }

    return bin;
  };

  // Prepare table header
  let tableHtml = '<tr>';
  for (let i = 0; i < varList.length; i++) {
    tableHtml += `<th>${varList[i]}</th>`;
  }

  tableHtml += '<th>Wynik</th></tr>';

  for (let current = 0; current < combinations; current++) {
    const bin = decToBin(current);
    let vars = {};

    // Create vars object with <varName>:<value> pairs
    for (let i = 0; i < varList.length; i++) {
      vars[varList[i]] = bin[i];
    }

    let result = calculateExpression(rpn.slice(), vars);

    // Add row with calculation result
    tableHtml += '<tr>';
    for (let i = 0; i < varList.length; i++) {
      tableHtml += `<td>${vars[varList[i]]}</td>`;
    }

    tableHtml += `<td>${result}</td></tr>`;

    console.log(vars);
    console.log(result);
    console.log('');
  }

  // Show the table
  $table.innerHTML = tableHtml;
}
