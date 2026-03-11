const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const {
    createGroup,
    getMyGroups,
    inviteMember,
    respondToInvite,
    getPublicGroups,
    joinGroup
} = require("../controllers/groupController");

router.post("/", verifyUser, createGroup);
router.get("/", verifyUser, getMyGroups);
router.get("/public", verifyUser, getPublicGroups);
router.post("/:groupId/invite", verifyUser, inviteMember);
router.put("/:groupId/respond", verifyUser, respondToInvite);
router.post("/:groupId/join", verifyUser, joinGroup);

module.exports = router;
