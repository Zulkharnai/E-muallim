var express = require('express');
var route = express.Router();


// --- === Routes Prefixing === --- \\
express.application.prefix = express.Router.prefix = function (path, middleware, configure) {
    var router = express.Router();
    this.use(path, middleware, router);
    configure(router);
    return router;
};


var AuthMiddleware = require('../middleware/AuthMiddleware');

const AuthController = require('../controllers/Auth/AuthController');
const TeacherController=require("../controllers/Teacher/TeacherController")
const classController=require("../controllers/masterClasses/masterClassesController")
const subjectController=require("../controllers/mastersSubject/mastersSubjectController")
const chapterController=require("../controllers/Chapters/ChapterController")
const topicController=require("../controllers/Topics/topicController")
const dashBoardController=require("../controllers/Dashboard/dashBoardController")
const language=require("../controllers/langauage/languageController")


route.prefix('/api/teacher/', (req, res, next) => next(),function (Auth) {
        // Auth.route('/Login').get(AuthController.Login);
        Auth.route('/Login').post(TeacherController.Login);
});

route.prefix('/api/teacher/', AuthMiddleware.teacherAuth, function (Auth) {

    Auth.route('/class-list').get(classController.classList);
    

    Auth.route('/subject-list').get(subjectController.subjectList);
    
    Auth.route('/chapter-list').get(chapterController.chapterList);
 
    Auth.route('/get-chapter').get(chapterController.GetChapters);

    Auth.route('/topic-list').get(topicController.TopicList);
    Auth.route('/topic-search').get(topicController.topicSearch);

    Auth.route('/get-topic').get(topicController.GetTopic);
    Auth.route('/topic-by-subject').get(topicController.getBySubject);
    

    Auth.route('/dashboard').get(dashBoardController.dashBoard);
    Auth.route('/dashboard-info').get(dashBoardController.dashBoardInfo);

    Auth.route('/language-list').get(language.languageList);




  
});


module.exports = route