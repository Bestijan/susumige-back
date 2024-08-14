const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dbURI = 'mongodb://shushumige-25931:ILSCqLxW0t8aRgKGTz4sfzq7rJ80Mb@db-shushumige-25931.nodechef.com:5361/shushumige?ssl=true';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');


app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const postRoutes = require('./routes/postRoutes');
const getRoutes = require('./routes/getRoutes');
const putRoutes = require('./routes/putRoutes');
const deleteRoutes = require('./routes/deleteRoutes');

const corsOptions = {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Application-json',
                     'Authorization', 
                     'X-Requested-With', 'Accept', 'Origin'
    ],
    origin: '*',
    credentials: true
};

app.use(cors(corsOptions));

// Use the routes
app.use('', postRoutes);
app.use('', getRoutes);
app.use('', putRoutes);
app.use('', deleteRoutes);

const privateKey = fs.readFileSync('./pk.pem', 'utf8');
const certificate = fs.readFileSync('./SSLCA.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

mongoose.connect(dbURI)
        .then(() => {
            app.listen(5361, () => {
                console.log("App is listening on port 5361....");
            });
            // httpsServer.listen(5361, () => {
            //     console.log(`HTTPS server listening on port 5361`);
            // });
        })
        .catch(error => {
            console.log(error);
        });
// app.get('/',   
//     (req, res) => {
//         res.send('Hello from NodeChef with HTTPS!');
//     });
    
