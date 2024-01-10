const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    id: String,
    description: String
})

const QuestionModel = mongoose.model("Question", QuestionSchema, "Question")
module.exports = QuestionModel;