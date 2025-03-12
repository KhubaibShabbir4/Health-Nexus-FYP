import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Get session token from cookies
    const sessionToken = cookies().get("session_token")?.value;

    if (sessionToken) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { token: sessionToken },
      });

      // Clear cookies
      const response = NextResponse.json(
        { success: true, message: "Logged out successfully" },
        { status: 200 }
      );

      response.cookies.set("session_token", "", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
      });

      response.cookies.set("authToken", "", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
      });

      response.cookies.set("user_role", "", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
      });

      return response;
    }

    return NextResponse.json({ error: "No session found" }, { status: 400 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
