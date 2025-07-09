const connected = require('../../connection/connection');
const bcrypt = require('bcrypt');
const queries = require('./authUser_query');
const secretkey = process.env.SECRETKEY
const jwt = require('jsonwebtoken');

const registerUser = (req, res)=>{
    const {
        first_name,last_name,age,gender,phone_number,password
    }=req.body

const encryptPassword = bcrypt.hash(password || secretkey, 10);
const encryptedPassword = encryptPassword;

connected.query(queries.checkUserPhoneNum, [phone_number],(err, result)=>{
    if(err)throw err;
    if(result.length){
        res.json({
            status: 400,
            message: "Phone number already exists"
        })
    }
    else{
        connected.query(queries.registerUser, [first_name,last_name,age,gender,phone_number,encryptedPassword], (err, result)=>{
        if(err) throw err;
        res.json({
            status:200,
            message: "User registered successfully",
        })
        })
    }
    
})
};

const loginUser = (req, res)=>{
    const { phone_number, password } = req.body;
if(!phone_number || !password){
    res.json({
        status: 400,
        message: "ບໍມີເບີໂທ ຫຼື ລະຫັດຜ່ານເດີ!!!"
    });
}
connected.query(queries.checkUSerStatus, [phone_number], (err, result)=>{
    if(err)throw err;
    if(!result.length){
        res.json({
        status: 404,
        message: "ບໍມີບັນຊີນີ້ ຫຼື ຖືກປິດໃຊ້ງານ !!!"
        });
    }
    else{
        bcrypt.compare(password, result[0].password)

        .then((isPasswordMatch) => {
            if (!isPasswordMatch){
                return res.json({
                    status: 401,
                    message: "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ"
                });
            }else{
                const accessToken = jwt.sign(
                    { user_id: result[0].user_id, phone_number: result[0].phone_number, user_status: result[0].status,  },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                const payload ={
                    phone_number: result[0].phone_number,
                    user_id: result[0].user_id,
                    user_status: result[0].status,
                }
                res.json({
                    status: 200,
                    message: "Login successful",
                    accessToken,
                    payload
                });
            }
        })
    }
})
};

const tempStore = {}; 
const loginByOTP = (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    res.status(400).json({ message: 'Phone and OTP are required' });
  } else if (!tempStore[phone]) {
    res.status(400).json({ message: 'No OTP found for this number' });
  } else if (Date.now() > tempStore[phone].expires) {
    delete tempStore[phone]; // Clean up expired
    res.status(400).json({ message: 'OTP expired' });
  } else if (tempStore[phone].otp !== otp) {
    res.status(400).json({ message: 'Invalid OTP' });
  } else {
    // OTP correct
    delete tempStore[phone]; // Clear after use

    const token = jwt.sign(
      { phone },
      process.env.JWT_SECRET || secretkey ,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'OTP verified', token });
  }
};






module.exports={
registerUser,
loginUser,
loginByOTP
}