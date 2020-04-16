const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

let Product = require('./models/product.js');

mongoose.connect('mongodb://localhost/db_products');
let database = mongoose.connection;

const app = express();
var cors = require('cors');
app.use(cors());
const port = 3000;



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

database.once('open', function(req) {
    console.log('Connected to db_products');
});

database.on('error', function(err) {
    console.log(err);
});

app.use(
    expressValidator({
        errorFormatter: function(param, msg, val) {
            var namespace = param.split('.');
            var root = namespace.shift();
            var formParam = root;

            while(namespace.length) {
                formParam += "[" + namespace.shift() + "]";
            }
            return {
                param: formParam,
                msg: msg,
                val: val
            };
        }
}));

app.get('/api/products/get', function(req,res) {
    Product.find({}, function(err, product) {
        if(err) {
            console.log("Error in find: ", err);
        } else {
            console.log("Table lookup complete.");
            res.json(product);
            console.log("Here's what i got from the table: ",product);
        }
    }); 
});

app.get('/api/products/get/:id', function(req,res) {
    Product.findById(req.params.id, function(err,product) {
        if(err) {
            console.log("Error in findById: ", err);
        } else {
            console.log("Table lookup complete.");
            res.json(product);
            console.log("Heres the item I got: ", product);
        }
    });
});

app.post('/api/products/post', function(req,res) {
    req.checkBody('productName','productName: field cannot be empty.').notEmpty();
    req.checkBody('productContent','productContent: field cannot be empty.').notEmpty();
    req.checkBody('productImage','productImage: field cannot be empty.').notEmpty();
    req.checkBody('productPrice','productPrice: field cannot be empty.').notEmpty();

    let err = req.validationErrors();

    if(err) {
        res.json({error: err});
    } else {
        let product = new Product();
        product.productName = req.body.productName;
        product.productContent = req.body.productContent;
        product.productImage = req.body.productImage;
        product.productPrice = req.body.productPrice;

        product.save(function(err) {
            if (err) {
                console.log("Error in posting item(s): ", err);
                return;
            } else {
                console.log("Item added to table.");
                res.json({ success: true });
            }
        })
    }
});

app.put('/api/products/update/:id', function(req,res) {
    let query = { _id: req.params.id };

    

    Product.findByIdAndUpdate(query, { $set: req.body }, function(err) {
        if (err) {
            res.json({error: err});
        } else {
            console.log("Item updated.");
            res.json({ success: true });
        }
    });
});

app.delete('/api/products/delete:/id', function(req,res) {
    let query = { _id: req.params.id };

    console.log("Query: ", query);

    Product.remove(query, function(err) {
        if (err) {
            res.json({ error: err });
        } else {
            console.log("Item deleted.");
            res.json({ success: true });
        }
    });
});

app.listen(port, function() {
    console.log("Server started on port: ", port); 
});