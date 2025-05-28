import { v4 as uuidv4 } from 'uuid'
import { BrowserWindow } from 'electron'
import db from '../../electron/db/connection.js'
import sales from '../../electron/db/queries/sales.js'
import products from '../../electron/db/queries/products.js'

export default async function createSales(salesData) {
  if (!Array.isArray(salesData) || salesData.length === 0) {
    throw new Error('At least one sale is required')
  }

  const createdSales = []
  let pharmacyInfo = null
  let receiptProducts = []

  await db.transaction(async (trx) => {
    // Fetch pharmacy info once during transaction
    pharmacyInfo = await trx('pharmacy_data').first()

    for (const sale of salesData) {
      const {
        product_id,
        quantity_sold,
        price_per_unit,
        discount_applied = 0,
        total_cost,
        price_before_discount,
        expected_selling_price,
        seller_id,
      } = sale

      const product = await products(trx).findById(product_id)
      if (!product) throw new Error(`Product with ID ${product_id} not found`)
      if (product.quantity_remained < quantity_sold) {
        throw new Error(`Not enough stock for product ${product.name} (ID: ${product_id})`)
      }

      const saleObject = {
        product_id,
        quantity_sold,
        price_per_unit,
        discount_applied,
        total_cost,
        price_before_discount,
        expected_selling_price,
        seller_id,
        sale_uuid: uuidv4(),
      }

      const [saleId] = await sales(trx).create(saleObject)
      await products(trx).updateQuantity(product_id, product.quantity_remained - quantity_sold)

      createdSales.push({ sale_id: saleId, sale_uuid: saleObject.sale_uuid })

      receiptProducts.push({
        name: product.name,
        brand: product.brand,
        quantity_sold,
        price_per_unit,
        discount_applied,
        total_cost,
      })
    }
  })

  // 🧾 Generate and print receipt
  try {
    const receiptWindow = new BrowserWindow({ show: false })

    const grandTotal = receiptProducts.reduce((sum, p) => sum + p.total_cost, 0);

    const receiptHTML = `
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Receipt</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        background: white;
        color: #111827;
        padding: 2rem;
        max-width: 900px;
        margin: auto;
      }
      h1, h2 {
        text-align: center;
        margin: 0;
      }
      h1 {
        font-size: 1.875rem;
        font-weight: bold;
        text-transform: uppercase;
      }
      h2 {
        font-size: 1.5rem;
        margin-top: 1rem;
      }
      .info, .footer {
        text-align: center;
        font-size: 0.875rem;
        color: #6B7280;
        margin-top: 0.25rem;
      }
      .info span {
        margin: 0 0.5rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 2rem;
        font-size: 0.875rem;
      }
      thead {
        background-color: #F3F4F6;
        color: #1F2937;
      }
      th, td {
        padding: 0.75rem;
        border: 1px solid #D1D5DB;
        text-align: right;
      }
      th:first-child, td:first-child {
        text-align: left;
      }
      tfoot td {
        background-color: #F9FAFB;
        font-weight: bold;
      }
      .powered {
        font-size: 0.75rem;
        color: #9CA3AF;
        text-align: left;
        margin-top: 2rem;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <h1>${pharmacyInfo?.name || 'Pharmacy Name'}</h1>
    <div class="info">
      <span>${pharmacyInfo?.phone_number || '-'}</span>
      <span>•</span>
      <span>${pharmacyInfo?.email || '-'}</span>
      <span>•</span>
      <span>${pharmacyInfo?.address || '-'}</span>
    </div>

    <h2>Receipt</h2>
    <p class="info">Date: ${new Date().toLocaleString()}</p>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Discount</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${receiptProducts.map(p => `
          <tr>
            <td>${p.name} (${p.brand})</td>
            <td>${p.quantity_sold}</td>
            <td>${p.price_per_unit.toLocaleString()} TZS</td>
            <td>${(p.discount_applied || 0).toLocaleString()} TZS</td>
            <td>${p.total_cost.toLocaleString()} TZS</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="text-align:right;">Grand Total</td>
          <td>${grandTotal.toLocaleString()} TZS</td>
        </tr>
      </tfoot>
    </table>

    <div class="powered">Powered by AfyaTrack</div>
  </body>
</html>
`


    await receiptWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(receiptHTML)}`)
    receiptWindow.webContents.on('did-finish-load', () => {
      receiptWindow.webContents.print({}, (success, error) => {
        if (!success) console.error('Print failed:', error)
        receiptWindow.close()
      })
    })
  } catch (err) {
    console.error('Receipt print error:', err)
  }

  return { success: true, sales: createdSales }
}
