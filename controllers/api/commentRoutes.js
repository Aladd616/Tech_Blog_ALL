const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Comment } = require("../../models/Comment");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      attributes: [
        "id",
        "comment_post",
        "user_id",
        "blogPost_id",
        "created_at",
      ],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const commentData = await Comment.findOne({
      attributes: [
        "id",
        "comment_post",
        "user_id",
        "blogPost_id",
        "created_at",
      ],
      where: { id: req.params.id },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    if (!commentData) {
      res.status(404).json({ message: "No Comment found with this id!" });
      return;
    }
    res.json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const commentData = await Comment.create({
      comment_post: req.body.comment_post,
      user_id: req.session.user_id,
      blogPost_id: req.body.blogPost_id,
    });

    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const commentData = await Comment.update(
      {
        comment_post: req.body.comment_post,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!commentData) {
      res.status(404).json({ message: "No comment found with this id!" });
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!commentData) {
      res.status(404).json({ message: "No comment found with this id!" });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
