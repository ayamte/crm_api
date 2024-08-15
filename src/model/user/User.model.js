const { UserSchema } = require("./User.schema");


const insertUser =  (userObj) => {
  return new Promise((resolve, reject) =>{
    UserSchema(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};



const getUserByEmail = async (email) => {
  if (!email) return false;

  try {
    const user = await UserSchema.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserById = async (_id) => {
  if (!_id) return false;

  try {
    const user = await UserSchema.findOne({ _id });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const storeUserRefreshJWT = (_id, token)=>{
  return new Promise ((resolve, reject)=>{
    try {
      console.log('Updating user with ID:', _id);
      console.log('New refresh token:', token);
      UserSchema.findOneAndUpdate(
        {_id}, 
        {
          $set: {"refreshJWT.token":token, 
            "refreshJWT.addedAt": Date.now()},
          },
          {new:true}
        )
        .then((data) => resolve(data))
        .catch((error) => {

          console.log(error);
          reject(error);
          
        });
    } catch (error) {

      console.log(error);
      reject(error);
    }
  })
}

const updatePassword = async (email, newHashedPass) => {
  try {
    const updatedUser = await UserSchema.findOneAndUpdate(
      { email },
      { $set: { password: newHashedPass } },
      { new: true } 
    ).exec();

    return updatedUser;
  } catch (error) {
    console.log(error);
    throw error; 
  }
};
 


module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  storeUserRefreshJWT,
  updatePassword,
}
