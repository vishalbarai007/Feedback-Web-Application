import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { success } from "zod/v4";

export async function GET(request: Request) {
    if (request.method !== "GET") {
        return new Response(JSON.stringify({
            message: "Method Not Allowed",
            success: false,
        }), { status: 405 });
    }

    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if (!session || !session.user) {
            return new Response(JSON.stringify({
                message: "Unauthorized",
                success: false,
            }), { status: 401 });
        }



        const userId = new mongoose.Types.ObjectId(user._id);
        try {
            const user = await UserModel.aggregate([
                {
                    $match: {
                        _id: userId,
                    }
                },
                {
                    $unwind: '$messages'
                },
                { $sort: { 'messages.createdAt': -1 } }, // Sort messages by createdAt in descending order
                {
                    $group: {
                        _id: '$_id',
                        messages: { $push: '$messages' }
                    }
                },
            ])

            if (!user || user.length === 0) {
                return Response.json(
                    {
                        success: false,
                        messages: "User not Found"
                    },
                    { status: 401 }
                )
            }

            return Response.json(
                {
                    success: true,
                    messages: user[0].messages
                },
                {
                    status: 200
                }
            )


        } catch (error) {
            console.error("Error parsing request body:", error);
            return new Response(JSON.stringify({
                message: "Invalid request body",
                success: false,
            }), { status: 400 });

        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            success: false,
        }), { status: 500 });
    }
}