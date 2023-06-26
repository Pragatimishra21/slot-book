const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use("/api/v1/user" , require("./routes/userRoutes"));

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || development;

app.listen(port, () => {
    console.log(`Server Running in ${nodeEnv} on port ${port}`.bgCyan.white);
});
