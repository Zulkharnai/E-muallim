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
            validate: true,
            message: validate.error.details[0].message.replace("_", " "),
            error: error
        });
    }


    db.query('SELECT * FROM schools__teachers  WHERE (login_id = ? AND login_password = ?)', [req.body.login_id, req.body.login_password], function (err, data, fields) {
        if (err) {
            console.log(err);
            res.json({ success: false, message: "Invalid credentials please retry..", err: err });

        } else {
            if (data.length > 0) {
                // --- Auth Token --- \\
                var token = jwt.sign({
                    id: data[0].teacher_id
                }, process.env.TEACHER_SECRET);
                res.json({ success: true, message: "User logged in.", token: token, data: data });
            } else {
                res.json({ success: false, message: "User not found." });
            }
        }
    });
}

exports.teacherCreate = (req, res) => {
    let date =`${new Date().toISOString().slice(0, 10)}`;
    const schema = Joi.object({
        school_id: Joi.string().required(),
        teacher_name: Joi.string().required(),
        login_id: Joi.string().required(),
        login_password: Joi.string().required(),
        created_by: Joi.string().required(),
    })
    var validate = schema.validate({
        school_id: req.body.school_id,
        teacher_name: req.body.teacher_name,
        login_id: req.body.login_id,
        login_password: req.body.login_password,
        created_by: req.body.created_by
    });

    if (typeof validate.error !== 'undefined') {
        return res.json({
            success: false,
            message: (validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
        });
    }

    db.query('INSERT INTO schools__teachers (school_id,teacher_name,login_id,login_password,created_by,created_date) VALUES (?,?,?,?,?,?)', [req.body.school_id, req.body.teacher_name, req.body.login_id, req.body.login_password, req.body.created_by, date], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops something went wronge.' });
        } else {
            return res.json({ success: true, message: 'Teacher created successfully.' });
        }
    })
}

exports.GetTeachers = (req, res) => {
    var { school_id } = req.query;

    school_id = school_id || "";


    if (school_id < 1) {
        return res.json({ success: false, message: "Please provide id" })
    }
    var query = 'SELECT * FROM `schools__teachers` WHERE  school_id= ? ORDER BY teacher_id DESC ';
    db.query(query, [req.query.school_id], function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({ success: false, message: 'Oops somethinge went wronge.' });
        } else {

            if (data1.length > 0) {

                return res.json({ success: true, message: "Data retrieved.", data: data1 });
            } else {
                return res.json({ success: false, message: "Data no found ", data: data1 });
            }

        }
    });
}

exports.techerUpdate = (req, res) => {

    const schema = Joi.object({
        school_id: Joi.string().required(),
        teacher_name: Joi.string().required(),
        login_id: Joi.string().required(),
        login_password: Joi.string().required(),
        created_by: Joi.string().required(),
        teacher_id: Joi.string().required()
    })
    var validate = schema.validate({
        school_id: req.body.school_id,
        teacher_name: req.body.teacher_name,
        login_id: req.body.login_id,
        login_password: req.body.login_password,
        created_by: req.body.created_by,
        teacher_id: req.body.teacher_id
    });

    if (typeof validate.error !== 'undefined') {
        return res.json({
            success: false,
            message: (validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
        });
    }
  
    let date = `${new Date().toISOString().slice(0, 10)}`;

    db.query('UPDATE schools__teachers SET school_id=?,teacher_name=?,login_id=?,login_password=?,created_by=?,created_date=?  WHERE teacher_id = ?', [req.body.school_id, req.body.teacher_name, req.body.login_id, req.body.login_password, req.body.created_by, date, req.body.teacher_id], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somthing went wronge.' });
        } else {
            return res.json({ success: true, message: 'Teacher updated successfully.' });
        }
    })
}
exports.teacherEdit = (req, res) => {
    var { teacher_id } = req.query;
    teacher_id = teacher_id || "";
    if (teacher_id < 1) {
        return res.json({ success: false, message: "Please provide teacher id " })
    }
    db.query('SELECT * FROM  schools__teachers WHERE teacher_id = ?', [req.query.teacher_id], function (err, data) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            if (data.length > 0) {
                return res.json({ success: true, message: 'Data retrieved successfully', data: data });
            } else {

                return res.json({ success: false, message: 'Data not found', data: data });

            }
        }
    })
}

exports.teacherDelete = (req, res) => {
    var { teacher_id } = req.query;
    teacher_id = teacher_id || "";
    if (teacher_id < 1) {
        return res.json({ success: false, message: "Please provide teacher id " })
    }
    db.query('DELETE FROM  schools__teachers WHERE teacher_id = ?', [req.query.teacher_id], function (err, data) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            if (data.affectedRows > 0) {
                return res.json({ success: true, message: 'Data deleted successfully' });
            } else {

                return res.json({ success: false, message: 'Data not found' });

            }
        }
    })
}


exports.teacherSearch = (req, res) => {
    try {
        console.log(req.query.keyword)
        const schema = Joi.object({
            Limit: Joi.number().required(),
            Page: Joi.number().required()
        })
        var validate = schema.validate({
            Limit: req.query.limit,
            Page: req.query.page
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
            message:(validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
        });
    }

    var limit = req.query.limit;
    var current_page = req.query.page;
    var total_records = 0;
    var total_pages = 0;
    var next = current_page == total_pages ? false : true;
    var prev = current_page == 0 ? false : true;
    var start = current_page * limit;
    let keyword = ""
  
    if (req.query.keyword !== null && req.query.keyword !== '' && req.query.keyword !== undefined) {
        const onlyLettersPattern =/^[A-Za-z-' '-\d-\u0600-\u06FF]+$/;

        if (!req.query.keyword.match(onlyLettersPattern)) {
            return res.json({
                success: false,
                message: 'No Special Character Allowed'
            });
        }
     
        keyword = "%" + req.query.keyword + "%"
        var query = 'SELECT * FROM schools__teachers  WHERE  teacher_name LIKE  ? || login_id LIKE ?  ';

    }
    else {
        var query = 'SELECT * FROM schools__teachers';
    }
    

    db.query(query, [keyword,keyword], function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({
                success: false,
                message: 'Oops somethinge went wrong.'
            });
        } else {
            query += ' LIMIT ' + start + ', ' + limit + '';
            db.query(query, [keyword,keyword], function (err, data) {
                if (err) {
                    console.log(err);
                    return res.json({
                        success: false,
                        message: 'Oops somethinge went wrong.'
                    });
                } else {
                    if (data1.length > 0) {
                        total_records = data1.length;
                        total_pages = Math.ceil(total_records / limit);
                        next = Number(current_page) + 1 === Number(total_pages) ? false : true;
                        return res.json({ success: true, total_records: total_records, total_pages: total_pages, page: current_page, next: next, prev: prev, data: data });
                    } else {
                        return res.json({
                            success: false,
                            data: data,
                            message: 'Data not found.'
                        });
                    }
                }
            })
        }
    });
}
exports.teacherListPagination = (req, res) => {
    
    var { limit,page } = req.query;
    var limit = req.query.limit;
    var current_page = req.query.page;
    var total_records = 0;
    var total_pages = 0;
    var next = current_page == total_pages ? false : true;
    var prev = current_page == 0 ? false : true;
    var start = current_page * limit;

    var to_date = req.query.to_date
    var from_date = req.query.from_date
    var query = 'SELECT * FROM  schools__teachers ORDER BY teacher_id DESC';
    db.query(query, function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({ success: false, message: 'Oops somethinge went wronge.' });
        } else {  
                      if(start||limit){
                limit = limit || "";
    if (limit < 0 ||limit =="") {
        return res.json({ success: false, message: "Please provide limit" })
    }
    page = page || "";
    if (page < 0 ||page =="") {
        return res.json({ success: false, message: "Please provide page" })
    }
            query += ' LIMIT ' + start + ', ' + limit + '';
            db.query(query, function (err, data) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Oops somethinge went wronge.' });
                } else {
                    if (data1.length > 0) {
                        total_records = data1.length;
                        total_pages = Math.ceil(total_records / limit);
                        next = Number(current_page) + 1 == total_pages ? false : true;
                        return res.json({ success: true, total_records: total_records, total_pages: total_pages, page: current_page, next: next, prev: prev, data: data });
                    } else {
                        return res.json({ success: false,message: 'Data retrieved successfully.', data: data });
                    }
                }
            })
        }else{
            res.json({ success: true,message: 'Data retrieved successfully.', data: data1 })
        }
        }
    });
}