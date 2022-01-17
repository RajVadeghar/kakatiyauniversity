import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import dbConnect from "../../../utils/mongo";
import bcrypt from "bcrypt";
import { validateAllOnce } from "../../../utils/common";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
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
            delete userDoc.password;
            return userDoc;
          } else {
            throw new Error("ID Number or password is incorrect");
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token && token.uid) {
        session.user.id = token.id;
        session.user.uid = token.uid;
        session.user.isFaculty = token.isFaculty;
        session.user.branch = token.branch;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.dateOfJoining = token.dateOfJoining;
        session.user.dateOfPassOut = token.dateOfPassOut;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user && user._id) {
        token.id = user._id;
        token.uid = user.uid;
        token.isFaculty = user.isFaculty;
        token.branch = user.branch;
        token.name = user.name;
        token.image = user.img;
        token.dateOfJoining = user.dateOfJoining;
        token.dateOfPassOut = user.dateOfPassOut;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
