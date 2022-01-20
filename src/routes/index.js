const express = require("express");
const router = express.Router();
const FORM_CONTROLLER = require("../controller/user.controller");
const CONVERSATION_CONTROLLER = require("../controller/conversation.controller")
const MESSAGE_CONTROLLER = require("../controller/message.controller")
const { authenticate } = require("../utils/authenticate")

//auth block
router.post("/register", FORM_CONTROLLER.register);
router.post("/login", FORM_CONTROLLER.login);

//user block
router.get("/user/:id", FORM_CONTROLLER.getUser);

//conversation block
router.post("/conversation", authenticate, CONVERSATION_CONTROLLER.create);
router.get("/conversation/:id", authenticate, CONVERSATION_CONTROLLER.get);

//messages block
router.post("/message", authenticate, MESSAGE_CONTROLLER.create);
router.get("/message/:id", authenticate, MESSAGE_CONTROLLER.get);


// router.post("/login", FORM_CONTROLLER.login);


module.exports = router;