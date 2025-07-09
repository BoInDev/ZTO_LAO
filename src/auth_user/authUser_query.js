const registerUser = `INSERT INTO tbl_user(first_name,last_name,age,gender,phone_number,password,created_at)
VALUES(?,?,?,?,?,?,?,current_timestamp())`;
const checkUserPhoneNum = `SELECT * FROM tbl_user WHERE phone_number = ?`;
const checkUSerStatus = `SELECT * FROM tbl_user WHERE phone_number = ? AND status = 1`;

module.exports = {
registerUser,
checkUserPhoneNum,
checkUSerStatus
}