const express = require('express');
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config();
const cors = require("cors");

// route import

const adminRoute=require("./routes/adminAppRoutes")
const teacherRoute=require("./routes/teacherAppRoutes")
const users=require("./routes/usersAppRoutes")

app.use(cors());
// --- Body Parser --- \\
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
// --- Body Parser --- \\ 

app.use('/public', express.static('public'))

process.on('uncaughtException', function (err) {
    // Handle the error safely
    console.log(err)
})

// --- === Use All Route === --- \\
app.get("/",(req,res)=>{

    return res.json({emaullim:"emaullim"})
});
app.use(adminRoute);
app.use(teacherRoute);
app.use(users);
// --- === Use All Route === --- \\

app.listen(process.env.PORT);