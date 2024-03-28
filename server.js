import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({path: './config.env'})

import app from "./app.js"

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD )

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() =>console.log("DB connections successfull!!"))

const port = 3000 || process.env.PORT;
app.listen(port, () => {
    console.log(`server started! at port ${port}`);
});