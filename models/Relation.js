const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require:true
        },
    },
    {
        timestamps : true,
        collection: 'relations'
    }
);

module.exports = mongoose.model('Relation',ModelSchema);

