import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2, 4, 8] splice(1, 2) starts at position 1, takes to elements - returns 4 and 8; mutates array: [2]
        // [2, 4, 8] slice(1, 2) starts at one[index], ends at pos. to but doesn't include it; returns 4, [2, 4, 8]

        //remove only one element
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        //instead of returning the index, returns the item that matches
        this.items.find(el => el.id === id).count = newCount;
    }
}