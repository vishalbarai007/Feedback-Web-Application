import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { success } from "zod/v4";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
    // Add any additional fields if needed
});

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username"),
        };

        const result = UsernameQuerySchema.safeParse({ queryParams });
        console.log(result);

        if (!result.success) {

            const username = result.error.format().username?._errors || [];

            return new Response(JSON.stringify({
                message: "Invalid query parameters",
                success: false,
                errors: result.error.errors,
            }), { status: 400 });
        }

        const { username } = result.data;

        const ExistingVerifiedUser = await UserModel.findOne({
            username: username,
            isVerified: true,
        });

        if (ExistingVerifiedUser) {
            return new Response(JSON.stringify({
                message: "Username is already taken",
                success: false,
            }), { status: 409 });

            
        }

        return Response.json({
            message: "Username is available",
            success: true,
        }, { status: 200 });

    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            success: false,
        }), { status: 500 });
    }
}