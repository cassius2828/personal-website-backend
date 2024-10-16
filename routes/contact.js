const express = require('express');
const router = express.Router();
const contactCtrl = require('../controllers/contact')
router.post('/contact-form-submission', contactCtrl.postContactFormSubmission)

module.exports = router