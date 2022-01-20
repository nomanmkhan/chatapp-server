
const Conversation = require("../model/conversation.model");

//create conversation
module.exports.create = async (req, res) => {
    try {
        const { id } = req.user
        const { receiverId } = req.body;

        if (!receiverId && !id) return res.status(400).json({ msg: "Enter ids" })

        const findCon = await Conversation.findOne({
            $and: [{ members: { $in: [id] } }, { members: { $in: [receiverId] } }]
        })

        if (!findCon) {
            const conversation = new Conversation({
                members: [id, receiverId]
            });
            await conversation.save();
            if (conversation) {
                return res.status(200).json({ conversation })
            }
        } else {
            return res.status(409).json({ msg: "chat already created" })
        }

    }
    catch (err) {
        res.status(500).json(err)
    }
}

//get all conversation for a user.
module.exports.get = async (req, res) => {
    try {
        const { id } = req.params
        const conversation = await Conversation.find({
            members: { $in: [id] }
        })
        if (conversation.length < 1) return res.status(200).json({ msg: "No conversation found" })
        res.status(200).json({ conversation })
    }
    catch (err) {
        res.status(500).json(err)
    }
}
