'use strict';

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", () => {
    
    let classification_id = parseInt(classificationList.value);
    console.log( "what type is the id",typeof(classification_id))
    console.log(`the classification id for the selected classification is ${classification_id}`)
    let classIdURL = `/inv/getInventory/${classification_id}`;
    fetch(classIdURL)
    .then((response) => {
        if (response.ok) {
            return response.json()
        }
        throw new Error("Network response was not ok.")
    })
    .then ((data) => {
        console.log("Data received:", data); // Debug log
        buildInventoryList(data);
    })
    .catch((error) => {
        console.error("Fetch error:", error.message);
    })
})


// Build inventory items into HTML table components and inject into DOM 
let buildInventoryList = (data) => {
    let inventoryDisplay = document.querySelector("#inventoryDisplay");
    inventoryDisplay.innerHTML = ""; // Clear previous content
    // Set up the table labels 
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; // Add header row
    dataTable += '</thead>';
    // Set up the table body
    dataTable += '<tbody>';
    // Iterate over all vehicles in the array and put each in a row
    data.forEach((element) => {
        console.log(`${element.inv_id}, ${element.inv_model}`); 
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href="/inv/edit/${element.inv_id}" title="Click to update ${element.inv_make} ${element.inv_model}">Modify</a></td>`;
        dataTable += `<td><a href="/inv/delete/${element.inv_id}" title="Click to delete ${element.inv_make} ${element.inv_model}">Delete</a></td>`;
    })
    dataTable += '</tbody>';
   // Display the contents in the Inventory Management view 
   inventoryDisplay.innerHTML = dataTable;  // Inject the HTML table into the DOM
   if (!data.length) {
    inventoryDisplay.innerHTML = "<p>No vehicles found in this classification.</p>";
    return;
    }
}