const router = require("express").Router();
const sequelize = require("../config/connection");
const { Blog, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      attributes: ["id", "title", "blogPost", "created_at"],
      where: { user_id: req.session.user_id },
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
    const blogPosts = blogData.map((Post) => Post.get({ plain: true }));

    res.render("dashboard", {
      blogPosts,
      logged_in: req.session.logged_in,
    });
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

    const blogPost = blogData.get({ plain: true });

    res.render("edit-post", {
      ...blogPost,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/new", (req, res) => {
  res.render("new-post");
});

module.exports = router;
