const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

let url = "mongodb+srv://akssmbr91:n1AVaMMpOv5SV5Lz@cluster0.vfcyhpk.mongodb.net/new_dev?retryWrites=true&w=majority"
// let url = "mongodb+srv://singhkumaramit2019:cGiOlc0Xd5yG6Yhs@cluster0.jvsyd.mongodb.net/qnps?retryWrites=true&w=majority&appName=Cluster0"
// let url = "mongodb://localhost:27017/qnps"

mongoose.connect(url,
{useNewUrlParser : true},(err,result)=>{
    if(err){
        console.log("not Connected",err)
    }else{
    console.log("db Connected")
    }

});

