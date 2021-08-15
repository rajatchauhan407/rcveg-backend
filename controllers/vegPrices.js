const Vege = require('../models/vege');
const Bucket = require('../models/bucket');
const Orders = require('../models/orders');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const url = require('url');
const doc = require('pdfkit');
/********* check */
exports.check = (req,res, next) =>{
    Vege.find().then(result =>{
        res.status(201).json({
            message:result,
        })
    }).catch(error => {
        message:"May be database not getting connected"

    });
}
/***************Adding Prices to the menu of vegetable*******/
exports.prices = (req,res,next)=>{
 const vege = new Vege({
    vegName:req.body.name,
    vCode:req.body.vCode,
    price:req.body.price,
    availability:req.body.availability
 });
 vege.save().then(result =>{
     console.log(req.userId);
    res.status(200).json({
        message:"Data is being sent"
    })
 }).catch(error=>{
     console.log(error);
     res.status(501).json({
         message:error
     })
 });  
};
/******************Getting Prices and All products *******/
exports.getPrices=(req,res,next)=>{  
    Vege.find().then(result =>{
        // console.log(req.userId + "hello2");
            const userId = req.userId;
        
        // console.log(req.data);
            res.status(201).json({
              response:result,
              userId: userId
            });
        }).catch(error=>{
            console.log(error);
        })
};
/********************Adding Vegetables to the Bucket to the Bucket *********/
exports.addVegBucket = (req,res,next)=>{
    const bucket = new Bucket({
        vegId:  req.body.vegId,
        quantity: req.body.quantity,
        price: req.body.price,
        userId: req.body.userId,
        vegName:req.body.vegName,
        imagePath:req.body.imagePath
     });
     bucket.save().then(result =>{
        res.status(200).json({
            message:"Data is being sent"
        })
     }).catch(error=>{
         res.status(501).json({
             message:error
         })
     }); 
};
/****************** Getting vegetables in the bucket *******/
exports.getVegBucket = (req, res, next)=>{
    const userId = req.query.id;
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    // console.log(req.query);
    const BucketQuery = Bucket.find({'userId': userId});
    let fetchedBucket;
    let subTotal=0;
    function calculateSubtotal(){
        Bucket.find({'userId' : userId}).then((result) => {
            result.forEach(data => {
                subTotal += data.quantity * data.price;
                // console.log(data.quantity * data.price);
            });
            console.log(subTotal);
        });
    }
    calculateSubtotal();
    if(userId && pageSize && currentPage){
        BucketQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }   
        BucketQuery.then(result =>{
            fetchedBucket = result;
           return Bucket.countDocuments({'userId': userId});
    }).then(count =>{
            res.status(201).json({
                response : fetchedBucket,
                bucketCount : count,
                subTotal :subTotal
            });
    }).catch(error=>{
        console.log(error);
        res.status(501).json({
            message:"Could not get resolve the request"
        })
    });
};
/******************* Add Orders ***********/
exports.orders = (req, res, next)=>{
    res.status(201).json({
        message: 'Data is being sent'
    })
};

/***********Delete data from bucket ********/
exports.bucketDelete = (req,res,next) =>{
    const id = req.query.id;
    console.log(id);
    Bucket.deleteOne({ _id : id}).then(
        result =>{
            if(result.n > 0){
                res.status(201).json({
                    message: " Deleted Successfully"
                })
            }
        }
    ).catch(error => {
        res.status(501).json({
            message: "Could not delete successfully",
            error : error
        })
    })
}
/******************Confirm Order From the bucket ****************/
exports.confirmOrder = (req, res, next) => {
    const orderedOn = new Date();
    const orderData= req.body.order;
    const data = [];
    orderData.forEach((orders)=>{
        data.push({
            
            vegId:orders.vegId,
            quantity: orders.quantity,
            price: orders.price,
            vegName:orders.vegName
        });
    });
    const order = new Orders({
        orderedOn: orderedOn,
        userId: req.body.userId,
        orderTotal: req.body.orderTotal,
        vegetables: data
    });
    order.save().then(result =>{
        res.status(201).json({
            message: "Oder Confirmed"
        });
    }).catch(error => {
        console.log(error);
        res.status(501).json({
            message:" An Error has occured"
        })
    });
   
};
/**************Get Orders ************/
exports.getOrders = (req, res, next) =>{
    const userId = req.query.id;
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const OrdersQuery = Orders.find({'userId': userId}).sort([['orderedOn', -1]]);
    let fetchedOrders;
    if(userId && pageSize && currentPage){
        OrdersQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    OrdersQuery.then(result => {
            fetchedOrders = result;
            // fetchedOrders.skip(5);
           return Orders.countDocuments({'userId': userId});
    }).then(count =>{
        res.status(201).json({
            data: fetchedOrders,
            count:count
        })
    }).catch(error =>{
        res.status(501).json({
            error:error,
            message:"could Not resolve request"
        })
    });
};
/**************Getting an invoice for the order ***********/
exports.getInvoice = (req, res, next)=>{
    const orderId = req.query.orderId;
    Orders.findById(orderId).then(order =>{
        if(!order){
            res.status(501).json({
                errorMessage: "Order Does Not exist"
            });
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data','invoices',invoiceName);
            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'attachement;filename="'+ invoiceName +'"'
            );
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.text(`Order Id: ${orderId}`,25,25);
            pdfDoc.fontSize(16);
            pdfDoc.text('Invoice For Veggies',50,70,{
                align:'center',
                underline:'true'
            });
            pdfDoc.moveDown();
            // pdfDoc.moveTo(50,150).
            // lineTo(550,150);
            let y=150;
            pdfDoc.font('Times-Bold').fontSize(14).text('ITEM',50,y-25)
            .text('Quantity',250,y-25)
            .text('Price', 350, y-25)
            .text('Total Cost',450,y-25);
            pdfDoc.moveTo(50,y-5).lineTo(550,y-5);
            order.vegetables.forEach(vegData =>{
                pdfDoc.moveTo(50,y+20).lineTo(550,y+20);
                pdfDoc.font('Times-Roman').fontSize(14).text(
                 vegData.vegName,50,y
                )
                .text(vegData.quantity,250,y)
                .text(vegData.price,350,y)
                .text(vegData.quantity * vegData.price, 450, y);
                y +=30;
                pdfDoc.moveDown(); 
            });
            pdfDoc.font('Times-Bold').fontSize(14).text('Total',50,y,{

            }).text(order.orderTotal,450,y);
            pdfDoc.polygon([20, 20], [590, 20], [590,760],[20, 760]);
            pdfDoc.stroke();
            pdfDoc.end();
    }).catch(error =>{
        console.log(error);
    });
};