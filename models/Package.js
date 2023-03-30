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
            type: Object,
            default:null
        },
        is_active:{
            type: Boolean,
            default:true
        },
        document_types:[{
            type: mongoose.Schema.Types.ObjectId,
            ref : "DocumentType",
        }]
    },
    {
        timestamps : true,
        collection: 'packages'
    }
);

module.exports = mongoose.model('Package',ModelSchema);

