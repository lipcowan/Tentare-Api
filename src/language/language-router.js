const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");
const LinkedList = require("../LinkedList");

const languageRouter = express.Router();
const jsonBodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/", async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/head", async (req, res, next) => {
  try {
    const headWord = await LanguageService.getHeadWord(
      req.app.get("db"),
      req.language.id,
      req.language.head
    );

    const resHeadWord = {
      nextWord: headWord.original,
      totalScore: headWord.totalScore,
      wordCorrectCount: headWord.correct_count,
      wordIncorrecttCount: headWord.incorrect_count,
    };

    res.json(resHeadWord);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post("/guess", jsonBodyParser, async (req, res, next) => {
  // implement me
  const { guess } = req.body;
  if (!guess) {
    return res.status(400).json({
      error: `Missing 'guess' in request body`,
    });
  }
  try {
    const words = await LanguageService.createWordsList(
      req.app.get("db"),
      req.language.id
    );
    //find start of word list
    let headWord = words.head.value;
    let nextWord = words.head.next.value;
    let totalScore = req.language.total_score;

    let isCorrect = false;
    if (guess === headWord.translation) {
      isCorrect = true;
      totalScore++;
    }
    const wordsList = gradeWord(words, isCorrect);
    LanguageService.updateWordList(
      req.app.get("db"),
      wordsList,
      totalScore,
      req.language.id
    );
    res.json({
      nextWord: nextWord.original,
      totalScore: totalScore,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
      answer: headWord.translation,
      isCorrect: isCorrect,
    });
  } catch (error) {
    next(error);
  }
});

//need an M value starting at 1.
//Need to double the value of M when the answer is correct.
//When the answer is incorrect, we are setting M to 1.
//Regardless of what M is, we are moving value back M amount of spaces.
//Incorrect count ++ and correct count ++
//Reset the head word. Insert at the M value.

function gradeWord(words, answer) {
  const headWord = words.head.value;
  let mValue = headWord.memory_value;
  words.remove(headWord);
  if (!answer) {
    mValue = 1;
    headWord.incorrect_count++;
  } else {
    mValue *= 2;
    headWord.correct_count++;
  }
  headWord.memory_value = mValue;
  words.LinkedList(headWord, mValue);
  return words;
}

module.exports = languageRouter;
