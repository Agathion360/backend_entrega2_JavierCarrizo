import fs from 'fs'


class ProductManager {
    
    static genId = 0

    constructor(path) {
        this.path = path
        this.products = []
        
        
    }

//lectura de archivo products.json
async initProduct(){
    try {
        const productData = await fs.promises.readFile(this.path, 'utf-8') 
        this.products = JSON.parse(productData)
    } catch (error) {
        console.error("Error al leer el archivo:", error.message)
    }
    
}




    async addProduct(product) {
       
        try {
            await this.initProduct()
            this.constructor.genId++
            product.id = this.constructor.genId

            if (this.products.some(prod => prod.code === product.code)) {
                console.log(`Error, el código ${product.code} está repetido`)
                return
            } else if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
                console.log('Error, todos los campos son obligatorios')
                return
            } else {
                this.products.push(product)
                console.log('Producto agregado correctamente')
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))

            }

        } catch (error) {
            console.error("Error al agregar el producto:", error.message)
        }



    }

    async getProducts() {
        try{
            await this.initProduct()
            console.log(this.products)
        }
        catch(error){
            console.error("Error al obtener la lista de productos:", error.message)
        }
    }

    async getProductsById(id) {
      try{
        await this.initProduct()
        const product = this.products.find(prod => prod.id === id)
        product ? product : console.log(`not found`)
        //console.log(product)
        }
        catch(error){
            console.error("Error al obtener la lista de productos:", error.message)
        }
    }
       
   
    

    async updateProduct(id, data) {
       
       try  {
        await this.initProduct()
        const productIndex = this.products.findIndex(prod => prod.id === id)

        if (productIndex !== -1) {
            
            for (const key in data) {
                if (key in this.products[productIndex]) {
                    this.products[productIndex][key] = data[key]
                }
            }

            console.log('Producto actualizado correctamente')
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } else {
            console.log(`El producto con ID: ${id} no existe`)
        }
        
       }catch(error){
           console.error("Error al actualizar el producto:", error.message)
       }
       
    }

    async deleteProduct(id) {
        try{
            await this.initProduct()
            const product = this.products.find(prod => prod.id === id)
            if (product) {
                this.products = this.products.filter(prod => prod.id !== id)
                console.log('Producto eliminado correctamente')
            } else {
                console.log(`El producto con ID: ${id} no existe`)
            }
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        }
        catch(error){
            console.error("Error al eliminar el producto:", error.message)
        }
    }
}
const productManager = new ProductManager("./Products.json")



//Metodos para probar el codigo

const product={
    title: 'pantalon',
    description: 'pantalon de algodón',
    price: 5000,
    thumbnail:'./img/pantalon.jpg',
    code: 34,
    stock: 50,
    
}

productManager.addProduct(product)



// Obtener la lista de productos
//console.log(productManager.getProducts())


//busqueda de producto con el id 1
 //console.log(productManager.getProductsById(1))


//busqueda de producto con el id 20 inexistente en el array
//  console.log(productManager.getProductsById(20))


//metodo para actualizar un producto con el id, se puede cambiar uno o varios campos
//productManager.updateProduct(1,{title:"Chomba Pique", price: 10000})


//metodo para eliminar un producto
//console.log(productManager.deleteProduct(1))
