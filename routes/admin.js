var express = require('express');
var Connect_to_db = require('../database/connect');
var checkPassword = require('../database/checkPassword');
var crypto = require('crypto');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin',{InSistem:"Welcome"}); 
});
router.post('/', function(req, res, next) {
    console.log(req.body);
    var data_form = req.body;

        Connect_to_db()
        .then((client)=>{
        var db = client.db("BlogAnnetteRedhead");
        const collection = db.collection('Admin');

        collection.find({login:data_form.Login}).toArray((err,items)=>{
                if (err) {console.log('Ошибка тут',err);
                res.send("can not find");
                };
                console.log('нашли\n',items);
                client.close(); 
                var user = items[0];
                if (user){
                    if(checkPassword(data_form.Password,user.password)){
                        res.set('set-cookie',`user=${crypto.createHash('md5').update(user.login).digest("hex")}`);
                        res.redirect('/AdminPannel');
                    }
                    else{
                        res.render('admin',{InSistem:"Not correct Password, try again"}); 
                    }
                }
                else{
                    res.render('admin',{InSistem:"Not correct Login, try again"}); 
                }
            });
        });
});

module.exports = router;
