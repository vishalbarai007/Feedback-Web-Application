import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    await UserModel.init();

    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: "Username already exists" }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.random().toString(36).substring(2, 15); // Random code
    const verifyCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // If email exists and is verified → reject
    if (existingUserByEmail && existingUserByEmail.isVerified) {
      return new Response(
        JSON.stringify({ success: false, message: "Email already exists" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUserByEmail && !existingUserByEmail.isVerified) {
      // Update existing unverified user
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpires = verifyCodeExpires;
      await existingUserByEmail.save();
    } else {
      // New user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    console.log("Email sent successfully:", emailResponse);

    if (!emailResponse.success) {
      console.error("Failed to send verification email:", emailResponse.message);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to send verification email",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully. Please check your email for verification.",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Server Error\nError registering user",
      }),
      { status: 500 }
    );
  }
}
