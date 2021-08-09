const router = require("express").Router();
const sequelize = require("../config/connection");
const { Blog, User, Comment } = require("../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      attributes: ["id", "title", "blogPost", "created_at"],
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

    res.render("homepage", {
      blogPosts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const blogData = await Blog.findOne({
      attributes: ["id", "title", "blogPost", "created_at"],
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

    res.render("blogPost", {
      ...blogPost,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");

  router.get("/signup", (req, res) => {
    res.render("signup");
  });
});

module.exports = router;
