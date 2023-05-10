// establish connection to IndexedDB

// create variable to hold db connection
let db;
// establish a conneciton to IndexedDB database called 'pizza_hunt' and set it to version 1
// acts as an event listener for the database
const request = indexedDB.open('pizza_hunt', 1);

// this will emit the first time we run code or if the database version changes
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon successful connection
request.onsuccess = function(event) {
    // when db is successfully created with its object store or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() to send all local db data to api
    if (navigator.onLine) {
        uploadPizza();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};




// Will be executed if we arrempt to submit a new pizza while there is no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
};


function uploadPizza() {
    // open a transaction to the db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    // getAll() method is an asycnhronous function that we have to attach an event handler to in order to retrieve the data
    const getAll = pizzaObjectStore.getAll();

    // upon a successfull .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, send it to the api server
        // Mongoose .create() method can handle either a single object or an array of objects, 
        // so one fetch works regardless of how many saved pizzas
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
};


// listen for app coming back online
window.addEventListener('online', uploadPizza);