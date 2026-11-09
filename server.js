// grab express so can make the server
const express = require("express");
// make the app
const app = express();

// let the browser load our html, css, and js files from this folder
app.use(express.static("."));

// lets the server read the json our pages send over
app.use(express.json());

// little helper that prints every request in the terminal
const logRequest = function(req, res, next) {
   // shows stuff like "POST for /api/returns"
   console.log(`Request: ${req.method} for ${req.path}`);
   // keep going to the next step
   next();
};

// turn on the logger
app.use(logRequest);

// lists to hold everything people send (clears when the server stops)
let billingList = [];
let returnList = [];
let orderList = [];

// runs when the billing page sends billing info
app.post("/api/billing", function(req, res) {
   // the billing info that got sent
   const billing = req.body;

   // if name, address, or card is missing send back an error
   if (!billing.fullName || !billing.address || !billing.cardNumber) {
      res.status(400).json({ success: false, message: "Missing billing information" });
   }
   else {
      // build the billing object we're saving
      const newBilling = {
         // gives it an id like B1, B2, B3
         billingId: "B" + (billingList.length + 1),
         fullName: billing.fullName,
         address: billing.address,
         // only keep the last 4 digits of the card
         card: "**** **** **** " + billing.cardNumber.substring(12),
         expiration: billing.expiration,
         // whats in the cart and the total
         items: billing.items,
         total: billing.total
      };

      // save it to the list
      billingList.push(newBilling);
      // print it in the terminal so can see it worked
      console.log(newBilling);

      // tell the page it worked and give back the id
      res.json({ success: true, billingId: newBilling.billingId });
   }
});

// shows all the billing info we got so far
app.get("/api/billing", function(req, res) {
   res.json(billingList);
});

// runs when the returns page sends a return
app.post("/api/returns", function(req, res) {
   // the return info that got sent
   const details = req.body;

   // if product, reason, or condition is missing send back an error
   if (!details.productName || !details.reason || !details.condition) {
      res.status(400).json({ success: false, message: "Missing return information" });
   }
   else {
      // build the return object we're saving
      const newReturn = {
         // gives it an id like R1, R2, R3
         returnId: "R" + (returnList.length + 1),
         productId: details.productId,
         productName: details.productName,
         price: details.price,
         reason: details.reason,
         condition: details.condition,
         // every new return starts as pending
         status: "Pending"
      };

      // save it to the list
      returnList.push(newReturn);
      // print it in the terminal
      console.log(newReturn);

      // tell the page it worked and give back the id
      res.json({ success: true, returnId: newReturn.returnId });
   }
});

// shows all the returns we got so far
app.get("/api/returns", function(req, res) {
   res.json(returnList);
});

// runs when someone hits checkout on the cart
app.post("/api/orders", function(req, res) {
   // build the order object
   const newOrder = {
      // gives it an id like O1, O2, O3
      orderId: "O" + (orderList.length + 1),
      items: req.body.items,
      total: req.body.total
   };

   // save it to the list
   orderList.push(newOrder);
   // print it in the terminal
   console.log(newOrder);

   // tell the page it worked
   res.json({ success: true, orderId: newOrder.orderId });
});

// shows all the orders we got so far
app.get("/api/orders", function(req, res) {
   res.json(orderList);
});

// start the server on port 3000
app.listen(3000, function() {
   console.log("Listening on port 3000...");
});