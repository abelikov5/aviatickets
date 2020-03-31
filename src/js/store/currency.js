import config from '../config/apiConfig';
import axios from 'axios';
import curCurr from '../app';

// let curCurr = '$';

// document.querySelector("select").addEventListener('change', function (e) {
//     curCurr = e.target.value;
//     console.log(curCurr);
//     // export default curCurr;
// })

async function curActial() {
	try {
		console.log("try curr");
		const response = await axios.get(`${config.curr}`)
		.then( function (response) {
            curCurr.rub = Math.ceil(response.data.Valute.USD.Value);
            curCurr.eur = (response.data.Valute.EUR.Value / curCurr.rub).toFixed(2);
			// console.log("res = ", curCurr);
			// flightUploadHTML(res);
		})
	} catch (err) {
		console.log(err);  
	}
};
// curActial();


// export default curCurr;
export default curActial;