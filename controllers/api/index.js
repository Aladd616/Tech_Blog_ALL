const router = require("express").Router();

const userRoutes = require("./userRoutes.js");
const blogRoutes = require("./blogRoutes.js");
const commentRoutes = require("./commentRoutes.js");

router.use("/users", userRoutes);
router.use("/blog", blogRoutes);
router.use("/comments", commentRoutes);

apiRoutes.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
