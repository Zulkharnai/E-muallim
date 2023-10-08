const jwt = require('jsonwebtoken');
require('dotenv').config();


// --- === Jwt Web Token Authentication === --- \\
exports.Auth = (req, res, next) => {
    res.setHeader('Content-Type', 'text/json');
    var token = req.headers.token;
   
    if (token === null || token === "") {
        return res.json({ success: false, message: "Token should not be null" });
    }
    
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).send({ success: false, message: "Failed to authenticate user." })
        } else {
            // console.log(decoded);
            req.decoded = decoded
            next()
        }
    });
    // res.end();
}
// --- === Jwt Web Token Authentication === --- \\

exports.teacherAuth = (req, res, next) => {
    res.setHeader('Content-Type', 'text/json');
    var token = req.headers.token;
   
    if (token === null || token === "") {
        return res.json({ success: false, message: "Token should not be null" });
    }
    
    jwt.verify(token, process.env.TEACHER_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).send({ success: false, message: "Failed to authenticate user." })
        } else {
            // console.log(decoded);
            req.decoded = decoded
            next()
        }
    });
    // res.end();
}