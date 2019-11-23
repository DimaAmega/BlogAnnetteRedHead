var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  var data_for_cards = [
    {
      class:"b_2_1",
      url:"/blog",
      img_url:"/images/fon1.jpg",
      title:"Мою собаку...",
      mark:"Разное",
      mark_url:"#"
    },
    {
      class:"b_1_2",
      url:"#",
      img_url:"/images/fon2.jpg",
      title:"Это заголовок!",
      mark:"новое",
      mark_url:"#"
    },
    {
      class:"b_2_1",
      url:"#",
      img_url:"/images/fon4.jpg",
      title:"Это заголовок!",
      mark:"Погода",
      mark_url:"#"
    },
    {
      class:"b_1_2",
      url:"#",
      img_url:"/images/home.jpg",
      title:"Это заголовок!",
      mark:"Погода",
      mark_url:"#"
    },
    {
      class:"b_1_2",
      url:"#",
      img_url:"/images/contacts.jpg",
      title:"Это заголовок!",
      mark:"Погода",
      mark_url:"#"
    },
    {
      class:"b_1_2",
      url:"#",
      img_url:"/images/fon1.jpg",
      title:"Это заголовок!",
      mark:"Погода",
      mark_url:"#"
    },
  ];
  res.render('blog',{data:data_for_cards}); 
});

module.exports = router;
