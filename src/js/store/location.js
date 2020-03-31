import api from '../services/apiService';
// import { Autocomplete } from 'materialize-css';

class Locations {
    constructor (api) {
        this.api = api;
        this.countries = null;
        this.cities = null;
        this.airlines = null;
    }
    async init() {
        const response = await Promise.all([
            this.api.countries(),
            this.api.cities(), 
            this.api.airlines(),
            // this.api.curr(),
        ]);
        const [countries, cities, airlines, curr] = response;
        this.countries = countries;
        this.cities = cities;
        this.airlines = airlines;
        // this.curr = curr;
        console.log(response);

        return response;
    }
    async fetchTickets(params) {
        const response = await this.api.prices(params);
    }
}

const locations = new Locations(api);
// console.log('locations', locations.curr);


export default locations;