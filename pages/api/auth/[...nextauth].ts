import NextAuth from "next-auth";
import { authOptions } from "@/lib/nextAuth";

console.log("Auth configuration:", {
  nextAuthUrl: process.env.NEXTAUTH_URL,
  nodeEnv: process.env.NODE_ENV,
});

export default NextAuth(authOptions);
