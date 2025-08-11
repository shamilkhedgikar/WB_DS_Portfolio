import find from "esri/rest/find";
import FindParameters from "esri/rest/support/FindParameters";

const calciteLoader = document.getElementById("calciteLoader");
const resultsTable = document.getElementById("tbl");
const findButton = document.getElementById("findBtn");
const inputTxt = document.getElementById("inputTxt");
const errorMsg = document.getElementById("errorMsg");

// Create a URL pointing to a map service
const findUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";

// Set parameters to only query the Counties layer by name
const params = new FindParameters({
  layerIds: [0],
  searchFields: ["areaname"]
});

// Executes on each button click
async function doFind() {
  if (calciteLoader) {
    calciteLoader.hidden = false;
  }
  if (errorMsg) {
    errorMsg.textContent = "";
  }
  if (!inputTxt) {
    console.error("inputTxt element not found");
    return;
  }
  // Set the search text to the value of the input box
  params.searchText = inputTxt.value;
  // The find() performs a LIKE SQL query based on the provided text value
  // showResults() is called once the promise returned here resolves
  try {
    const response = await find.find(findUrl, params);
    showResults(response);
  } catch (error) {
    rejectedPromise(error);
  }
}

// Executes when the promise from find.execute() resolves
function showResults(response) {
  const results = response.results;

  if (!resultsTable) {
    if (calciteLoader) {
      calciteLoader.hidden = true;
    }
    return;
  }

  // Clear the cells and rows of the table to make room for new results
  resultsTable.textContent = "";

  // If no results are returned from the find, notify the user
  if (results.length === 0) {
    resultsTable.textContent = "";
    const italic = document.createElement("i");
    italic.textContent = "No results found";
    resultsTable.appendChild(italic);
    calciteLoader.hidden = true;
    return;
  }

  // Set up row for descriptive headers to display results
  let topRow = resultsTable.insertRow(0);
  let cell1 = topRow.insertCell(0);
  let cell2 = topRow.insertCell(1);
  let cell3 = topRow.insertCell(2);
  let cell4 = topRow.insertCell(3);
  const header1 = document.createElement("b");
  header1.textContent = "City Name";
  cell1.appendChild(header1);
  const header2 = document.createElement("b");
  header2.textContent = "State Abbreviation";
  cell2.appendChild(header2);
  const header3 = document.createElement("b");
  header3.textContent = "Population (2000)";
  cell3.appendChild(header3);
  const header4 = document.createElement("b");
  header4.textContent = "Is state capital?";
  cell4.appendChild(header4);

  // Loop through each result in the response and add as a row in the table
  results.forEach(function (findResult, i) {
    // Get each value of the desired attributes
    const city = findResult.feature.attributes["AREANAME"];
    const state = findResult.feature.attributes["ST"];
    const pop2000 = findResult.feature.attributes["POP2000"];
    const capital = findResult.feature.attributes["CAPITAL"];

    // Add each resulting value to the table as a row
    const row = resultsTable.insertRow(i + 1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.textContent = city;
    cell2.textContent = state;
    cell3.textContent = pop2000;
    cell4.textContent = capital;
  });

  if (calciteLoader) {
    calciteLoader.hidden = true;
  }
}

// Executes each time the promise from find.execute() is rejected.
function rejectedPromise(error) {
  console.error("Promise didn't resolve: ", error.message);
  if (calciteLoader) {
    calciteLoader.hidden = true;
  }
  if (errorMsg) {
    errorMsg.textContent = `Error: ${error.message}`;
  }
}

document.getElementById("findBtn").addEventListener("click", doFind);
