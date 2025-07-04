import mongoose from "mongoose";




// const mongoose = require('mongoose')
// require('dotenv').config()

const url = process.env.MONGODB_URI;
// console.log(url);

if (!url) {
    throw new Error("MONGODB_URI environment variable is not defined");
}

// const connectionParams={
//     useNewUrlParser: true,
//     // useCreateIndex: false,
//     useUnifiedTopology: true 
// }
mongoose.connect(url)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })






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