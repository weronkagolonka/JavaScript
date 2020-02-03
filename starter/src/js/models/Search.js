 //better than fetch - doesn't crash
import axios from 'axios';

export default class Search {
    constructor(query) {
         this.query = query;
    }

    async getResult() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';

        //handle the errors; fetch wouldn't probably have recognized e.g. a typo
        try {
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            //array with the recipes
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch(error) {
            alert(error);
        }
    }

    //school habit: good object-oriented practice
    pickUpResult() {
        return this.result;
    }
}