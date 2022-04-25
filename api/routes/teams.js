const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Team = require("../models/team");
const Messages = require("../../messages/messages")

router.get("/", (req, res, next)=>{
    Team.find({})
    .select("name location roster _id")
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err.message);
        res.status(500).json({
            error:{
                message:err.message
            }
        })
    })
});

router.post("/", (req, res, next)=>{
    const newTeam = new Team({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        location:req.body.location,
        roster:req.body.roster
    });

    Team.find({name:req.body.name, player1:req.body.roster.player1})
    .populate("roster.player1", "name number position").populate("roster.player2", "name number position").populate("roster.player3", "name number position").populate("roster.player4", "name number position").populate("roster.player5", "name number position")
    .exec()
    .then(result=>{
      console.log(result);
      if (result.length>0) {
        return res.status(406).json({
          message:Messages.teamAlreadyAdded
        })
      }

    newTeam.save()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:Messages.teamAdded,
            team:{
                name:result.name,
                location:result.location,
                roster:{
                    player1:req.body.roster.player1,
                    player2:req.body.roster.player2,
                    player3:req.body.roster.player3,
                    player4:req.body.roster.player4,
                    player5:req.body.roster.player5
                },
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
    })
    .catch(err=>{
        console.error(err);
        res.status(500).json({
          error:{
            message:`${Messages.teamAddError}${req.body.name}`
          }
        });
      });
});

router.get("/:id", (req, res, next)=>{
    const teamId=req.params.id;
    Team.findById(teamId)
    .select("name _id roster")
    .populate("roster.player1", "name number position").populate("roster.player2", "name number position").populate("roster.player3", "name number position").populate("roster.player4", "name number position").populate("roster.player5", "name number position")
    .exec()
    .then(team=>{
      if (!team) {
        return res.status(404).json({
          message:Messages.teamNotFound
        })
      }
      res.status(201).json({
        message:Messages.teamFoundByID,
        team:team
      })
    })
    .catch(err=>{
      res.status(500).json({
        error:{
          message:err.message
        }
      })
    })
});

router.patch("/:id", (req, res, next)=>{
    const teamId=req.params.id;

    const updatedTeam = {
        name:req.body.name,
        location:req.body.location,
        roster:req.body.roster
    }

    Team.findOneAndUpdate({_id:teamId}, updatedTeam)
    .populate("roster.player1", "name number position").populate("roster.player2", "name number position").populate("roster.player3", "name number position").populate("roster.player4", "name number position").populate("roster.player5", "name number position")
    .exec()
    .then(result=>{
        if (!result) {
            return res.status(404).json({
                message:Messages.teamNotFound
            })
        }
        res.status(200).json({
            message:Messages.teamUpdatedByID,
            team:{
                name:result.name,
                location:result.location,
                roster:{
                    player1:result.roster.player1,
                    player2:result.roster.player2,
                    player3:result.roster.player3,
                    player4:result.roster.player4,
                    player5:result.roster.player5
                }
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:{
                message:`${Messages.teamUpdateError}${req.body.name}`
            }
        })
    })
});

router.delete("/:id", (req, res, next)=>{
    const teamId=req.params.id;

    Team.findOneAndDelete({_id:teamId})
    .populate("roster.player1", "name number position").populate("roster.player2", "name number position").populate("roster.player3", "name number position").populate("roster.player4", "name number position").populate("roster.player5", "name number position")
    .exec()
    .then(result=>{
        res.status(200).json({
            message:Messages.teamDeletedByID,
            team:{
                name:result.name,
                location:result.location,
                roster:{
                    player1:result.roster.player1,
                    player2:result.roster.player2,
                    player3:result.roster.player3,
                    player4:result.roster.player4,
                    player5:result.roster.player5
                }
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:{
                message:`Unable to delete ${req.body.name}`
            }
        })
    })
});

module.exports=router;