const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true
        },
        icon:{
            type: String,
            default:null
        },
        is_basic:{
            type: Boolean,
            default:false
        },
        is_active:{
            type: Boolean,
            default:true
        }
    },
    {
        timestamps : true,
        collection: 'document_types'
    }
);

module.exports = mongoose.model('DocumentType',ModelSchema);

