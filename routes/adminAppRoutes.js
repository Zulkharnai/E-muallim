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
const AdminController=require("../controllers/Admin/AdminController")
const classController=require("../controllers/masterClasses/masterClassesController")
const masterBoard=require("../controllers/masterBoard/masterBoardController")
const dashBoardController=require("../controllers/Dashboard/dashBoardController")
const language=require("../controllers/langauage/languageController")
const subjectController=require("../controllers/mastersSubject/mastersSubjectController")
const chapterController=require("../controllers/Chapters/ChapterController")
const topicController=require("../controllers/Topics/topicController")
const schoolController=require("../controllers/school/schoolController")


route.prefix('/api/admin/', (req, res, next) => next(),function (Auth) {
        Auth.route('/Login').post(AdminController.Login);
});

route.prefix('/api/admin/', AuthMiddleware.Auth, function (Auth) {
    Auth.route('/class-list').get(classController.classList);
    Auth.route('/class-create').post(classController.classCreate);
    Auth.route('/class-update').post(classController.classUpdate);
    Auth.route('/class-delete').get(classController.classDelete);
    Auth.route('/class-edit').get(classController.classEdit);
    Auth.route('/class-search').get(classController.classSearch);
    Auth.route('/class-list-pagination').get(classController.classListPagination);

    Auth.route('/master-board-list').get(masterBoard.masterBoardList);
    Auth.route('/master-board-create').post(masterBoard.masterBoardCreate);
    Auth.route('/master-board-update').post(masterBoard.masterBoardUpdate);
    Auth.route('/master-board-delete').get(masterBoard.masterBoardDelete);
    Auth.route('/master-board-edit').get(masterBoard.masterBoardEdit);
    Auth.route('/master-board-search').get(masterBoard.masterBoardSearch);


    Auth.route('/admin-dashboard-info').get(dashBoardController.AdminDashboardInfo);
    Auth.route('/dashboard').get(dashBoardController.dashBoard);

    Auth.route('/language-list').get(language.languageList);
    Auth.route('/language-create').post(language.languageCreate);
    Auth.route('/language-update').post(language.languageUpdate);
    Auth.route('/language-delete').get(language.languageDelete);
    Auth.route('/language-edit').get(language.languageEdit);

    Auth.route('/subject-js').get(subjectController.getSubjectall);
    Auth.route('/subject-create').post(subjectController.subjectCreate);
    Auth.route('/subject-update').post(subjectController.subjectUpdate);
    Auth.route('/subject-delete').get(subjectController.subjectDelete);
    Auth.route('/subject-edit').get(subjectController.subjectEdit);
    Auth.route('/get-subjects').get(subjectController.getSubjects);
    Auth.route('/subject-list').get(subjectController.subjectList);
    Auth.route('/subject-search').get(subjectController.subjectSearch);
    Auth.route('/subject-list-pagination').get(subjectController.subjectListPagination);
    
    Auth.route('/topic-list').get(topicController.TopicList);
    Auth.route('/topic-search').get(topicController.topicSearch);
    Auth.route('/topic-create').post(topicController.TopicCreate);
    Auth.route('/topic-update').post(topicController.TopicUpdate);
    Auth.route('/topic-delete').get(topicController.TopicDelete);
    Auth.route('/topic-edit').get(topicController.topicEdit);
    Auth.route('/topic-by-subject').get(topicController.getBySubject);
    Auth.route('/get-topic').get(topicController.GetTopic);
    
    Auth.route('/get-topic-search').get(topicController.topicAdminSearch);
    
    Auth.route('/school-edit').get(schoolController.schoolEdit);
    Auth.route('/school-list').get(schoolController.schoolList);
    Auth.route('/school-create').post(schoolController.schoolCreate);
    Auth.route('/school-update').post(schoolController.schoolUpdate);
    Auth.route('/school-delete').get(schoolController.schoolDelete);
    Auth.route('/school-search').get(schoolController.schoolSearch);
    Auth.route('/school-list-pagination').get(schoolController.schoolListPagination);

    Auth.route('/get-chapters').get(chapterController.GetChapters);
    Auth.route('/chapter-list').get(chapterController.chapterList);
    Auth.route('/chapter-create').post(chapterController.chapterCreate);
    Auth.route('/chapter-update').post(chapterController.chapterUpdate);
    Auth.route('/chapter-delete').get(chapterController.chapterDelete);
    Auth.route('/chapter-edit').get(chapterController.chapterEdit);
    Auth.route('/chapter-search').get(chapterController.chapterSearch);

   
});


module.exports = route

