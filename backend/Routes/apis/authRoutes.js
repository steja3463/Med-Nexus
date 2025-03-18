const express = require('express');
const {login,register, addAdmin} = require('../../Controllers/authControllers');
const { authentcateJWT, checkRole } = require('../../Middleware/authMiddleware');

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
// router.post('/addAdmin',authentcateJWT,checkRole('isAdmin'),addAdmin);
router.post('/addAdmin',addAdmin);

module.exports = router;


