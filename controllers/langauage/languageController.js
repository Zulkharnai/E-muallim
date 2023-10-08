const db = require('../../config/Config');
const Joi = require('joi')


exports.languageList = (req, res) => {
    
    var query = 'SELECT * FROM  languages';
            db.query(query, function (err, data) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Oops somethinge went wronge.' });
                } else {
                    if (data.length > 0) {
                       
                        return res.json({ success: true,message: 'Data retrieved successfully', data: data });
                    } else {
                        return res.json({ success: false, data: data });
                    }
                }
            })
        
}
exports.languageCreate = (req, res) => {
    let date = `${new Date().toISOString().slice(0, 10)}`;
    // return res.json(Groups.globales)
    var { language,language_code } = req.body;
    language = language || "";
    if (language < 1 ||language =="") {
        return res.json({ success: false, message: "Please provide language" })
    }
    language_code = language_code || "";
    if (language_code < 1) {
        return res.json({ success: false, message: "Please provide language_code " })
    }
    db.query('INSERT INTO  languages (language,language_code) VALUES (?,?,?)', [req.body.language,req.body.language_code], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops something went wronge.' });
        } else {
            return res.json({ success: true, message: 'Language created successfully.' });
        }
    })
}
exports.languageUpdate = (req, res) => {
    let data = req.body;
    let date = `${new Date().toISOString().slice(0, 10)}`;
    var { language,language_code ,language_id} = req.body;
    language = language || "";
    if (language < 1 ||language =="") {
        return res.json({ success: false, message: "Please provide language" })
    }
    language_id = language_id || "";
    if (language_id < 1) {
        return res.json({ success: false, message: "Please provide board id " })
    }
    language_code = language_code || "";
    if (language_code < 1) {
        return res.json({ success: false, message: "Please provide language_code " })
    }
    db.query('UPDATE languages SET language = ?,language_code = ? WHERE language_id = ?', [ data.language, data.language_code, data.language_id  ], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somthing went wronge.' });
        } else {
            return res.json({ success: true, message: 'Language updated successfully.' });
        }
    })
}
exports.languageDelete = (req, res) => {
    var { language_id} = req.body;
    language_id = language_id || "";
    if (language_id < 1 ||language_id =="") {
        return res.json({ success: false, message: "Please provide language_id" })
    }
    db.query('DELETE FROM languages WHERE language_id = ?', [req.query.language_id  ], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            return res.json({ success: true, message: 'Language removed successfully' });
        }
    })
}

exports.languageEdit = (req, res) => {
    var { language_id} = req.body;
    language_id = language_id || "";
    if (language_id < 1 ||language_id =="") {
        return res.json({ success: false, message: "Please provide language_id" })
    }
    db.query('SELECT * FROM  languages WHERE language_id = ?', [req.query.language_id], function (err,data) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            return res.json({ success: true, message: 'Data retrieved successfully' ,data:data});
        }
    })
}
