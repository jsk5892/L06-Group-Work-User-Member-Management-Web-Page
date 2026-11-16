// get shopping cart from local storage
function getCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart == null) {
        cart = [];
    }
    return cart;
}

// save shopping cart to local storage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// display shopping cart
function showCart() {
    const cart = getCart();
    const table = document.getElementById("cartTable");
    const totalElement = document.getElementById("cartTotal");
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += Number(cart[i].price);
    }
    if (totalElement !== null) {
        totalElement.textContent = total.toFixed(2);
    }
    if (table == null) {
        return;
    }

    table.innerHTML = "";
    if (cart.length == 0) {
        const row = table.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 4;
        cell.textContent = "Your shopping cart is empty";
    } else {
        for (let i = 0; i < cart.length; i++) {
            const row = table.insertRow();

            row.insertCell().textContent = cart[i].id;
            row.insertCell().textContent = cart[i].description;
            row.insertCell().textContent = Number(cart[i].price).toFixed(2);

            const buttonCell = row.insertCell();
            const button = document.createElement("button");
            button.type = "button";
            button.className = "btn btn-sm btn-danger removeBtn";
            button.setAttribute("data-index", i);
            button.textContent = "Remove";
            buttonCell.appendChild(button);
        }
    }
}

// add product to cart
$(document).on("click", ".addBtn", function() {
    const mongoId = $(this).attr("data-id");
    let selectedProduct = null;

    for (let i = 0; i < products.length; i++) {
        if (products[i]._id == mongoId) {
            selectedProduct = products[i];
            break;
        }
    }
    if (selectedProduct == null) {
        alert("Product not found.");
        return;
    }

    const cart = getCart();
    const newItem = {
        _id: selectedProduct._id,
        id: selectedProduct.id,
        description: selectedProduct.description,
        price: Number(selectedProduct.price)
    };

    cart.push(newItem);
    saveCart(cart);
    showCart();
});

// remove product from cart
$(document).on("click", ".removeBtn", function() {
    const index = Number($(this).attr("data-index"));
    const cart = getCart();

    cart.splice(index, 1);
    saveCart(cart);
    showCart();
});


// save checkout to mongoDB
async function checkoutOrder(button) {
    const cart = getCart();

    if (cart.length == 0) {
        alert("Your shopping cart is empty");
        return;
    }

    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += Number(cart[i].price);
    }

    const order = {
        items: cart,
        total: total
    };
    button.disabled = true;

    try {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error("Order could not be saved");
        }


        const savedOrder = await response.json();
        console.log("Saved order:", savedOrder);
        alert("Order saved successfully");

        let nextPage = button.getAttribute("data-next");


        if (nextPage == null) {
            nextPage = "shipping.html";
        }

        window.location.href = nextPage;

    } catch (error) {
        console.log(error);
        alert("Error saving order to mongoDB");
        button.disabled = false;
    }
}


// checkout button
$(document).on("click", "#checkoutBtn", function(event) {
    event.preventDefault();
    checkoutOrder(this);
});

// display cart
$(document).ready(function() {
    showCart();
});