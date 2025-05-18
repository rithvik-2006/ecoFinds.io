import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { generateToken } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // check if fields are filled
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // find user and check password
    const user = await User.findByCredentials(email, password)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // make token
    const token = generateToken(user._id)

    // send user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    )
  }
}
