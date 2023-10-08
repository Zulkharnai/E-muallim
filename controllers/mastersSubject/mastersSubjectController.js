const db = require('../../config/Config');
const Joi = require('joi')

exports.getSubjectall = (req, res) => {
    var limit = req.query.limit;
    var current_page = req.query.page;
    var total_records = 0;
    var total_pages = 0;
    var next = current_page == total_pages ? false : true;
    var prev = current_page == 0 ? false : true;
    var start = current_page * limit;
   const {class_id}= req.query

    var to_date = req.query.to_date
    var from_date = req.query.from_date
    var query =`SELECT masters__subjects.subject_id,
    masters__subjects.subject_name, JSON_ARRAY(GROUP_CONCAT(concat('{topic_id:',topics.topic_id,',topic_title:',topics.topic_title,',topic_description:',topics.topic_title,',topic_thumbnail:',topics.topic_thumbnail,',topic_video_url:',topic_video_url,'}') SEPARATOR ','))
    AS Topics  from masters__subjects 
    RIGHT JOIN topics ON topics.subject_id = masters__subjects.subject_id WHERE topics.class_id = ?
    GROUP BY topics.subject_id`;
            db.query(query, [req.query.class_id],function (err, data1) {
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


exports.subjectListPagination = (req, res) => {
    
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
    var query = 'SELECT * FROM  masters__subjects ORDER BY subject_id DESC';
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
exports.subjectCreate = (req, res) => {
    let date = `${new Date().toISOString().slice(0, 10)}`;
    // return res.json(Groups.globales)
    var { subject_name,created_by } = req.body;
    subject_name = subject_name || "";
    if (subject_name < 1 ||subject_name =="") {
        return res.json({ success: false, message: "Please provide subject name" })
    }
    created_by = created_by || "";
    if (created_by < 1) {
        return res.json({ success: false, message: "Please provide created_by  id" })
    }
    
    db.query('INSERT INTO masters__subjects (subject_name,created_by,created_date) VALUES (?,?,?)', [req.body.subject_name,req.body.created_by,date], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops something went wronge.' });
        } else {
            return res.json({ success: true, message: 'subject created successfully.' });
        }
    })
}
exports.subjectUpdate = (req, res) => {
    let data = req.body;
    let date =`${new Date().toISOString().slice(0, 10)}`;
    var { subject_name,created_by ,subject_id} = req.body;
    subject_name = subject_name || "";
    if (subject_name < 1 ||subject_name =="") {
        return res.json({ success: false, message: "Please provide subject name" })
    }
    created_by = created_by || "";
    if (created_by < 1) {
        return res.json({ success: false, message: "Please provide created_by  id" })
    }
    subject_id = subject_id || "";
    if (subject_id < 1) {
        return res.json({ success: false, message: "Please provide subject_id id" })
    }
    db.query('UPDATE masters__subjects SET subject_name = ?,created_by = ?,created_date = ? WHERE subject_id = ?', [ data.subject_name, data.created_by, date, data.subject_id ], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somthing went wronge.' });
        } else {
            return res.json({ success: true, message: 'subject updated successfully.' });
        }
    })
}
exports.subjectDelete = (req, res) => {
    var { subject_id } = req.query;
    subject_id = subject_id || "";
    if (subject_id < 1) {
        return res.json({ success: false, message: "Please provide subject id" })
    }
    db.query('DELETE FROM masters__subjects WHERE subject_id = ?', [req.query.subject_id ], function (err) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            return res.json({ success: true, message: 'subject removed successfully' });
        }
    })
}
exports.subjectEdit = (req, res) => {
   
    db.query('SELECT * FROM  masters__subjects WHERE subject_id = ?', [req.query.subject_id], function (err,data) {
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


exports.getSubjects = (req, res) => {
 const {class_id}= req.query
    var query = 'SELECT ms.subject_id, ms.subject_name,mc.class_name FROM `chapters` RIGHT JOIN masters__subjects AS ms ON ms.subject_id = chapters.subject_id RIGHT JOIN masters__classes AS mc ON mc.class_id = chapters.class_id WHERE chapters.class_id = ? GROUP by ms.subject_id;';
    db.query(query,[class_id], function (err1, data1) {
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
exports.subjectList = (req, res) => {
    
       var query = 'SELECT * FROM masters__subjects ORDER BY subject_id DESC';
       db.query(query, function (err1, data1) {
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
exports.subjectSearch = (req, res) => {
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
        var query = 'SELECT * FROM masters__subjects  WHERE  subject_name LIKE  ? ';

    }
    else {
        var query = 'SELECT * FROM masters__subjects ';

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


