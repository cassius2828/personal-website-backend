const express = require("express");
const router = express.Router();
const blogRouter = require("../controllers/blogs");

router.get("/", blogRouter.getAllBlogs);
router.get("/:blogId", blogRouter.getBlogById);
router.post("/new", blogRouter.postNewBlog);

module.exports = router;
