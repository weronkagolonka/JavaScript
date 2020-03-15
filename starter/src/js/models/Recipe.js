import axios from 'axios';
import { proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    };

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.pic = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong...:(');
        }
    }

    calcTime() {
        //15min per 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);

        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g', 'ml'];

        const newIngredients = this.ingredients.map(el => {
            //1. uniform unit
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                //replace method search for any string that matches with unit and replaces it with shorter version
                ingredient = ingredient.replace(unit, units[i]);
            })

            //2. remove parentheses - REGULAR EXPRESSIONS
            ingredient = ingredient.replace(/ *\([^]*\) */g, ' ');

            //3. Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            
            //returns an index of the element that matches the requirements of the callback func
            //find position of the unit even though you don't know which unit you're looking for
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //there's a unit

                //get an amount - a number before the unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'));
                    count = Math.round(count*100) / 100;
                } else {
                    //[1, 1/2] --> '1+1/2' --> evaluates as JS code --> 1.5
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                    count = Math.round(count*100) / 100;
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                //can convert to int, so there's a number, not a unit
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                //no unit, no number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            } 

            //each iteration of map has to return something
            return objIng;
        });
        
        this.ingredients = newIngredients; 
    }
    
    updateServings(type) {
        //dec -> decrease inc -> increase

        //update servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //update ingredients
        this.ingredients.forEach(ing => {
            // newServings / 4
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    };
};