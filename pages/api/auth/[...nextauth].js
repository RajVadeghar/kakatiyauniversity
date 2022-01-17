import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import dbConnect from "../../../utils/mongo";
import bcrypt from "bcrypt";
import { validateAllOnce } from "../../../utils/common";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      // credentials: {
      //   username: { label: "Username", type: "text", placeholder: "jsmith" },
      //   password: {  label: "Password", type: "password" }
      // },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        try {
          await dbConnect();
          const { uid, password } = credentials;
          validateAllOnce({ uid, password });

          const userId = uid.toUpperCase();

          const user = await User.findOne({ uid: userId });
          if (!user) {
            throw new Error("Something went wrong");
          }
          const userDoc = user._doc;
          const isMatched = await bcrypt.compare(password, userDoc.password);

          if (user && isMatched) {
            // Any object returned will be saved in `user` property of the JWT
            delete userDoc.password;
            return userDoc;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            throw new Error("ID Number or password is incorrect");
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user, token }) {
      if (token && token.uid) {
        session.user.id = token.uid;
        session.user.isFaculty = token.isFaculty;
        session.user.branch = token.branch;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.dateOfJoining = token.dateOfJoining;
        session.user.dateOfPassOut = token.dateOfPassOut;
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user && user._id) {
        token.uid = user.uid;
        token.isFaculty = user.isFaculty;
        token.branch = user.branch;
        token.name = user.name;
        token.image = user.img;
        token.dateOfJoining = user.dateOfJoining;
        token.dateOfPassOut = user.dateOfPassOut;
      }
      // console.log("token >>>>>>>>>>>>>", token);
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
