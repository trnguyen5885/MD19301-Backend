var express = require('express');
var router = express.Router();

const productModel = require('../models/productModel');
const upload = require('../utils/upload');
const sendMail = require('../utils/email');

// Lấy tất cả sản phẩm

router.get('/all', async function(req, res, next) {
    try {
      let list = await productModel.find().populate("userID");
      res.status(200).json({status: true, message: "Thành công", data: list});
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra" + e})
    }
  });

  // Lấy tất cả sản phẩm lớn hơn người dùng truyền vào

  router.get('/lay-danh-sach-lon-hon-nguoi-dung', async function(req, res, next) {
    try {
      const {soluong} = req.query;
      let list = await productModel.find({quantity: {$gt: soluong}});
      res.status(200).json({status: true, message: "Thành công", data: list});
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra"})
    }
  });

  router.get('/lay-danh-sach-tu-den', async function(req, res, next) {
    try {
      const {min,max} = req.query;
      let list = await productModel.find({price: {$gte: min, $lte: max}});
      res.status(200).json(list);
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra"})
    }
  });

  router.get('/lay-danh-sach-tu-den', async function(req, res, next) {
    try {
      const {min,max} = req.query;
      let list = await productModel.find({price: {$gte: min, $lte: max}});
      res.status(200).json(list);
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra"})
    }
  });

  router.get('/lay-san-pham-theo-id', async function(req, res, next) {
    try {
      const {id} = req.query;
      let product = await productModel.findById(id);
      res.status(200).json(product);
    } catch (e) {
      res.status(400).json({status: false, message: "Có lỗi xảy ra"})
    }
  });

// Thêm sản phẩm

router.post('/add', async (req, res) => {
  try {
    const {name, price, quantity} = req.body;
    const newProduct = {name, price, quantity};
    await productModel.create(newProduct);
    res.status(200).json({status: true, message: "Thành công"})
  } catch (e) {
    res.status(400).json({status: true, message: "Có lỗi xảy ra"})
  }
})

// Sửa sản phẩm

router.put('/edit', async (req, res) => {

  try {
    const {id, name, price, quantity} = req.body;
    const productUpdate = await productModel.findById(id);

    if(productUpdate) { 
      productUpdate.name = name ? name : productUpdate.name;
      productUpdate.price = price ? price : productUpdate.price;
      productUpdate.quantity = quantity ? quantity : productUpdate.quantity;
      await productUpdate.save();
      res.status(200).json({status: true, message: "Thành công"})
    } else {
      res.status(300).json({status: true, message: "Not found"})
    }
    
  } catch (e) {
    res.status(400).json({status: true, message: "Có lỗi xảy ra"})
  }
})

// Xoá sản phẩm

router.delete('/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(200).json({status: true, message: "Thành công"})
  } catch (e) {
    res.status(400).json({status: true, message: "Có lỗi xảy ra"})
  }
})

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