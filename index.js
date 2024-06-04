const locationDisplay = document.querySelector('.location-display');
const locationInput = document.querySelector('.form-control');
const formOne = document.querySelector('.container-fluid');
const temperatureCard = document.querySelector('.Temp');
const startDate = document.querySelector('#startD').value;
const endDate = document.querySelector('#endD').value;
const cardText = document.querySelector('.card-text');
const cel = document.querySelector('#cel');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const precipitation = document.querySelector('.precipprob');
const qTime = document.querySelector('.qTime');
const leftC = document.querySelector('.left-c');
const alerts = document.querySelector('.alerts');
const dateAlert = document.querySelector('.date-alert');
const showMap = document.querySelector('#showMap');
const mapContainer = document.querySelector('#map');
const cardBody = document.querySelector(".card-body");
const navbar = document.querySelector(".navbar");
let mapShown = false;

const tDate = new Date();

dateAlert.innerHTML = tDate;


function weatherIcon(data) {
    // Check if the container already has an icon
    const existingIcon = leftC.querySelector('.icon');
    if (existingIcon) {
        // If an icon exists, remove it
        existingIcon.remove();
    }

    // Create a new img element for the icon
    const img = document.createElement('img');
    const forecastDays = data.forecast.forecastday;
    const firstForecastDay = forecastDays[0];
    const conditions = firstForecastDay.day.condition;
    const weatherIconURL = conditions.icon;
    img.classList.add('icon');
    leftC.prepend(img);
    img.src = weatherIconURL;

    // Return the created img element
    return img;
}


let urlStructure = {
	key: 'DCUFENZ7QESXWSVNDYEH4TVQW',
	startDateTime: 'starts=' + startDate + 'T00:00:00-05:00&',
	endDateTime: 'ends=' + endDate + 'T00:00:00-05:00&',
	defaultLocation: 'Uruguay, salinas',
};

let URL =
	'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
	urlStructure.defaultLocation +
	'?unitGroup=us&key=' +
	urlStructure.key +
	'&contentType=json';

function dysplayData(res) {
	const description = res.data.currentConditions.conditions;
	const temperature = res.data.currentConditions.temp;
	const humidityData = res.data.currentConditions.humidity;
	const windSpeed = res.data.currentConditions.windspeed;
	const precipProb = res.data.currentConditions.precipprob;
	let des = res.data.description
	
	const days = res.data.days[0].datetime;
	console.log(res);
	const latitude = res.data.latitude;
	const longitud = res.data.longitude;

	console.log('Latitude:', latitude);
	console.log('Longitude:', longitud);

	cardText.innerHTML = description;
	temperatureCard.innerHTML = temperature;
	humidity.innerHTML = 'Humidity: ' + humidityData + '%';
	wind.innerHTML = 'Wind Velocity: ' + windSpeed + ' km/h';
	precipitation.innerHTML = 'Prob of precipitation: ' + precipProb + ' %';
	qTime.innerHTML = 'Description: ' + des;
}



let alertElement; // Declare alertElement globally to keep track of the alert

function getWeatherData(URL) {
    axios.get(URL)
        .then((res) => {
            dysplayData(res);
            // Remove any existing alert
            removeAlert();
        })
        .catch((error) => {
            let errorMessage;
            // Check if the error is due to a 400 status code (Bad Request)
            if (error.response && error.response.status === 400) {
                errorMessage = 'Invalid location. Please enter a valid location.';
            } else {
                errorMessage = 'An error occurred while fetching weather data. Please try again later.';
            }
            // If alertElement doesn't exist, create a new alert element
            if (!alertElement) {
                alertElement = document.createElement('div');
                alertElement.classList.add('alert', 'alert-warning', 'position-absolute', 'w-100', 'text-center', 'mt-3');
                navbar.style.position = 'relative'; // Ensure navbar has relative positioning
                navbar.append(alertElement); // Append the alert to the navbar
            }
            alertElement.textContent = errorMessage; // Set the alert message

            console.error('Weather data retrieval error:', error);
        });
}



// Function to remove the alert element
function removeAlert() {
    if (alertElement) {
        alertElement.remove();
        alertElement = null; // Reset alertElement to null
    }
}





// console.log(URL)
getWeatherData(URL);

// Function to create the alert element
function createAlert(errorMessage) {
    alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'alert-warning', 'position-absolute', 'w-100', 'text-center', 'mt-3');
    navbar.style.position = 'relative'; // Ensure navbar has relative positioning
    navbar.prepend(alertElement); // Append the alert to the navbar
    alertElement.textContent = errorMessage; // Set the alert message
}

locationInput.addEventListener('input', (evt) => {
    evt.preventDefault();
    const inputValue = locationInput.value.trim(); // Trim to remove leading and trailing spaces
    if (!inputValue) {
        locationDisplay.innerHTML = 'Weather Genius';
        // Remove the alert when the location input is empty
        removeAlert();
    } else {
        const capitalizedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
        locationDisplay.innerHTML = capitalizedValue;
       
    }
});


function locationForm() {
	
	formOne.addEventListener('submit', (evt) => {
		evt.preventDefault();
		const locationValue = locationInput.value.trim(); // Trim to remove leading and trailing spaces

		if (!locationValue) {
            // Display error message
            locationDisplay.innerHTML = 'Please enter a location';
            return; // Exit the function early
        }

		// Capitalize the first letter of the location value
		const capitalizedValue =
			locationValue.charAt(0).toUpperCase() + locationValue.slice(1);

		// Update the inner HTML of locationDisplay with the capitalized value
		locationDisplay.innerHTML = capitalizedValue;

		// Assuming urlStructure is defined elsewhere in your code
		urlStructure.defaultLocation = locationValue;

		URL =
			'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
			urlStructure.defaultLocation +
			'?unitGroup=us&key=' +
			urlStructure.key +
			'&contentType=json';

		// console.log(urlStructure.defaultLocation);
		const currentDate = new Date();

		// Format the date as required by the OpenWeatherMap API (YYYY-MM-DD)
		const formattedDate = currentDate.toISOString().split('T')[0];

		getWeatherData(URL);
		let openWeatherReport = {
			url: 'https://api.weatherapi.com/v1/history.json?',
			key: 'key=217c2c3bcd0e45f693f134151242405&',
			alerts: 'alerts=no&aqi=no&',
			dt: 'dt=' + formattedDate + '&', // Update this to your desired date
			where: 'q=' + urlStructure.defaultLocation,
		};
		

		const openUrl =
			openWeatherReport.url +
			openWeatherReport.key +
			openWeatherReport.alerts +
			openWeatherReport.dt +
			openWeatherReport.where;

		axios.get(openUrl).then((res) => {
			// Call weatherIcon function with the response data
			weatherIcon(res.data); // Ensure this appends the image to the correct element in your HTML
		});
	});

	
}

locationForm();

alerts.addEventListener('submit', (evt) => {
    evt.preventDefault();

    URL =
        'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
        urlStructure.defaultLocation +
        '?unitGroup=us&key=' +
        urlStructure.key +
        '&alerts?' +
        urlStructure.startDateTime +
        urlStructure.endDateTime +
        'contentType=json';

    console.log(URL);
    axios.get(URL).then((res) => {
        console.log(res.data);
        const alertsData = res.data.alerts;

        // Remove any existing alert
        removeAlert();

        if (alertsData.length === 0) {
            // If no alerts are found, display a message
            const noAlertsMessage = document.createElement('div');
            noAlertsMessage.classList.add('alert', 'alert-info', 'mt-3');
            noAlertsMessage.textContent = 'No alerts available. Please note that the range of alert duration time is from 0.25 to 99.5 hours for SAME alerts.';
            alerts.prepend(noAlertsMessage); // Append the message to the alerts container
        } else {
            // If alerts are found, display them
            displayAlerts(alertsData);
        }
    }).catch((error) => {
        console.error('Error fetching alerts:', error);
    });
});

// Function to remove the alert element
function removeAlertexisting() {
    const existingAlert = document.querySelector('.alert.alert-info');
    if (existingAlert) {
        existingAlert.remove();
    }
}


const darkModeButton = document.querySelector('.form-check-input');
const content = document.querySelector('body');
const nav = document.querySelector('.navbar');
let rainInterval; // Variable to hold the interval ID

darkModeButton.addEventListener('change', () => {
	const isDarkMode = document.body.classList.contains('dark-mode');
	document.body.classList.toggle('dark-mode');
	const h1 = document.querySelector("h1");
	content.classList.toggle('lighting-effect');
	nav.classList.toggle('bg-body-tertiary');
	nav.classList.toggle('light-text');
	h1.classList.toggle("h")

	if (isDarkMode) {
		// Clear the interval responsible for generating raindrops
		clearInterval(rainInterval);

		// Remove all existing raindrop elements
		const raindrops = document.querySelectorAll('.raindrop');
		raindrops.forEach((raindrop) => raindrop.remove());
	} else {
		// Generate raindrops at intervals
		rainInterval = setInterval(createRaindrop, 100);
	}
});

// Function to generate a random number between min and max values
function random(min, max) {
	return Math.random() * (max - min) + min;
}

// Function to create a raindrop element and add it to the rain container
function createRaindrop() {
	const raindrop = document.createElement('div');
	raindrop.classList.add('raindrop');
	raindrop.style.left = `${random(0, window.innerWidth)}px`;
	document.getElementById('rain-container').appendChild(raindrop);

	// Randomize the animation duration for a more natural effect
	const animationDuration = random(1, 3) + 's';
	raindrop.style.animation = `fall ${animationDuration} linear infinite`;

	// Remove the raindrop element when it reaches the bottom of the screen
	raindrop.addEventListener('animationiteration', () => {
		raindrop.remove();
	});
}

showMap.addEventListener('click', (evt) => {
    evt.preventDefault();
    
    if (!mapShown) {
        // Check if the map container already exists
        let map = document.getElementById("map");
        if (!map) {
            const divMap = document.createElement("div");
            divMap.id = "map";
            leftC.appendChild(divMap);
            // Fetch and initialize the map
            fetchAndInitializeMap();
        }
        showMap.innerHTML = "Close Map";
        mapShown = true;
    } else {
        // Remove the map container
        const map = document.getElementById("map");
        if (map) {
            map.remove();
        }
        showMap.innerHTML = "Show Map";
        mapShown = false;
    }
});


function fetchAndInitializeMap() {
    URL =
        'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
        urlStructure.defaultLocation +
        '?unitGroup=us&key=' +
        urlStructure.key +
        '&alerts?' +
        urlStructure.startDateTime +
        urlStructure.endDateTime +
        'contentType=json';

    axios.get(URL).then((res) => {
        console.log(res.data);
        const cordinates = res.data;
        console.log(cordinates);

        const lat = cordinates.latitude;
        const lon = cordinates.longitude;
        var map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
    });
}


