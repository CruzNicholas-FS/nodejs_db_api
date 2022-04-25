const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Author = require("../models/author");

router.get("/",(req, res, next)=>{
    res.json({message:"All authors - GET"});
})

router.post("/",(req, res, next)=>{
  const newAuthor = new Author({
    _id: mongoose.Types.ObjectId(),
    name:req.body.name,
    book:req.body.bookId
  })

  Author.find({name:req.body.name, book:req.body.bookId})
  .exec()
  .then(result=>{
    if (result.length>0) {
      return res.status(406).json({
        message:"Author already added"
      })
    }
    
    newAuthor.save()
    .then(result=>{
      res.status(200).json({
        message:"Author added",
        author:{
          name:result.name,
          bookWritten:result.book
        },
        metadata:{
          host:req.hostname,
          method:req.method
        }
      })
    })
    .catch(err=>{
      console.log(err.message);
      res.status(500).json({
        error:{
          message:err.message
        }
      })
    })
  })
  .catch(err=>{
    console.error(err);
    res.status(500).json({
      error:{
        message:`Unable to save author with name${req.body.name}`
      }
    })
  })
})

router.get("/:id",(req, res, next)=>{
    const authorId=req.params.id;
    Author.findById(authorId)
    .select("name _id")
    .populate("book", "title author")
    .exec()
    .then(author=>{
      if (!author) {
        console.log(author);
        return res.status(404).json({
          message:"Author not found"
        })
      }
      res.status(201).json({
        author:author
      })
    })
    .catch(err=>{
      res.status(500).json({
        error:{
          message:err.message
        }
      })
    })
})

router.patch("/:id",(req, res, next)=>{
    const authorId=req.params.id;
    res.json({
      message:"All authors - PATCH",
      id:authorId
    });
})

router.delete("/:id",(req, res, next)=>{
    const authorId=req.params.id;

    Author.findOneAndDelete({_id:authorId})
    .exec()
    .then(result=>{
      res.status(200).json({
        message:"Author deleted",
        request:{
          method:"GET",
          url:"http://localhost:3100/authors"+authorId
        }
      })
    })
    .catch(err=>{
      res.status(500).json({
        message:err.message
      })
    })
    res.json({
      message:"All authors - GET",
      id:authorId 
    });
})


module.exports=router;