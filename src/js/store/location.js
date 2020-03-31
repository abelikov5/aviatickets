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
        ]);
        const [countries, cities, airlines] = response;
        this.countries = countries;
        this.cities = cities;
        this.airlines = airlines;
        // console.log(response);

        return response;
    }
    async fetchTickets(params) {
        console.log(params);
        const response = await this.api.prices(params);
        console.log(response); 

    }
}

const locations = new Locations(api);


export default locations;