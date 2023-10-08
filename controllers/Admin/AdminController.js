const db = require('../../config/Config');
const jwt = require('jsonwebtoken')
const Joi = require('joi')
require('dotenv').config();

exports.Login = (req, res) => {
 
    try {
        const schema = Joi.object({
            login_id: Joi.string().required(),
            login_password: Joi.string().required()
        })
        var validate = schema.validate({
            login_id: req.body.login_id,
            login_password: req.body.login_password
        });
    } catch (error) {
        return res.json({
            success: false,
            message: 'Ooops something went wrong.',
            error: error
        });
    }
    if (typeof validate.error !== 'undefined') {
        return res.json({
            success: false,
            validate:true,
            message:(validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', ""),
            error: error
        })
    }
 
    db.query('SELECT * FROM users  WHERE (users.login_id = ? AND users.login_password = ?)', [req.body.login_id, req.body.login_password], function (err, data, fields) {
        if (err) {
            console.log(err);
            res.json({ success: false, message: "Invalid credentials please retry..", err: err });

        } else {
            if (data.length > 0) {
                // --- Auth Token --- \\
                var token = jwt.sign({
                    id: data[0].user_id
                }, process.env.TOKEN_SECRET);
                res.json({ success: true, message: "User logged in.",token:token, data: data });
            } else {
                res.json({ success: false, message: "User not found." });
            }
        }
    });
}
