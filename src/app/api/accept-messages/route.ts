import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import  dbConnect  from "@/lib/dbConnect";
import  UserModel  from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    if (request.method !== "POST") {
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

        const userId = user._id;
        const { acceptMessages } = await request.json();

      try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, 
            { isAcceptingMessage: acceptMessages },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({
                message: "User not found",
                success: false,
            }), { status: 404 });
        }
        return new Response(JSON.stringify({
            message: "User message acceptance status updated successfully",
            success: true,
            data: updatedUser,
        }), { status: 200 });
        
      } catch (error) {
            console.error("Error parsing request body:", error);
            return new Response(JSON.stringify({
                message: "Invalid request body",
                success: false,
            }), { status: 400 });
        }
        

    } catch (error) {
        console.error("Error accepting messages:", error);
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            success: false,
        }), { status: 500 });
    }
}


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

        const userId = user._id;
        const existingUser = await UserModel.findById(userId);

        if (!existingUser) {
            return new Response(JSON.stringify({
                message: "User not found",
                success: false,
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            message: "User message acceptance status retrieved successfully",
            success: true,
            isAcceptingMessages: existingUser.isAcceptingMessage,
            
            // data: existingUser.isAcceptingMessage,
        }), { status: 200 });

    } catch (error) {
        console.error("Error retrieving message acceptance status:", error);
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            success: false,
        }), { status: 500 });
    }
}