var express = require('express');
var router = express.Router();
var multer  = require('multer');
var path = require('path');
var Connect_to_db = require('../database/connect');
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
/////////////////////////////////
//      СЛУЖЕБНЫЕ ФУНКЦИИ
////////////////////////////////
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images_from_blog')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage});
function updateDateAddPost(arr_data,arr_files){
  var res = {};
  var image_count = 0;
  var okeys = Object.keys(arr_data);
  for(var i = 0;i<okeys.length-1;i++) res[okeys[i].split("_")[1]] = {content:[]}; 
  
  for(var i = 0;i<okeys.length-1;i++) {
    var arr_of_key = okeys[i].split("_");
    switch (arr_of_key[0]) {
      case "title":
          res[arr_of_key[1]]["title"] = arr_data[okeys[i]];
      break;
      case "count":
        res[arr_of_key[1]]["count"] = 0;
      break;
      case "annotation":
          res[arr_of_key[1]]["annotation"] = arr_data[okeys[i]];
      break;
      case "class":
          res[arr_of_key[1]]["class"] = arr_data[okeys[i]];
      break;
      case "text":
          res[arr_of_key[1]].content.push({type:"text",data:arr_data[okeys[i]]});
      break;
      case "image":
          res[arr_of_key[1]].content.push({type:"image",data:arr_files[image_count].originalname});  
          image_count++; 
      break;
      default:
      break;
    }
  }
  return res;
};
function getPhotoNames(post){
  var res = {};
  var okeys = Object.keys(post);
  for(var i = 0;i<okeys.length;i++) {
    var content = post[okeys[i]].content;
    for(var j = 0;j<content.length;j++) if (content[j].type=="image") res[content[j].data]="";
  }
  return Object.keys(res);
};
function deleteImages(arr_images){
  for(var i = 0;i<arr_images.length;i++) fs.unlinkSync(path.join(__dirname,"../","images_from_blog",arr_images[i]));
};
function getDeleteNames(old_arr,new_arr){
  var res = [];
  for(var i = 0;i<old_arr.length;i++) if(new_arr.indexOf(old_arr[i])<0) res.push(old_arr[i]);
  return res;
};
/////////////////////////////////
//            РОУТЫ
////////////////////////////////
/////////////////////////
//      КОРНЕВАЯ
////////////////////////
router.get('/', function(req, res, next) {
  var client_real;
  Connect_to_db()
  .then((client)=>{
    client_real = client;
    var db = client.db("BlogAnnetteRedhead");
    var col = db.collection('Categories');
    return col.find({}).toArray()
    })
    .then((items)=>{
      var body = items.reverse();
      res.render("adminPannel",{lang:req.lang,user:req.user,data:body});
      client_real.close();
    })
  .catch((e)=>{console.log(e);})
});
/////////////////////////////
//      ДОБАВЛЕНИЕ ПОСТА
/////////////////////////////
router.get('/addPost', function(req, res, next) {
  var id_category = req.query.id_category;
  var client_real;
  Connect_to_db()
  .then((client)=>{
    client_real = client;
    db = client.db("BlogAnnetteRedhead");
    var col = db.collection('Categories');
    return col.findOne({_id:new ObjectID(id_category)})
  })
  .then((data)=>{
    res.render("addPost",{name_category:data.title.en,id_category:id_category});
    client_real.close();
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).send("Error");   
    client_real.close();
  });
});
/////////////////////////////////////
//  ОБРАБОТКА ОТПРАВЛЕННОГО ПОСТА
/////////////////////////////////////
router.post('/addPost',upload.any(),function(req, res, next) {
  var id_category = req.body.id_category;
  var client_real;
  var db;
  Connect_to_db()
  .then((client)=>{
    client_real = client;
    db = client.db("BlogAnnetteRedhead");
    var col = db.collection('Categories');
    return col.findOne({_id:new ObjectID(id_category)})
  })
  .then((category)=>{
    var col = db.collection('Posts');
    return col.findOne({category:category.title})
  })
  .then((posts_of_category)=>{
    var posts_id = posts_of_category._id;
    posts = posts_of_category.posts;
    var res_data_post = updateDateAddPost(req.body,req.files);
    posts.push(res_data_post);
    var col = db.collection('Posts');
    return col.updateOne({_id:ObjectID(posts_id)},{$set:{posts:posts}});
  })
  .then((result)=>{
    console.log(result.result);
    res.redirect("/AdminPannel/update?id_category="+id_category)
    client_real.close();
  })
  .catch((err)=>{
    console.log(err);
    res.send("<h1 style='text-align:center;'>Some server ERROR</h1>");
    client_real.close();
  });
});
/////////////////////////////////////
//  ИЗМЕНЕНИЕ ПОСТА
/////////////////////////////////////
router.post('/editPost',upload.any(),function(req, res) {
  if (req.query.id_category&&req.query.number) {
    var id_category = req.query.id_category;
    var num = req.query.number;
    var client_real;
    var db,col,title;
    Connect_to_db()
    .then((client)=>{
      client_real = client;
      db = client.db("BlogAnnetteRedhead");
      col = db.collection('Categories');
      return col.findOne({_id:new ObjectID(id_category)})
    })
    .then((category)=>{
      title = category.title;
      col = db.collection('Posts');
      return col.findOne({category:title})
    })
    .then((data)=>{
      var posts_id = data._id;
      var posts = data.posts;
      var N = posts.length-1;
      var new_post = updateDateAddPost(req.body,req.files);
      var old_post = posts[N-num];
      old_post_images = getPhotoNames(old_post);
      new_post_images = getPhotoNames(new_post);
      deleteImages(getDeleteNames(old_post_images,new_post_images));
      posts[N-num] = new_post;
      return  col.updateOne({_id:ObjectID(posts_id)},{$set:{posts:posts}});
    })
    .then((result)=>{
      console.log(result.result);
      res.redirect('/AdminPannel/update?id_category='+id_category);
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).send("Error");      
      client_real.close();
    });
  }
  else{
    res.send("Параметр категории не передан");
  }
});
/////////////////////////////////////
//  ДОБАВЛЕНИЕ НОВОЙ ТЕМЫ
/////////////////////////////////////
router.get('/addNewCategory',function(req,res){
  res.render("NewCategory");
});
/////////////////////////////////////
//  ОБРАБОТКА ДОБАВЛЕНИЯ НОВОЙ ТЕМЫ
/////////////////////////////////////
router.post('/addNewCategory',function(req,res){
  var client_real;
  Connect_to_db()
    .then((client)=>{
    client_real = client;
    var db = client_real.db("BlogAnnetteRedhead");
    var col = db.collection('Categories');
    return col.insertOne({title:req.body});
    })
    .then((result)=>{
      console.log(result.result);
      var db = client_real.db("BlogAnnetteRedhead");
      var col = db.collection('Posts');
      return col.insertOne({category:req.body,posts:[]});
    })
    .then((result)=>{ 
      console.log(result.result);
      res.redirect('/AdminPannel');
      client_real.close();
    })
    .catch((err)=>{
      console.log(err);
      res.redirect('/AdminPannel');
      client_real.close();
    });
});
///////////////////////////////////////////
//  УДАЛЕНИЕ ВСЕХ СТЕТЕЙ ДАННОЙ КАТЕГОРИИ
///////////////////////////////////////////
router.delete('/',function(req,res){
  var id_title = req.headers.title;
  console.log(id_title);
  var client_real;
  var title;
  var db;
  Connect_to_db()
  .then((client)=>{
    client_real = client;
    db = client.db("BlogAnnetteRedhead");
    var col = db.collection('Categories');
    return col.findOne({_id: new ObjectID(id_title)});
    })
    .then((item)=>{
      console.log("Нашли\n",item);
      title = item.title;
      var col = db.collection('Categories');
      return col.deleteOne({_id: new ObjectID(id_title)});
    })
    .then((result)=>{
      console.log("Удалили из Categories ",result.result);
      var col = db.collection('Posts');
      return col.deleteOne({category: title});
    })
    .then((result)=>{
      console.log(result.result);
      res.status(200).send("Ok");
      client_real.close();
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).send("Error");      
      client_real.close();
    });
});
///////////////////////////////////////М////////////////
//    УДАЛЕНИЕ КОНКРЕТНОЙ СТАТЬИ КОНКРЕТНОЙ КАТЕГОРИИ
///////////////////////////////////////////////////////
router.delete('/deleteArtilce',function(req,res){
  if (req.query.id_category&&req.query.number) {
    var id_category = req.query.id_category;
    var num = req.query.number;
    var client_real;
    var db,col,title;
    Connect_to_db()
    .then((client)=>{
      client_real = client;
      db = client.db("BlogAnnetteRedhead");
      col = db.collection('Categories');
      return col.findOne({_id:new ObjectID(id_category)})
    })
    .then((category)=>{
      title = category.title;
      col = db.collection('Posts');
      return col.findOne({category:title})
    })
    .then((data)=>{
      posts_id = data._id;
      var posts = data.posts;
      var N = posts.length;
      var delete_post = posts[N-num-1];
      deleteImages(getPhotoNames(delete_post));
      posts.splice(N-num-1,1);
      return col.updateOne({_id:ObjectID(posts_id)},{$set:{posts:posts}});
    })
    .then((result)=>{
      console.log(result.result);    
      res.send("Ok");
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).send("Error");      
      client_real.close();
    });
  }
  else{
    res.send("Параметр категории не передан");
  }
});
///////////////////////////////////////М////////////////
//    ЗАГРУЗКА СТРАНИЦЫ С ПОСТОМ ДЛЯ ЕГО ИЗМЕНЕНИЯ
///////////////////////////////////////////////////////
router.get('/updateArtilce',function(req,res){ 
  if (req.query.id_category&&req.query.number) {
    var id_category = req.query.id_category;
    var num = req.query.number;
    res.render("editPost",{id_category:id_category,number_of_post:num});
  }
  else{
    res.send("Параметр категории не передан");
  }
});
///////////////////////////////////////М////////////////
//    ОТПРАВКА ДАННЫХ КОНКРЕТНОГО ПОСТА
///////////////////////////////////////////////////////
router.get('/getDataArtilce',function(req,res){
  if (req.query.id_category&&req.query.number) {
    var id_category = req.query.id_category;
    var num = req.query.number;
    var client_real;
    var db,col,title;
    Connect_to_db()
    .then((client)=>{
      client_real = client;
      db = client.db("BlogAnnetteRedhead");
      col = db.collection('Categories');
      return col.findOne({_id:new ObjectID(id_category)})
    })
    .then((category)=>{
      title = category.title;
      col = db.collection('Posts');
      return col.findOne({category:title})
    })
    .then((data)=>{
      var posts = data.posts;
      var N = posts.length-1;
      res.json(posts[N-num]);
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).send("Error");      
      client_real.close();
    });
  }
  else{
    res.send("Параметр категории не передан");
  }
});
/////////////////////////////////////////////////////////////////
//                ИЗМЕНЕНИЕ КАТЕГОРИЙ
/////////////////////////////////////////////////////////////////
router.get('/update',function(req,res){
  if (req.query.id_category) {
    var id_category = req.query.id_category;
    var client_real;
    var db;
    var title;
    Connect_to_db()
    .then((client)=>{
      client_real = client;
      db = client.db("BlogAnnetteRedhead");
      var col = db.collection('Categories');
      return col.findOne({_id:new ObjectID(id_category)})
    })
    .then((category)=>{
      title = category.title;
      var col = db.collection('Posts');
      return col.findOne({category:title})
    })
    .then((data)=>{
      res.render("editorCategory",{category:data.category.en,id_category:id_category,data:data.posts.reverse()});
      client_real.close();
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).send("Error");   
      client_real.close();
    });
  }
  else{
    res.send("Параметр категории не передан");
  }
});
/////////////////////////////////////////////////////////////////
//  ИЗМЕНЕНИЕ СТАТЬИ В БД ОТПРАВКА ФОРМЫ С НОВЫМИ ДАННЫМИ В БД
/////////////////////////////////////////////////////////////////
module.exports = router;
