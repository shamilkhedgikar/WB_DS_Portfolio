import * as find from "https://js.arcgis.com/4.32/@arcgis/core/rest/find.js";
import FindParameters from "https://js.arcgis.com/4.32/@arcgis/core/rest/support/FindParameters.js";

const calciteLoader = document.getElementById("calciteLoader");
// Create a URL pointing to a map service
const findUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";

// Set parameters to only query the Counties layer by name
const params = new FindParameters({
  layerIds: [0],
  searchFields: ["areaname"],
});

// Cache reusable DOM elements
const resultsTable = document.getElementById("tbl");
const errorMsg = document.getElementById("errorMsg");

// Executes on each button click
function doFind() {
  // Display loading gif to provide the user feedback on search progress
  calciteLoader.hidden = false;
  errorMsg.textContent = "";
  // Set the search text to the value of the input box
  params.searchText = document.getElementById("inputTxt").value;
  // The find() performs a LIKE SQL query based on the provided text value
  // showResults() is called once the promise returned here resolves
  find.find(findUrl, params).then(showResults).catch(rejectedPromise);
}

// Executes when the promise from find.execute() resolves
function showResults(response) {
  const results = response.results;

  // Clear the cells and rows of the table to make room for new results
  resultsTable.innerHTML = "";

  // If no results are returned from the find, notify the user
  if (results.length === 0) {
    resultsTable.innerHTML = "<i>No results found</i>";
    calciteLoader.hidden = true;
    return;
  }

  // Set up row for descriptive headers to display results
  const topRow = resultsTable.insertRow(0);
  const header1 = topRow.insertCell(0);
  const header2 = topRow.insertCell(1);
  const header3 = topRow.insertCell(2);
  const header4 = topRow.insertCell(3);
  header1.innerHTML = "<b>City Name</b>";
  header2.innerHTML = "<b>State Abbreviation</b>";
  header3.innerHTML = "<b>Population (2000)</b>";
  header4.innerHTML = "<b>Is state capital?</b>";

  // Build rows in a document fragment to minimize DOM reflows
  const fragment = document.createDocumentFragment();

  // Loop through each result in the response and add as a row in the table
  results.forEach(function (findResult) {
    // Get each value of the desired attributes
    const city = findResult.feature.attributes["AREANAME"];
    const state = findResult.feature.attributes["ST"];
    const pop2000 = findResult.feature.attributes["POP2000"];
    const capital = findResult.feature.attributes["CAPITAL"];

    // Create each resulting value as a row
    const row = document.createElement("tr");
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");
    const cell4 = document.createElement("td");
    cell1.textContent = city;
    cell2.textContent = state;
    cell3.textContent = pop2000;
    cell4.textContent = capital;
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    fragment.appendChild(row);
  });

  resultsTable.appendChild(fragment);
  calciteLoader.hidden = true;
}

// Executes each time the promise from find.execute() is rejected.
function rejectedPromise(error) {
  console.error("Promise didn't resolve: ", error.message);
  calciteLoader.hidden = true;
  errorMsg.textContent = "Error: " + error.message;
}

// Run doFind() when button is clicked
document.getElementById("findBtn").addEventListener("click", doFind);

