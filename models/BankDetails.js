const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        author_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Author",
            required:true,
        },
        account_type:{
            type: String,
            enum: ["Saving","Current"],
            default:"Saving"
        },
        account_holder_name:{
            type: String,
            required:true,
        },
        bank_name:{
            type: String,
            required:true,
        },
        ifsc_code:{
            type: String,
            required:true,
        },
        is_active:{
            type: Boolean,
            default:true
        }
    },
    {
        timestamps : true,
        collection: 'bank_details'
    }
);

module.exports = mongoose.model('BankDetails',ModelSchema);

