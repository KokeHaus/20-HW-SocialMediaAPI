const router = require('express').Router();
const {
    getAllThoughts,
    createThought,
    getSingleThought,
    updateSingleThought,
    deleteThought,
    createReaction,
    deleteReaction
} = require('../../controllers/thoughtController');

router.route('/').get(getAllThoughts).post(createThought);
router.route('/:id').get(getSingleThought).put(updateSingleThought).delete(deleteThought);
router.route('/:id/reactions').post(createReaction);
router.route('/:thoughtId/reaction/:reactionId').delete(deleteReaction);

module.exports = router;