const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dbURI = 'mongodb://127.0.0.1:27017/susumige';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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
    origin: ['http://localhost:4200', 
             'http://localhost:4400'],
    credentials: true
};

app.use(cors(corsOptions));

// Use the routes
app.use('', postRoutes);
app.use('', getRoutes);
app.use('', putRoutes);
app.use('', deleteRoutes);

mongoose.connect(dbURI)
        .then(() => {
            app.listen(5000, () => {
                console.log("App is listening on port 5000....")
            });
        })
        .catch(error => {
            console.log(error);
        });
