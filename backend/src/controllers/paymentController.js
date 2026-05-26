const stripe = require("../services/stripe");
const Payroll = require("../models/Payroll");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { payrollId } = req.body;

    if (!payrollId) {
      return res.status(400).json({ message: "Payroll ID is required" });
    }

    const payroll = await Payroll.findById(payrollId).populate("employeeId", "name email");

    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    if (payroll.paid) {
      return res.status(400).json({ message: "This payroll has already been paid" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Salary payment for ${payroll.employeeId?.name || payroll.employeeEmail}`,
              description: `${payroll.month} ${payroll.year} - ${payroll.employeeEmail}`,
            },
            unit_amount: Math.round(payroll.salary * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        payrollId: payroll._id.toString(),
        employeeEmail: payroll.employeeEmail,
      },
      success_url: `${process.env.CLIENT_URL}/dashboard/payroll?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/payroll?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    res.status(500).json({ message: "Failed to create payment session" });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({ message: "Missing stripe-signature header" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const payrollId = session.metadata?.payrollId;

    if (!payrollId) {
      console.error("No payrollId in session metadata");
      return res.status(200).json({ received: true });
    }

    try {
      const payroll = await Payroll.findById(payrollId);

      if (!payroll) {
        console.error(`Payroll record ${payrollId} not found`);
        return res.status(200).json({ received: true });
      }

      if (payroll.paid) {
        return res.status(200).json({ received: true });
      }

      payroll.paid = true;
      payroll.paymentDate = new Date();
      payroll.transactionId = session.id;
      await payroll.save();

      console.log(`Payroll ${payrollId} marked as paid`);
    } catch (error) {
      console.error("Webhook handler error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.json({ received: true });
};
