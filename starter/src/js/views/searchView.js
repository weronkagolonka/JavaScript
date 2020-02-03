import { elements } from './base';

//without curly brackets - it's gonna automatically return the value
export const getInput = () => elements.searchInput.value;

//keep it in separate functions

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    //clear the recipe list
    elements.searchResList.innerHTML = '';
}

//limit to 17 signs with full words, so the title fits in one line
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //opposite of .split
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

//don't need to export it
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//loop through the recipes
export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
};