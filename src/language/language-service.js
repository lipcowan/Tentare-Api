const LinkedList = require("../LinkedList");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },

  getWord(db, language_id, word_id) {
    return db
      .from("word")
      .select("original", "translation", "next")
      .where({ language_id })
      .andWhere({ word_id });
  },

  getHeadWord(db, language_id, head) {
    return db
      .from("word")
      .select(
        "word.original",
        "language.total_score",
        "word.correct_count",
        "word.incorrect_count"
      )
      .join("language", "word.language_id", "language.id")
      .where("word.language_id", language_id)
      .andWhere("word.id", head)
      .first();
  },

  getAllWordsWithHead(db, language_id) {
    return db
      .from("word")
      .select(
        "language.head",
        "word.id",
        "word.language_id",
        "word.original",
        "word.translation",
        "word.next",
        "word.memory_value",
        "word.correct_count",
        "word.incorrect_count"
      )
      .join("language", "word.language_id", "language.id")
      .where("word.language_id", language_id);
  },

  createWordsList(db, language_id) {
    const wordList = new LinkedList();
    return LanguageService.getAllWordsWithHead(db, language_id).then(
      (wordArray) => {
        // start with creating headWord using insertFirst method
        const headWord = wordArray.find((word) => word.head === word.id);
        wordList.insertFirst(headWord);
        this.addNextWordtoList(wordArray, headWord, wordList);
        // loop through and insert after word where currWord.next eqls word.id
        // wordArray.forEach(word => wordList.insertLast(word))
        return wordList;
      }
    );
  },

  addNextWordtoList(wordArray, curWord, wordList) {
    if (curWord.next === null) {
      return wordList;
    }
    const nextWord = wordArray.find((word) => curWord.next === word.id);
    wordList.insertLast(nextWord);
    return this.addNextWordtoList(wordArray, nextWord, wordList);
  },

  updateWord(db, fields, id) {
    return db.from("word").update(fields).where({ id });
  },

  async updateWordList(db, wordList, totalScore, language_id) {
    await db
      .from("language")
      .update({
        total_score: totalScore,
        head: wordList.head.value.id,
      })
      .where("id", language_id);

    let currNode = wordList.head;
    while (currNode) {
      let { id, memory_value, correct_count, incorrect_count } = currNode.value;
      let next = null;
      if (currNode.next) {
        next = currNode.next.value.id;
      }
      let fields = { memory_value, correct_count, incorrect_count, next };
      await this.updateWord(db, fields, id);
      currNode = currNode.next;
    }
  },
};

module.exports = LanguageService;
