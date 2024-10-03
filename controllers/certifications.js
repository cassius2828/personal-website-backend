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
