var express = require('express');
var router = express.Router();

const productModel = require('../models/productModel');
const JWT = require("jsonwebtoken");
const config = require("../utils/tokenConfig");
const upload = require('../utils/upload');
const sendMail = require('../utils/email');

// Lấy tất cả sản phẩm

router.get('/all', async function(req, res, next) {
    try {
      const token = req.header("Authorization").split(' ')[1];
      if(token){
        JWT.verify(token, config.SECRETKEY, async function (err, id){
          if(err){
            res.status(403).json({"status": 403, "err": err});
          }else{
            let listProducts = await productModel.find().populate("category");
            res.status(200).json({status: true, message: "Thành công", data: listProducts});
          }
        });
      }else{
        res.status(401).json({"status": 401});
      }
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra" + e})
    }
  });

  // Chi tiết sản phẩm

  router.get('/detail', async function(req, res, next) {
    try {
      const token = req.header("Authorization").split(' ')[1];
      if(token){
        JWT.verify(token, config.SECRETKEY, async function (err, id){
          if(err){
            res.status(403).json({"status": 403, "err": err});
          }else{
            const {id} = req.query;
            let productDetail = await productModel.findById(id);
            if(productDetail) {
              res.status(200).json({status: true, message: "Thành công", data: productDetail});
            } else {
              res.status(400).json({status: true, message: "Không tìm thấy người dùng"})
            }
          }
        });
      }else{
        res.status(401).json({"status": 401});
      }
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra" + e})
    }
  });

  // Tìm kiếm sản phẩm theo khoản giá

  router.get('/find-products', async function(req, res, next) {
    try {
      const token = req.header("Authorization").split(' ')[1];
      if(token){
        JWT.verify(token, config.SECRETKEY, async function (err, id){
          if(err){
            res.status(403).json({"status": 403, "err": err});
          }else{
            const { min, max } = req.query;
            const listProducts = await productModel.find({price: {$gte: min, $lte: max}});
            res.status(200).json({status: true, message: "Successfully", data: listProducts});
          }
        });
      }else{
        res.status(401).json({"status": 401});
      }
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra" + e})
    }
  });

  // Sắp xếp sản phẩm theo khoản giá từ thấp đến cao

  router.get('/sort-products', async function(req, res, next) {
    try {
      const token = req.header("Authorization").split(' ')[1];
      if(token){
        JWT.verify(token, config.SECRETKEY, async function (err, id){
          if(err){
            res.status(403).json({"status": 403, "err": err});
          }else{
            const listProducts = await productModel.find().sort({score: 1});
            res.status(200).json({status: true, message: "Successfully", data: listProducts});
          }
        });
      }else{
        res.status(401).json({"status": 401});
      }
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra" + e})
    }
  });

  

// Upload một file

router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
               return res.json({ status: 0, link : "" }); 
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : "" });
        }
    });

// Upload nhiều file

router.post('/uploads', [upload.array('image', 9)],
    async (req, res, next) => {
        try {
            const { files } = req;
            if (!files) {
               return res.json({ status: 0, link : [] }); 
            } else {
              const url = [];
              for (const singleFile of files) {
                url.push(`http://192.168.1.13:3000/images/${singleFile.filename}`);
              }
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : [] });
        }
});

// Gửi email

router.post("/send-mail", async function(req, res, next){
  try{
    const {to, subject, content} = req.body;


    const mailOptions = {
      from: "trungnguyenne <nguyennttps38258@fpt.edu.vn>",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công"});
  }catch(err){
    res.json({ status: 0, message: "Gửi mail thất bại"});
  }
});







module.exports = router;