require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const projectRoutes = require('./routes/project');

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

//Middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

app.use(cors());

app.use('/project', projectRoutes);

//Conexão com o db
mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.uuffbkd.mongodb.net/`
    )
    .then(() => {
        console.log(`Conectado ao MongoDB.`);
        app.listen(3000);
    })
    .catch((err) => console.log(err));

