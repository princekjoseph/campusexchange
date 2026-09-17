const { Router } = require('express');
const multer = require('multer');
const listingController = require('../controllers/listingController');
const { requireAuth } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const router = Router();

router.get('/listings', listingController.getAllListings);
router.get('/listings/new', requireAuth, listingController.getNewListing);
router.post('/listings/new', requireAuth, upload.single('image'), listingController.postNewListing);
router.get('/listings/:id', listingController.getListingById);
router.get('/dashboard', requireAuth, listingController.getDashboard);
router.post('/listings/:id/status', requireAuth, listingController.updateListingStatus);

module.exports = router;