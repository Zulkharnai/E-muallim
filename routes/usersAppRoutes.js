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
const SchoolUsers=require("../controllers/SchoolUser/SchoolUsersController")
const classController=require("../controllers/masterClasses/masterClassesController-1")
const teacherController=require("../controllers/Teacher/TeacherController")


route.prefix('/api/users/', (req, res, next) => next(),function (Auth) {
        // Auth.route('/Login').get(AuthController.Login);
        Auth.route('/Login').post(SchoolUsers.Login);
});

route.prefix('/api/users/', AuthMiddleware.Auth, function (Auth) {

    Auth.route('/class-list').get(classController.classList);
    Auth.route('/class-create').post(classController.classCreate);
    Auth.route('/class-update').post(classController.classUpdate);
    Auth.route('/class-delete').get(classController.classDelete);

    Auth.route('/get-teachers').get(teacherController.GetTeachers);
    Auth.route('/teacher-create').post(teacherController.teacherCreate);
    Auth.route('/teacher-update').post(teacherController.techerUpdate);
    Auth.route('/teacher-delete').get(teacherController.teacherDelete);
    Auth.route('/teacher-edit').get(teacherController.teacherEdit);
    Auth.route('/teacher-search').get(teacherController.teacherSearch);
    Auth.route('/teacher-list-pagination').get(teacherController.teacherListPagination);


});


module.exports = route