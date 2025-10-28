import db from "../../electron/db/connection.js";
import sales from "../../electron/db/queries/sales.js";

export default function getSales({
  productId = null,
  sellerName = null,
  startDate = null,
  endDate = null,
  search = "",
  page = 1,
  perPage = 25,
} = {}) {
  return sales(db).findAll({
    productId,
    sellerName,
    startDate,
    endDate,
    search,
    page,
    perPage,
  });
}
