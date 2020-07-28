var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
con.connect(function (err) {
    if (err) throw err;

});
var questions =[];
var count;
var dept;
router.get('/admin/questionlist/:dept', function (req, res, next) {
    console.log(req.params.dept);
    dept = req.params.dept;

    generateQuestionList();

    setTimeout(function () {
        res.render('questionlist',{
            dept : req.params.dept,
            questions : questions,
            count : count
        });
    },500);

});

function generateQuestionList() {

        con.query("select count(*) as count from "+dept+"_question_list ;", function (err, result2) {
            if (err) throw err;
            console.log(result2);

            count =result2[0].count;

        });
        con.query("select *  from "+dept+"_question_list ;", function (err, result) {
            if (err) throw err;
            console.log(result);
            for(var i=0;i<count;i++)
            {
                questions[i]=result[i].question;
                console.log(questions[i]);
            }


        });
}



module.exports = router;