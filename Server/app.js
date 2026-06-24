require ('dotenv').config();
const express = require('express');
const {connectdb,disconnectdb} = require('./config/database');
const mongoose  = require('mongoose');
const cors = require('cors');
const corsOrigins = require('./config/CorsOrigins');
const cookieParser = require('cookie-parser')
const app = express();


connectdb()

app.use(cors(corsOrigins));
app.use(cookieParser());
app.use(express.json());

app.use("/Api/auth",require('./Routers/AuthRouters'));
app.use("/Api/users",require('./Routers/UsersRouter'));
app.use("/Api/barbers",require('./Routers/Barbers'));
app.use("/Api/appointments",require('./Routers/AppointmentRouter'));


const port = process.env.port || 5000;
mongoose.connection.once('open',()=>{
    console.log( "connected to database" )
    app.listen(port, () =>{

    const base = `http://localhost:${port}`;
    const endpoints = [
        ['POST',   '/Api/auth/register',                 'public'],
        ['POST',   '/Api/auth/login',                     'public'],
        ['GET',    '/Api/auth/refresh',                   'public (cookie)'],
        ['POST',   '/Api/auth/logout',                     'public'],
        ['GET',    '/Api/users',                           'admin'],
        ['GET',    '/Api/users/:id',                       'auth'],
        ['PUT',    '/Api/users/:id',                       'owner/admin'],
        ['DELETE', '/Api/users/:id',                       'owner/admin'],
        ['GET',    '/Api/barbers',                         'auth'],
        ['GET',    '/Api/barbers/:id',                     'auth'],
        ['GET',    '/Api/barbers/:id/available-slots',     'auth'],
        ['POST',   '/Api/barbers',                          'admin'],
        ['PUT',    '/Api/barbers/:id',                      'admin'],
        ['DELETE', '/Api/barbers/:id',                      'admin'],
        ['POST',   '/Api/appointments',                     'auth'],
        ['GET',    '/Api/appointments/me',                  'auth'],
        ['GET',    '/Api/appointments/:id',                 'owner/admin'],
        ['PATCH',  '/Api/appointments/:id/cancel',          'owner/admin'],
        ['GET',    '/Api/appointments',                     'admin'],
        ['PATCH',  '/Api/appointments/:id/status',          'admin'],
    ];

    console.log(`\nServer listening on port ${port}\n`);
    console.log('METHOD  ACCESS         ENDPOINT');
    console.log('------  -------------  ---------------------------------------------');
    endpoints.forEach(([method, path, access]) => {
        console.log(`${method.padEnd(7)} ${access.padEnd(14)} ${base}${path}`);
    });
    console.log('');
})
});

disconnectdb();




