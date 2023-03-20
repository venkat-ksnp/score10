const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        tenant_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Author",
            required:true,
        },
        document_type_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "DocumentType",
            required:true,
        },
        number:{
            type:String,
            default:null
        },
        is_verified:{
            type:Boolean,
            default:false
        },
        verification_response:{
            type:Object,
            default:false
        }
    },
    {
        timestamps : true,
        collection: 'tenant_documents'
    }
);

module.exports = mongoose.model('TenantDocument',ModelSchema);

