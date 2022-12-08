// Various selectors and other DOM stuff for different HTML elements on the page.
const airportValue = document.getElementById('main-input'), searchButton = document.getElementById('searchbutton');
const dropdownlist = document.querySelectorAll('.dropdown-menu .options');
const dropbtn = document.getElementById('dropbtn');

// Sets the report type as METAR (currently the only one supported, TAF to come in the future).
let report_type = 'metar';

// Replaces the dropdown with the selected report type, & sets the report_type variable accordingly.
dropdownlist.forEach((event) => {
	//Adds an event listener for each link tag in the dropdown list.
	event.addEventListener('click', () => {
		dropbtn.innerText = event.textContent;
		report_type = event.textContent.toLowerCase();
	});
});

// Fetches data from the AVWX API, based on the selected report type & airport, & returns the data in JSON format.
const fetchInfo = async (airport) => {
	try {
		const token = 'OelaG0zRE-mlEj6139ZSDFP5bW-to6J41fRoti8UYlU';
		const api_call = await fetch(
			`https://avwx.rest/api/${report_type}/${airport}?options=&airport=true&reporting=true&format=json&remove=&filter=&onfail=cache`, { 
			mode: 'cors',
			headers: {
				Authorization: 'BEARER ' + token,
			}
		});
		const data = await api_call.json();
		return { data };
	}
	catch (Error) {
		alert('Error: Failed to fetch data, please input an appropriate ICATO airport code. (Example: KORD)');
	}
};

// List of data labels and their keys to grab from the results.
const dataNames = [
	{name: 'Airport', key: 'station'},
	{name: 'Timestamp', key: 'time', subKey: 'dt'},
	{name: 'Altimeter', key: 'altimeter', subKey: 'repr'},
	{name: 'Temperature', key: 'temperature', subKey: 'repr'},
	{name: 'Visibility', key: 'visibility', subKey: 'repr'},
	{name: 'Flight Rules', key: 'flight_rules'},
	{name: 'Wind Direction', key: 'wind_direction', subKey: 'repr'},
	{name: 'Wind Gust', key: 'wind_gust', subKey: 'repr'},
	{name: 'Wind Speed', key: 'wind_speed', subKey: 'value'},
	{name: 'Dewpoint', key: 'dewpoint', subKey: 'repr'}
];

// Helper function to remove all the current tags/nodes with data.
const removeAllChildNodes = (parent) => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

const dataShow = () => {
	if (report_type == 'metar') {
		// Displays the data for METAR reports.
		fetchInfo(airportValue.value).then(results => {
			// Creates new HTML tags and updates them with the appropriate data.

			if (!results) {
				return;
			}

			let ul = document.getElementById("results");
			removeAllChildNodes(ul);
		
			for (const item of dataNames) {
				if (results.data[item.key] === undefined || results.data[item.key] === null) {
					continue;
				}

				let li = document.createElement("li");
				li.className = "information";

				const data = ('subKey' in item) ? results.data[item.key][item.subKey] : results.data[item.key];
				li.innerHTML = item.name + `: ${data}`;
				ul.append(li);
			}
		});
	}
};

//Sets up an event-listener that calls the dataShow function when the search button is clicked, displaying the data.
searchButton.addEventListener('click', () => {
	dataShow();
});
