// Global app controller
//2 types of json pack - libraries, frameworks etc.; development tools

// https://forkify-api.herokuapp.com/api/search

/*
https://crossorigin.me/
another proxy if crossorigin doesn't work:
https://cors-anywhere.herokuapp.com
and it didn't sork
*/

//better than fetch - doesn't crash
import axios from 'axios';

async function getResult(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?q=${query}`);
    const recipes = res.data.recipes;
    console.log(recipes);
}
getResult('pasta');

