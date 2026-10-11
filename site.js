// have to grab elements on the page by id


// the whole form
const signupForm = document.getElementById("signupform");

// for the text boxes
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

// the empty table at the bottom that shows everyone who signed up
const attendeesTable = document.getElementById("attendees");

//list of ppl attending
let attendees = [];

if (localStorage.getItem("attendees")) {
    attendees = JSON.parse(localStorage.getItem("attendees"));
}



// event listenner so waits for if something will happen or not

signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // prevents the page from refreshing

    //have to get values from each box and strip them down
    const nameValue = nameInput.value.trim();
    const ageValue = ageInput.value.trim();
    const addressValue = addressInput.value.trim();
    const emailValue = emailInput.value.trim();
    const phoneValue = phoneInput.value.trim();

    // validation
    let errors = "";
    if (nameValue === "") {
        errors += "Full name is required.\n";
    }
    if (ageValue === "" || isNaN(ageValue) || ageValue < 1 || ageValue > 120) {
        errors += "Age must be a number from 1 to 120.\n";
    }
        // address box cant be empty
    if (addressValue === "") {
        errors += "Address is required.\n";
    }

    // if no "@" or "." then the email box isnt valid
    if (emailValue.indexOf("@") === -1 || emailValue.indexOf(".") === -1) {
        errors += "Please enter a valid email address.\n";
    }
    // phone number optional so dont have to chec

    // moving forward, either throw error or save the person overall

    if (errors !== "") {
        alert(errors);
    } else {
        const newAttendee = {
            name: nameValue,
            age: ageValue,
            address: addressValue,
            email: emailValue,
            phone: phoneValue
        };

        attendees.push(newAttendee);
        localStorage.setItem("attendees", JSON.stringify(attendees));
        console.log("Data stored as JSON:", JSON.stringify(attendees));
        showAttendees();
        signupForm.reset(); // clear the form after submission
        alert("Successfully signed up! Welcome, " + nameValue + "!");
    }
});

//show everyone in table

function showAttendees() {
    let rows = "";
    for (let i = 0; i < attendees.length; i++) {
        rows += "<tr><td>" + attendees[i].name + "</td><td>" + attendees[i].age + "</td><td>" + attendees[i].address + "</td><td>" + attendees[i].email + "</td><td>" + attendees[i].phone + "</td></tr>";
    }
    attendeesTable.innerHTML = rows;
}
showAttendees();
