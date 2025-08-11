import find from "esri/rest/find";
import FindParameters from "esri/rest/support/FindParameters";

const calciteLoader = document.getElementById("calciteLoader");

// Create a URL pointing to a map service
const findUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";

// Set parameters to only query the Counties layer by name
const params = new FindParameters({
  layerIds: [0],
  searchFields: ["areaname"]
});

// Executes on each button click
async function doFind() {
  // Display loading gif to provide the user feedback on search progress
  calciteLoader.hidden = false;
  // Set the search text to the value of the input box
  params.searchText = document.getElementById("inputTxt").value;
  // The find() performs a LIKE SQL query based on the provided text value
  // showResults() is called once the promise returned here resolves
  try {
    const response = await find.find(findUrl, params);
    showResults(response);
  } catch (error) {
    rejectedPromise(error);
  }
}

const resultsTable = document.getElementById("tbl");

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
  let topRow = resultsTable.insertRow(0);
  let cell1 = topRow.insertCell(0);
  let cell2 = topRow.insertCell(1);
  let cell3 = topRow.insertCell(2);
  let cell4 = topRow.insertCell(3);
  cell1.innerHTML = "<b>City Name</b>";
  cell2.innerHTML = "<b>State Abbreviation</b>";
  cell3.innerHTML = "<b>Population (2000)</b>";
  cell4.innerHTML = "<b>Is state capital?</b>";

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
    cell1.innerHTML = city;
    cell2.innerHTML = state;
    cell3.innerHTML = pop2000;
    cell4.innerHTML = capital;
  });
  calciteLoader.hidden = true;
}

// Executes each time the promise from find.execute() is rejected.
function rejectedPromise(error) {
  console.error("Promise didn't resolve: ", error.message);
}

// Run doFind() when button is clicked
document.getElementById("findBtn").addEventListener("click", doFind);
