//grab express so can make the server
const express = require("express");
//grab mongoose so can talk to mongoDB
const mongoose = require("mongoose");
//grab schema from model.js
const models = require("./models");
//make the app
const app = express();

//connect to happyvalley database on computer
async function connectDB(){
   try {
      await mongoose.connect("mongodb://127.0.0.1/happyvalley");
      //shows in terminal when works
      console.log("Connected to MongoDB");
   }
   catch (ex) {
      //shows if mongodb isnt running
      console.log("Couldnt connect to MongoDB " + ex.message);
   }
}

//actually run the connect function
connectDB();

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

// ---------- Returns ----------

// add a return
app.post("/api/returns", async function(req, res) {
   try {
      const newReturn = new models.Return(req.body);
      await newReturn.save();
      res.status(201).json({ success: true, returnId: newReturn._id });
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// get all returns
app.get("/api/returns", async function(req, res) {
   try {
      const returns = await models.Return.find({});
      res.json(returns);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// update a return
app.put("/api/returns/:id", async function(req, res) {
   try {
      await models.Return.updateOne({ _id: req.params.id }, req.body);
      res.sendStatus(204);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// delete a return
app.delete("/api/returns/:id", async function(req, res) {
   try {
      await models.Return.deleteOne({ _id: req.params.id });
      res.sendStatus(204);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// ---------- Billing ----------

// add billing info
app.post("/api/billing", async function(req, res) {
   try {
      const newBilling = new models.Billing(req.body);
      await newBilling.save();
      res.status(201).json(newBilling);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// get all billing info
app.get("/api/billing", async function(req, res) {
   try {
      const billing = await models.Billing.find({});
      res.json(billing);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// update billing info
app.put("/api/billing/:id", async function(req, res) {
   try {
      await models.Billing.updateOne({ _id: req.params.id }, req.body);
      res.sendStatus(204);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// delete billing info
app.delete("/api/billing/:id", async function(req, res) {
   try {
      await models.Billing.deleteOne({ _id: req.params.id });
      res.sendStatus(204);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// ---------- Shopping Cart ----------

// save the cart when someone checks out
app.post("/api/orders", async function(req, res) {
   try {
      const newCart = new models.Cart(req.body);
      await newCart.save();
      res.status(201).json(newCart);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// get all carts
app.get("/api/orders", async function(req, res) {
   try {
      const carts = await models.Cart.find({});
      res.json(carts);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// ---------- Products ----------

// add a product
app.post("/api/products", async function(req, res) {
   try {
      const newProduct = new models.Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// get all products
app.get("/api/products", async function(req, res) {
   try {
      const products = await models.Product.find({});
      res.json(products);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// update a product
app.put("/api/products/:id", async function(req, res) {
   try {
      await models.Product.updateOne({ _id: req.params.id }, req.body);
      res.sendStatus(204);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// delete a product
app.delete("/api/products/:id", async function(req, res) {
   try {
      await models.Product.deleteOne({ _id: req.params.id });
      res.sendStatus(204);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// ---------- Shipping ----------

app.post("/api/shipping", async function(req, res) {
   try {
      const newShipping = new models.Shipping(req.body);
      await newShipping.save();
      res.status(201).json(newShipping);
   }
   catch (ex) {
      res.status(400).json({ error: ex.message });
   }
});

// get all shipping
app.get("/api/shipping", async function(req, res) {
   try {
      const shipping = await models.Shipping.find({}).sort({ createdAt: -1});
      res.json(shipping);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// update shipping info
app.put("/api/shipping/:id", async function(req, res) {
   try {
      const updated = await models.Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (updated == null) {
         return res.status(404).json({ error: "Shipping record not found" });
      }
      res.json(updated);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// delete shipping info
app.delete("/api/shipping/:id", async function(req, res) {
   try {
      await models.Shipping.deleteOne({ _id: req.params.id });
      res.sendStatus(204);
   }
   catch (ex) {
      res.status(400).send(ex.message);
   }
});

// start the server on port 3000
app.listen(3000, function() {
   console.log("Listening on port 3000...");
});

