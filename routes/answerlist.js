var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});
con.connect(function (err) {
    if (err) throw err;

});
var dept;
var mobile;
var sql;
var questions = [];
var questionNos = [];
var cAnswers = [];
var aAnswer = [];
var Name,Email,Marks;
router.get('/admin/answerlist/:dept/:mobile', function (req, res, next) {
    console.log(req.params.mobile);
    dept = req.params.dept;
    mobile = req.params.mobile;


    generateAnswerList();

    setTimeout(function () {
        res.render('answerlist', {
            mobile: mobile,
            questions: questions,
            aAnswer : aAnswer,
            cAnswers:cAnswers,
            Name    : Name,
            Email   : Email,
            Marks   : Marks
        });
    }, 1000);

});

function generateAnswerList() {

    sql = "select questionid from " + dept + " where mobile = '" + mobile + "';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result[0].questionid);
        var questionid = JSON.parse(result[0].questionid);
        var i = 0;
        questionNos = Object.keys(questionid);
        console.log(questionNos);
        for (var x in questionid) {
            aAnswer[i] = questionid[x];
            i++;
        }
        console.log(aAnswer);
    });
    sql = "select name,email,result from "+dept+" where mobile = '"+mobile+"';";
    con.query(sql,function (err,result) {
       if(err) throw err;
       Name = result[0].name;
       Email = result[0].email;
       Marks = result[0].result;
    });
    setTimeout(function () {
        for (var i = 0; i < questionNos.length; i++) {
            const pos = i;
            con.query("select question,answer from " + dept + "_question_list where qno = " + questionNos[i] + ";", function (err, result) {
                if (err) throw err;
                console.log(result);
                questions[pos] = result[0].question;
                cAnswers[pos] = result[0].answer;
                console.log(questions);
                console.log(cAnswers);

            });
        }
    }, 300);


}
module.exports = router;