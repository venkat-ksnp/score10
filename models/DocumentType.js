const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
            unique:true,
        },
        icon:{
            type: String,
            default:null
        },
        is_basic:{
            type: Boolean,
            default:false
        },
        type:{
            type: String,
            enum: ["adhar", "pan", "driving_licence","voter_id","passport","electricity","court_case"],
            default:"adhar",
            unique:true,
            required:true
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

