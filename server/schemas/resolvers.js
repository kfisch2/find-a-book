const { sign } = require("jsonwebtoken");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("You need to log in!");
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Wrong credentials");
      }
      const correctPW = await user.isCorrectPassword(password);
      if (!correctPW) {
        throw new AuthenticationError("Wrong credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create({ args });
      const token = signToken(user);
    },

    saveBook: async (parent, {bookData}, context) => {
        
    },
    removeBook: {},
  },
};

module.exports = resolvers;
