import mongoose from "mongoose";

const dbName = "cadt-idg-003";
const mongoURI = 'mongodb://cadt-db:27017';//docker server
// const mongoURI = 'mongodb://127.0.0.1:27017';//generatedata

export async function dbConnect() {
    mongoose.connection.on('connected', () => {
        console.log('Conected: ', dbName);
    })
    await mongoose.connect(mongoURI, {
        dbName
    })
}