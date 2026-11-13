const mongoose = require("mongoose");

const shopperSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String
});

const cartSchema = new mongoose.Schema({
    items: Array,
    total: Number,
    status: String
});

const returnSchema = new mongoose.Schema({
    productName: String,
    reason: String,
    condition: String,
    status: String
});

const Shopper = mongoose.model("Shopper", shopperSchema, "shopper");
const Product = mongoose.model("Product", productSchema, "products");
const Cart = mongoose.model("Cart", cartSchema, "shopping_cart");
const Return = mongoose.model("Return", returnSchema, "returns");

module.exports = { Shopper, Product, Cart, Return };
