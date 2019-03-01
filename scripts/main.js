//Various QuerySelectors and other DOM stuff for different HTML elements on the page.
const airportValue = document.querySelector('#main-input'), searchButton = document.querySelector('#searchbutton');
const rawReport = document.querySelector('#rawreport'), airportName = document.querySelector('#airportname');
const altimeter = document.querySelector('#altimeter'), dewpoint = document.querySelector('#dewpoint');
const flightRules = document.querySelector('#flightrules'), timestamp = document.querySelector('#timestamp');
const dewDecimal = document.querySelector('#dewdecimal'), tempDecimal = document.querySelector('#tempdecimal');
const visibility = document.querySelector('#visibility'), windDir = document.querySelector('#winddir');
const windGust = document.querySelector('#windgust'), windSpeed = document.querySelector('#windspeed');
const showRawReport = document.querySelector('#showraw'), dropdownlist = document.querySelectorAll('.dropdown-menu .options');
const tempature = document.querySelector('#tempature'), dropbtn = document.querySelector('#dropbtn');

//Sets the default report type as METAR.
let report_type = 'metar';

//Replaces the dropdown with the selected report type, & sets the report_type variable accordingly.
dropdownlist.forEach((event) => {
	//Adds an event listener for each link tag in the dropdown list.
	event.addEventListener('click', () => {
		dropbtn.innerText = event.textContent;
		report_type = event.textContent.toLowerCase();
	});
});

//Fetches data from the AVWX API, based on the selected report type & airport, & returns the data in JSON format.
const fetchInfo = async (airport) => {
	try {
		const api_call = await fetch(`http://avwx.rest/api/preview/${report_type}/${airport}?options=&format=json`, { mode: 'cors' });
		const data = await api_call.json();
		return { data };
	}
	catch (Error) {
		alert('Error: Failed to fetch data, please input an appropriate ICATO airport code. (Example: KORD)');
	}
};

const dataShow = () => {
	if (report_type == 'metar') {
		//Displays the data for METAR reports.
		fetchInfo(airportValue.value).then(results => {
			/* Updates the appropriate HTML tags with the appropriate data.
			   The if statements check if the JSON object length that we wish to print to the page is > 0,
			   if it isn't then 'N/A' is printed instead. */
			console.log(results);
			airportName.innerHTML = `Airport: <span class="information">${results.data.station}</span>`;
			timestamp.innerHTML = `Timestamp: <span class="information">${results.data.meta.timestamp}</span><br>`;
			altimeter.innerHTML = `Altimeter: <span class="information">${results.data.altimeter.repr} inHg</span>`;
			temperature.innerHTML = `Temperature: <span class="information">${results.data.temperature.repr}</span>`;
			visibility.innerHTML = `Visibility: <span class="information">${results.data.visibility.repr} sm</span><br>`;
			flightRules.innerHTML = `Flight Rules: <span class="information">${results.data.flight_rules}</span>`;
			windDir.innerHTML = `Wind Direction: <span class="information">${results.data.wind_direction.repr}</span><br>`;
			//Noticed that the wind_gust sometimes returns an empty value, so if that occurs then 'N/A' is printed instead.
			if (results.data['wind_gust'] != null) {
				windGust.innerHTML = `Wind Gust: <span class="information">${results.data.wind_gust.repr}</span>`;
			} else {
				windGust.innerHTML = 'Wind Gust: <span class="information">N/A</span>';
			}
			windSpeed.innerHTML = `Wind Speed: <span class="information">${results.data.wind_speed.repr} kt</span><br>`;
			dewpoint.innerHTML = `Dewpoint: <span class="information">${results.data.dewpoint.repr}</span>`;
			dewDecimal.innerHTML = `Dew Decimal: <span class="information">${results.data.remarks_info.dewpoint_decimal.repr}</span>`;
			showRawReport.style.display = 'inline-block';
			showRawReport.innerHTML = `Raw Report`;
			rawReport.innerHTML = '';
			// Shows raw report when button is clicked, and then hides it if clicked again.
			showRawReport.addEventListener('click', () => {
				if (rawReport.innerHTML == '') {
					rawReport.innerHTML = `<span class="information">${results.data.raw}</span>`;
				} else {
					rawReport.innerHTML = '';
				}
			});
		});
		//Displays the data for TAF reports.
	} else if (report_type == 'taf') {
		fetchInfo(airportValue.value).then(results => {
			console.log(results);
			//Updates the appropriate HTML tags with the appropriate data.
			airportName.innerHTML = `Airport: <span class="information">${results.data.station}</span>`;
			timestamp.innerHTML = `Time: <span class="information">${results.data.time.dt}</span>`;

		});
	}
};

//Sets up an event-listener that calls the dataShow function when the search button is clicked, displaying the data.
searchButton.addEventListener('click', () => {
	console.log('Button clicked!')
	dataShow();
});