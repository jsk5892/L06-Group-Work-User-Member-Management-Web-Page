function validateBilling() {

    let name = document.getElementById("fullName").value.trim();
    let address = document.getElementById("address").value.trim();
    let card = document.getElementById("cardNumber").value.trim();
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

    if (card.length !== 12 || isNaN(card)) {
    alert("Number must be 12 digits");
    return false;
    }

    if (expiration.length !== 5 || expiration.charAt(2) !== "/") {
    alert("Enter expiration date");
    return false;
    }
  
    let parts = expiration.split("/");
    let month = Number(parts[0]);
    let year = 2000 + Number(parts[1]);
    let today = new Date();

    if (year < today.getFullYear() ||
        (year === today.getFullYear() && month < today.getMonth() + 1)) {
        alert("Card Expired");
        return false;
    }

    if (security.length !== 6 || isNaN(security)) {
    alert("Enter 6 digit security code");
    return false;
    }

    alert("Validated");

    return false;
}
