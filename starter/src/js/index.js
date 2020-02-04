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
import Recipe from './models/Recipe'

/** global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list
 * - Liked recipes
*/
const state = {};


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    //1. get query from view
    const query = searchView.getInput(); //TODO

    if(query) {
        //2. new search object and add to the state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4. Search for recipes - an array with all the recipes that match the query
        await state.search.getResult();
        console.log(state.search.pickUpResult().length);

        //5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.pickUpResult());
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    //.closest('selector class') - clicks on the whole selected element, not just text, button or icon
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        // goto - go to the element within the page; gotoPage - goes to an another page
        
        //clear the result list
        searchView.clearResults();

        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.renderResults(state.search.pickUpResult(), goToPage);
    }
});


/**
 * RECIPE CONTROLLER
 */
const r = new Recipe(47746);
r.getRecipe();
console.log(r);