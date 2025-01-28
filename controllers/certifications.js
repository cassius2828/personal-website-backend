const getAllCerts = async (req, res) => {
    try {
        res.status(200).json('hit')
    } catch (err) {
        res.status(500).json('miss')
    }
};
const getCertById = async (req, res) => {
    try {
        res.status(200).json('hit')
    } catch (err) {
        res.status(500).json('miss')
    }
};
const postCreateCert = async (req, res) => {
    const admin = process.env.ADMIN_ID;
    const userId = req.user.user._id;
    console.log(admin, " <-- admin id");
    if (userId !== admin) {
      return res.status(400).json({
        error: "User is not authorized to create a blog",
      });
    }
    try {
        res.status(200).json('hit')
    } catch (err) {
        res.status(500).json('miss')
    }
};


module.exports = {
    getAllCerts,
    getCertById,postCreateCert
};
