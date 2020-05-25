"use strict";

const express = require("express");
const router = express.Router();
const authRoute = require("../../user/auth/route/api");

/*
 * authentication api
 */
router.use("/auth", authRoute);

module.exports = router;
