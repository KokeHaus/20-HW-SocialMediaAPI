const router = require('express').Router();
const {
    getAllUsers,
    createUser,
    getSingleUser,
    updateSingleUser,
    deleteUser,
    createUserFriend,
    deleteUserFriend
} = require('../../controllers/userController');

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).put(updateSingleUser).delete(deleteUser);
router.route('/:userId/friends/:friendId').post(createUserFriend).delete(deleteUserFriend);

module.exports = router;