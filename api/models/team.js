const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String, required:true},
    location:{type:String, required:true},
    roster:{
        player1:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Player",
            required:true
        },
        player2:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Player",
            required:false
        },
        player3:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Player",
            required:false
        },
        player4:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Player",
            required:false
        },
        player5:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Player",
            required:false
        }
    }
})

module.exports=mongoose.model("Team", teamSchema);