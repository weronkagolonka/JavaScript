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
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

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
        if (state.search) {
            searchView.renderResults(state.search.pickUpResult(), goToPage);
        } else {
            searchView.renderResults(state.oldResults, goToPage);
        }
        localStorage.setItem('page', JSON.stringify(goToPage));
        
    }
});


/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    //hash from the URL address [string]
    const id = window.location.hash.replace('#', '');
    //console.log(id);

    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight the selected result
        if(state.search) {
            searchView.highlightSelected(id);
        };

        //Create new recipe
        state.recipe = new Recipe(id);

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //Calculate serving 
            state.recipe.calcServings();
            state.recipe.calcTime();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(state.recipe.id)
                );
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

/**
 * LIST CONTROLLER
 */

const controlList = () => {
    // create a new list IF there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

/**
 * LIKE CONTROLLER
 */

const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    // user has not yet liked current recipe
    if (!state.likes.isLiked(currentId)) {
        // Add like to the data
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.pic
        );

        // Toggle the like button - has liked it
        likesView.toggleLikeBtn(true);

        // Add like to the UI list
        likesView.renderLike(newLike);

    // user has liked the current recipe
    } else {
        // Remove like from the data
        state.likes.deleteLike(currentId);

        // Toggle the like button - doesn't like it anymore
        likesView.toggleLikeBtn(false);

        // Remove like from the UI list
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumberLikes()); 
}

// Restore liked recipe --and results-- after loading the page
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    state.oldResults = JSON.parse(localStorage.getItem('searchResult'));

    likesView.toggleLikeMenu(state.likes.getNumberLikes());

    //render existing likes
    state.likes.likes.forEach(el => {
        likesView.renderLike(el);
    });

    const lastPage = JSON.parse(localStorage.getItem('page'));
    if (state.oldResults) searchView.renderResults(state.oldResults, lastPage);
});



// Handle the shopping list buttons - delete/update
elements.shopping.addEventListener('click', e => {

    //.dataset.<...> -> in HTML data-<...>="..." - get the items ID
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // delete btn
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {

        //delete from the state
        state.list.deleteItem(id);

        //delete from the UI
        listView.deleteItem(id);

    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10); 
        state.list.updateCount(id, val);
    }
});


 //handling the recipe btn clicks
 elements.recipe.addEventListener('click', e => {
    //.btn-decrease * -> any child element of the button
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        };
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
 });