const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

//get all users
// app.get("/users", async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// //get single user
// app.get("/users/:id", async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         id: Number(req.params.id),
//       },
//     });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// //create user
// app.post("/users", async (req, res) => {
//   try {
//     const user = await prisma.user.create({
//       data: {
//         name: req.body.name,
//         email: req.body.email,
//       },
//     });
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// //update a user
// app.put("/users/:id", async (req, res) => {
//   try {
//     const user = await prisma.user.update({
//       where: {
//         id: Number(req.params.id),
//       },
//       data: {
//         name: req.body.name,
//         email: req.body.email,
//       },
//     });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// //delete a user
// app.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await prisma.user.delete({
//       where: {
//         id: Number(req.params.id),
//       },
//     });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // return all products
// app.get("/products", async (req, res) => {
//   try {
//     const products = await prisma.product.findMany();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // add a product with name,  description, price, sku, stock, categories, createdAt and updatedAt fields
// app.post("/products", async (req, res) => {
//   try {
//     const product = await prisma.product.create({
//       data: {
//         name: req.body.name,
//         description: req.body.description,
//         sku: req.body.sku,
//         price: req.body.price,
//         stock: req.body.stock,
//         categories: req.body.categories,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Delete an invoice and its related data in case of Product returns(1 item or entire order)
app.delete("/invoices/:id", async (req, res) => {
  const invoiceId = Number(req.params.id);

  try {
    // Delete related PaymentInvoice records
    await prisma.paymentInvoice.deleteMany({
      where: { invoice_id: invoiceId },
    });

    // Delete the invoice
    const deletedInvoice = await prisma.invoice.delete({
      where: { invoice_id: invoiceId },
    });

    res.status(200).json(deletedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
