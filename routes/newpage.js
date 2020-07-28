var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "msrmh"
});

var count;
var dep=[];
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


        for(var i=0;i<count;i++)
        {
            dep[i]=result1[i].depname;
            console.log(dep[i]);
        }
        console.log(JSON.stringify(result1));
        console.log(dep);



    });
});

router.get('/',function (req,res,next) {
   res.render('newpage.ejs',{
       count : count,
       dep : dep
   });
});


module.exports = router;