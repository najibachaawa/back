"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const authService = require("../service/authService");
const upload = require("../../../base/service/upload");

router.post("/signup", upload.single("userImage"), (req, res, next) => {
  authService.signup(req.body, req.file).then(
    (data) => {
      return res.send(data);
    },
    (err) => next(err)
  );
});

router.post("/login", (req, res, next) => {
  authService.login(req.body).then(
    (data) => {
      return res.send(data);
    },
    (err) => next(err)
  );
});

module.exports = router;
