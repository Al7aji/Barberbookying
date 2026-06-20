const mongoose = require('mongoose');

const connectdb = async ()=> {
   try{
       await mongoose.connect(process.env.DATABASE_URI) 

         console.log('MongoDB connected successfully')  
   }catch(err){
     console.error('MongoDB connection failed:', err.message)
      process.exit(1);
   }
    
};

const disconnectdb = ()=>{
        mongoose.connection.on('error',(err)=>{
        console.error('err')
         });

}

module.exports = { connectdb, disconnectdb };