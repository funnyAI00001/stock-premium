const express = require("express");
const router = express.Router();

const User = require("../models/user");

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");
const adminEmails = [
  "admin1@gmail.com",
  "admin2@gmail.com",
  "jason.p.nutter@gmail.com",
  "email7@gmail.com",
];

router.post("/pay", async (req, res) => {
  const { token, amount, user } = req.body;
  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
          },
          { idempotencyKey }
        )
        .then(async (result) => {
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            await User.findOneAndUpdate(
              { email: user.email },
              {
                $set: {
                  stripe: true,
                },
              },
              { new: true }
            );
          } else {
            const newUser = new User({
              email: user.email,
              stripe: true,
            });

            await newUser.save();
          }
          res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: err.message });
        });
    });
});

// router.post("/updateStripeStatus", async (req, res) => {
//   const { user } = req.body;
//   const existingUser = await User.findOne({ email: user.email });

//   try {
//     if (existingUser) {
//       await User.findOneAndUpdate(
//         { email: user.email },
//         {
//           $set: {
//             stripe: true,
//           },
//         },
//         { new: true }
//       );
//     } else {
//       const newUser = new User({
//         email: user.email,
//         stripe: true,
//       });

//       await newUser.save();
//     }

//     res.json({ stripe: true });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message, stripe: false });
//   }
// });

router.post("/getStripeStatus", async (req, res) => {
  const { user } = req.body;

  const existingUser = await User.findOne({ email: user.email });

  if (existingUser) {
    const stripe = existingUser.stripe;

    res.status(200).json({ stripe });
  } else {
    res.status(200).json({ stripe: false });
  }
});

router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 100 * 100;
};

let YOUR_DOMAIN = "http://localhost:3000/stripe";

if (process.env.NODE_ENV === "production") {
  YOUR_DOMAIN = "https://premium.coverd.io/stripe";
}

router.post("/create-checkout-session", async (req, res) => {
  const { user } = req.body;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // price: "price_1P2H3LB0gv0feBVJ0NRs6cUl", // one time payment
        price: process.env.PRICE_ID, // recurring payment
        quantity: 1,
      },
    ],
    mode: "subscription",
    subscription_data: {
      trial_period_days: 14,
    },
    allow_promotion_codes: true,
    success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  // Update checkout session id of the user
  // const existingUser = await User.findOne({ email: user.email });
  // const userType = adminEmails.includes(user.email) ? "Admin" : "Paid";

  // if (existingUser) {
  //   await User.findOneAndUpdate(
  //     { email: user.email },
  //     {
  //       $set: {
  //         checkout_session_id: session.id,
  //         type: userType,
  //       },
  //     }
  //   );
  // } else {
  //   const newUser = new User({
  //     email: user.email,
  //     checkout_session_id: session.id,
  //     type: userType,
  //   });

  //   await newUser.save();
  // }
  // res.redirect(303, session.url);
  res.status(200).json({ url: session.url });
});

router.post("/update-checkout-session-id", async (req, res) => {
  const { user, checkoutSessionId } = req.body;

  try {
    // Update checkout session id of the user
    const existingUser = await User.findOne({ email: user.email });
    const userType = adminEmails.includes(user.email) ? "Admin" : "Paid";

    if (existingUser) {
      await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            checkout_session_id: checkoutSessionId,
            type: userType,
          },
        }
      );
    } else {
      const newUser = new User({
        email: user.email,
        checkout_session_id: checkoutSessionId,
        type: userType,
      });

      await newUser.save();
    }

    res.status(200).json({ id: checkoutSessionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create-portal-session", async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  // const { session_id } = req.body;
  try {
    const { user } = req.body;
    const existingUser = await User.findOne({ email: user.email });
    const session_id = existingUser.checkout_session_id;
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = YOUR_DOMAIN;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: returnUrl,
    });

    // res.redirect(303, portalSession.url);
    res.status(200).json({ url: portalSession.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/createFreeTrialAccount", async (req, res) => {
  try {
    const { user } = req.body;

    const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      const newUser = new User({
        email: user.email,
        checkout_session_id: "trial",
        type: adminEmails.includes(user.email) ? "Admin" : "Free",
      });

      await newUser.save();
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get session id of checkout session of the user, and data for the admin panel
router.post("/get-checkout-session-id", async (req, res) => {
  try {
    const { user } = req.body;
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      const sessionID = existingUser.checkout_session_id;
      let subscriptionStatus = null;

      if (existingUser.type === "Admin") {
        subscriptionStatus = "Admin";
      } else if (sessionID !== null && sessionID !== "trial") {
        const checkoutSession = await stripe.checkout.sessions.retrieve(
          sessionID
        );
        subscriptionStatus = checkoutSession.status;
      } else if (sessionID === "trial") {
        created_at = existingUser.created_at;

        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const diffTime = Math.abs(currentDate - created_at);

        // Convert milliseconds to days
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 7) {
          subscriptionStatus = "trial_expired";
        } else {
          subscriptionStatus = "trial";
        }
      }

      res.status(200).json({
        id: sessionID,
        status: subscriptionStatus,
        userType: existingUser.type,
      });
    } else {
      res.status(200).json({
        id: null,
        status: null,
        userType: null,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;
