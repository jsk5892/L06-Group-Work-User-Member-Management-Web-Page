//gabbing all the different elements and storing them as varuabkes

//the whole form 
const productForm = document.getElementById('productForm'); 

//the text boxes that the user types in
const idInput = document.getElementById('productId');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const unitInput = document.getElementById('unitOfMeasurement');
const priceInput = document.getElementById('price');
const infoInput = document.getElementById('additionalInfo');

//the empty table body where the products will show up
const productsTable = document.querySelector('tbody');

//list of products
let products = [];

//check if there are products in local storage and if so, load them 
if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
}

//if button is clicked
productForm.addEventListener('submit', function (event) {
    event.preventDefault(); 

    //get what the user typed into each box
    const idValue = idInput.value.trim(); //trimming dow exta blank spaces with trim()
    const descriptionValue = descriptionInput.value.trim();
    const categoryValue = categoryInput.value.trim();
    const unitValue = unitInput.value.trim();
    const priceValue = priceInput.value.trim();
    const infoValue = infoInput.value.trim();

    //validation: checking all the inputs to make sure they are valid
    let errors = '';
    if (idValue === ''|| isNaN(idValue) || idValue < 1) {
        errors += 'Product ID must be a number of 1 or greater\n';
    }
    if (descriptionValue === '') {
        errors += 'Description is required.\n';
    }
    if (categoryValue === '') {
        errors += 'Category is required.\n';
    }
    if (unitValue === '') {
        errors += 'Unit of Measurement is required.\n';
    }
    if (priceValue === ''|| isNaN(priceValue) || priceValue < 0) {
        errors += 'Price must be a number of 0 or more\n';
    }
    if (errors) {
        alert(errors); //show the errors to the user
        return;
    }
    else {

        //if everything is valid, create a new product object and add it to the products array
        const newProduct = {
            id: parseInt(idValue),
            description: descriptionValue,
            category: categoryValue,
            unitOfMeasurement: unitValue,
            price: parseFloat(priceValue),
            additionalInfo: infoValue
        };
        //add the new product to the end of the product list, save the list to local storage, and show the updated list in the table
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        console.log('Products stored as JSON:', JSON.stringify(products, null, "  "));
        showProducts();
        productForm.reset();
        alert("Product added!");
    }
});
//show the products in the table
function showProducts(list) {
    //Josh addition the line below
    list = list || products;
    //clear the table first
    let rows = "";
    //loop through the products array and create a new row for each product
    for (let i = 0; i < list.length; i++) {
        //create a new row with the product's information and add it to the rows variable
        rows += "<tr><td>" + list[i].id + "</td><td>" + list[i].description + "</td><td>" + list[i].category + "</td><td>" + list[i].unitOfMeasurement + "</td><td>" + list[i].price.toFixed(2) + "</td><td>" + list[i].additionalInfo + "</td></tr>";
    }//set the innerHTML of the table body to the rows variable, which will display all the products in the table
    productsTable.innerHTML = rows;
}

showProducts();

