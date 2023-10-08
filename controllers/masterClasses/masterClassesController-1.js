const db = require('../../config/Config');
const Joi = require('joi')


exports.classList = (req, res) => {
  
    var query = 'SELECT * FROM masters__classes WHERE created_by=? ';
db.query(query,[req.headers.created_by], function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({ success: false, message: 'Oops somethinge went wronge.' });
        } else {
                    if (data1.length > 0) {
                     
                        return res.json({ success: true, message:"data Retrieved ",data: data1 });
                    } else {
                        return res.json({ success: false, data: data1 });
                    }
            
        }
    });
}
exports.classCreate = (req, res) => {
    let date =`${new Date().toISOString().slice(0, 10)}`;
    // return res.json(Groups.globales)
    var { class_name,created_by ,class_id} = req.body;
    class_name = class_name || "";
    if (class_name < 1 ||class_name =="") {
        return res.json({ success: false, message: "Please provide class_name" })
    }
    created_by = created_by || "";
    if (created_by < 1) {
        return res.json({ success: false, message: "Please provide created_by id" })
    }
    db.query('INSERT INTO masters__classes (class_name,created_by,created_date) VALUES (?,?,?)', [req.body.class_name,req.body.created_by,date], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops something went wronge.' });
        } else {
            return res.json({ success: true, message: 'Class created successfully.' });
        }
    })
}
exports.classUpdate = (req, res) => {
    let data = req.body;
    let date = `${new Date().toISOString().slice(0, 10)}`;
    var { class_name,created_by ,class_id} = req.body;
    class_name = class_name || "";
    if (class_name < 1 ||class_name =="") {
        return res.json({ success: false, message: "Please provide class_name" })
    }
    created_by = created_by || "";
    if (created_by < 1) {
        return res.json({ success: false, message: "Please provide created_by id" })
    }
    class_id = class_id || "";
    if (class_id < 1) {
        return res.json({ success: false, message: "Please provide class_id" })
    }
    db.query('UPDATE masters__classes SET class_name = ?,created_by = ?,created_date = ? WHERE class_id = ?', [ data.class_name, data.created_by, date, data.class_id], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somthing went wronge.' });
        } else {
            return res.json({ success: true, message: 'Class updated successfully.' });
        }
    })
}
exports.classDelete = (req, res) => {
    var { class_id } = req.query;
    class_id = class_id || "";
    if (class_id < 1 ||class_id =="") {
        return res.json({ success: false, message: "Please provide class_id" })
    }

    db.query('DELETE FROM masters__classes WHERE class_id = ?', [req.query.class_id], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            return res.json({ success: true, message: 'Class removed successfully' });
        }
    })
}
exports.classEdit = (req, res) => {
    var { class_id } = req.query;
    class_id = class_id || "";
    if (class_id < 1 ||class_id =="") {
        return res.json({ success: false, message: "Please provide class_id" })
    }

    db.query('SELECT * FROM  masters__classes WHERE class_id = ? AND created_by=?', [req.query.class_id ,req.headers.created_by ], function (err,data) {
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


exports.classSearch = (req, res) => {
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
        const onlyLettersPattern = /^[A-Za-z]+$/;

        if (!req.query.keyword.match(onlyLettersPattern)) {
            return res.json({
                success: false,
                message: 'No Special Character Allowed'
            });
        }
     
        keyword = "%" + req.query.keyword + "%"
        var query = 'SELECT * FROM masters__classes  WHERE created_by= ? AND class_name LIKE  ?   ';

    }
    else {
        var query = 'SELECT * FROM masters__classes WHERE created_by = ? ';

    }
    db.query(query, [req.headers.created_by,keyword], function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({
                success: false,
                message: 'Oops somethinge went wrong.'
            });
        } else {
            query += ' LIMIT ' + start + ', ' + limit + '';
            db.query(query, [req.headers.created_by,keyword], function (err, data) {
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
