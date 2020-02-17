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
import * as recipeView from './views/recipeView';
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
    const query = searchView.getInput();

    if(query) {
        //2. new search object and add to the state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //4. Search for recipes - an array with all the recipes that match the query
            await state.search.getResult();

            //5. render results on UI
            clearLoader();
            searchView.renderResults(state.search.pickUpResult());
        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }


    }
};


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

const controlRecipe = async () => {
    //hash from the URL address [string]
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Create new recipe
        state.recipe = new Recipe(id);

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //Calculate serving 
            state.recipe.calcServings();
            state.recipe.calcTime();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert('Error processing recipe!'); 
        }
    };
};

 //don't need to call while creating an event listener REMEMBER
 //shows hash when we click at a different item

 //the chosen recipe data remains after reloading 

 //create one event listener for two events
 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));