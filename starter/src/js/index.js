// Global app controller
//2 types of json pack - libraries, frameworks etc.; development tools

// https://forkify-api.herokuapp.com/api/search

/*
https://crossorigin.me/
another proxy if crossorigin doesn't work:
https://cors-anywhere.herokuapp.com
and it didn't sork
*/
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list
 * - Liked recipes
*/
const state = {};

const controlSearch = async () => {
    //1. get query from view
    const query = searchView.getInput(); //TODO
    console.log(query);

    if(query) {
        //2. new search object and add to the state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4. Search for recipes - an array with all the recipes that match the query
        await state.search.getResult();

        //5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.pickUpResult());
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})
