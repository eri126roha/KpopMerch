const express = require("express");
const mongoose= require("mongoose");
const config= require("config");
const cors= require("cors");
const app= express();

const merchandises = require('./routes/api/merchRouter');

const users = require("./routes/api/users");

app.use(express.json());
app.use(cors());

const mongo_url=config.get("mongo_url");
mongoose.set('strictQuery', true);
mongoose
.connect(mongo_url)
.then(() => console.log("connected to mongo"))
.catch((err) => console.log(err));

app.use("/api/users",users);
app.use("/api/merchandises", merchandises);
const port= process.env.PORT || 3001;

app.listen(port, ()=> console.log(`Server running on port ${port}`));