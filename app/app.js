const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

const authorRoutes = require("../api/routes/authors");
const bookRoutes = require("../api/routes/books");
const playerRoutes = require("../api/routes/players");

//middleware for logging
app.use(morgan("dev"));
//parsing middleware
app.use(express.urlencoded({extended:true}));
//middleware that all requests are JSON
app.use(express.json());

//middleware to handle CORS
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method==="OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST, PUT, GET, PATCH, DELETE");
    }

    next();
})

app.get("/",(req,res,next)=>{
    res.status(201).json({message:"Server up", method:req.method});
})

app.use("/authors", authorRoutes);

app.use("/books", bookRoutes);

app.use("/players", playerRoutes);

//middleware modules
app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
  });
  //middleware to send error nicely
  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      error: {
        message: error.message,
        status: error.status,
        method: req.method,
      },
    });
  });

//Connect to mongodb
mongoose.connect(process.env.mongodbURL, err =>{
    if (err) {
        console.error("Error: ", err.message)
    } else {
        console.log("MongoDB connection successful")
    }
})

module.exports=app;