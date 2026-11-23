function getOrderTotal() {
    let total = 0;
    if (typeof getCart === "function") {
        const cart = getCart();
        for (let i = 0; i < cart.length; i++) {
            total += Number(cart[i].price);
        }
    }
    return total;
}

function validateBilling() {

    let name = document.getElementById("fullName").value.trim();
    let address = document.getElementById("address").value.trim();
    let card = document.getElementById("cardNumber").value.replace(/\s/g, "");
    let expiration = document.getElementById("expiration").value.trim();
    let security = document.getElementById("securityCode").value.trim();

    if (name === "") {
        alert("Enter Full Name");
        return false;
    }

    if (address === "") {
        alert("Enter Address");
        return false;
    }

    if (!/^\d{16}$/.test(card)) {
    alert("Number must be 16 digits");
    return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiration)) {
    alert("Enter expiration date");
    return false;
    }
  
    let parts = expiration.split("/");
    let month = Number(parts[0]);
    let year = 2000 + Number(parts[1]);
    let today = new Date();

    if (month < 1 || month > 12) {
        alert("Expiration month must be 01 to 12");
        return false;
    }

    if (year < today.getFullYear() ||
        (year === today.getFullYear() && month < today.getMonth() + 1)) {
        alert("Card Expired");
        return false;
    }

    if (!/^\d{3}$/.test(security)) {
    alert("Enter 3 digit security code");
    return false;
    }

    return true;
}

// run the billing check when the billing form is submitted
const billingForm = document.getElementById("billingForm");

billingForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stops the page from refreshing
    validateBilling();
});
