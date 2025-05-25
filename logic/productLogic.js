import products from '../electron/db/queries/products.js'
import db from '../electron/db/connection.js'

export async function createProduct(productData) {
  if (!productData.name) throw new Error('Product name is required')

  const result = products(db).create(productData)
  return { productId: result.lastInsertRowid }
}

export async function getProducts() {
  return products(db).findAll()
}

export async function getProductById(id) {
  if (!id) throw new Error('Product ID is required')

  const product = products(db).findById(id)
  if (!product) throw new Error('Product not found')

  return product
}

export async function updateProduct(id, updates) {
  if (!id) throw new Error('Product ID is required')

  const result = products(db).update(id, updates)
  return { changes: result.changes }
}

export async function deleteProduct(id) {
  if (!id) throw new Error('Product ID is required')

  const result = products(db).delete(id)
  return { changes: result.changes }
}
