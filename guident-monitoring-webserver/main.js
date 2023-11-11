console.log('Javascript Loaded!!')

// const getJSON = async url => {
//     const response = await fetch(url);
//     console.log(response);
//     return response.json(); // get JSON from the response 
//   }
  
// console.log("Fetching data...");
// getJSON("https://guident.bluepepper.us:8444")
// .then(data => console.log(data));
 // Function to display data
 function displayData(data) {
    const dataDisplayElement = document.getElementById('data');

    // Loop through connections.vehicles
    for (const vehicleId in data.connections.vehicles) {
        if (data.connections.vehicles.hasOwnProperty(vehicleId)) {
            const vehicleData = data.connections.vehicles[vehicleId];

            // Create a new div for each vehicle and display relevant information
            const vehicleDiv = document.createElement('div');
            vehicleDiv.innerHTML = `
                <p>Vehicle ID: ${vehicleId}</p>
                <p>Connected To: ${vehicleData["engagement-connection-id"]}</p>
                <p>Latitude: ${vehicleData.latitude}</p>
                <p>Longitude: ${vehicleData.longitude}</p>
                <p>Speed: ${vehicleData.speed}</p>
                <p>RSSI: ${vehicleData.rssi}</p>
                <p>RSRQ: ${vehicleData.rsrq}</p>
                <p>SINR: ${vehicleData.sinr}</p>
                <!-- Add more information as needed -->
            `;

            // Append the div to the data display element
            dataDisplayElement.appendChild(vehicleDiv);
        }
    }
}
// Function to display data in tables
function displayDataInTables(data) {
    displayUsersData(data);
    displayVehiclesData(data);
}

// Function to display users data
function displayUsersData(data) {
    // const usersHeader = document.getElementsByClassName('users-header');
    // console.log(data.connections.users.split(',').length)
    // usersHeader.textContent = "Users: "+data.connections.users.split(',').length;
    const usersTableBody = document.getElementById('users-table').getElementsByTagName('tbody')[0];

    // Check if users data is present
    if (data.connections.users !== "") {
        // Assuming user data is a comma-separated string
        const userIds = data.connections.users.split(',');

        userIds.forEach(userId => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = userId;
            row.appendChild(cell);
            usersTableBody.appendChild(row);
        });
    }
}

// Function to display vehicles data
function displayVehiclesData(data) {
    // const vehiclesHeader = document.getElementsByClassName('vehicles-header');
    // vehiclesHeader.textContent = "Vehicles: "+data.connections.users.split(',').length;
    // console.log(data.connections.vehicles.length)
    const vehiclesTableBody = document.getElementById('vehicles-table').getElementsByTagName('tbody')[0];

    // Loop through connections.vehicles
    for (const vehicleId in data.connections.vehicles) {
        if (data.connections.vehicles.hasOwnProperty(vehicleId)) {
            const vehicleData = data.connections.vehicles[vehicleId];

            // Create a new row for each vehicle and display relevant information
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const connectedToCell = document.createElement('td');
            const latitudeCell = document.createElement('td');
            const longitudeCell = document.createElement('td');
            const speedCell = document.createElement('td');
            const rssiCell = document.createElement('td');
            const rsrqCell = document.createElement('td');
            const sinrCell = document.createElement('td');


            idCell.textContent = vehicleId;
            connectedToCell.textContent = vehicleData["engagement-connection-id"];
            latitudeCell.textContent = vehicleData.latitude;
            longitudeCell.textContent = vehicleData.longitude;
            speedCell.textContent = vehicleData.speed;
            rssiCell.textContent = vehicleData.rssi;
            rsrqCell.textContent = vehicleData.rsrq;
            sinrCell.textContent = vehicleData.sinr;

            row.appendChild(idCell);
            row.appendChild(connectedToCell);
            row.appendChild(latitudeCell);
            row.appendChild(longitudeCell);
            row.appendChild(speedCell);
            row.appendChild(rssiCell);
            row.appendChild(rsrqCell);
            row.appendChild(sinrCell);

            // Append the row to the table body
            vehiclesTableBody.appendChild(row);
        }
    }
}


// Function to make the API request
async function fetchData() {
    const url = 'https://guident.bluepepper.us:8444';
  
    try {
      // Making the request using the fetch API
      const response = await fetch(url);
  
      // Checking if the response status is OK (200)
      if (response.ok) {
        // Parsing the JSON data from the response
        const jsonData = await response.json();
        console.log(jsonData);
        setTimeout(displayDataInTables(jsonData), 5000);
      } else {
        // Handling non-OK response status
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      // Handling any network or other errors
      console.error('Error:', error.message);
    }
  }
  
  // Calling the function to initiate the request
  fetchData();
  