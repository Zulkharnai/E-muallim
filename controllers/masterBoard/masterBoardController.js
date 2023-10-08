const db = require('../../config/Config');
const Joi = require('joi')

exports.boardList = (req, res) => {
    
    var query = 'SELECT * FROM  masters__boards ORDER BY board_id DESC';
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
exports.masterBoardList = (req, res) => {

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
    var query = 'SELECT * FROM masters__boards ORDER BY board_id DESC';
    db.query(query, function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({ success: false, message: 'Oops somethinge swent wronge.' });
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
                        return res.json({ success: true, data: data });
                    }
                }
            })
        }else{

            res.json({ success: true, message: 'Data retrieved successfully.',data: data1 })
        }
        }
    });
}
exports.masterBoardCreate = (req, res) => {
    let date =`${new Date().toISOString().slice(0, 10)}`;
    // return res.json(Groups.globales)
    var { board_name,created_by } = req.body;
    board_name = board_name || "";
    if (board_name < 1 ||board_name =="") {
        return res.json({ success: false, message: "Please provide board_name" })
    }
 
    created_by = created_by || "";
    if (created_by < 1) {
        return res.json({ success: false, message: "Please provide created_by id" })
    }
    db.query('INSERT INTO  masters__boards (board_name,created_by,created_date) VALUES (?,?,?)', [req.body.board_name,req.body.created_by,date], function (err) {
        if (err) {  
            console.log(err);
            return res.json({ success: false, message: 'Oops something went wronge.' });
        } else {
            return res.json({ success: true, message: 'Board created successfully.' });
        }
    })
}
exports.masterBoardUpdate = (req, res) => {
    let data = req.body;
    let date = `${new Date().toISOString().slice(0, 10)}`;
    var { board_name,created_by ,board_id} = req.body;
    board_name = board_name || "";
    if (board_name < 1 ||board_name =="") {
        return res.json({ success: false, message: "Please provide board_name" })
    }
    board_id = board_id || "";
    if (board_id < 1) {
        return res.json({ success: false, message: "Please provide board id " })
    }
    created_by = created_by || "";
    if (created_by < 1) {
        return res.json({ success: false, message: "Please provide created_by id" })
    }
    db.query('UPDATE masters__boards SET board_name = ?,created_by = ?,created_date = ? WHERE board_id = ?', [ data.board_name, data.created_by, date, data.board_id  ], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somthing went wronge.' });
        } else {
            return res.json({ success: true, message: 'Board updated successfully.' });
        }
    })
}
exports.masterBoardDelete = (req, res) => {
    var { board_id} = req.query;
    board_id = board_id || "";
    if (board_id < 1 ||board_id =="") {
        return res.json({ success: false, message: "Please provide board_id" })
    }
  
    try{  db.query('DELETE FROM masters__boards WHERE board_id = ?', [req.query.board_id  ], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            return res.json({ success: true, message: 'Board remove successfully' });
        }
    })}catch(er){

console.log(er)
    }
  
}
exports.masterBoardEdit = (req, res) => {
    var { board_id} = req.query;
    board_id = board_id || "";
    if (board_id < 1 ||board_id =="") {
        return res.json({ success: false, message: "Please provide board_id" })
    }
  
    db.query('SELECT * FROM  masters__boards WHERE board_id = ?', [req.query.board_id  ], function (err,data) {
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
exports.masterBoardSearch = (req, res) => {
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
        const onlyLettersPattern = /^[A-Za-z-' '-\d-\u0600-\u06FF]+$/;

        if (!req.query.keyword.match(onlyLettersPattern)) {
            return res.json({
                success: false,
                message: 'No Special Character Allowed'
            });
        }
     
        keyword = "%" + req.query.keyword + "%"
        var query = 'SELECT * FROM masters__boards  WHERE  board_name LIKE  ? ';

    }
    else {
        var query = 'SELECT * FROM masters__boards';
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