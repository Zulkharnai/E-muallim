const { date } = require('joi');
const mysql = require('mysql');
const util = require('util');
require('dotenv').config();

var conn = mysql.createPool({
    connectionLimit: 10, host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME
});

const db = util.promisify(conn.query).bind(conn);
exports.AdminDashboardInfo = async (req, res) => {
    var oneWeekAgo = new Date();
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let weekdate = `${oneWeekAgo.toISOString().slice(0, 10)}`;
    let classes = await db('SELECT * from masters__classes ')
    let subjects = await db('SELECT * FROM masters__subjects ')
    let language = await db("SELECT * FROM languages")
    let boards = await db("SELECT * FROM masters__boards")
    let schools = await db("SELECT * FROM schools")
    let chapters = await db("SELECT * FROM chapters")
    let topics = await db("SELECT * FROM topics")
    let topicsbydate = await db("SELECT COUNT( topic_id) AS COUNT,created_date FROM topics WHERE YEAR(created_date) = YEAR(CURRENT_DATE()) GROUP BY DAY(created_date), MONTH(created_date) ORDER BY created_date DESC")
    let chapterbydate = await db("SELECT COUNT( chapter_id) AS COUNT,created_date FROM chapters WHERE YEAR(created_date) = YEAR(CURRENT_DATE()) GROUP BY DAY(created_date), MONTH(created_date) ORDER BY created_date DESC")
    let topicWeekData = await db("SELECT COUNT( topic_id)  AS COUNT,created_date FROM topics  WHERE created_date BETWEEN  ? AND ? GROUP BY DAY(created_date) ORDER BY created_date DESC", [weekdate, `${new Date().toISOString().slice(0, 10)}`])
    let chapterWeekData = await db("SELECT COUNT(chapter_id)  AS COUNT,created_date FROM chapters  WHERE created_date BETWEEN  ? AND ? GROUP BY DAY(created_date) ORDER BY created_date DESC", [weekdate, `${new Date().toISOString().slice(0, 10)}`])
    const topicCounts = topicsbydate.map(row => row.COUNT);
    const topicDateArray = topicsbydate.map(row => row.created_date);
    const chapterCounts = chapterbydate.map(row => row.COUNT);
    const chapterDateArray = chapterbydate.map(row => row.created_date);
    const weekCountTopic = topicWeekData.map(row => row.COUNT)
    const weekDateTopic = topicWeekData.map(row => row.created_date)
    const weekCountChapter = chapterWeekData.map(row => row.COUNT)
    const weekDateChapter = chapterWeekData.map(row => row.created_date)

    let data = {
        classes: classes.length,
        subjects: subjects.length,
        language: language.length,
        schools: schools.length,
        boards: boards.length,
        chapters: chapters.length,
        topics: topics.length,
        topicDateArray,
        topicCounts,
        chapterDateArray,
        chapterCounts,
        weekDateTopic,
        weekCountTopic,
        weekDateChapter,
        weekCountChapter
        
    }
    return res.json({ success: true, data: data });
}
exports.dashBoard = async (req, res) => {

    var limit = 5
    var current_page = req.query.page;
    var total_records = 0;
    var total_pages = 0;
    var next = current_page == total_pages ? false : true;
    var prev = current_page == 0 ? false : true;
    var start = current_page * limit;
    let { class_id,language_code } = req.query
    language_code = language_code || "";
    if (language_code < 1) {
        return res.json({ success: false, message: "Please provide language_code" })
    }
    var to_date = req.query.to_date
    var from_date = req.query.from_date
    var dashboards = [];
    var query = `SELECT * FROM masters__subjects`;
    var data1 = await db('SELECT * FROM masters__subjects ');
    dashboards = data1;
    var dashBoard = []
    for (var i = 0; i < dashboards.length; i++) {
        var data2 = await db("SELECT * FROM topics WHERE class_id =? and subject_id = ?  and language_code= ?  LIMIT 10;", [class_id, dashboards[i]['subject_id'],req.query.language_code])

        dashboards[i]['topics'] = data2;
    }
    if (dashboards.length > 0) {
        // let  data=  data1[0].Topics.split("$")
        total_records = dashboards.length;
        total_pages = Math.ceil(total_records / limit);
        next = Number(current_page) + 1 == total_pages ? false : true;
        return res.json({ success: true, total_records: total_records, total_pages: total_pages, page: current_page, next: next, prev: prev, data: dashboards });
        return res.json({ success: true, message: 'success', data: dashboards });
    } else {
        return res.json({ success: false, data: [] });
    }

}

exports.dashBoardInfo = async (req, res) => {
    var limit = req.query.limit;
    var current_page = req.query.page;
    var total_records = 0;
    var total_pages = 0;
    var next = current_page == total_pages ? false : true;
    var prev = current_page == 0 ? false : true;
    var start = current_page * limit;
    const { class_id } = req.query
    var to_date = req.query.to_date
    var from_date = req.query.from_date
    var dashboards = [];
    var query = `SELECT * FROM masters__subjects`;
    var data1 = await db(`SELECT 
    'subject_id', ms.subject_id,
    'subject_name', ms.subject_name,
  GROUP_CONCAT(
  JSON_OBJECT('topic_id', t.topic_id,'topic_title', t.topic_title,'topic_description',t.topic_description,'topic_video_url',t.topic_video_url,'topic_thumbnail',t.topic_thumbnail)
  SEPARATOR '$$$'
  )  AS "topics"
  FROM masters__subjects as ms LEFT JOIN topics AS t ON ms.subject_id=t.subject_id WHERE t.class_id=? AND t.language_code=?
  GROUP by t.subject_id `, [class_id,req.query.language_code]);
    dashboards = data1;
    let getObjec = []
    // var v=JSON.parse(b)
    for (let i = 0; i < dashboards.length; i++) {
        let element = dashboards[i].topics.split("$$$");
        if (element.length > 10) {
            for (let j = 0; j < 10; j++) {
                getObjec.push(JSON.parse(element[j]));
            }
        } else {

            for (let j = 0; j < element.length; j++) {
                getObjec.push(JSON.parse(element[j]));
            }
        }

        dashboards[i]["topics"] = getObjec
        getObjec = []
    }
    if (dashboards.length > 0) {
        return res.json({ success: true, message: 'Data retrieved successfully', data: dashboards });
    } else {
        return res.json({ success: false, data: [] });
    }
}