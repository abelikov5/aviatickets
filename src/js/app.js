import locations from './store/location';
import axios from 'axios';
import '../css/style.css';
import './plugins';

import dateValue from './store/current_date';
import curActial from './store/currency';
// import { getMonth, getDate } from 'date-fns';
import autoprefixer from 'autoprefixer';
import config from './config/apiConfig';

curActial();

let response = {};

let curCurr = {
	curName: '$',
};


document.querySelector("select").addEventListener('change', function (e) {
	if (e.target.value == '€')
		flightUploadHTML(response, curCurr.eur, '€');
	else if (e.target.value == '₽')
		flightUploadHTML(response, curCurr.rub, '₽');
	else if (e.target.value == '$')	
		flightUploadHTML(response);

	// if (e.target.value == '₽') {
	// 	let arrCurr = document.querySelectorAll('.fly_card .price_flight');
	// 	curCurr.src = parseInt(arrCurr[i].textContent);

	// }
	// curCurr.dest = curCurr.curName == '$' ? 1 : 0;
	// curCurr.curName = e.target.value;

	
	// let i = 0;
	// curCurr.src = parseInt(arrCurr[i].textContent);
	
	// arrCurr[i].innerHTML = `${curCurr.curName}`

	// console.log(arrCurr);
    // export default curCurr;
})

// const curCurr = document.querySelector("select");
// curCurr.addEventListener('change', function (e) {
//     console.log("Changed to: " + e.target.value)
// })




// console.log("текущее значение селектора", curCurr);
// console.log(config);

function findCountry ({countries}, countryCode) {
	// console.log(countries, countryCode);
	for (let i = 0; i < countries.length; i++) {
		if(countries[i].code === countryCode)
			return countries[i].name;
	}
	return -1;
}
let AutoComplite = {};
let optionStr = "";
AutoComplite.auto = [];
AutoComplite.code = [];

locations.init().then(res => {
	// console.log(res);
	// console.log(locations); 
	// console.log(locations.cities.length);

	// AutoComplite.countryCode = [];
	autoprefixer.countryName = [];
	// 
	for (let i = 0, z; i < locations.cities.length; i++) {
		
		z = findCountry(locations, locations.cities[i].country_code);
		AutoComplite.auto[i] = locations.cities[i].name + ', ' + z;

		AutoComplite.code[i] = locations.cities[i].code;
		optionStr += `<option value="${locations.cities[i].code}"> ${AutoComplite.auto[i]} </option>`
		// AutoComplite.countryCode[i] = locations.cities[i].country_code;
	}
	document.getElementById('pasta').innerHTML = optionStr;
	// console.log( AutoComplite);
	// console.log(optionStr);

});

// date input

let inputDate = document.getElementById('depart_date');
inputDate.value = dateValue;
inputDate.min = dateValue;
// console.log(dateValue);

// onclick submin FORM

let form = document.querySelector('form');
// console.log(config.url);
const flightSection = document.getElementById('section_fly');

function getAircompanyName(data, airCode) {
	for(let i = 0; i < data.length; i++) {
		if (data[i].code === airCode)
			return data[i].name_translations.en;
	}
}

function getOriginCityName(data, cityCode) {
	// console.log('getData = ', data);
	for(let i = 0; i < data.length; i++) {
		if (data[i].code === cityCode)
			return data[i].name || data[i].name_translations.en;
	}
}

function convertDate(str) {
	let arr = str.split('-');
	return arr[2] + ' ' + arr[1] + ' ' + arr[0];
}

function flightUploadHTML (resp, multip = 1, cur = '$') {
	let flightCardStr = '';
	const arrData = Object.entries(resp.data.data);
	if (!arrData.length)
	{
		console.log(arrData.length);
		flightSection.innerHTML = ` <div class="no_tickets_on_request"><p>Sorry, dear!) Theare no tickets on your request. Let's try another date or direction >>>></p></div>`;
		document.getElementsByClassName('no_tickets_on_request').classList += 'd_block';
		return ;
	}
	// console.log(arrData);
	for (let i = 0; i < arrData.length; i++) {
		console.log(curCurr);
		const aircompanyCode = arrData[i][1].airline;
		const orCode = arrData[i][1].origin;
		const arrCode = arrData[i][1].destination;
		flightCardStr += `
		<div class="fly_card">
        <div class="aero_comp">
          <img src="${config.pics}/${aircompanyCode}.png" alt="${aircompanyCode}">
          ${getAircompanyName(locations.airlines, aircompanyCode)}
        </div>
        <div class="from_to d_flex jc_space_between">
          <div class="departure">
		  ${getOriginCityName(locations.cities, orCode)}  <i class="tiny material-icons">flight_takeoff</i>
          </div>
          <div class="arrival">
            <i class="material-icons">flight_land</i> ${getOriginCityName(locations.cities, arrCode)} 
          </div>
        </div>
        <div class="date_price d_flex jc_space_between">
          <div class="date_of_departure">
            ${convertDate(arrData[i][0])}
          </div>
          <div class="price_flight">
            ${Math.ceil(arrData[i][1].price * multip)} ${cur}
          </div>
        </div>  
        <div class="change_flight">
          Transfers: ${arrData[i][1].transfers}, flight number: ${arrData[i][1].flight_number}
        </div>

      </div>
		`
	}
 

	flightSection.innerHTML=flightCardStr;

	// console.log(arrData);
	// console.log(resp)
}



async function prices(params) {
	try {
			await axios.get(`${config.url}/prices/cheap`, {
				params,
		})
		.then( function (res) {
			response = JSON.parse(JSON.stringify(res));

			// console.log("res = ", response);
			flightUploadHTML(res);
		})
	} catch (err) {
		console.log(err);  
	}
}


form.addEventListener('submit', function (e) {
	e.preventDefault();
	// console.log(form.elements[0].value, form.elements[2].value.slice(0,7));
	const origin = form.elements[0].value;
	const destination = form.elements[1].value;
	const depart_date = form.elements[2].value.slice(0,7);
	const return_date = form.elements[3].value.slice(0,7);

	prices({
		origin,
		destination,
		depart_date,
		return_date,
	})
	// locations.fetchTickets({
	//    origin,
	//    destination,
	//    depart_date,
	//    return_date,
	// })
})

export default curCurr;