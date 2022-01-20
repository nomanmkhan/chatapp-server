
const Message = require("../model/message.model");
const Conversation = require("../model/conversation.model");

module.exports.create = async (req, res) => {
    try {
        const { id } = req.user;
        const { conversationId, text } = req.body;
        let data = {
            conversationId,
            sender: id,
            text
        }
        let conversation = await Conversation.findOne({ id: conversationId });
        const message = await new Message(data);
        if (!message) return res.status(400).json({ msg: "values not provided." })
        conversation.lastMessage({ msg: text, time: new Date() });
        await conversation.save()
        await message.save();
        res.status(200).json({ message })


    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports.get = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await Message.find({ conversationId: id });
        if (messages.length < 1) return res.status(200).json({ msg: "No messages found" })
        res.status(200).json({ messages })

    } catch (err) {
        res.status(500).json(err)
    }
}
