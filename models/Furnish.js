const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            default:null 
        },
        icon:{
            type: String,
            default:null
        },
        is_active:{
            type: Boolean,
            default:true
        },
    },
    {
        timestamps : true,
        collection: 'furnish_details'
    }
);

module.exports = mongoose.model('Furnish',ModelSchema);

