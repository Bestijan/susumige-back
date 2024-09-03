const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dbURI = 'mongodb://shushumigelaza-25931:4MkBWeUwjDrDGoGrAmQppP9DQPn53t@db-shushumigelaza-25931.nodechef.com:5361/shushumigelaza';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express());
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
    origin: ['https://shushumige.net', 'https://www.shushumige.net', 'http://localhost:4200'],
    credentials: true
};

app.use(cors(corsOptions));

// Use the routes
app.use('', postRoutes);
app.use('', getRoutes);
app.use('', putRoutes);
app.use('', deleteRoutes);

// const options = {
//     key: fs.readFileSync('shushumige.net-privkey.pem'),
//     cert: fs.readFileSync('shushumige.net-fullchain.pem')
// };

// const credentials = { 
//     key: privateKey, 
//     cert: certificate
// };

const sslCA = fs.readFileSync('./SSLCA.pem');

const httpsServer = https.createServer(sslCA);

mongoose.connect(dbURI)
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("App is listening....");
        });
        // httpsServer.listen(process.env.PORT || 3000 ,() => {
        //     console.log(`HTTPS server listening...`);
        // });
    })
    .catch(error => {
        console.log(error);
    });
app.get('/',   
    (req, res) => {
        res.send('Hello from NodeChef with HTTPS!');
    });
    
