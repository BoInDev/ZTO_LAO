const connected = require('../../connection/connection');
const bcrypt = require('bcrypt');
const queries = require('./userProfile_query');
const secretkey = process.env.SECRETKEY
const jwt = require('jsonwebtoken');


// get one user

const getOneUser = (req, res) =>{
    const userId = req.user.user_id;
     // const {user_id} = req.body;
    jwt.verify(req.token, secretkey, (token_err, rsToken)=>{
        if(token_err){
            res.json({
                status: 401,
                message: "Unauthorized access"
            });
        }else{
            connected.query(queries.getOneUser, [userId], (err, result)=>{
            if(err) throw err;
            if(!result.length){
                res.json({
                    status: 404,
                    message: "ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້"
                });
            }else{
                res.json({
                    status: 200,
                    message: "ພົບຂໍ້ມູນຜູ້ໃຊ້",
                    data: result[0]
                });
            }
            })

        }
    })
};

// getAllUser
const getAllUser = (req, res) => {
    jwt.verify(req.token, secretkey, (token_err, rsToken) => {
        if (token_err) {
            res.json({
                status: 401,
                message: "Unauthorized access"
            });
        } else {
            connected.query(queries.getAllUser, (err, result) => {
                if (err) throw err;
                if (!result.length) {
                    res.json({
                        status: 404,
                        message: "No users found"
                    });
                } else {
                    res.json({
                        status: 200,
                        message: "Users retrieved successfully",
                        data: result
                    });
                }
            });
        }
    });
};

// update user profile
const updateUserProfile = (req, res) => {
    const userId = req.user.user_id;
    // const {user_id} = req.body;
    const { first_name, last_name,age, gender, phone_number } = req.body;

    jwt.verify(req.token, secretkey, (token_err, rsToken) => {
        if (token_err) {
            res.json({
                status: 401,
                message: "Unauthorized access"
            });
        } else {
            connected.query(queries.checkUserPhoneNum, [phone_number], (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.json({
                        status: 400,
                        message: "ບໍ່ສາມາດປ່ອນເບີໂທນີ້ໄດ້ ເບີໂທນີ້ໄດ້ຖືກນຳໃຊ້ແລ້ວ"
                    });
                } else {
                    connected.query(queries.updateUserProfile, [first_name, last_name,age, gender, phone_number, userId], (err, result) => {
                        if (err) throw err;
                        res.json({
                            status: 200,
                            message: "User profile updated successfully"
                        });
                    });
                }
            });

        }
    });
};

//ໃຊ້ຢູ່ສໍາລັບອັບເດດຮູບ
const upload_img = (req, res) => {
    const userId = req.user.user_id;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ resultCode: "ກະລຸນາອັບຮູບແດ່" });
    }

    jwt.verify(req.token, secretkey, (token_err, rstoken) => {
        if (token_err) {
            return res.status(403).json({ resultCode: "token ມີບັນຫາ" });
        }

        connected.query(queries.checkUser, [userId], (error, results) => {
            if (error) {
                console.error("Error checking user ID for image upload:", error);
                return res.status(500).json({ resultCode: "ຜິດພາດທາງເຊີບເວີ" });
            }

            if (!results.length) {
                return res.json({ resultCode: "ບໍ່ສາມາດອັບເດດໄດ້ stage 1" });
            }

            connected.query(queries.upload_image, [file.path, userId], (err, result) => {
                if (err) {
                    console.error("Error uploading image:", err);
                    return res.status(500).json({ resultCode: "ຜິດພາດທາງເຊີບເວີ" });
                }

                if (!result.affectedRows) {
                    return res.json({ resultCode: "ບໍ່ສາມາດອັບເດດໄດ້ stage 2" });
                }

                return res.json({ resultCode: "update profile ສຳເລັດ", result });
            });
        });
    });
};






module.exports = {
getOneUser,
updateUserProfile,
getAllUser,
upload_img,
};