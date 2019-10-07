// separation of concerns - dzielenie na niezalezne moduly
/*****************************************/
// BUDGET CONTROLLER
var budgetController = (function() {
    
   var Expense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   };
    
    Expense.prototype.calcPrecentage = function(totalIncome) {
        
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
        
    }; // create a method in protoype
    
    Expense.prototype.getPercentage = function() {
        
        return this.percentage;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    /*var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0; it's better to keep a good data structure instead of having several variables floating around */
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
        /*
        0
        [200, 400, 100]
        sum = 0 + 200
        sum = 200 + 400
        sum = 600 + 100 = 700
        */
        
    }; // we want to have it private
    
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 //it doesnt exist at this point
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID; 
            
            // [1, 2, 3, 4, 5] next ID = 6, each ID should exist once, that's why this solution is not ideal if we mess up the numbers later
            // [1, 2, 4, 6, 8] next ID = 9
            // ID = last ID + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //defining the very last item in order to create the id, it doesn't really work for the very first item where its posistion is 0, 0 - 1 = -1 and it doesn't exist in the array
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);  
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
           
            // Push it into our data structure
            data.allItems[type].push(newItem); // names of 'type' are the same like arrays storing item objects
           
            // return the new element
            return newItem; //other modules need an access to th items
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // id = 4
            // data.allItems[type][id];
            // ids = [1,2,4,6,8] we can delete items! then the id can be different ids[4] is not id
            // we loop over all the items
            // index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            }); // map returns a brand new array
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculateBudget: function() {
            
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            // we cannot divide by 0!!
            // exp = 100, inc = 200; spent 50%, 100/200 = 0.5 * 100
            
        },
        
        calculatePercentages: function() {
          
            /*
            a = 20
            b = 10
            c = 40
            income = 200
            a = 20/200*100 = 10%
            b = 10/200*100 = 5%
            c = 40/200*100 = 20%
            */
            data.allItems.exp.forEach(function(cur) {
                cur.calcPrecentage(data.totals.inc);
            });   
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
               return cur.getPercentage(); 
            });
            return allPerc;
        }, // in order to loop and return and STORE somtehing, we need to use map method
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percentage: data.percentage
            }; // returns alle the data at once    
        }, // func that only retrievs data, sets data
        
        testing: function() {
            console.log(data);
        }
    };
    
})();


// UI CONTROLLER
var UiController = (function() {
    
    //create an object for storing data strings(in case we want to modify the UI or sth like that)
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(number, type) {
            var numSplit, int, dec, sign;
            /*
            + or - before the number,
            exactly 2 decimal points,
            comma separating the thousands
            
            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */
            
            number = Math.abs(number); // overwriting the num argument(we can do that since its just a variabel here). abs gives an absolute number
            number = number.toFixed(2); // to fixed - number prototype property. it will always put to decimals(either rounded or not). it returns a string
            
            numSplit = number.split('.'); // returns an array
            int = numSplit[0];
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // substr(posistion(from the left), item index), returns selected item(s); input 2300 -> 2,300; int.length - 3 makes it more dynamic if we want to input e.g. 20000 -> 20,000
            }
            
            dec = numSplit[1];
            
            if (type === 'exp') {
                sign = '-';
            } else if (type === 'inc') {
                sign = '+';
            } else {
                sign = '';
            }
            
            return sign + ' ' + int + '.' + dec;
            
        };
    
    var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

    return {
        getInput: function() {
            
            return {
            type: document.querySelector(DOMstrings.inputType).value, // will be either inc(income) or exp(expense)
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }; //return as an object so we don't have 3 seperate variables
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // Create an HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
               element = DOMstrings.expenseContainer;
                
               html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with actual data received from the object
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description); // it has to be replaced on newHtml, otherwise it would edit the variable without the id changed
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID) {
            // js can remove the elements child but in order to do that, we need to find its parents(crucial)
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); //like css selecting we separate selectors with just coma
            
            fieldsArr = Array.prototype.slice.call(fields); //array function constructor
            
            fieldsArr.forEach(function(currentValue, indexNr, array) {
                currentValue.value = "";
                
            }); // this method has an accsess to these three arguments
            
            fieldsArr[0].focus(); //zielona ramka wraca na tekst
        },
        
        // querySelectorAll doesnt returns an array but a LIST. There is a trick to convert it - we use a method that originally just copies an exisitng array as a new array. In this case we are gonna copy a list which will be returned as an array anyway
        
        // However, fields.slice() wont work since the original value is not an array. We call slice() using a call method and we pass a field value. Slice() is stored in the Array protothype
        
        displayBudget: function(obj) {
            var type;
            
            //obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            if (obj.budget > 0) {
                type = 'inc';
            } else if (obj.budget == 0) {
                type = ' ';
            } else {
                type = 'exp';
            }
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'exp');   
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
        displayPercentages: function(percentages) {
            
            // we dont know how many expenses will be on the list, so we need to use queryselecorALL
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) {
               
                // do stuff
                // cool thing when you need to loop over a node list
                // index = callback function that looped over the list. We get the acces to the index -> (current = list[i], index = i)
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
                
            }); // mindfuckkkkkkk
        },
        
        displayMonth: function() {
            var now, year, months, month;
            
            now = new Date(); // returns todays date
            // var christmas = new Date(2016, 11(0 based), 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = months[now.getMonth()]; // getMonth() is 0-based
            
            year = now.getFullYear();
            
            document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;
            
        },
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue 
            );
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        }, 
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    } //method for returning all three methods in this field; return is global
    
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UiCtrl) {

   //initialization function
    var setupEventListeners = function() {
        
        var DOM = UiCtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); //don't call the fn, event listener will do that
    
        //dodwania przycisku enter, nie trzeba przypisywav do niczego, bo zachodzi to globalnie na stronie
       
        document.addEventListener('keypress', function(event) {
        
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
        
       }); 
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UiCtrl.changedType);
    };
    
    // in order to not repeat the code below, we'll make a custom function    

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget(); // we store in a variable
        
        // 3. Display the budget on the UI
        UiCtrl.displayBudget(budget);
    }; 
    
    // were gonna keep neccesary inf since calculating data will be crucial for the nr 5 and 6 on the list. Then we dont need to repeat data
    
    var updatePercentages = function() {
        
        // 1. calculate the percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percenages from the budget controller and STORE it
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UiCtrl.displayPercentages(percentages);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the filed input data
        input = UiCtrl.getInput(); //get input is a public method
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //NaN - not a number
            // isNan - is not a number - true; !isNaN - is not not a number - true
            
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            // 3. Add the item to the UI
            UiCtrl.addListItem(newItem, input.type);
        
            //4. Clear the input fields
            UiCtrl.clearFields();
        
            //5. Calculate and update the budget
            updateBudget()
            
            
            // 6. Calculate and display the new percentages
            updatePercentages();
            
            }
        
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // nice way to check what im clicking on. parent node goes to the parent element while clicking
        
        if (itemID) {
            
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UiCtrl.deleteListItem(itemID);
            
            // 3. Update and show the budget
            updateBudget()
            
            // 4. Calculate and display the new percentages
            updatePercentages();
        }
    };
    //we need to make the init function public
        return {
            init: function() {
                console.log('App has started.');
                UiCtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1
            });
                UiCtrl.displayMonth();
                setupEventListeners();
            }
        }
    
})(budgetController, UiController); //good practice to put is as parameters, kontrolowanie powyzszych modulow ktore sa od siebie niezalezne, jesli zmienilibysmy nazwe ktoregos z nich, to nie trzeba zmieniac tego x razy wewnatrz tego modulu

controller.init();