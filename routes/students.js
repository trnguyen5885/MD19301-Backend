const express = require('express');
const router = express.Router();

const studentModel = require('../models/studentModel');
const JWT = require("jsonwebtoken");
const config = require("../utils/tokenConfig");




// - Lấy toàn bộ danh sách sinh viên

router.get('/all', async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
          JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
              res.status(403).json({"status": 403, "err": err});
            }else{
                const listStudent = await studentModel.find();
                res.status(200).json({status: true, message: "Successfully", data: listStudent});  
            }
          });
        }else{
          res.status(401).json({"status": 401});
        }
        
    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e });
    }
});

// - Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT

router.get('/all-subject', async (req, res) => {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
          JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
              res.status(403).json({"status": 403, "err": err});
            }else{
                const { name } = req.query;
                const listStudent = await studentModel.find({subject: {$eq: name}}, )
                res.status(200).json({status: true, message: "Successfully", data: listStudent});   
            }
          });
        }else{
          res.status(401).json({"status": 401});
        }
      
    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e });
    }
})

// - Lấy danh sách sản phẩm có điểm trung bình từ 6.5 đến 8.5

router.get('/all-score', async (req, res) => {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
          JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
              res.status(403).json({"status": 403, "err": err});
            }else{
                const { min, max } = req.query;
                const listStudent = await studentModel.find({score: {$gte: min, $lte: max}});
                res.status(200).json({status: true, message: "Successfully", data: listStudent}); 
            }
          });
        }else{
          res.status(401).json({"status": 401});
        }
    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e })
    }
})

// - Tìm kiếm thông tin của sinh viên theo MSSV

router.get('/find-student', async (req, res) => {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
          JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
              res.status(403).json({"status": 403, "err": err});
            }else{
                const {code} = req.query;
                const student = await studentModel.findOne({code: code});
                res.status(200).json({status: true, message: "Successfully", data: student});
            }
          });
        }else{
          res.status(401).json({"status": 401});
        }
      
        

    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e })
    }
})

// Thêm sinh viên

router.post('/add-student', async (req, res) => {
    try {
        const {code, fullname, score, subject, age} = req.body;
        const newStudent = {code, fullname, score, subject, age};
        await studentModel.create(newStudent);
        res.status(200).json({status: true, message: "Successfully"})
    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e })
    }
})

// Sửa thông tin sinh viên

router.put('/update-student', async (req, res) => {
    try {
        const { code, fullname, score, subject, age } = req.body;
        const studentUpdate = await studentModel.findOne({code: code});
        if(studentUpdate) {
            studentUpdate.code = code ? code : studentUpdate.code;
            studentUpdate.fullname = fullname ? fullname : studentUpdate.fullname;
            studentUpdate.score = score ? score : studentUpdate.score
            studentUpdate.subject = subject ? subject : studentUpdate.subject
            studentUpdate.age = age ? age : studentUpdate.age
            await studentUpdate.save();
            res.status(200).json({status: true, message: "Successfully"})
        } else {
            res.status(404).json({status: false, message: "Not found student"})
        }
    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e })
    }
})

// Xoá sinh viên

router.delete('/delete-student', async (req, res) => {
    try {
        const {code} = req.query;
        const deleteStudent = await studentModel.findOneAndDelete({code: code});
        res.status(200).json({status: true, message: "Successfully", studentDelete: deleteStudent})

        
    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e })
    }
})

// Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0

router.get('/all-subject-score', async (req, res) => {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
          JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
              res.status(403).json({"status": 403, "err": err});
            }else{
                const {subjectStudent, scoreStudent} = req.query;
                const listStudent = await studentModel.find({$and: [{subject: {$eq: subjectStudent}},{score: {$gte: scoreStudent}}]});
                res.status(200).json({status: true, message: "Succesfully", listStudent: listStudent});
            }
          });
        }else{
          res.status(401).json({"status": 401});
        }
      
    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e})
    }
})

// - Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5

router.get('/all-age-score', async (req, res) => {
    try {

        const {minStudent, maxStudent, scoreStudent} = req.query;
        const listStudent = await studentModel.find({$and: [{age: {$gte: minStudent, $lte: maxStudent}},{score: {$gte: scoreStudent}}]});
        res.status(200).json({status: true, message: "Succesfully", listStudent: listStudent});

    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e})
    }
})

// - Sắp xếp danh sách sinh viên tăng dần theo dtb

router.get('/all-student-score', async (req, res, next) => {
    try {
        const listStudent = await studentModel.find().sort({score: 1});
        res.status(200).json({status: true, message: "Successfully", data: listStudent});

    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e });
    }
});

// - Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT

router.get('/max-student', async (req, res, next) => {
    try {
        const maxStudentScore = await studentModel.findOne().sort({score: -1});
        const listMaxStudentScore = await studentModel.find({score: maxStudentScore.score});
        res.status(200).json({status: true, message: "Successfully", data: listMaxStudentScore});

    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e });
    }
});







module.exports = router;
