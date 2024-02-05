const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("Connection successful");
})
.catch((err) => { 
    console.log(err);
});

app.listen(3000, () => {
    console.log("Server running on port:3000");
});

app.get("/" ,(req,res) => {
    res.send("Working");
});