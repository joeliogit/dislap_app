const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/doctorController');
const verifyToken = require('../middleware/auth');

function verifyPsychologist(req, res, next) {
  if (req.user?.role !== 'psychologist') {
    return res.status(403).json({ success: false, message: 'Acceso restringido a psicólogos' });
  }
  next();
}

router.get('/patients',     verifyToken, verifyPsychologist, ctrl.getPatients);
router.get('/patients/:id', verifyToken, verifyPsychologist, ctrl.getPatientDetail);

module.exports = router;
