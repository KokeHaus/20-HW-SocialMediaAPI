const { User, Thought } = require('../models');

module.exports = {
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .populate('reactions') 
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create( { thoughtText: req.body.thoughtText, username: req.body.username } )
        .then (( {_id} ) => {
            // also update user to push new thought in array
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: _id }}, 
                { new: true, runValidators: true }
            );
        })
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.id })
        .select('-__v')       
        .populate('reactions') 
        .then((thought) =>         
        !thought
        ? res.status(400).json({ message: 'No thought with that ID' })
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    updateSingleThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
          )
          .then((thought) =>         
          !thought
          ? res.status(400).json({ message: 'No thought with that ID' })
          : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOne({ _id: req.params.id })
        .then((thought) =>         
        {
            if(!thought)
            res.status(400).json({ message: 'No thought with that ID' })
            else
            {
                const thoughtId = thought._id;
                const username = thought.username;
                Thought.findOneAndDelete({ _id: thoughtId })  
                .then(() => {
                    User.findOneAndUpdate(
                        { username: username },
                        { $pull: { thoughts: thoughtId } },
                        { runValidators: true, new: true }
                      )
                })    
                .then(() => res.json({ message: 'Thoughts deleted, user updated!' }))
            }
        }        
        )        
        .catch((err) => res.status(500).json(err));
    },
     createReaction(req, res) {             
        Thought.findOneAndUpdate(
            { _id:  req.params.id },
            { $push: { reactions:  req.body } },
            { runValidators: true, new: true }
          )
          .select('-__v')       
          .populate('reactions') 
          .then((thought) =>         
          !thought
          ? res.status(400).json({ message: 'No thought with that ID' })
          : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },    
    deleteReaction(req, res) {
        const thoughtId = req.params.thoughtId;
        const reactionId = req.params.reactionId;
        Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $pull: { reactions: {reactionId: reactionId} } },
            { runValidators: true, new: true }
          )
          .select('-__v')       
          .populate('reactions') 
          .then((thought) =>         
          !thought
          ? res.status(400).json({ message: 'No thought with that ID' })
          : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    }
}