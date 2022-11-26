const express = require('express');

const router = express.Router();


const User = require('../schema/UserSchema');

router.get("/posts/:id", (req, res, next) => {

    const payload = {
        pagetitle: "View post",
        userLoggedIn: req.session.user,
        userLoggedInreq: JSON.stringify(req.session.user),
        postId: req.params.id
    }
    
    res.status(200).render("postPage", payload);
})

module.exports = router;