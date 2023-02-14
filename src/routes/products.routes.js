import { Router } from 'express';
import ProductManager from '../controllers/ProductManager.js';

const routerProduct = Router();
const manager = new ProductManager('src/models/products.json');

/*  Producto de prueba para agregar o actualizar
        {
        "title": "Rocket League",
        "description": "El mejor E-Sport",
        "code": "6A",
        "price": "0",
        "status": true,
        "stock": 500,
        "category": "juegos",
        "thumbnails": "public/img/rocketLeague.png"
        }
*/

// Ver productos. También ver productos con la limitación 'limit' - api/products/ o api/products?limit=2

routerProduct.get('/', async (req, res) => {
    const products = await manager.getProducts();
    let { limit = products.length } = req.query;
    const data = products.slice(0, limit);
    res.send(data);
});

// Ver productos por ID - api/products/1

routerProduct.get("/:pid", async (req, res) => {
    const product = await manager.getProductByID(parseInt(req.params.pid, 10));
    if (product === null) {
        res.status(404).send({ error: "Producto no encontrado" });
    } else {
        res.send(product);
    }
});

// Agregar un nuevo producto al JSON - api/products/ req.body

routerProduct.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const data = await manager.addProduct(title, description, code, price, status, stock, category, thumbnails);
    res.status(201).send(`${data}`);
});

// Actualizar un producto - api/products/1 req.body

routerProduct.put('/:pid', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const data = await manager.updateProduct(parseInt(req.params.pid, 10), title, description, code, price, status, stock, category, thumbnails);
    if (data) {
        res.send(data);
    } else {
        res.status(404).send({ error: "Producto no encontrado" });
    }
});

// Borrar un producto - api/products/6 

routerProduct.delete('/:pid', async (req, res) => {
    const data = await manager.deleteProduct(parseInt(req.params.pid, 10));
    res.send(data);
});

export default routerProduct;