const userDao = require("../dao/user.dao");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const commentsModel = require("../models/comments.model");
const { StatusCodes } = require("http-status-codes");

class commentsController {
  async addComment(req, res) {
    try {
      const { topic, content } = req.body;
      const userId = req.params.userId;

      const comment = new commentsModel({
        topic,
        content,
        userId
      });
      await comment.save();
      console.log("added");
      return res.status(StatusCodes.CREATED).json("added")
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
  async commentslist(req, res, next) {
  

    const result = await commentsModel.find().populate('userId').exec()
    return res.status(StatusCodes.OK).json(result)
  }
  async deletecomment(req, res, next) {
    commentsModel.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data,
        });
      }
    });
  }
  async updatecomment(req, res, next) {
    commentsModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      (error, data) => {
        if (error) {
          return next(error);
        } else {
          res.json(data);
          console.log("Comment updated successfully !");
        }
      }
    );
  }
}

module.exports = new commentsController();