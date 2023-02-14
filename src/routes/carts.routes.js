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

  if (!productInfo) {
    return res.status(404).send(`Producto "${req.params.pid}" no encontrado.`);
  }

  const result = await cartManager.addProduct(parseInt(req.params.cid), parseInt(req.params.pid), prodQty);

  if (!result) {
    return res.status(500).send(`Error al agregar el producto.`);
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
