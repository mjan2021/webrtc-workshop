console.log('Javascript Loaded!!')
const guidentApi = 'https://dev.bluepepper.us/api';
const guidentServer = 'https://guident.bluepepper.us:8444';
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
    const usersTableBody = document.getElementById('users-table').getElementsByTagName('tbody')[0];

    for (const userId in data.connections.users) {
        if (data.connections.users.hasOwnProperty(userId)) {
            const userData = data.connections.users[userId];
            getDetail('first_name', userData["user-id"])
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const nameCell = document.createElement('td');
            const connectionIdCell = document.createElement('td');
            const connectedToCell = document.createElement('td');
            const connectedAtCell = document.createElement('td');

            idCell.textContent = userData["user-id"];
            nameCell.textContent = userData["user-name"];
            connectionIdCell.textContent = userData["connection-id"];
            connectedToCell.textContent = userData["engagement-connection-id"];
            connectedAtCell.textContent = userData["connectedAt"];

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(connectionIdCell);
            row.appendChild(connectedToCell);
            row.appendChild(connectedAtCell);

            usersTableBody.appendChild(row);
        }
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
            const connectionIdCell = document.createElement('td');
            const connectedToCell = document.createElement('td');
            const latitudeCell = document.createElement('td');
            const longitudeCell = document.createElement('td');
            const speedCell = document.createElement('td');
            const rssiCell = document.createElement('td');
            const rsrqCell = document.createElement('td');
            const sinrCell = document.createElement('td');


            idCell.textContent = vehicleId;
            connectionIdCell.textContent = vehicleData["connection-id"];
            connectedToCell.textContent = vehicleData["engagement-connection-id"];
            latitudeCell.textContent = vehicleData.latitude;
            longitudeCell.textContent = vehicleData.longitude;
            speedCell.textContent = vehicleData.speed;
            rssiCell.textContent = vehicleData.rssi;
            rsrqCell.textContent = vehicleData.rsrq;
            sinrCell.textContent = vehicleData.sinr;

            row.appendChild(idCell);
            row.appendChild(connectionIdCell);
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

function getDetail(type, value){
    let data = fetch(guidentApi+'/users/'+value).then(data => 
        data.json().then(json => {
            console.log(json);
            return json;
        }));
    console.log(data);
}

// Function to make the API request
async function fetchData(guidentServer) {
    const url = guidentServer
  
    try {
      // Making the request using the fetch API
      const response = await fetch(url);
  
      // Checking if the response status is OK (200)
      if (response.ok) {
        // Parsing the JSON data from the response
        const jsonData = await response.json();
        // console.log(jsonData);
        setTimeout(displayDataInTables(jsonData), 5000);
        return jsonData;

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
  fetchData(guidentServer);
  