import mongoose from "mongoose";

type ConnectionObect = {
    isConnected?: number;

};

const connection: ConnectionObect = {};

async function dbConnect(): Promise<void> {
    // chexking connection
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState
        console.log("Connected to the database successfully");
        
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1)
        
    }
}

export default dbConnect;