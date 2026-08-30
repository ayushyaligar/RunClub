const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
    getAllAnnouncements, createAnnouncement, getAnnouncementById,
    updateAnnouncement, deleteAnnouncement, notifyMembers
} = require('../controllers/announcements.controller');

const router = express.Router();

router.get('/', getAllAnnouncements);
router.get('/:id', getAnnouncementById);
router.post('/', requireAuth, requireAdmin, createAnnouncement);
router.put('/:id', requireAuth, requireAdmin, updateAnnouncement);
router.delete('/:id', requireAuth, requireAdmin, deleteAnnouncement);
router.post('/:id/notify', requireAuth, requireAdmin, notifyMembers);

module.exports = router;