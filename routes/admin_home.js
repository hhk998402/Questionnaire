var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var app = require('express');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "msrmh",
    dateStrings: "date"
});
var dept;
var count;
var dep = [];
var attendeeCount;
con.connect(function (err) {
    if (err) throw err;

    con.query("select count(*) as count from department_list", function (err, result2) {
        if (err) throw err;
        console.log(result2);

        console.log(JSON.stringify(result2));
        var x = JSON.stringify(result2);
        console.log(x);
        var y = JSON.parse(x);
        console.log(y);
        console.log(typeof y);

        count = result2[0].count;
    });
    con.query("select * from department_list", function (err, result1) {
        if (err) throw err;
        console.log(result1);


        for (var i = 0; i < count; i++) {
            dep[i] = result1[i].depname;
            console.log(dep[i]);
        }
        console.log(JSON.stringify(result1));
        console.log(dep);
        dept = JSON.stringify(result1);
        console.log(dept);
        console.log(typeof dept);


    });
});
var i = 0;
var details;
var searchDetails;
var searchCount = 0;
router.get('/admin/:dept', function (req, res, next) {

    console.log(req.params.dept);
    if (req.params.dept) {
        if (i > 0) {
            var ques = {
                question: req.query.question,
                option1: req.query.option1,
                option2: req.query.option2,
                option3: req.query.option3,
                option4: req.query.option4,
                answer: req.query.answer
            };

            console.log(ques);
            if (ques.answer !== undefined && ques.question !== undefined && ques.option1 !== undefined && ques.option2 !== undefined && ques.option3 !== undefined && ques.option4 !== undefined) {
                addToDatabase(ques, req.params.dept);
            }

        }
        console.log("start");
        details = attendeeDetails(req.params.dept);
        console.log("end");

        var searchName = req.query.search;
        if (searchName !== undefined) {
            searchFromDatabase(searchName, req.params.dept);
        }


        setTimeout(function () {

            renderpage(req,res);

        }, 500);

        i++;
    }
    else
        res.redirect('/newpage');

});

router.post('/admin/:dept', function (req, res) {
    console.log("enter");
    var qtd = req.body.question;
    if (typeof qtd === "string") {
        var questionstodelete = [];
        questionstodelete.push(qtd);
        console.log(questionstodelete);
        deleteQuestion(questionstodelete, req.params.dept);
    }
    else {
        console.log(qtd);
        deleteQuestion(qtd, req.params.dept);
    }


    var aDate, aName, aMobile, aEmail, aQuesAns, aRes;
    aDate = details.aDate;
    aName = details.aName;
    aMobile = details.aMobile;
    aEmail = details.aEmail;
    aQuesAns = details.aQuesAns;
    aRes = details.aRes;
    res.render('admin_home', {
        dept: req.params.dept,
        aDate: aDate,
        aName: aName,
        aMobile: aMobile,
        aEmail: aEmail,
        aRes: aRes,
        attendeeCount: attendeeCount

    });
    console.log("exit");
});

function renderpage(req,res) {
    var aDate, aName, aMobile, aEmail, aQuesAns, aRes;
    aDate = details.aDate;
    aName = details.aName;
    aMobile = details.aMobile;
    aEmail = details.aEmail;
    aQuesAns = details.aQuesAns;
    aRes = details.aRes;

    console.log(details);
    console.log(aDate);
    console.log(aName);
    console.log(aMobile);
    console.log(aEmail);
    console.log(aQuesAns);
    console.log(aRes);

    if (searchDetails !== undefined) {
        var sDate, sName, sMobile, sEmail, sQuesAns, sRes;
        sDate = searchDetails.sDate;
        sName = searchDetails.sName;
        sMobile = searchDetails.sMobile;
        sEmail = searchDetails.sEmail;
        sQuesAns = searchDetails.sQuesAns;
        sRes = searchDetails.sRes;

        console.log(searchDetails);
        console.log(sDate);
        console.log(sName);
        console.log(sMobile);
        console.log(sEmail);
        console.log(sQuesAns);
        console.log(sRes);
        console.log("*************");
        console.log(searchCount);
        console.log("*************");
        res.render('admin_home', {
            dept: req.params.dept,
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aRes: aRes,
            sDate: sDate,
            sName: sName,
            sMobile: sMobile,
            sEmail: sEmail,
            sRes: sRes,
            attendeeCount: attendeeCount,
            searchCount: searchCount
        });
    }
    else{
        res.render('admin_home', {
            dept: req.params.dept,
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aRes: aRes,
            attendeeCount: attendeeCount,
            searchCount: searchCount
        });
    }

}
var sql = "";
function addToDatabase(ques, department) {
    console.log(department);
    sql = "insert into " + department + "_question_list(question,option1 , option2 , option3 ,option4 , answer) values ('" + ques.question + "','" + ques.option1 + "','" + ques.option2 + "','" + ques.option3 + "','" + ques.option4 + "','" + ques.answer + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Inserted into" + department);
    });

    sql = "SET @count = 0;";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("set count to 0");
    });
    sql = "UPDATE " + department + "_question_list SET " + department + "_question_list.qno = @count:= @count + 1;"
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("qno are rearranged");
    });

}
function deleteQuestion(questionstodelete, department) {
    console.log(questionstodelete.length);
    for (var i = 0; i < questionstodelete.length; i++) {
        sql = "delete from " + department + "_question_list where question = '" + questionstodelete[i] + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Deleted Questions from " + department);
        });
    }
    sql = "SET @count = 0;";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("set count to 0");
    });
    sql = "UPDATE " + department + "_question_list SET " + department + "_question_list.qno = @count:= @count + 1;"
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("qno are rearranged");
    });
}
function attendeeDetails(department) {
    var aDate = [], aName = [], aMobile = [], aEmail = [], aQuesAns = [], aRes = [];
    sql = "select count(*) as count from " + department;
    con.query(sql, function (err, result) {
        if (err) throw err;

        attendeeCount = result[0].count;
    });

    sql = "select * from " + department;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Attendee Details");
        console.log(result);
        for (var i = attendeeCount - 1, j = 0; i >= 0; i--, j++) {
            aDate[j] = result[i].date;
            aName[j] = result[i].name;
            aMobile[j] = result[i].mobile;
            aEmail[j] = result[i].email;
            aQuesAns[j] = result[i].questionid;
            aRes[j] = result[i].result;
        }
        details = {
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aQuesAns: aQuesAns,
            aRes: aRes
        };

    });
    setTimeout(function () {
        return details;
    }, 200);

}
function searchFromDatabase(searchName, department) {
    var sDate = [], sName = [], sMobile = [], sEmail = [], sQuesAns = [], sRes = [];

    sql = "select count(*) as count from " + department + " where name LIKE '%" + searchName + "%';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        searchCount = result[0].count;
    });
    sql = "select * from " + department + " where name LIKE '%" + searchName + "%';";
    con.query(sql, function (err, result) {
        if (err) throw err;

        for (var i = searchCount - 1, j = 0; i >= 0; i--, j++) {
            sDate[j] = result[i].date;
            sName[j] = result[i].name;
            sMobile[j] = result[i].mobile;
            sEmail[j] = result[i].email;
            sQuesAns[j] = result[i].questionid;
            sRes[j] = result[i].result;
        }
        searchDetails = {
            sDate: sDate,
            sName: sName,
            sMobile: sMobile,
            sEmail: sEmail,
            sQuesAns: sQuesAns,
            sRes: sRes
        };

    });
    setTimeout(function () {
        return searchDetails;
    }, 200);
}

/*var z =[];
 function searchQuestion(searchques, department) {

 console.log("entered");
 if (department === 'nursingDepartment') {
 sql = "select question from nursing_question_list where question LIKE '%" + searchques + "%';";
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log(result);

 for (var i = 0; i < result.length; i++) {
 z.push(result[i].question);
 }


 });
 }
 else if (department === 'accountsDepartment') {
 sql = "select question from accounts_question_list where question LIKE '%" + searchques + "%';";
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log(result);
 var z = [];
 for (var i = 0; i < result.length; i++) {
 z.push(result[i].question);
 }

 });
 }
 else if (department === 'promotionDepartment') {
 sql = "select question from promotion_question_list where question LIKE '%" + searchques + "%';";
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log(result);
 var z = [];
 for (var i = 0; i < result.length; i++) {
 z.push(result[i].question);
 }

 });
 }


 return z;


 }*/

module.exports = router;


