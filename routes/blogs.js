const express = require("express");
const router = express.Router();
const blogRouter = require("../controllers/blogs");
const upload = require("multer")();
const verifyToken = require("../middleware/verify-token");
router.get("/", blogRouter.getAllBlogs);
router.post("/new", verifyToken, upload.single("img"), blogRouter.postNewBlog);
router.post(
  "/editor-image-upload",
  upload.single("file"),
  blogRouter.uploadImage
);
router.get("/:blogId", blogRouter.getBlogById);
router.put("/:blogId", verifyToken, blogRouter.putEditBlog);
router.delete("/:blogId", verifyToken, blogRouter.deleteBlog);

module.exports = router;
