const Storage = (function() {
    return {
        getItemsFromStorage: function() {
            items = [];
            if(localStorage.getItem('items') !== null) 
                items = JSON.parse(localStorage.getItem('items'));
            return items;
        },
        addItemToStorage: function(item) {
            items = [];
            if(localStorage.getItem('items') !== null) 
                items = JSON.parse(localStorage.getItem('items'));
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            items = [];
            if(localStorage.getItem('items') !== null) 
                items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(item.id === id)
                    items.splice(index, 1);
            })
            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItemInStorage: function(updatedItem) {
            items = [];
            if(localStorage.getItem('items') !== null) 
                items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item) => {
                if(item.id === updatedItem.id) {
                    item.name = updatedItem.name;
                    item.calories = updatedItem.calories;
                }
            })
            localStorage.setItem('items', JSON.stringify(items));

        },
        clearStorage: function() {
            localStorage.clear();
        }
    }   
})();

const ItemCtrl = (function() {
    function item(id, name, calories) {
        this.name = name;
        this.calories = calories
        this.id = id;
    }
    // special Item because it has to be edited
    let itemToEdit = null;
    data = [];
    const setId =  function() {
        id = 0;
        if(data.length > 0)
            id = data[data.length - 1].id + 1;
        return id;
    }
    return {
        getData: function() {
            return data;
        },
        getItem: function(name, calories) {
            calories = parseInt(calories);
            return new item(setId(), name, calories);
        },
        getItemById: function(id) {
            let itemToFind = null;
            data.forEach((item) => {
                if(item.id === id)
                    itemToFind = item;
            });
            return itemToFind;
        },
        getCalories: function() {
            let calories = 0;
            data.forEach(item => {
                calories += item.calories;
            })
            return calories;
        },
        updateItemById: function(updatedItem) {      
            data.forEach((item) => {
                if(item.id === updatedItem.id) {
                    item.name = updatedItem.name,
                    item.calories = updatedItem.calories;
                }
            });
        },
        addToData: function(item) {
            data.push(item);
        },
        deleteItemById: function(id) {
            data.forEach((item, index) => {
                if(item.id === id) {
                    data.splice(index, 1);
                }
            });
        },
        setItemToEdit(item) {
            itemToEdit = item;
        },
        getItemToEdit() {
            return itemToEdit;
        },
        clearData() {
            data = [];
        }
    }
})();

const UICtrl = (function() {
    const uiSelectors = {
        clearBtn: ".clear-btn",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        itemName: "#item-name",
        itemCalories: "#item-calories",
        itemList: "item-list",
        totalCalories: ".total-calories",
        editIcon: "edit-item",
        liItems: "li.collection-item",
    };
    function getInnerHTML(name, calories) {
        return `
            <strong>${name}: </strong> <em>${calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
        `;
    }
    function getLiElement(item) {
        const li = document.createElement('li');
        li.className = "collection-item";
        li.id = item.id;
        li.innerHTML = getInnerHTML(item.name, item.calories);
        return li;
    }
    function showList() {
        document.getElementById(uiSelectors.itemList).style.display = 'block';
    }
    function getElementFromList(id) {
        let found = null;
        items = document.querySelectorAll(uiSelectors.liItems);
        items = Array.from(items);
        items.forEach(item => {
            if(parseInt(item.id) === id) 
                found = item;
        })
        return found;
    }
    return {
        getInputData: function() {
            return {
                name: document.querySelector(uiSelectors.itemName).value,
                calories: document.querySelector(uiSelectors.itemCalories).value,
            };
        },
        clearInputData: function() {
            document.querySelector(uiSelectors.itemName).value = "";
            document.querySelector(uiSelectors.itemCalories).value = "";
        },
        showAlert: function(msg) {
            window.alert(msg);
        },
        hideList: function() {
            document.getElementById(uiSelectors.itemList).style.display = 'none';
        },
        addItemToList: function(item) {
            showList();
            const li = getLiElement(item);
            document.getElementById(uiSelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        populateList: function(items) {
            items.forEach(item=>this.addItemToList(item));
        },
        updateItemInList: function(updatedItem) {
            item = getElementFromList(updatedItem.id);
            item.innerHTML = getInnerHTML(updatedItem.name, updatedItem.calories);
        },
        deleteItemFromList: function(item) {
            itemNode = getElementFromList(item.id);
            itemNode.remove();
        },
        updateInput: function(name, calories) {
            document.querySelector(uiSelectors.itemName).value = name;
            document.querySelector(uiSelectors.itemCalories).value = calories;            
        },
        sethomeState:function() {
            this.clearInputData();
            document.querySelector(uiSelectors.addBtn).style.display = 'inline';
            document.querySelector(uiSelectors.updateBtn).style.display = 'none';
            document.querySelector(uiSelectors.backBtn).style.display = 'none';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
        },
        displayCalories: function(x) {
            document.querySelector(uiSelectors.totalCalories).innerHTML = x;
        },
        setUpdateState: function() {
            document.querySelector(uiSelectors.addBtn).style.display = 'none';
            document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
            document.querySelector(uiSelectors.backBtn).style.display = 'inline';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
        },
        deleteList: function(){
            list = document.getElementById(uiSelectors.itemList);
            while(list.firstChild)  {
                list.removeChild(list.firstChild);
            }
            this.hideList();
        },
        uiSelectors,
    }
})();

const App = (function(ItemCtrl, UICtrl, Storage) {
    const uiSelectors = UICtrl.uiSelectors;
    const LoadEventListeners = function() {
        document.querySelector(uiSelectors.addBtn).addEventListener('click', addItem);
        document.getElementById(uiSelectors.itemList).addEventListener('click', editItem);
        document.querySelector(uiSelectors.backBtn).addEventListener('click', backToHome);
        document.querySelector(uiSelectors.updateBtn).addEventListener('click', updateItem);
        document.querySelector(uiSelectors.clearBtn).addEventListener('click', clearAll);
        document.querySelector(uiSelectors.deleteBtn).addEventListener('click', deleteItem);
        document.addEventListener('keydown', function(e){
            if(e.code === 'Enter'){
              e.preventDefault();
              return false;
            }
        });      
    }
    function addItem(e) {
        const input = UICtrl.getInputData();
        UICtrl.clearInputData();
        if(input.name === '' || input.calories === '')
            UICtrl.showAlert('Please enter valid information');
        else {
            const item = ItemCtrl.getItem(input.name, input.calories);
            ItemCtrl.addToData(item);
            Storage.addItemToStorage(item);
            UICtrl.addItemToList(item);
            UICtrl.displayCalories(ItemCtrl.getCalories());
        }
        e.preventDefault();
    }
    function editItem(e) {
        if(e.target.classList.contains(uiSelectors.editIcon)) {
            UICtrl.setUpdateState();
            itemId = e.target.parentElement.parentElement.id;
            itemId = parseInt(itemId);
            item = ItemCtrl.getItemById(itemId);
            ItemCtrl.setItemToEdit(item);
            UICtrl.updateInput(item.name, item.calories);
        }
        e.preventDefault();
    }
    function backToHome(e) {
        UICtrl.sethomeState();
        e.preventDefault();
    }
    function updateItem(e) {
        item = ItemCtrl.getItemToEdit();
        input = UICtrl.getInputData();
        input.calories = parseInt(input.calories);
        item.name = input.name, item.calories = input.calories;
        ItemCtrl.updateItemById(item);
        UICtrl.updateItemInList(item);
        UICtrl.displayCalories(ItemCtrl.getCalories());
        Storage.updateItemInStorage(item);
        UICtrl.sethomeState();
        e.preventDefault();
    }
    function addFromStorage() {
        items = Storage.getItemsFromStorage();
        items.forEach(item => ItemCtrl.addToData(item));
        UICtrl.populateList(items);
        UICtrl.displayCalories(ItemCtrl.getCalories());
    }
    function clearAll(e) {
        ItemCtrl.clearData();
        UICtrl.deleteList();
        Storage.clearStorage();
        UICtrl.displayCalories(ItemCtrl.getCalories());
        e.preventDefault();
    }
    function deleteItem() {
        item = ItemCtrl.getItemToEdit();
        ItemCtrl.deleteItemById(item.id);
        Storage.deleteItemFromStorage(item.id);
        UICtrl.deleteItemFromList(item);
        UICtrl.displayCalories(ItemCtrl.getCalories());
        UICtrl.sethomeState();
    }
    return {
        init: function() {
            LoadEventListeners();
            UICtrl.sethomeState();
            UICtrl.hideList();
            addFromStorage();
        }   
    }
})(ItemCtrl, UICtrl, Storage);

App.init();