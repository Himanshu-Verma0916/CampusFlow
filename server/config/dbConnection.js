const mongoose =require('mongoose');

const connectDB =async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/content_broadcasting`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // process.exit(1);
        throw error
    }
}

module.exports = connectDB;
