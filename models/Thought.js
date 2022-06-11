const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

function formatTimestamp(createdAt) {
    return moment(createdAt).format('MMM Do, YYYY [at] hh:mm a');
}

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,            
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatTimestamp
        },
    },
    {
        toJSON: {            
            getters: true 
        },  
    }
)

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,            
            required: true,
            maxlength: 280,
            minlength: 1,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatTimestamp
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true 
        },
        id: false 
    }
)

thoughtSchema
    .virtual('reactionCount')
    .get(function() {
        return this.reactions.length;
    })
 
const Thought = model('Thought', thoughtSchema);
module.exports = Thought;