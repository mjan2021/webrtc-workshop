console.log('Javascript Loaded!!')
const guidentApi = 'https://dev.bluepepper.us/api';
const guidentServer = 'https://guident.bluepepper.us:8444';
const email = 'sam@guident.co';
const password = 'secret';
let accessToken = '';
let returnData = null;

// Authenticate and make the API request
// Function to authenticate user and make API request
async function authenticateAndMakeRequest() {
   console.log('Authenticating...')
    try {
        const response = await fetch(guidentApi+'/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers as needed
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        if (response.ok) {
            // Successful response, handle the data
            const responseData = await response.json();
            accessToken = responseData.tokens.accessToken;
            // console.log('Access Token:', accessToken);
            return true;
        } else {
            // Handle error response
            console.error('Error:', response.status, response.statusText);
            return false
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error:', error.message);
        return false;
    }
}



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
            `;

            // Append the div to the data display element
            dataDisplayElement.appendChild(vehicleDiv);
        }
    }
}



// Function to display users data
function displayUsersData(data) {
    const usersTableBody = document.getElementById('users-table').getElementsByTagName('tbody')[0];

    for (const userId in data.connections.users) {
        if (data.connections.users.hasOwnProperty(userId)) {
            const userData = data.connections.users[userId];
            // let userDetailsJson = getDetail('first_name', userData["user-id"])
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const firstNameCell = document.createElement('td');
            const lastNameCell = document.createElement('td');
            const emailCell = document.createElement('td');
            const connectionIdCell = document.createElement('td');
            const connectedToCell = document.createElement('td');
            const connectedAtCell = document.createElement('td');

            var resp = fetch(guidentApi+'/users/'+userId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                }
            }).then(data => { data.json()
                .then((json) => {
                    console.log(json)
                    firstNameCell.textContent = json['first_name'];
                    lastNameCell.textContent = json['last_name'];
                    emailCell.textContent = json['email'];
                    idCell.textContent = userData["user-id"];
                    connectionIdCell.textContent = userData["connection-id"];
                    connectedToCell.textContent = userData["engagement-connection-id"];
                    
                    var connectedAtData = new Date(0);
                    connectedAtData.setUTCMilliseconds(userData["connectedAt"]);
                    connectedAtCell.textContent = connectedAtData;
                    
                    row.appendChild(idCell);
                    row.appendChild(firstNameCell);
                    row.appendChild(lastNameCell);
                    row.appendChild(emailCell);
                    row.appendChild(connectionIdCell);
                    row.appendChild(connectedToCell);
                    row.appendChild(connectedAtCell);
                    
                    usersTableBody.appendChild(row);

                })
            });
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
            const vehicleTypeCell = document.createElement('td');
            const idCell = document.createElement('td');
            const plateNumberCell = document.createElement('td'); 
            const connectionIdCell = document.createElement('td');
            const connectedToCell = document.createElement('td');
            const latitudeCell = document.createElement('td');
            const longitudeCell = document.createElement('td');
            const speedCell = document.createElement('td');
            const rssiCell = document.createElement('td');
            const rsrqCell = document.createElement('td');
            const sinrCell = document.createElement('td');

            var resp = fetch(guidentApi+'/vehicles/'+vehicleId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                }
                }).then(data => { data.json()
                    .then((json) => {
                        console.log(json)

                    vehicleTypeCell.textContent = '<img src="./assets/gemE4.png" style="width:60px;height40pc;">'
                    idCell.textContent = vehicleId;
                    plateNumberCell.textContent = json["license_plate"];
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
                });
            })
        }
    }
}


// Function to display VTU Request data
function displayVtuRequestData(data) {
    const vtuRequestTableBody = document.getElementById('vtu-request-table').getElementsByTagName('tbody')[0];

    // Loop through connections.vehicles
    for (const vehicleId in data['vtu-reset-requests']) {
        if (data['vtu-reset-requests'].hasOwnProperty(vehicleId)) {
            const requestData = data['vtu-reset-requests'][vehicleId];
            
            // Create a new row for each vehicle and display relevant information
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const licensePlateCell = document.createElement('td');
            const customerIdCell = document.createElement('td');
            const uniqueIdCell = document.createElement('td');
            const requestStatusCell = document.createElement('td');
            const requestedByCell = document.createElement('td');

            var resp = fetch(guidentApi+'/vehicles/'+vehicleId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                }
                }).then(data => { data.json()
                    .then((json) => {
                        console.log(json)

                        idCell.textContent = requestData["vehicle-id"];
                        licensePlateCell.textContent = json["license_plate"];
                        customerIdCell.textContent = json["customer_id"];
                        uniqueIdCell.textContent = requestData["unique-vehicle-id"];
                        requestStatusCell.textContent = requestData["reset-vtu-requested"];
                        requestedByCell.textContent = requestData["reset-vtu-requested-by"];
            
                        row.appendChild(idCell);
                        row.appendChild(licensePlateCell);
                        row.appendChild(customerIdCell);
                        row.appendChild(uniqueIdCell);
                        row.appendChild(requestStatusCell);
                        row.appendChild(requestedByCell);
            
                        vtuRequestTableBody.appendChild(row);
                });
            })
        }
    }
}


function getCustomerData(customerId){
    fetch(guidentApi+'/customers/'+customerId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            }
                }).then(
                    data => data.json()
                    .then(json => {console.log(json)})
                );
}

function getDetail(type, value){
    // return null;
    
    fetch(guidentApi+'/users/'+value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })
    .then(data => data.json()
         .then(json => {
             console.log(type+': '+json[type]);
             returnData = json;
            })
         );
}

// Function to make the API request
async function fetchData(guidentServer) {
    const url = guidentServer
  
    try {
      // Making the request using the fetch API
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    });
  
      // Checking if the response status is OK (200)
      if (response.ok) {
        // Parsing the JSON data from the response
        const jsonData = await response.json();
        console.log(jsonData);
        displayDataInTables(jsonData);
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

  // Function to display data in tables
function displayDataInTables(data) {
    displayUsersData(data);
    displayVehiclesData(data);
    displayVtuRequestData(data);
}

function startTimer() {

    var timer = 0
    setInterval(()=>{
        if (timer == 30) {
            window.location.reload()
        }
    },1000);
}

// Calling the function to initiate the request
if(authenticateAndMakeRequest()){
    console.log('Authenticated!!')
    fetchData(guidentServer);
    startTimer();
    getCustomerData('3');
    // setInterval( window.location.reload(), 10000);

}

// validateToken(accessToken);
