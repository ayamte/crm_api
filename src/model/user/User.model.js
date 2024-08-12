const { UserSchema } = require("./User.schema");

// Insérer un nouvel utilisateur dans la base de données
const insertUser = async (userObj) => {
  try {
    const data = await UserSchema(userObj).save();
    console.log(data);
    return data; // Retourne les données enregistrées
  } catch (error) {
    console.error(error);
    throw error; // Relance l'erreur pour être capturée par l'appelant
  }
};

// Obtenir un utilisateur par email
const getUserByEmail = async (email) => {
  if (!email) throw new Error("Email is required");

  try {
    const user = await UserSchema.findOne({ email });
    return user; // Retourne l'utilisateur trouvé ou null si non trouvé
  } catch (error) {
    console.error(error);
    throw error; // Relance l'erreur pour être capturée par l'appelant
  }
};

module.exports = {
  insertUser,
  getUserByEmail,
};
