const expres                    =   require('express')
const router                    =   expres.Router()
const authorization             =   require('../middleware/authentication')
const Helper                    =   require("../middleware/helper");
const multer                    =   require('multer')
const storage                   =   multer.memoryStorage()
const upload                    =   multer({ storage: storage })

router.post("/upload", upload.single("singleFile"), async (req, res) => {
    /*
      #swagger.consumes = ['multipart/form-data']  
      #swagger.parameters['singleFile'] = {
          in: 'formData',
          type: 'file',
          required: 'true',
          description: 'Some description...',
    } */

    const file = req.file;
    return await Helper.SuccessValidation(req,res,[],'Added successfully')
});

module.exports = router;