const express = require("express")
const app = express()
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const imageModelService = require("../services/imageModel")


module.exports = router