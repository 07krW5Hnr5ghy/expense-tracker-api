const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const dbConn = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log(`MongoDB Connected: ${dbConn.connection.host}`);
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;