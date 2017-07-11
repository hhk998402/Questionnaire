var pass = require('../routes/admin_home.js');

function generatePassword() {
    var date=new Date();
    var password = date.getTime().toString();
    document.getElementById("Gpassword").innerHTML = password ;

    //pass.storePassword(password);

    console.log(password);
}
