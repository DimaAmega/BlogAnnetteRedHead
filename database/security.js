var express = require('express');
var crypto = require('crypto');
var Connect_to_db = require('../database/connect');

module.exports = function (req,res,next){
    var cookie = req.cookies;
    if (cookie){
        Connect_to_db()
        .then((client)=>{
                var db = client.db("BlogAnnetteRedhead")
                const collection = db.collection('Admin');
                collection.find({}).toArray((err,items)=>{
                    if (err) throw err;
                    for(var i = 0; i< items.length; i++){
                            if(crypto.createHash('md5').update(items[i].login).digest("hex") == cookie.user){
                                req.user = items[i].login;
                                break;
                            }
                        };
                    client.close();
                    if (req.user){
                        next();
                    }
                    else{
                        res.render("admin",{InSistem:' Acsess does not allow, you need authorization'})
                    }
            });
                
        })
    }
    else {
    res.render("admin",{InSistem:' Acsess does not allow, you need authorization'})
    }
};
