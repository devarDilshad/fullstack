const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

//json
app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// test api with error 500 in case of error there is a problme with all sys not only db
app.get("/test", (req, res) => {
  try {
    res.status(200).json({ message: "API is working" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch Orders by Invoice ID Endpoint
app.get("/orders/:invoiceId", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        // convert to number because a parameter is string and invoice id is a number
        invoice_id: Number(req.params.invoiceId),
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel Order Endpoint
app.post("/cancel-order/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  // orderId is a String and so is order_id
  // find the order and update status to canceled
  try {
    const order = await prisma.order.update({
      where: { order_id: orderId },
      data: { order_status: "Canceled" },
    });

    // Check if all orders in the invoice are canceled
    const orders = await prisma.order.findMany({
      // change to Number if any bugs is created in the feature
      where: { invoice_id: order.invoice_id },
    });

    const allCanceled = orders.every(
      (order) => order.order_status === "Canceled"
    );

    if (allCanceled) {
      // Update invoice status and amount if necessary
      await prisma.invoice.update({
        where: { invoice_id: order.invoice_id },
        data: { invoice_status: "Canceled", total_amount: 0 },
      });
    }

    res.json({ message: "Order canceled successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Error canceling order" });
  }
});

// create a new Client
app.post("/clients", async (req, res) => {
  const {
    organization_name,
    client_name,
    client_number,
    email,
    client_address,
    shipping_address,
  } = req.body;
  try {
    const newClient = await prisma.client.create({
      data: {
        organization_name,
        client_name,
        client_number,
        email,
        client_address,
        shipping_address,
      },
    });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper function to calculate remaining amount
const calculateRemainingAmount = (invoice) => {
  return invoice.total_amount - invoice.paid_amount;
};

// Get all invoices with added remaining_amount of money programmatically
app.get("/invoices", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany();
    const invoicesWithRemainingAmount = invoices.map((invoice) => ({
      ...invoice,
      remaining_amount: calculateRemainingAmount(invoice),
    }));
    res.status(200).json(invoicesWithRemainingAmount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific invoice
app.get("/invoices/:id", async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
    });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all of the invoices for a client
app.get("/invoices/client/:id", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        client_id: req.params.id,
      },
    });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// create a new invoice
app.post("/invoices", async (req, res) => {
  const { client_id, invoice_date, total_amount, payment_status } = req.body;
  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        client_id,
        invoice_date: new Date(invoice_date),
        total_amount,
        payment_status,
      },
    });
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// add a new payment
app.post("/payments", async (req, res) => {
  const { client_id, payment_type, payment_amount, payment_date, status } =
    req.body;
  try {
    const newPayment = await prisma.payment.create({
      data: {
        client_id,
        payment_type,
        payment_amount,
        payment_date: new Date(payment_date),
        status,
        unallocated: true,
      },
    });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// auto payment allocation end point
app.post("/process-payment/:paymentId", async (req, res) => {
  const paymentId = parseInt(req.params.paymentId);

  try {
    await allocatePayment(paymentId);
    res.status(200).send("Payment processed successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// function that allocates a payment to unpaid invoice ordered by the oldest invoice
// 1- the payment fulfills the invoice, the invoice status is updated to 'paid' and the payment status is changes to allocated
// 2- the payment doesn't fulfill an invoice, the invoice status remains 'unpaid' and the payment status is changes to partially allocated
// 3- the payment over fulfills an invoice, the invoice status is updated to 'paid'.
// The payment is marked as allocated (0 is remained) or partially_allocated depending on whether the remaining amount is zero or not.
// the process continues until the payment is exhausted or there are no more invoices for that client, the remained ammount goes
// the Client Balance
async function allocatePayment(paymentId) {
  // get the payment info plus the client that made the payment
  const payment = await prisma.payment.findUnique({
    where: { payment_id: paymentId },
    include: { Client: true },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  let remainingAmount = payment.payment_amount;

  // get all unpaid invoices for that client and order it by date
  const invoices = await prisma.invoice.findMany({
    where: {
      client_id: payment.client_id,
      payment_status: "unpaid",
    },
    orderBy: {
      invoice_date: "asc",
    },
  });

  for (const invoice of invoices) {
    const amountToPay = Math.min(
      remainingAmount,
      invoice.total_amount - invoice.paid_amount
    );
    remainingAmount -= amountToPay;

    await prisma.paymentInvoice.create({
      data: {
        payment_id: payment.payment_id,
        invoice_id: invoice.invoice_id,
        amount_allocated: amountToPay,
      },
    });

    await prisma.invoice.update({
      where: { invoice_id: invoice.invoice_id },
      data: {
        paid_amount: { increment: amountToPay },
        payment_status:
          amountToPay + invoice.paid_amount === invoice.total_amount
            ? "paid"
            : "unpaid",
      },
    });

    if (remainingAmount <= 0) break;
  }

  await prisma.payment.update({
    where: { payment_id: payment.payment_id },
    data: {
      status: remainingAmount > 0 ? "partially_allocated" : "allocated",
      unallocated: remainingAmount > 0,
    },
  });

  if (remainingAmount > 0) {
    await prisma.client.update({
      where: { client_id: payment.client_id },
      data: {
        client_balance: { increment: remainingAmount },
      },
    });
  }
}

// start server
const PORT = process.env.PORT || 4000;

// listen to port  and log server is running on that port if it is up n running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// create a function or edit the schema so that the invoice total amount is auto generated by adding the order items
