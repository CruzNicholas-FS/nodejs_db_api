const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Player = require("../models/player");

router.get("/", (req, res, next)=>{
    Player.find({})
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err.message);
        res.status(500).json({
            error:{
                message:err.message
            }
        });
    });
});

router.post("/", (req, res, next)=>{
    const newPlayer = new Player({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        number:req.body.number,
        position:req.body.position,
        team:req.body.team
    });

    newPlayer.save()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"Player added",
            player:{
                name:result.name,
                number:result.number,
                position:result.position,
                team:result.team,
                id:result._id
            },
            metadata:{
                host:req.hostname,
                method:req.method
            }
        });
    })
    .catch(err=>{
        console.error(err.message);
        res.status(500).json({
          error:{
            message: err.message
          }
        });
      });
});

router.get("/:id", (req, res, next)=>{
    const playerId = req.params.id
    Player.findOne({_id:playerId})
    .then(result=>{
        res.status(200).json({
            message:"Player found by ID",
            player:{
                name:result.name,
                number:result.number,
                position:result.position,
                team:result.team,
                id:result._id
            },
            metadata:{
                host:req.hostname,
                method:req.method
            }
        });
    })
    .catch(err=>{
        console.error(err.message);
        res.status(500).json({
            error:{
                message:err.message
            }
        });
    });
});

router.patch("/:id", (req, res, next)=>{
    const playerId = req.params.id;

    const updatedPlayer = {
        name:req.body.name,
        number:req.body.number,
        position:req.body.position,
        team:req.body.team
    }

    Player.findOneAndUpdate({_id:playerId}, updatedPlayer, {returnOriginal:false})
    .then(result=>{
        res.status(200).json({
            message:"Player updated by ID",
            player:{
                name:result.name,
                number:result.number,
                position:result.position,
                team:result.team
            },
            metadata:{
                host:req.hostname,
                method:req.method
            }
    })
  })
})

router.delete("/:id", (req, res, next)=>{
    const playerId = req.params.id;

    const deletedPlayer = {
        name:req.body.name,
        number: req.body.number,
        position:req.body.position,
        team:req.body.team
    }

    Player.findOneAndDelete({_id:playerId})
    .then(result=>{
        res.status(200).json({
            message:"Player deleted by ID",
            player:{
                name:result.name,
                number:result.number,
                position:result.position,
                team:result.team,
                id:result._id
            },
            metadata:{
                host:req.hostname,
                method:req.method
            }
    })
  })
})

module.exports=router;