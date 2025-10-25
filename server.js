const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Product = require("./models/Product");

const app = express();

// ✅ Only load dotenv locally
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// ✅ MongoDB connection (Atlas or local fallback)
const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/inventory_dashboard";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Routes
app.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("new");
});

app.post("/products", async (req, res) => {
  await Product.create(req.body);
  res.redirect("/");
});

app.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("edit", { product });
});

app.put("/products/:id", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// ✅ Server listens on dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
