const { token } = require("morgan");
const { ResetPinSchema } = require("./RestPin.schema");
const { randomPinNumber } = require("../../utils/randomGenerator");

const setPasswordRestPin = async (email) => {
  //Random 6 digit
  const pinLength = 6;
  const randPin = await randomPinNumber(pinLength);

  const restObj = {
    email,
    pin: randPin,
  };

  return new Promise((resolve, reject) => {
    ResetPinSchema(restObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getPinByEmailPin = async (email, pin) => {
  try {
    const data = await ResetPinSchema.findOne({ email, pin }).exec();
    return data || false;
  } catch (error) {
    console.log(error);
    throw error; // Laisse l'erreur être gérée plus haut si nécessaire
  }
};


const deletePin = async (email, pin) => {
  try {
    const deletedPin = await ResetPinSchema.findOneAndDelete({ email, pin }).exec(); 
    return deletedPin;
  } catch (error) {
    console.log(error);
    throw error; 
  }
};


module.exports = {
  setPasswordRestPin,
  getPinByEmailPin,
  deletePin,
};