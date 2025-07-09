const getOneUser = `SELECT user_id,first_name,last_name,age,gender,phone_number,profile_picture FROM tbl_user WHERE user_id = ?`;
const getAllUser = `SELECT first_name,last_name,age,gender,phone_number,profile_picture FROM tbl_user`;
const updateUserProfile = `UPDATE tbl_user SET first_name = ?, last_name = ?,age=?, gender=?, phone_number = ? WHERE user_id = ?`;
const checkUserPhoneNum = `SELECT phone_number FROM tbl_user WHERE phone_number = ?`;
const checkUser = `SELECT * FROM tbl_user WHERE user_id = ?`;
const upload_image = `update tbl_user set picturs = ? where user_id = ?`;
module.exports = {
    getOneUser,
    getAllUser,
    updateUserProfile,
    checkUserPhoneNum,
    checkUser,
    upload_image
}