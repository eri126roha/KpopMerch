const express = require("express");
const mongoose= require("mongoose");
const config= require("config");
const cors= require("cors");
const app= express();
const merchandises = require('./routes/api/merchRouter');

const users = require("./routes/api/users");
app.use(cors());
app.use(express.json());



const mongo_url=config.get("mongo_url");
mongoose.set('strictQuery', true);
mongoose
.connect(mongo_url)
.then(() => console.log("connected to mongo"))
.catch((err) => console.log("MongoDB connection error:",err));

app.use("/api/users",users);
app.use("/api/merchandises", merchandises);

app.use((req, res, next) => {
    res.status(404).send({ error: 'Route not found' });
  });
  
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error
    res.status(500).send({ error: 'Something went wrong, please try again later' });
  });

const port= process.env.PORT || 3001;

app.listen(port, ()=> console.log(`Server running on port ${port}`));