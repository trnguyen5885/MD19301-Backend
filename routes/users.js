var express = require('express');
var router = express.Router();

const userModel = require('../models/userModel');
const JWT = require("jsonwebtoken");
const config = require("../utils/tokenConfig");

/* GET users listing. */
router.get('/all', async function(req, res, next) {
  let list = await userModel.find();
  res.json(list);
});

router.get('/detail', async function (req, res) {
  try{
    const {id} = req.query;
    let detail = await userModel.findById(id);
    if(detail) {
      res.status(200).json(detail);
    } else {
      res.status(400).json({status: true, message: "Không tìm thấy người dùng"})
    }
  }catch(e) {
    res.status(400).json({status: false, message: "Có lỗi xảy ra"})
  }
});

router.get('/get-ds', async (req, res) => {
  try {
    const {min,max} = req.query;
    let list = await userModel.find({old: {$gte: min, $lte: max}});
    res.status(200).json(list);

  }catch(e) {
    res.status(400).json({status: false, message: "Có lỗi xảy ra"})
  }
})

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;
    const checkUser = await userModel.findOne({username: username, password: password});
    if(checkUser == null) {
      res.status(400).json({status: false, message: "Tên đăng nhập không tồn tại"})
    } else {
      var token = await JWT.sign({username: username},config.SECRETKEY,{expiresIn: '50s'});
      var refeshToken = await JWT.sign({username: username},config.SECRETKEY,{expiresIn: '1d'});

      res.status(200).json({status: true, message: "Đăng nhập thành công", token: token, refeshToken: refeshToken});
    }
  } catch (e) {
    res.status(400).json({status: false, message: "Có lỗi xảy ra"})
  }
})

module.exports = router;
