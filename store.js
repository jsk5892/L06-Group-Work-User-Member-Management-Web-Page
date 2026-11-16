//the whole form 
const productForm = document.getElementById("productForm");

//the text boxes that the user types in
const idInput = document.getElementById("productId");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const unitInput = document.getElementById("unitOfMeasurement");
const priceInput = document.getElementById("price");
const infoInput = document.getElementById("additionalInfo");

//the empty table body where the products will show up
const productsTable = document.querySelector("table tbody");

// store products from mongoDB
let products = [];

// GET, load products from mongoDB
async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        if (!response.ok) {
            throw new Error("Could not load products");
        }
        products = await response.json();
        showProducts();

    } catch (error) {
        console.error(error);
        alert("Error loading products from MongoDB.");
    }
}

// display products in the table
function showProducts(list = products) {
    productsTable.innerHTML = "";
    for (const product of list) {
        const row = productsTable.insertRow();
        const values = [
            product.id,
            product.description,
            product.category,
            product.unitOfMeasurement,
            product.price.toFixed(2),
            product.additionalInfo
        ];
        for (const value of values) {
            const cell = row.insertCell();
            cell.textContent = value;
        }

        // add to cart button
        const actions = row.insertCell();
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "btn btn-sm btn-primary addBtn me-2";
        addButton.textContent = "Add";
        addButton.dataset.id = product._id;
        actions.appendChild(addButton);
        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-sm btn-danger deleteProductBtn";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = product._id;
        actions.appendChild(deleteButton);
    }
}

// POST/PUT, Add or update products
productForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const id = Number(idInput.value);
    const description = descriptionInput.value.trim();
    const category = categoryInput.value.trim();
    const unit = unitInput.value.trim();
    const price = Number(priceInput.value);
    const info = infoInput.value.trim();


    // Validate form inputs
    if (!Number.isInteger(id) || id < 1 ||
        description == "" ||
        category == "" ||
        unit == "" ||
        priceInput.value.trim() == "" ||
        !Number.isFinite(price) || price < 0) {

        alert("Enter valid product info");
        return;
    }
    const newProduct = {
        id: id,
        name: description,
        description: description,
        category: category,
        unitOfMeasurement: unit,
        price: price,
        additionalInfo: info
    };
    // look for product with matching ID
    const existing = products.find(function(product) {
        return product.id == id;
    });
    let url = "/api/products";
    let method = "POST";
    if (existing !== undefined) {
        url = "/api/products/" + existing._id;
        method = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        });
        if (!response.ok) {
            throw new Error("Could not save product");
        }

        await loadProducts();
        productForm.reset();
        alert(existing ? "Product updated" : "Product added");
    } catch (error) {
        console.error(error);
        alert("Error saving to MongoDB");
    }
});

// DELETE, remove product from mongoDB
productsTable.addEventListener("click", async function(event) {
    const button = event.target.closest(".deleteProductBtn");
    if (!button) {
        return;
    }

    const mongoId = button.dataset.id;
    if (!confirm("Delete this product?")) {
        return;
    }
    try {
        const response = await fetch("/api/products/" + mongoId, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Could not delete product");
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        let updatedCart = [];
        for (let i = 0; i < cart.length; i++) {
            if (cart[i]._id !== mongoId) {
                updatedCart.push(cart[i]);
            }
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        await loadProducts();
        if (typeof showCart == "function") {
            showCart();
        }

        alert("Product deleted!");
    } catch (error) {
        console.error(error);
        alert("Error deleting product from MongoDB");
    }
});

// load products when page opens
loadProducts();
