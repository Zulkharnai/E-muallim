const db = require('../../config/Config');
const formidable = require("formidable")
const fs = require('fs');
const Joi = require('joi')

const path = require("path");

exports.TopicList = (req, res) => {
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
    var query = 'SELECT topics.*,ms.subject_name,mc.class_name FROM topics LEFT JOIN masters__subjects AS ms ON topics.subject_id=ms.subject_id LEFT JOIN masters__classes AS mc ON topics.class_id=mc.class_id ORDER BY topic_id DESC';
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
                        return res.json({ success: false, data: data });
                    }
                }
            })
        }else{

            res.json({ success: true, message: 'Data retrieved successfully.',data: data1 })
        }
        }
    });
}
exports.TopicCreate = (req, res) => {
    let date = `${new Date().toISOString().slice(0, 10)}`;
    // return res.json(Groups.globales)
    var form = new formidable.IncomingForm();
    form.parse(req, function (_err, input, file) {
        const schema = Joi.object({
            topic_title: Joi.string().required(),
            chapter_id: Joi.string().required(),
            class_id: Joi.string().required(),
            language_code: Joi.string().required(),
            topic_description: Joi.string().required(),
            topic_video_url: Joi.string().required(),
            created_by: Joi.required(),
            subject_id: Joi.string().required(),
         
        })
        var validate = schema.validate({
        class_id: input.class_id, subject_id: input.subject_id, language_code: input.language_code, topic_title: input.topic_title, topic_description: input.topic_description, created_by: input.created_by,chapter_id:input.chapter_id,topic_video_url:input.topic_video_url
        });

        if (typeof validate.error !== 'undefined') {
            return res.json({
                success: false,
                message: (validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
            });
        }
        let arrayfile=['.JPEG','.JPG','.PNG','.GIF','.TIFF','.PSD','.EPS' ,'.INDD','.RAW']
        var FileName = "-";
        if (file.topic_thumbnail_file !== undefined&&arrayfile.includes(path.extname(file.topic_thumbnail_file.originalFilename.toUpperCase()))) {
            let topic_thumbnail_file = file.topic_thumbnail_file;
            var FromPath = topic_thumbnail_file.filepath;
            var FileName = `${input.topic_title}_${Date.now() + path.extname(topic_thumbnail_file.originalFilename)}`;
            var newPath = path.join(__dirname, '../../public/topicThumbnail/') + FileName;
            fs.copyFile(FromPath, newPath, (err) => {
                if (err) throw err;
                console.log('File create successfully');
            });
        }
        db.query('INSERT INTO  topics (topic_title,chapter_id,class_id,subject_id,language_code,topic_description,topic_thumbnail,topic_video_url,created_by,created_date) VALUES (?,?,?,?,?,?,?,?,?,?)', [input.topic_title, input.chapter_id, input.class_id,input.subject_id, input.language_code, input.topic_description, FileName, input.topic_video_url, input.created_by, date], function (err) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: 'Oops something went wronge.' });
            } else {
                return res.json({ success: true, message: 'Topic created successfully.' });
            }
        })
    })
}
exports.TopicUpdate = (req, res) => {
    let data = req.body;
    let date = `${new Date().toISOString().slice(0, 10)}`;
    var form = new formidable.IncomingForm();
    form.parse(req, function (_err, input, file) {
        const schema = Joi.object({
            topic_title: Joi.string().required(),
            chapter_id: Joi.string().required(),
            class_id: Joi.string().required(),
            language_code: Joi.string().required(),
            topic_description: Joi.string().required(),
            topic_video_url: Joi.string().required(),
            created_by: Joi.required(),
            topic_id: Joi.string().required(),
            subject_id:Joi.string().required()
        })
        var validate = schema.validate({
            class_id: input.class_id, subject_id: input.subject_id, language_code: input.language_code, topic_title: input.topic_title, topic_description: input.topic_description, created_by: input.created_by,chapter_id:input.chapter_id,topic_video_url:input.topic_video_url,topic_id:input.topic_id
        });

        if (typeof validate.error !== 'undefined') {
            return res.json({
                success: false,
                message: (validate.error.details[0].message).replaceAll("_", " ").replaceAll('"', "")
            });
        }
        let arrayfile=['.JPEG','.JPG','.PNG','.GIF','.TIFF','.PSD','.EPS' ,'.INDD','.RAW']
        if (file.topic_thumbnail_file !== undefined&&arrayfile.includes(path.extname(file.topic_thumbnail_file.originalFilename.toUpperCase()))) {
            let topic_thumbnail_file = file.topic_thumbnail_file;
            var FromPath = topic_thumbnail_file.filepath;
            var FileName = `${input.topic_title}_${Date.now() + path.extname(topic_thumbnail_file.originalFilename)}`;
            var ToPath = path.join(__dirname, '../../public/topicThumbnail/') + FileName;
            fs.copyFile(FromPath, ToPath, (err) => {
                if (err) throw err;
                console.log('File moved successfully');
            }); 
          
            // they are different file.topic_thumbnail and input.topic_thumbnail 2 input different type
            let removePath = `${path.join(__dirname, '../../public/topicThumbnail/') + input.topic_thumbnail}`;
            if (fs.existsSync(removePath)) {
                fs.unlinkSync(removePath)
            }
        } else {
            var FileName = input.topic_thumbnail||"-";
        }
        db.query('UPDATE topics SET topic_title=?,chapter_id=?,class_id=?,topic_description=?,language_code=?,topic_thumbnail=?,topic_video_url=?,created_by=?,created_date=? WHERE topic_id = ?', [input.topic_title, input.chapter_id,input.class_id, input.topic_description, input.language_code, FileName, input.topic_video_url, input.created_by, date, input.topic_id], function (err) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: 'Oops somthing went wronge.' });
            } else {
                return res.json({ success: true, message: 'Topic updated successfully.' });
            }
        })
    })
}
exports.TopicDelete = (req, res) => {
    var { topic_id } = req.query;
    topic_id = topic_id || "";
    if (topic_id < 1) {
        return res.json({ success: false, message: "Please provide topic id" })
    }
    db.query('SELECT topic_thumbnail FROM topics WHERE topic_id = ?', [req.query.topic_id], (err, data) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: "Oops somethinge went wronge." });
        } else {         
               if(data.length>0){
            db.query('DELETE FROM  topics WHERE topic_id = ?', [req.query.topic_id], function (err) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Oops somethinge went wronge' });
                } else {
                   
                    return res.json({ success: true, message: 'Topic removed successfully' });
                }
            })
            let file=  data[0].topic_thumbnail||"notfound"
         
                let removePath = `${path.join(__dirname, '../../public/topicThumbnail/') }${file}`;
            
                if (fs.existsSync(removePath)) {
                    fs.unlinkSync(removePath)
                }else{
    
                }
            }else{

                return res.json({ success: false, message: "Oops somethinge went wronge." });
            }
    
        }
    })
 
}

exports.GetTopic = (req, res) => {
    var { topic_id } = req.query;
    topic_id = topic_id || "";
    if (topic_id < 1) {
        return res.json({ success: false, message: "Please provide topic id" })
    }
    var query = 'SELECT * FROM topics WHERE topic_id = ?  ';

    db.query(query, [req.query.topic_id], function (err1, data1) {
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
exports.topicSearch = (req, res) => {
    try {
        console.log(req.query.keyword)
        const schema = Joi.object({
            Limit: Joi.number().required(),
            Page: Joi.number().required(),
            language_code:Joi.string().required(),
        })
        var validate = schema.validate({
            Limit: req.query.limit,
            Page: req.query.page,
            language_code:req.query.language_code
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
        var query = 'SELECT ts.*,ms.subject_name,c.chapter_title FROM topics AS ts LEFT JOIN  masters__subjects AS ms ON ms.subject_id=ts.subject_id LEFT JOIN  chapters AS c ON c.chapter_id=ts.chapter_id WHERE ts.language_code=? AND (ts.topic_title LIKE  ? OR ms.subject_name LIKE ? OR c.chapter_title LIKE ?)';

    }
    else {
        return res.json({
            success: false,
            message: 'Please search something!.'
        });

    }
    

    db.query(query, [req.query.language_code,keyword,keyword,keyword], function (err1, data1) {
        if (err1) {
            console.log(err1);
            return res.json({
                success: false,
                message: 'Oops somethinge went wrong.'
            });
        } else {
            query += ' LIMIT ' + start + ', ' + limit + '';
            db.query(query, [req.query.language_code,keyword,keyword,keyword], function (err, data) {
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

exports.topicEdit = (req, res) => {
    var { topic_id } = req.query;
    topic_id = topic_id || "";
    if (topic_id < 1) {
        return res.json({ success: false, message: "Please provide topic id" })
    }
    db.query('SELECT t.*, c.chapter_title FROM topics AS t LEFT JOIN chapters AS c ON t.chapter_id=c.chapter_id WHERE topic_id = ?', [req.query.topic_id], function (err,data) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            if (data.length > 0) {

                return res.json({ success: true, message: "Data retrieved successfully.", data: data });
            } else {
                return res.json({ success: false,message: "Data not found.", data: data });
            }
        }
    })
}

exports.getBySubject = (req, res) => {
    var { class_id,subject_id,language_code} = req.query;
    class_id = class_id || "";
    if (class_id < 1) {
        return res.json({ success: false, message: "Please provide class_id id" })
    }  
  
    subject_id = subject_id || "";
    if (subject_id < 1) {
        return res.json({ success: false, message: "Please provide subject_id id" })
    }
    language_code = language_code || "";
    if (language_code < 1) {
        return res.json({ success: false, message: "Please provide language_code" })
    }
    db.query(`SELECT topics.*, chapters.chapter_title FROM  topics LEFT JOIN chapters ON topics.chapter_id=chapters.chapter_id   WHERE topics.class_id =? AND topics.subject_id=? AND topics.language_code=? `, [req.query.class_id,req.query.subject_id,req.query.language_code], function (err,data) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Oops somethinge went wronge' });
        } else {
            if(data.length>0){

                return res.json({ success: true, message: 'Data retrieved successfully' ,data:data});
            }else{

                return res.json({ success: false, message: 'Data not found' });  
            }
            
        }
    })
}

exports.topicAdminSearch = (req, res) => {
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
        var query = 'SELECT ts.* ,ms.subject_name,cs.class_name FROM topics AS ts LEFT JOIN masters__subjects AS ms ON ms.subject_id=ts.subject_id LEFT JOIN masters__classes AS cs ON cs.class_id=ts.class_id WHERE ts.topic_title LIKE ? || ms.subject_name LIKE ? || cs.class_name LIKE ?';

    }
    else {
        var query = 'SELECT * FROM topics ';
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