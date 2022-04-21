const express=require("express");
const router = express.Router();

router.get("/",(req, res, next)=>{
    res.json({message:"All authors - GET"});
})

router.post("/",(req, res, next)=>{
    res.json({message:"All authors - POST"});
})

router.get("/:id",(req, res, next)=>{
    const authorId=req.params.id;
    res.json({
      message:"All authors - GET",
      id:authorId 
    });
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
    res.json({
      message:"All authors - GET",
      id:authorId 
    });
})


module.exports=router;