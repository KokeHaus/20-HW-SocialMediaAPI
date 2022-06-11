const { User, Thought } = require('../models');

module.exports = {
    getAllUsers(req, res) {
        User.find()
        .select('-__v')
        .populate('thoughts')
        .populate('friends') 
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },    
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    getSingleUser(req, res) {        
        User.findOne({ _id: req.params.id })
        .select('-__v')
        .populate('thoughts') 
        .populate('friends') 
        .then((user) =>         
        !user
        ? res.status(400).json({ message: 'No user with that ID' })
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    updateSingleUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { runValidators: true, new: true }
        )
        .then((user) =>         
        !user
        ? res.status(400).json({ message: 'No user with that ID' })
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
          .then((user) =>         
          !user
          ? res.status(400).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thought } })  
          )
          .then(() => res.json({ message: 'User and thoughts deleted!' }))
          .catch((err) => res.status(500).json(err));
    },
     createUserFriend(req, res) {
        const userId = req.params.userId;
        const friendId = req.params.friendId;
        User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { friends: friendId } },
            { runValidators: true, new: true }
          )
          .then((user) =>         
          !user
          ? res.status(400).json({ message: 'No user with that ID' })
          : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
    },
    deleteUserFriend(req, res) {
        const userId = req.params.userId;
        const friendId = req.params.friendId;
        User.findOneAndUpdate(
            { _id: userId },
            { $pull: { friends: friendId } },
            { runValidators: true, new: true }
          )
          .then((user) =>         
          !user
          ? res.status(400).json({ message: 'No user with that ID' })
          : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
    }
}