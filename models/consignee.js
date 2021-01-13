const mongoose = require('mongoose')

const consigneeSchema = new mongoose.Schema({
    consigneename : {
        type : String,
        required : true,
        unique : true
    },
    address : {
        type : String,
        required : true
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
})

const consignee = mongoose.model('Consignee',consigneeSchema)

module.exports = consignee