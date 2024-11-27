var express = require('express');
var router = express.Router();

const customerModel = require('../models/customerModel');
const JWT = require("jsonwebtoken");
const config = require("../utils/tokenConfig");

// Lấy tất cả customers

router.get('/all', async (req, res, next) => {
    try {
      const listCustomers = await customerModel.find();
      res.status(200).json({status: true, message: "Successfully", data: listCustomers});    
    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e });
    }
});

// Tìm kiếm customer theo name


router.get('/find-customer', async (req, res, next) => {
  try {
    const { name } = req.query;
    const listCustomers = await customerModel.find({customerName: {$eq: name}});
    res.status(200).json({status: true, message: "Successfully", data: listCustomers});    
  } catch (e) {
      res.status(400).json({status: false, message: "Error: " + e });
  }
});

// Tìm kiếm customer theo address

router.get('/find-address-customer/:address', async (req, res, next) => {
  try {
    const { address } = req.params;
    const listCustomers = await customerModel.find({address: {$eq: address}});
    res.status(200).json({status: true, message: "Successfully", data: listCustomers});    
  } catch (e) {
      res.status(400).json({status: false, message: "Error: " + e });
  }
});

// Thêm customer

router.post('/add-customer', async (req, res) => {
  try {
      const {customerName, email, phone, address, username, password} = req.body;
      const newCustomer = {customerName, email, phone, address, username, password};
      await customerModel.create(newCustomer);
      res.status(200).json({status: true, message: "Successfully"})
  } catch (e) {
      res.status(400).json({status: false, message: "Error: " + e })
  }
})

// Sửa customer 

router.put('/update-customer', async (req, res) => {
  try {
      const {customerName, email, phone, address, username, password} = req.body;
      const customerUpdate = await customerModel.findOne({username: username});
      if(customerUpdate) {
        customerUpdate.customerName = customerName ? customerName : studentUpdate.customerName;
        customerUpdate.email = email ? email : studentUpdate.email;
        customerUpdate.phone = phone ? phone : studentUpdate.phone;
        customerUpdate.address = address ? address : studentUpdate.address;
        customerUpdate.username = username ? username : studentUpdate.username;
        customerUpdate.password = password ? password : studentUpdate.password
          await customerUpdate.save();
          res.status(200).json({status: true, message: "Successfully"})
      } else {
          res.status(404).json({status: false, message: "Not found student"})
      }
  } catch (e) {
      res.status(400).json({status: false, message: "Error: " + e })
  }
})

// Xoá customer

router.delete('/delete-customer', async (req, res) => {
  try {
      const {username} = req.query;
      const deleteCustomer = await customerModel.findOneAndDelete({username: username});
      res.status(200).json({status: true, message: "Successfully", deleteCustomer: deleteCustomer})
  } catch (e) {
      res.status(400).json({status: false, message: "Error: " + e })
  }
})

// Customer login

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;
    const checkCustomer = await customerModel.findOne({username: username, password: password});
    if(checkCustomer == null) {
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


