// s3 configs
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const BlogModel = require("../models/blog");
const s3Client = new S3Client({ region: process.env.AWS_REGION });
// rich text editor and date packages
const sanitizeHTML = require("sanitize-html");

///////////////////////////
// GET | All Blogs
///////////////////////////
const getAllBlogs = async (req, res) => {
  try {
    // finds all blogs except for those created by the admin
    let blogs = await BlogModel.find({}).sort({ createdAt: -1 });
console.log(blogs, ' <-- blogs from getAllBlogs')
    if (!blogs) {
      return res
        .status(404)
        .json({ error: "No blogs array was able to be found" });
    }
    if (blogs.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error retrieving user blogs:", err);
    res.status(500).json({ error: "An error occurred while retrieving blogs" });
  }
};

///////////////////////////
// GET | Show Blog
///////////////////////////
const getBlogById = async (req, res) => {
  const { blogId } = req.params;
  try {
    // populate owner username and profile image for all blogs when viewing single blog
    const selectedBlog = await BlogModel.findById(blogId);
    if (!selectedBlog) {
      return res.status(404).json({ error: "cannot find the selected blog" });
    }
    // turn to array for function to work properly

    res.status(200).json(selectedBlog);
  } catch (err) {
    res.status(500).json({ error: "Cannot retrieve blog" });
  }
};

///////////////////////////
// ? POST | New Blog
///////////////////////////
const postNewBlog = async (req, res) => {
  const { title, content, owner } = req.body;

  // Check for missing fields
  if (!title || !content) {
    return res.status(400).json({ error: "missing fields" });
  }

  // Sanitize the content
  const sanitizedContent = sanitize(content);

  // Check if a file is included in the request
  if (req.file) {
    // Generate the file path for S3 upload
    const filePath = `portfolio/blog-headers/${uuidv4()}-${title}-${
      req.file.originalname
    }`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filePath,
      Body: req.file.buffer,
    };
    // Initialize the S3 PutObjectCommand
    const command = new PutObjectCommand(params);
    try {
      // Upload the file to S3
      const data = await s3Client.send(command);
      // Create a new blog with the image
      const newBlog = await BlogModel.create({
        owner,
        title,
        content: sanitizedContent,
        img: `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`,
      });
      res.status(200).json({
        message: "Successfully created new blog | Image received",
        blog: newBlog,
      });
    } catch (err) {
      console.error("Error creating blog:", err);
      res.status(500).json({ error: "Unable to create new blog" });
    }
  } else {
    try {
      // Create a new blog without an image
      const newBlog = await BlogModel.create({
        owner,
        title,
        content: sanitizedContent,
      });
      res.status(200).json({
        message: "Successfully created new blog | No Image given",
        blog: newBlog,
      });
    } catch (err) {
      console.error("Error creating blog:", err);
      res.status(500).json({ error: "Unable to create new blog" });
    }
  }
};

///////////////////////////
// * PUT | Edit Blog
///////////////////////////
const putEditBlog = async (req, res) => {
  // params
  const { blogId } = req.params;
  const userId = req.user.user._id;
  // body
  let { title, content } = req.body;
  content = sanitize(content);
  // photo
  const { file } = req;

  try {
    // find the blog to update
    const blogToUpdate = await BlogModel.findById(blogId);
    if (!blogToUpdate) {
      return res.status(404).json({ error: "Cannot find blog to update" });
    }
    // check if user is authorized to edit this blog
    if (blogToUpdate.owner.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "user is not authorized to edit this blog" });
    }

    // check to see if the photo will be upgraded or not
    if (!file) {
      try {
        // if there is no file, then update the title and content then return the doc
        const updatedBlog = await BlogModel.findByIdAndUpdate(
          blogId,
          { title, content },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: "Successfully updated blog", blog: updatedBlog });
      } catch (err) {
        res.status(500).json({
          error:
            "Server issues trying to update document's title and content keys",
        });
      }
    } else {
      try {
        const filePath = `portfolio/blog-headers/${uuidv4()}-${title}-${
          file.originalname
        }`;
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: filePath,
          Body: file.buffer,
        };

        // Initialize the S3 PutObjectCommand
        const command = new PutObjectCommand(params);

        // Upload the file to S3
        const data = await s3Client.send(command);

        const updatedBlog = await BlogModel.findByIdAndUpdate(
          blogId,
          {
            title,
            content,
            img: `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`,
          },
          { new: true }
        );

        return res.status(200).json({
          message: "Successfully updated blog with new photo",
          blog: updatedBlog,
        });
      } catch (err) {
        console.error("Error updating blog:", err);
        res.status(500).json({
          error:
            "Unable to update blog document's img, title, and content keys",
        });
      }
      // Create the file path and parameters for S3 upload
    }
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Unable to update blog" });
  }
};

///////////////////////////
// ! DELETE | Delete Blog
///////////////////////////
const deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.user._id;

  try {
    const blogToDelete = await BlogModel.findById(blogId);
    if (!blogToDelete) {
      return res.status(404).json({ error: "cannot find blog to delete" });
    }
    // if the user who is trying to delete is not the owner of the blog then return
    if (blogToDelete.owner.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "You are not authorized to delete this blog" });
    }
    // otherwise, delete the blog
    await BlogModel.findByIdAndDelete(blogId);
    res
      .status(200)
      .json({ message: "blog successfully deleted", blog: blogToDelete });
  } catch (err) {
    console.error("Error deleting blog:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: `Cannot delete blog: ${err.message}` });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  postNewBlog,
  deleteBlog,
  putEditBlog,
};

// sanitize html
const sanitize = (content) => {
  const sanitizedContent = sanitizeHTML(content, {
    allowedTags: sanitizeHTML.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      "*": ["class", "style"], // Allow 'class' and 'style' on any tag
      ...sanitizeHTML.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height"],
    },
  });
  return sanitizedContent;
};
