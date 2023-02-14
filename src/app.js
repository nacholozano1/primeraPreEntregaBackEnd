import express from "express";
import routerProduct from "./routes/products.routes.js";
import routerCart from "./routes/carts.routes.js";

const app = express();
const PORT = 8080;

// MW
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/products', routerProduct)
app.use('/api/carts', routerCart)

app.listen(PORT, () => {
    console.log(`Server created on http://localhost:${PORT}`);
});
