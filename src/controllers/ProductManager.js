import { promises as fs, existsSync, writeFileSync } from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.checkFile();
  }

  checkFile = () => {
    // Si existe el archivo no hace nada, sino lo crea
    if (!existsSync(this.path)) {
      writeFileSync(this.path, "[]", "utf-8");
    }
  };

  // Agregar productos
  async addProduct(title, description, code, price, status = true, stock, category, thumbnails = []) {
    const productObject = { title, description, code, price, status, stock, category, thumbnails };

    // Checkea si el producto le falta data
    if (Object.values(productObject).includes("") || Object.values(productObject).includes(null)) {
      return `Campo del producto faltante`;
    }
  
    this.checkFile();
    try {
      const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
      if (data.some((elem) => elem.code === productObject.code)) {
        return `El código ${code} ya existe, no es posible agregarlo.`;
      }
  
      const newID = data.length ? data[data.length - 1].id + 1 : 1;
      data.push({ ...productObject, id: newID });
      await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
      return `Producto agregado exitosamente`
    } catch (err) {
      console.error(err);
    }
  }

  // Ver productos

  async getProducts() {
    const read = await fs.readFile(this.path, "utf-8");
    const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
    console.log(data);
    return data;
  }

  // Ver productos por ID
  async getProductByID(id) {
    this.checkFile();
    try {
      const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
      const found = data.find((prod) => prod.id === id);
      if (!found) {
        return `ID no encontrado`;
      }
  
      return found;
    } catch (err) {
      console.error(err);
    }
  }

  // Actualizar un producto
  async updateProduct(id, title, description, code, price, status = true, stock, category, thumbnails = []) {
    this.checkFile();
    try {
      const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
      const index = data.findIndex((prod) => prod.id === id);
      if (index === -1) {
        return `ID no encontrado`;
      }
  
      const product = data[index];
      product.title = title;
      product.description = description;
      product.code = code;
      product.price = price;
      product.status = status;
      product.stock = stock;
      product.category = category;
      product.thumbnails = thumbnails;
      await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
      return `Producto cambiado`
    } catch (err) {
      console.error(err);
    }
  }

  // Borrar un producto
  async deleteProduct(id) {
    try {
        await this.checkFile();
        const products = await this.getProducts();
        const index = products.findIndex((prod) => prod.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            await fs.writeFile(this.path, JSON.stringify(products), "utf-8");
            return `Producto Borrado`;
        } else {
            throw `Producto con ID "${id}" no encontrado. Revise el ID ingresado.`;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}
}

export default ProductManager;

