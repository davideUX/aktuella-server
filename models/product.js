let mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productContent: {
        type: String, 
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    productPrice: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema, 'tbl_products');