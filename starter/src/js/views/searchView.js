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
    elements.searchResPages.innerHTML = '';
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

//type: 'prev' or 'next'
const createButton = (page, type) => `

    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage)  => {
    const pages = Math.ceil(numResults / resPerPage);
    
    let button;

    if (page === 1 && pages > 1) {
        //only button to the next page
        button = createButton(page, 'next');

    } else if (page < pages) {
        //both buttons
        button = `
        ${createButton(page, 'next')}
        ${createButton(page, 'prev')}
        `;

    } else if (page === pages && pages > 1) {
        //button to the previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

//loop through the recipes
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //pagination
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    //render the results of the 
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length , resPerPage);
};