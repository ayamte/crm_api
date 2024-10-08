const express = require("express");
const router = express.Router();

const {insertUser, getUserByEmail, getUserById, updatePassword, storeUserRefreshJWT} = require("../model/user/User.model");
const {hashPassword, comparePassword } = require('../helpers/bcrypt.helper')
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");

const {userAuthorization} = require("../middlewares/authorization.middleware");

const {setPasswordRestPin, getPinByEmailPin, deletePin} = require("../model/restPin/RestPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const {resetPassReqValidation, updatePassValidation} =require("../middlewares/formValidation.middleware");
const {verify} = require ("jsonwebtoken");
const {deleteJWT} = require("../helpers/redis.helper");

router.all('/', (req, res, next)=>{
  // res.json({message: "return from user router"});

  next();
});


// Get user profile router
router.get("/",userAuthorization, async (req,res) =>{

  //this data coming from database
  const _id = req.userId;

  const userProf = await getUserById(_id);
  const {name, email} = userProf;

  res.json({user: {
  _id,
  name,
  email,
  }

});
})



// Create new user route
router.post('/', async(req, res)=>{
  const  {name, company, address, phone, email, password } = req.body;

  try {
    //hash password
    const hashedPass = await hashPassword(password)

    const newUserObj = {
      name, 
      company, 
      address, 
      phone, 
      email, 
      password : hashedPass,
    }

    const result = await insertUser(newUserObj);
    console.log(result);

    res.json({message: 'New user created', result });

  } catch(error){

    console.log(error);

    res.json({status: 'error', message: error.message });
  }

});


// User sign in Router
router.post("/login", async(req, res) => {

  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({status: "error", message: "Invalid form submission"});
  }

  try {
    const user = await getUserByEmail(email);
    console.log("User from DB:", user);
    
    const passFromDb = user && user._id ? user.password : null;

    if (!passFromDb) {
      return res.json({ status: "error", message: "Invalid email or password!" });
    }

    const result = await comparePassword(password, passFromDb);
    console.log("Password match:", result);

    if (!result) {
      return res.json({status: "error", message: "Invalid email or password!"});
    }

    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);


    res.json({
      status: "success", 
      message: "Login Successfully!", 
      accessJWT,
      refreshJWT,
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.json({status: "error", message: "Internal server error"});
  }
});


/// Verify email and email pin to reset the password
router.post('/reset-password', resetPassReqValidation, async (req,res) =>{
  const {email} = req.body;

  const user = await getUserByEmail(email);

  if(user && user._id){
    const setPin = await setPasswordRestPin(email);
    await emailProcessor({email, pin: setPin.pin, type: 'request-new-password'});

   
      return res.json({
        status: "success",
        message: "If the email exist in our database, the password reset pin will be sent shortly. "
      });}
    

  return res.json({
    status: "error", 
    message:"If the email exist in our database, the password reset pin will be sent shortly."});
});

/// Replace with new password 
router.patch('/reset-password', updatePassValidation, async (req,res) =>{
  const {email, pin, newPassword} = req.body;
  const getPin = await getPinByEmailPin(email, pin);

  if(getPin._id){

    const dbDate = getPin.addedAt;
    const expiresIn = 1;
    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
    const today = new Date()

    if(today > expDate){
      return res.json({
        status: "error",
        message:"Invalid pin or expired pin."
      })
    }

    const hashPass = await hashPassword(newPassword);

    const user = await updatePassword(email, hashPass);

    if(user._id){
      /// send email notification
      await emailProcessor({email, type: 'password-update-success'});

      /// delete pin from database
      deletePin(email, pin);

      return res.json({
        status: "success", 
        message:"Your password has been updated."
    })
    }

  }
  res.json({
    status: "error", 
    message:"Unable to update your password. Please try again later."
  });

});

/// Delete user accessJWT
router.delete("/logout", userAuthorization, async (req, res) => {
	const { authorization } = req.headers;
	//this data coming form database
	const _id = req.userId;

	// delete accessJWT from redis database
	deleteJWT(authorization);

	// delete refreshJWT from mongodb
	const result = await storeUserRefreshJWT(_id, "");

	if (result._id) {
		return res.json({ status: "success", message: "Logged out successfully" });
	}

	res.json({
		status: "error",
		message: "Unable to log you out, plz try again later",
	});
});



module.exports = router;