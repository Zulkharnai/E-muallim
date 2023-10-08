const db = require('../../config/Config');
const formidable = require("formidable")
const fs = require('fs');
const Joi = require('joi')

const path = require("path");

exports.chapterList = (req, res) => {
    
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
    var query = 'SELECT chapters.*,ms.subject_name,mc.class_name,mb.board_name FROM chapters LEFT JOIN masters__subjects AS ms ON chapters.subject_id=ms.subject_id LEFT JOIN masters__classes AS mc ON chapters.class_id=mc.class_id LEFT JOIN masters__boards AS mb ON chapters.class_id=mb.board_id ORDER BY chapters.chapter_id DESC';
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
exports.chapterCreate = (req, res) => {
    let date = `${new Date().toISOString().slice(0, 10)}`;
   
    var form = new formidable.IncomingForm();
    form.parse(req, function (_err, input, file) {
      
        const schema = Joi.object({
            board_id: Joi.string().required(),
            class_id: Joi.string().required(),
            subject_id: Joi.string().required(),
            language_code: Joi.string().required(),
            chapter_title: Joi.string().required(),
            chapter_description: Joi.string().required(),
            created_by: Joi.string().required(),
        })
        var validate = schema.validate({
            board_id: input.board_id, class_id: input.class_id, subject_id: input.subject_id, language_code: input.language_code, chapter_title: input.chapter_title, chapter_description: input.chapter_description, created_by: input.created_by
        });

        if (typeof validate.error !== 'undefined') {
            return res.json({
                success: false,
                message: (validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
            });
        }
                     
let arrayfile=['.JPEG','.JPG','.PNG','.GIF','.TIFF','.PSD','.EPS' ,'.INDD','.RAW']
        var FileName = "";
   
        if (file.chapter_thumbnail_file !== undefined&&arrayfile.includes(path.extname(file.chapter_thumbnail_file.originalFilename.toUpperCase()))) {
            let chapter_thumbnail_file = file.chapter_thumbnail_file;
            var FromPath = chapter_thumbnail_file.filepath;
            var FileName = `${input.chapter_title}_${Date.now() + path.extname(chapter_thumbnail_file.originalFilename)}`;
            var newPath = path.join(__dirname, '../../public/chapterThumbnail/') + FileName;
            fs.copyFile(FromPath, newPath, (err) => {
                if (err) throw err;
                console.log('File moved successfully');
            });
        }


        db.query('INSERT INTO chapters (board_id,class_id,subject_id,language_code,chapter_title,chapter_description,chapter_thumbnail,created_by,created_date) VALUES (?,?,?,?,?,?,?,?,?)', [input.board_id, input.class_id, input.subject_id, input.language_code, input.chapter_title, input.chapter_description, FileName, input.created_by, date], function (err) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: 'Oops something went wronge.' });
            } else {
                return res.json({ success: true, message: 'Chapter created successfully.' });
            }
        })
    })
}
exports.chapterUpdate = (req, res) => {
    let data = req.body;
    let date = `${new Date().toISOString().slice(0, 10)}`;
    var form = new formidable.IncomingForm();
    form.parse(req, function (_err, input, file) {
        const schema = Joi.object({
            board_id: Joi.string().required(),
            class_id: Joi.string().required(),
            subject_id: Joi.string().required(),
            language_code: Joi.string().required(),
            chapter_title: Joi.string().required(),
            chapter_description: Joi.string().required(),
            created_by: Joi.string().required(),
        chapter_id : Joi.string().required(),
          
        })
        var validate = schema.validate({
            board_id: input.board_id, class_id: input.class_id, subject_id: input.subject_id, language_code: input.language_code, chapter_title: input.chapter_title, chapter_description: input.chapter_description, created_by: input.created_by, chapter_id : input.chapter_id
        });

        if (typeof validate.error !== 'undefined') {
            return res.json({
                success: false,
                message: (validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
            });
        }
        let arrayfile=['.JPEG','.JPG','.PNG','.GIF','.TIFF','.PSD','.EPS' ,'.INDD','.RAW']
        if (file.chapter_thumbnail_file !== undefined&&arrayfile.includes(path.extname(file.chapter_thumbnail_file.originalFilename.toUpperCase()))) {
            let chapter_thumbnail_file = file.chapter_thumbnail_file;
            var FromPath = chapter_thumbnail_file.filepath;
            var FileName = `${input.chapter_title}_${Date.now() + path.extname(chapter_thumbnail_file.originalFilename)}`;
            var ToPath = path.join(__dirname, '../../public/chapterThumbnail/') + FileName;
            fs.copyFile(FromPath, ToPath, (err) => {
                if (err) throw err;
                console.log('File moved successfully');
            });

            // they are different file.chapter_thumbnail and input.chapter_thumbnail 2 input different type
            let removePath = `${path.join(__dirname, '../../public/chapterThumbnail/') + input.chapter_thumbnail}`;
            if (fs.existsSync(removePath)) {
                fs.unlinkSync(removePath)
            }
        } else {
            var FileName = input.chapter_thumbnail||"-";
        }
        db.query('UPDATE chapters SET board_id=?,class_id=?,subject_id=?,language_code=?,chapter_title=?,chapter_description=?,chapter_thumbnail=?,created_by=?,created_date=?  WHERE chapter_id  = ?', [input.board_id, input.class_id, input.subject_id, input.language_code, input.chapter_title, input.chapter_description, FileName, input.created_by, date, input.chapter_id], function (err) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: 'Oops somthing went wronge.' });
            } else {
                return res.json({ success: true, message: 'Chapter updated successfully.' });
            }
        })
    })
}
exports.chapterDelete = (req, res) => {

    var { chapter_id } = req.query;

    chapter_id = chapter_id || "";
 
    if (chapter_id < 1) {
        return res.json({ success: false, message: "Please provide chapter id" })
    }
    db.query('SELECT chapter_thumbnail FROM chapters WHERE chapter_id = ?', [req.query.chapter_id], (err, data) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: "Failed to fetch form database check." });
        } else {
            db.query('DELETE FROM  chapters WHERE chapter_id = ?', [req.query.chapter_id], function (err,d) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Oops somethinge went wronge' });
                } else {
                    console.log(d);
                    return res.json({ success: true, message: 'chapter removed successfully' });
                }
            })
          
         let file=  data[0].chapter_thumbnail||"notfound"
            let removePath = `${path.join(__dirname, '../../public/chapterThumbnail/') + file}`;
            if (fs.existsSync(removePath)) {
                fs.unlinkSync(removePath)
            }else{

            }
    
        }
    
    })
}

exports.GetChapters = (req, res) => {
    var { subject_id,class_id } = req.query;

    subject_id = subject_id || "";
    class_id = class_id || "";
 
    if (class_id < 1 ||subject_id<1) {
        return res.json({ success: false, message: "Please provide id" })
    }
    var query = 'SELECT * FROM `chapters` WHERE  `subject_id` = ? AND `class_id`= ? ';
    db.query(query, [req.query.subject_id, req.query.class_id], function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({ success: false, message: 'Oops somethinge went wronge.' });
        } else {

            if (data1.length > 0) {

                return res.json({ success: true, message: "data Retrieved ", data: data1 });
            } else {
                return res.json({ success: false, data: data1 });
            }

        }
    });
}

exports.chapterEdit = (req, res) => {

    var { chapter_id } = req.query;

    chapter_id = chapter_id || "";

 
    if (chapter_id < 1 ) {
        return res.json({ success: false, message: "Please provide chapter id" })
    }
    db.query('SELECT * FROM  chapters WHERE chapter_id = ?', [req.query.chapter_id], function (err, data) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            return res.json({ success: true, message: 'Data retrieved successfully', data: data });
        }
    })
}

exports.chapterSearch = (req, res) => {
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
        var query = 'SELECT ts.*,ms.subject_name,cs.class_name FROM chapters AS ts LEFT JOIN masters__subjects AS ms ON ms.subject_id=ts.subject_id LEFT JOIN masters__classes AS cs ON cs.class_id=ts.class_id WHERE ts.chapter_title LIKE ? || ms.subject_name LIKE ? || cs.class_name LIKE ?'

    }
    else {
        var query = 'SELECT * FROM chapters ';

    }
    db.query(query, [keyword,keyword,keyword], function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({
                success: false,
                message: 'Oops somethinge went wrong.'
            });
        } else {
            query += ' LIMIT ' + start + ', ' + limit + '';
            db.query(query, [keyword,keyword,keyword], function (err, data) {
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

