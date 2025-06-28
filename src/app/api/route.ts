import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        await UserModel.init();
        const existingUserVarifiedByUsername = await UserModel.findOne({
            username,
            isverified: true
        })

        if (existingUserVarifiedByUsername) {
            return new Response(JSON.stringify({ success: false, message: "Username already exists" }), { status: 400 });
        }

        UserModel.findOne({ email })
        const verifyCode = Math.random().toString(36).substring(2, 15); // Generate a random verification code

        if (existingUserVarifiedByUsername) {
            return new Response(JSON.stringify({ success: false, message: "Email already exists" }), { status: 400 });

        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1); // Set expiry date
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpires: expiryDate,
                isvarified: false,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();    //user is saved 
            await sendVerificationEmail(newUser.email, newUser.username, newUser._id);

            return new Response(JSON.stringify({ success: true, message: "User registered successfully. Please check your email for verification." }), { status: 201 });
        }
    } catch (error) {
        console.error("Error in POST request:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error \n Error registering user" }), { status: 500 });

    }