 //better than fetch - doesn't crash
import axios from 'axios';
import { proxy } from '../config';

export default class Search {
    constructor(query) {
         this.query = query;
    }

    async getResult() { 
        //handle the errors; fetch wouldn't probably have recognized e.g. a typo
        try {
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            //array with the recipes
            this.result = res.data.recipes;

            // add to the local storage
            this.storeResults();

        } catch(error) {
            alert(error);
        }
    }

    //school habit: good object-oriented practice
    pickUpResult() {
        return this.result;
    }

    storeResults() {
        sessionStorage.setItem('searchResult', JSON.stringify(this.result));
    }
}