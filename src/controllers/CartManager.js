import { promises as fs, existsSync, writeFileSync } from "fs";

class Cart {
  constructor(id, products) {
    this.id = id;
    this.products = products;
  }
}

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Si existe el archivo no hace nada, sino lo crea
  checkFile = async () => {
    if (!existsSync(this.path)) {
      await writeFileSync(this.path, "[]", "utf-8");
    }
  };

  // Crear carrito
  async createCart() {
    try {
      await this.checkFile();

      const data = JSON.parse(await fs.readFile(this.path, 'utf-8'));
      const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
      const newCart = new Cart(newId, []);
      data.push(newCart);

      await fs.writeFile(this.path, JSON.stringify(data));
      return newId;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // Agregar productos al carrito
  async addProduct(cartId, productId, prodQty) {
    try {
      await this.checkFile();
  
      const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
      const foundCart = data.find(cart => cart.id === cartId);
  
      if (!foundCart) {
        throw new Error(`ID del carrito no encontrado`);
      }
  
      const foundProduct = foundCart.products.find(product => product.product === productId);
  
      if (!foundProduct) {
        foundCart.products.push({ product: productId, quantity: prodQty });
      } else {
        foundProduct.quantity += prodQty;
      }
  
      await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
  
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  // Ver el carrito
  async getCart(id) {
    try {
      await this.checkFile();
  
      const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
      const found = data.find(cart => cart.id === id);
  
      if (!found) {
        throw new Error(`ID del carrito no encontrado`);
      }
  
      return found;
    } catch (err) {
      console.error(err);
      return null;
    }
  }  

  // Borrar un producto del carrito
  async removeProductById(cartId, productId) {
    try {
      await this.checkFile();
  
      let data = JSON.parse(await fs.readFile(this.path, "utf-8"));
  
      const cartIndex = data.findIndex(cart => cart.id === cartId);
  
      if (cartIndex === -1) {
        throw new Error(`ID del carrito no encontrado`);
      }
  
      const cart = data[cartIndex];
      const productIndex = cart.products.findIndex(prod => prod.product === productId);
  
      if (productIndex === -1) {
        throw new Error(`El producto con id: "${productId}" no se encontró en el carrito con id: "${cartId}". Revise y vuelva a intentar.`);
      }
  
      cart.products.splice(productIndex, 1);
  
      await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
  
      return true;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}