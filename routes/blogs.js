const express = require("express");
const router = express.Router();
const blogRouter = require("../controllers/blogs");
const upload = require("multer")();
router.get("/", blogRouter.getAllBlogs);
router.post("/new", upload.single("img"), blogRouter.postNewBlog);
router.get("/:blogId", blogRouter.getBlogById);
router.put("/:blogId", blogRouter.putEditBlog);

module.exports = router;
