import { IResolvers } from "@graphql-tools/utils";
import { User } from "./entity/User";
import bcrypt from "bcryptjs";
import { stripe } from "./stripe";

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.session.userId) {
        return null;
      }

      const user = await User.findOne({ where: { id: req.session.userId } });

      return user;
    },
  },
  Mutation: {
    register: async (_, { email, password }) => {
      if (!email || !password) {
        return false;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        email,
        password: hashedPassword,
      }).save();

      return true;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    },
    logout: async (_, __, { req, res }) => {
      return new Promise((resolve) =>
        req.session.destroy((err: any) => {
          res.clearCookie("connect.sid");

          if (err) {
            console.log(err);
            resolve(false);
            return;
          }

          resolve(true);
        })
      );
    },
    createSubscription: async (_, { source, ccLast4 }, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error("Not authenticated");
      }

      const user = await User.findOne({ where: { id: req.session.userId } });

      if (!user) {
        throw new Error("User does not exist");
      }

      console.log("user", user);

      let stripeId = user.stripeId;

      if (!stripeId) {
        // create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          source,
        });

        // set the new customer id to the current users stripeId in db
        stripeId = customer.id;

        await stripe.subscriptions.create({
          customer: stripeId,
          items: [
            {
              price: process.env.STRIPE_PRICE_ID!, // ('!' meaning this is a string and defined)
            },
          ],
        });
      } else {
        // update customer
        await stripe.customers.update(stripeId, {
          source,
        });

        await stripe.subscriptions.create({
          customer: stripeId,
          items: [
            {
              price: process.env.STRIPE_PRICE_ID!,
            },
          ],
        });
      }

      //
      user.stripeId = stripeId;
      user.type = "paid";
      user.ccLast4 = ccLast4;

      await user.save();

      return user;
    },
    changeCreditCard: async (_, { source, ccLast4 }, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error("Not authenticated");
      }

      const user = await User.findOne({ where: { id: req.session.userId } });

      if (!user || !user.stripeId || user.type !== "paid") {
        throw new Error("User does not exist");
      }

      await stripe.customers.update(user.stripeId, { source });

      user.ccLast4 = ccLast4;
      await user.save();

      return user;
    },
    cancelSubscription: async (_, __, { req }) => {
      if (!req.session || !req.session.userId) {
        throw new Error("Not authenticated");
      }

      const user = await User.findOne({ where: { id: req.session.userId } });

      if (!user || !user.stripeId || user.type !== "paid") {
        throw new Error("User does not exist");
      }

      // retrieve the stripe customer
      //const stripeCustomer = await stripe.customers.retrieve(user.stripeId);

      // cancel the customers subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeId,
      });
      const [subscription] = subscriptions.data;

      await stripe.subscriptions.del(subscription.id);

      // delete customers credit card
      const cards = await stripe.customers.listSources(user.stripeId);
      const [card] = cards.data;

      await stripe.customers.deleteSource(user.stripeId, card.id as string);

      user.type = "free-trial";
      await user.save();

      return user;
    },
  },
};
