const db = require('../../config/Config');
const Joi = require('joi')

exports.schoolList = (req, res) => {
    
    var query = 'SELECT * FROM  schools ORDER BY school_id DESC';
            db.query(query, function (err, data1) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Oops somethinge went wronge.' });
                } else {
                    if (data1.length > 0) {
                       
                        return res.json({ success: true, data: data1 });
                    } else {
                        return res.json({ success: false, data: data1 });
                    }
                }
            })
}

exports.schoolListPagination = (req, res) => {
    
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
    var query = 'SELECT * FROM  schools ORDER BY school_id DESC';
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
exports.schoolCreate = (req, res) => {
    const schema = Joi.object({
        school_name: Joi.string().required(),
        school_email: Joi.string().email().required(),
        school_contact_number: Joi.number().required(),
        school_address: Joi.string().required(),
   
    })
    var validate = schema.validate({
        school_name: req.body.school_name,
        school_email: req.body.school_email,
        school_contact_number: req.body.school_contact_number,
        school_address: req.body.school_address,
    });
    if(!(req.body.school_contact_number.length >= 10 && req.body.school_contact_number.length <= 12)){
        return res.json({
            success: false,
            message: "Enter a Valid Phone number"
        });
    }
if (typeof validate.error !== 'undefined') {
    return res.json({
        success: false,
        message: (validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
    });
}

    let date = `${new Date().toISOString().slice(0, 10)} - ${new Date().toLocaleTimeString()}`;
    // return res.json(Groups.globales)
    db.query('INSERT INTO  schools (school_name,school_email,school_contact_number,school_address,created_by,created_date) VALUES (?,?,?,?,?,?)', [req.body.school_name,req.body.school_email,req.body.school_contact_number,req.body.school_address,req.body.created_by,date], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops something went wronge.' });
        } else {
            

            db.query('INSERT INTO user (login_id, login_password) VALUES (?,?)', [req.body.school_email,req.body.school_password], function (err) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Oops something went wronge.' });
                } else {
                    
        
        
                    return res.json({ success: true, message: 'School created successfully.' });
                }
            })
            // return res.json({ success: true, message: 'School created successfully.' });
        }
    })
    
}
exports.schoolUpdate = (req, res) => {
    let data = req.body;

        const schema = Joi.object({
            school_name: Joi.string().required(),
            school_email: Joi.string().email().required(),
            school_contact_number: Joi.number().required(),
            school_address: Joi.string().required(),
            school_id: Joi.required(),
        })
        var validate = schema.validate({
            school_name: data.school_name,
            school_email: data.school_email,
            school_contact_number: data.school_contact_number,
            school_address: data.school_address,
            school_id: data.school_id,
        });
   
    if (typeof validate.error !== 'undefined') {
        return res.json({
            success: false,
            message:(validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
        });
    }
    if(!(req.body.school_contact_number.length >= 10 && req.body.school_contact_number.length <= 12)){
        return res.json({
            success: false,
            message: "Enter a Valid Phone number"
        });
    }
    let date = `${new Date().toISOString().slice(0, 10)}`;
   
    db.query('UPDATE schools SET school_name=?,school_email=?,school_contact_number=?,school_address=?,created_by=?,created_date=?  WHERE school_id = ?', [ data.school_name, data.school_email, data.school_contact_number , data.school_address, data.created_by,date, data.school_id ], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somthing went wronge.' });
        } else {
            return res.json({ success: true, message: 'School updated successfully.' });
        }
    })
}
exports.schoolDelete = (req, res) => {

    var { school_id } = req.query;
    school_id = school_id || "";
    if (school_id < 1) {
        return res.json({ success: false, message: "Please provide school id" })
    }
    db.query('DELETE FROM schools WHERE school_id = ?', [req.query.school_id ], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            return res.json({ success: true, message: 'School removed successfully' });
        }
    })
}

exports.schoolEdit = (req, res) => {
    var { school_id } = req.query;
    school_id = school_id || "";
    if (school_id < 1) {
        return res.json({ success: false, message: "Please provide school id" })
    }
    db.query('SELECT * FROM  schools WHERE school_id = ?', [req.query.school_id], function (err,data) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            if (data.length>0) {
                return res.json({ success: true, message: 'Data retrieved successfully' ,data:data});
            }  else{

                return res.json({ success: false, message: 'Data not found' ,data:data});

            }   
        }
    })
}
exports.schoolSearch = (req, res) => {
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
        var query = 'SELECT * FROM schools  WHERE  school_name LIKE  ? ';

    }
    else {
        var query = 'SELECT * FROM schools';
    }
    

    db.query(query, [keyword], function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({
                success: false,
                message: 'Oops somethinge went wrong.'
            });
        } else {
            query += ' LIMIT ' + start + ', ' + limit + '';
            db.query(query, [keyword], function (err, data) {
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