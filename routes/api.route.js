const expres                    =   require('express')
const router                    =   expres.Router()
const authorization             =   require('../middleware/authentication')

const AuthorController          =  require('../controllers/Author.js')
router.post("/Author/create",authorization, AuthorController.create)
router.post("/Author/login",  AuthorController.login)
router.post("/Author/resendotp",  AuthorController.login)
router.post("/Author/loginwithotp",AuthorController.loginwithotp)
router.get("/Author/refreshToken/:refreshToken",  AuthorController.refreshToken)
router.get("/Author/forgotpassword/:email", AuthorController.forgotpassword)
router.patch("/Author/resetpassword/:id/:resetPawordToken",AuthorController.resetpassword)
router.post("/Author/changePassword",authorization,AuthorController.changePassword)
router.get("/Author/phone/verification/generateOtp/:phonenumber", AuthorController.generateotp)
router.get("/Author/phone/verification/submitOtp/:otp/:referenceId/:phonenumber", AuthorController.submitOtp)
router.get("/Author/list",authorization,AuthorController.list)
router.get("/Author/view/:id",authorization,AuthorController.view)
router.patch("/Author/update/:id",authorization,AuthorController.update)
router.delete("/Author/delete/:id",authorization,AuthorController.remove)
router.delete("/Author/bulkdelete/:ids",authorization,AuthorController.bulkremove)

// const CommonController          =  require('../controllers/Common.js')
// router.get("/Author/Dashboard",authorization,CommonController.Dashboard)

const PropertyController          =  require('../controllers/Property.js')
router.post("/Property/create",authorization, PropertyController.create)
router.get("/Property/list",authorization,PropertyController.list)
router.get("/Property/view/:id",authorization,PropertyController.view)
router.patch("/Property/update/:id",authorization,PropertyController.update)
router.delete("/Property/delete/:id",authorization,PropertyController.remove)
router.delete("/Property/rooms/delete/:id",authorization,PropertyController.roomremove)
router.delete("/Property/furnishes/delete/:id",authorization,PropertyController.furnishesremove)
// router.delete("/Property/bulkdelete/:ids",authorization,LandlordDocumentController.bulkremove)

const TenantDocumentDocumentController          =  require('../controllers/TenantDocument.js')
// router.post("/TenantDocument/create",authorization, TenantDocumentDocumentController.create)
router.get("/TenantDocument/list",authorization,TenantDocumentDocumentController.list)
router.get("/TenantDocument/verify/:id/:number",authorization,TenantDocumentDocumentController.Verify)
// router.get("/TenantDocument/view/:id",authorization,TenantDocumentDocumentController.view)
// router.patch("/TenantDocument/update/:id",authorization,TenantDocumentDocumentController.update)
router.delete("/TenantDocument/delete/:id",authorization,TenantDocumentDocumentController.remove)
// router.delete("/TenantDocument/bulkdelete/:ids",authorization,LandlordDocumentController.bulkremove)

const LandlordPackageController          =  require('../controllers/LandlordPackage.js')
router.post("/LandlordPackage/create",authorization, LandlordPackageController.create)
router.get("/LandlordPackage/list",authorization,LandlordPackageController.list)
router.get("/LandlordPackage/view/:id",authorization,LandlordPackageController.view)
router.patch("/LandlordPackage/update/:id",authorization,LandlordPackageController.update)
router.delete("/LandlordPackage/delete/:id",authorization,LandlordPackageController.remove)
// router.delete("/LandlordPackage/bulkdelete/:ids",authorization,LandlordPackageController.bulkremove)

const LanlordTenantController          =  require('../controllers/LanlordTenant.js')
router.post("/LanlordTenant/create",authorization, LanlordTenantController.create)
router.get("/LanlordTenant/list",authorization,LanlordTenantController.list)
router.get("/LanlordTenant/view/:id",authorization,LanlordTenantController.view)
router.patch("/LanlordTenant/update/:id",authorization,LanlordTenantController.update)
router.delete("/LanlordTenant/delete/:id",authorization,LanlordTenantController.remove)
// router.delete("/LanlordTenant/bulkdelete/:ids",authorization,LanlordTenantController.bulkremove)

const BankDetailsController          =  require('../controllers/BankDetails.js')
router.post("/BankDetails/create",authorization, BankDetailsController.create)
router.get("/BankDetails/list",authorization,BankDetailsController.list)
router.get("/BankDetails/view/:id",authorization,BankDetailsController.view)
router.patch("/BankDetails/update/:id",authorization,BankDetailsController.update)
router.delete("/BankDetails/delete/:id",authorization,BankDetailsController.remove)
// router.delete("/BankDetails/bulkdelete/:ids",authorization,BankDetailsController.bulkremove)

const RelationController          =  require('../controllers/Relation.js')
router.post("/Relation/create",authorization, RelationController.create)
router.get("/Relation/list",authorization,RelationController.list)
router.get("/Relation/view/:id",authorization,RelationController.view)
router.patch("/Relation/update/:id",authorization,RelationController.update)
router.delete("/Relation/delete/:id",authorization,RelationController.remove)
// router.delete("/Relation/bulkdelete/:ids",authorization,RelationController.bulkremove)

const CoTenantController          =  require('../controllers/CoTenant.js')
router.post("/CoTenant/create",authorization, CoTenantController.create)
router.get("/CoTenant/list",authorization,CoTenantController.list)
router.get("/CoTenant/view/:id",authorization,CoTenantController.view)
router.patch("/CoTenant/update/:id",authorization,CoTenantController.update)
router.delete("/CoTenant/delete/:id",authorization,CoTenantController.remove)
// router.delete("/CoTenant/bulkdelete/:ids",authorization,CoTenantController.bulkremove)

const AmenityController          =  require('../controllers/Amenity.js')
// router.post("/Amenity/create", AmenityController.create)
router.get("/Amenity/list",AmenityController.list)
// router.get("/Amenity/view/:id",AmenityController.view)
// router.patch("/Amenity/update/:id",authorization,AmenityController.update)
// router.delete("/Amenity/delete/:id",authorization,AmenityController.remove)
// router.delete("/Amenity/bulkdelete/:ids",authorization,AmenityController.bulkremove)

const AmenityCategoryController          =  require('../controllers/AmenityCategory.js')
// router.post("/AmenityCategory/create", AmenityCategoryController.create)
router.get("/AmenityCategory/list",AmenityCategoryController.list)
// router.get("/AmenityCategory/view/:id",AmenityCategoryController.view)
// router.patch("/AmenityCategory/update/:id",authorization,AmenityCategoryController.update)
// router.delete("/AmenityCategory/delete/:id",authorization,AmenityCategoryController.remove)
// router.delete("/AmenityCategory/bulkdelete/:ids",authorization,AmenityCategoryController.bulkremove)

const StateController          =  require('../controllers/State.js')
// router.post("/State/create", StateController.create)
router.get("/State/list",StateController.list)
// router.get("/State/view/:id",StateController.view)
// router.patch("/State/update/:id",authorization,StateController.update)
// router.delete("/State/delete/:id",authorization,StateController.remove)
// router.delete("/State/bulkdelete/:ids",authorization,StateController.bulkremove)

const CityController          =  require('../controllers/City.js')
// router.post("/City/create", CityController.create)
router.get("/City/list",CityController.list)
// router.get("/City/view/:id",CityController.view)
// router.patch("/City/update/:id",authorization,CityController.update)
// router.delete("/City/delete/:id",authorization,CityController.remove)
// router.delete("/City/bulkdelete/:ids",authorization,CityController.bulkremove)

const DocumentTypeController          =  require('../controllers/DocumentType.js')
// router.post("/DocumentType/create", DocumentTypeController.create)
router.get("/DocumentType/list",DocumentTypeController.list)
// router.get("/DocumentType/view/:id",DocumentTypeController.view)
// router.patch("/DocumentType/update/:id",authorization,DocumentTypeController.update)
// router.delete("/DocumentType/delete/:id",authorization,DocumentTypeController.remove)
// router.delete("/DocumentType/bulkdelete/:ids",authorization,DocumentTypeController.bulkremove)

const FurnishController          =  require('../controllers/Furnish.js')
// router.post("/Furnish/create", FurnishController.create)
router.get("/Furnish/list",FurnishController.list)
// router.get("/Furnish/view/:id",FurnishController.view)
// router.patch("/Furnish/update/:id",authorization,FurnishController.update)
// router.delete("/Furnish/delete/:id",authorization,FurnishController.remove)
// router.delete("/Furnish/bulkdelete/:ids",authorization,FurnishController.bulkremove)

const PackageController          =  require('../controllers/Package.js')
// router.post("/Package/create", PackageController.create)
router.get("/Package/list",PackageController.list)
// router.get("/Package/view/:id",PackageController.view)
// router.patch("/Package/update/:id",authorization,PackageController.update)
// router.delete("/Package/delete/:id",authorization,PackageController.remove)
// router.delete("/Package/bulkdelete/:ids",authorization,PackageController.bulkremove)

const PropertyCategoryController          =  require('../controllers/PropertyCategory.js')
// router.post("/PropertyCategory/create", PropertyCategoryController.create)
router.get("/PropertyCategory/list",authorization,PropertyCategoryController.list)
// router.get("/PropertyCategory/view/:id",PropertyCategoryController.view)
// router.patch("/PropertyCategory/update/:id",authorization,PropertyCategoryController.update)
// router.delete("/PropertyCategory/delete/:id",authorization,PropertyCategoryController.remove)
// router.delete("/PropertyCategory/bulkdelete/:ids",authorization,PropertyCategoryController.bulkremove)

const RoomController          =  require('../controllers/Room.js')
// router.post("/Room/create", RoomController.create)
router.get("/Room/list",authorization,RoomController.list)
// router.get("/Room/view/:id",RoomController.view)
// router.patch("/Room/update/:id",authorization,RoomController.update)
// router.delete("/Room/delete/:id",authorization,RoomController.remove)
// router.delete("/Room/bulkdelete/:ids",authorization,RoomController.bulkremove)

module.exports = router;