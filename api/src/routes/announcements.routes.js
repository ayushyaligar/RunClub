const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
    getAllAnnouncements, createAnnouncement, getAnnouncementById,
    updateAnnouncement, deleteAnnouncement,
} = require('../controllers/announcements.controller');

const router = express.Router();

router.get('/', getAllAnnouncements);
router.get('/:id', getAnnouncementById);
router.post('/', requireAuth, requireAdmin, createAnnouncement);
router.put('/:id', requireAuth, requireAdmin, updateAnnouncement);
router.delete('/:id', requireAuth, requireAdmin, deleteAnnouncement);

module.exports = router;