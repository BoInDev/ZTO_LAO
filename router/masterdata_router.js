//call express function
const { Router } = require('express');

//set router
const router = Router();
const { verifyToken, upload } = require('../middleware/middleware');


const userProfileController = require('../src/user_profile/userProfile_controller');
router.put("/upload/image",upload.single('image'),userProfileController.upload_img);
router.get("/get/user/profile", verifyToken, userProfileController.getOneUser);
router.get("/get/all/user/profile", verifyToken, userProfileController.getAllUser);

//export route to  server file
module.exports = router;