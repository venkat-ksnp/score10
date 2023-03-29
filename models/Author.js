const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        first_name:{
            type: String,
            default:null 
        },
        last_name:{
            type: String,
            default:null
        },
        email:{
            type: String,
            default:null
        },
        phonenumber:{
            type: String,
            unique :true,
            required:true,
        },
        is_phone_verified:{
            type: Boolean,
            default:false,
        },
        phone_verification:{
            type: Object,
            default:null
        },
        image:{
            type: String,
            default:null
        },
        role:{
            type: String,
            enum: ["Landlord", "Tenant", "Rwa"],
            default:"Landlord"
        },
        dob:{
            type: Date,
        },
        gender:{
            type: String,
            enum: ["Male", "Female", "Other"],
            default:null
        },
        password: {
            type: String,
            default:null
        },
        resetPawordToken: {
            type: String,
            default:null
        },
        refreshToken: {
            type: String,
            default:null
        },
        otp:{
            type: Number,
            default:null
        },
        api:{
            type: String,
            enum: ["signzy"],
            default:"signzy"
        }
    },
    {
        timestamps : true,
        collection: 'authors'
    }
);

ModelSchema.pre('updateOne', async function (next) {
    console.log('Before update....');
    let AlluserScOUNT = await mongoose.models.Author.countDocuments({email:this.getUpdate().$set.email,_id:{ $ne: this.getQuery()._id } })
    if(AlluserScOUNT==0){
        this.options.runValidators = true;
        if(this.getUpdate().$set.password){
            const salt = await bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(this.getUpdate().$set.password, salt);
            // this.password = hash
        }
        next();
    }else{
        next("Email already existed");
    }
});

ModelSchema.pre('save',async function(next){
    try{
        console.log('Before user insert....');
        const salt = await bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.password, salt);
        this.password = hash
        next()
    }catch(error){
        next(error)
    }
});

module.exports = mongoose.model('Author',ModelSchema);

