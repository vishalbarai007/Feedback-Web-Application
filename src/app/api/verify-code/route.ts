import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { decode } from "punycode";


export async function POST(request: Request) {
    if (request.method !== "GET") {
        return new Response(JSON.stringify({
            message: "Method Not Allowed",
            success: false,
        }), { status: 405 });
    }

    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });



        if (!code) {
            return new Response(JSON.stringify({
                message: "Code is required",
                success: false,
            }), { status: 400 });
        }

        // const user = await UserModel.findOne({ verificationCode: code });

        if (!user) {
            return new Response(JSON.stringify({
                message: "Invalid verification code",
                success: false,
            }), { status: 404 });
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date();

        if (isCodeValid || isCodeNotExpired) {
            user.isVerified = true;
            // user.verificationCode = null; // Clear the verification code after successful verification
            await user.save();
            return new Response(JSON.stringify({
                message: "User verified successfully",
                success: true,
            }), { status: 200 });
        } else if (!isCodeNotExpired) {
            return new Response(JSON.stringify({
                message: "Verification code has expired",
                success: false,
            }), { status: 400 });
        } else {
            return new Response(JSON.stringify({
                message: "Invalid verification code",
                success: false,
            }), { status: 400 });
        }

    } catch (error) {
        console.error("Error verifying user:", error);
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            success: false,
        }), { status: 500 });
    }
}