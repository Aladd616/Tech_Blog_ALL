const router = require("express").Router();
const sequelize = require("../config/connection");
const { Blog, User, Comment } = require("../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      attributes: [
        "id",
        "title",
        "blogPost",
        "user-id",
        "comment_id",
        "created_at",
      ],
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_post", "user_id", "blogPost_id"],
          include: {
            model: User,
            attributes: ["name"],
          },
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    (blogData) => res.json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findOne({
      attributes: ["id", "title", "blogPost", "created_at"],
      where: { id: req.params.id },
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_post", "user_id", "blogPost_id"],
          include: {
            model: User,
            attributes: ["name"],
          },
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    if (!blogData) {
      res.status(404).json({ message: "No blog post found with this id!" });
      return;
    }
    res.json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const blogData = await Blog.create({
      title: req.body.title,
      blogPost: req.body.blogPost,
      user_id: req.session.user_id,
    });

    res.status(200).json(blogData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const blogData = await Blog.update(
      {
        title: req.body.title,
        blogPost: req.body.blogPost,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!blogData) {
      res.status(404).json({ message: "No blog post found with this id!" });
      return;
    }
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: "No blog post found with this id!" });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
