import { Router } from 'express';
import { CartManager } from '../controllers/CartManager.js';
import ProductManager from '../controllers/ProductManager.js';

const routerCart = Router();
const cartManager = new CartManager('src/models/carts.json');
const prodManager = new ProductManager('src/models/products.json');

// Agregar productos al carrito - api/carts/1/product/1
routerCart.post('/:cid/product/:pid', async (req, res) => {
  const prodQty = 1;
  const productInfo = await prodManager.getProductByID(parseInt(req.params.pid));

  if (productInfo.id == undefined) {
    return res.status(404).send(`El producto con el ID: "${req.params.pid}" no existe.`);
  }
  const result = await cartManager.addProduct(parseInt(req.params.cid), parseInt(req.params.pid), prodQty);
  const cart = await cartManager.getCart(parseInt(req.params.cid));

  if (!cart) {
    return res.status(500).send(`Error al agregar el producto. El carrito con el ID: "${req.params.cid}" no existe.`);
  }

  res.send(`Producto "${productInfo.id}" fue agragado al carrito exitosamente.`);
});

// Crear un nuevo carrito - api/carts/
routerCart.post('/', async (req, res) => {
  const result = await cartManager.createCart();

  if (!result) {
    return res.status(500).send(`Error al crear carrito`);
  }

  res.send(`Carrito creado con el id ${result}`);
});

// Ver los detalles del carrito - api/carts/1
routerCart.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCart(parseInt(req.params.cid));

  if (!cart) {
    return res.status(404).send(`Carrito no encontrado`);
  }

  res.send(cart);
});

// Remover un producto del carrito - api/carts/1/product/1
routerCart.delete('/:cid/product/:pid', async (req, res) => {
  const result = await cartManager.removeProductById(parseInt(req.params.cid), parseInt(req.params.pid));

  if (!result) {
    return res.status(500).send(`Error al borrar el producto.`);
  }

  res.send(`El producto fue borrado del carrito.`);
});

export default routerCart;
