const router = require("express").Router();
const sequelize = require("../config/connection");
const { Comment } = require("../models");
const withAuth = require("../../utils/auth");
