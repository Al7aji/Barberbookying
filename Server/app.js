require ('dotenv').config();
const express = require('express');
const {connectdb,disconnectdb} = require('./config/database');
const mongoose  = require('mongoose');
const cors = require('cors');
const corsOrigins = require('./config/CorsOrigins');
const cookieParser = require('cookie-parser')
const app = express();
const allowedOrigins = require('./config/AllowedOrigins');

connectdb()

app.use(cors(corsOrigins));
app.use(cookieParser());
app.use(express.json());

app.use("/Api/auth",require('./Routers/AuthRouters'));
app.use("/Api/users",require('./Routers/UsersRouter'));



const port = process.env.Port || 5000;
mongoose.connection.once('open',()=>{
    console.log( "connected to database" )
    app.listen(port, () =>{

    console.log(`Example app listening on port ${port}!`)
    console.log(`http://localhost:${port}/Api/auth/register`);
    console.log(`http://localhost:${port}/Api/auth/login`);
    console.log(`http://localhost:${port}/Api/auth/refresh`);
    console.log(`http://localhost:${port}/Api/auth/logout`);
    console.log(`http://localhost:${port}/Api/users`);
    console.log(`http://localhost:${port}/Api/users/:id`);

})
});

disconnectdb();




