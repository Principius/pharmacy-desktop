export default function sales(db) {
  return {
    async create({
      product_id,
      quantity_sold,
      price_per_unit,
      discount_applied,
      total_cost,
      price_before_discount,
      expected_selling_price,
      seller_id,
      sale_uuid,
      profit,
      payment_method_id
    }) {
      return await db("sales").insert({
        product_id,
        quantity_sold,
        price_per_unit,
        discount_applied,
        total_cost,
        price_before_discount,
        expected_selling_price,
        seller_id,
        sale_uuid,
        profit,
        payment_method_id
      });
    },

    async findAll({
      productId = null,
      sellerName = null,
      startDate = null,
      endDate = null,
      search = "",
      page = 1,
      perPage = 25,
    } = {}) {
      let query = db("sales")
        .join("products", "sales.product_id", "products.id")
        .leftJoin("users", "sales.seller_id", "users.id")
        .leftJoin("payment_methods", "sales.payment_method_id", "payment_methods.id") // ✅ join payment_methods
        .select(
          "sales.*",
          "products.name as product_name",
          "products.brand as product_brand",
          "users.name as seller_name",
          "payment_methods.name as payment_method" // ✅ include payment method name
        )
        .orderBy("sales.created_at", "desc");

      // ✅ Apply filters
      if (productId) query.where("sales.product_id", productId);
      if (sellerName) query.where("users.name", sellerName);
      if (startDate) query.where("sales.created_at", ">=", new Date(startDate));
      if (endDate) query.where("sales.created_at", "<=", new Date(endDate));

      if (search.trim()) {
        query.where((builder) => {
          builder
            .where("products.name", "like", `%${search}%`)
            .orWhere("products.brand", "like", `%${search}%`)
            .orWhere("users.name", "like", `%${search}%`)
            .orWhere("sales.id", "like", `%${search}%`);
        });
      }

      // Count before pagination
      const total = await query.clone().count({ count: "*" }).first();

      // Pagination
      const offset = (page - 1) * perPage;
      const results = await query.limit(perPage).offset(offset);

      // Totals for filtered result
      const totals = await query
        .clone()
        .sum({
          totalQuantity: "sales.quantity_sold",
          totalAmount: "sales.total_cost",
          totalProfit: "sales.profit",
        })
        .first();

      // UTC → EAT conversion
      const toEAT = (utc) => {
        if (!utc) return null;
        const d = new Date(utc);
        return new Date(d.getTime() + 3 * 60 * 60 * 1000)
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
      };

      const data = results.map((sale) => ({
        ...sale,
        created_at_eat: toEAT(sale.created_at),
      }));

      return {
        sales: data,
        totals,
        total: Number(total.count),
        page,
        perPage,
        totalPages: Math.ceil(total.count / perPage),
      };
    },

    async findById(id) {
      return await db("sales")
        .join("products", "sales.product_id", "products.id")
        .leftJoin("users", "sales.seller_id", "users.id") // optional: also show seller here
        .select(
          "sales.*",
          "products.name as product_name",
          "users.name as seller_name"
        )
        .where("sales.id", id)
        .first();
    },

    async getSaleById(id) {
      return await db("sales").where({ id }).first();
    },

    async update(id, updates) {
      return await db("sales").where({ id }).update({
        product_id: updates.product_id,
        quantity_sold: updates.quantity_sold,
        price_per_unit: updates.price_per_unit,
        discount_applied: updates.discount_applied,
        total_cost: updates.total_cost,
        price_before_discount: updates.price_before_discount,
        expected_selling_price: updates.expected_selling_price,
        seller_id: updates.seller_id,
        sale_uuid: updates.sale_uuid,
      });
    },

    async delete(id) {
      return await db("sales").where({ id }).del();
    },
  };
}
