const LinkedList = require('../LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id });
  },

  getWord(db, language_id, word_id) {
    return db
      .from('word')
      .select(
        'original',
        'translation',
        'next')
      .where({language_id})
      .andWhere({word_id});
  },

  getHeadWord(db, language_id, head) {
    return db
      .from('word')
      .select(
        'word.original',
        'language.total_score',
        'word.correct_count',
        'word.incorrect_count'
      )
      .join('language', 'word.language_id', 'language.id')
      .where('word.language_id', language_id)
      .andWhere('word.id', head)
      .first();
  },

  getAllWordsWithHead(db, language_id) {
    return db
      .from('word')
      .select(
        'language.head',
        'word.id',
        'word.language_id',
        'word.original',
        'word.translation',
        'word.next',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count'
      )
      .join('language', 'word.language_id', 'language.id')
      .where('word.language_id', language_id);
  },

  createWordsList(db, language_id) {
    const wordList = new LinkedList();
    return LanguageService.getAllWordsWithHead(db, language_id)
      .then(wordArray => {
        // start with creating headWord using insertFirst method
        const headWord = wordArray.find(word => word.head === word.id);
        wordList.insertFirst(headWord); 
        // loop through and insert after word where currWord.next eqls word.id
        // wordArray.forEach(word => wordList.insertLast(word))
        return wordList;
      });
  },
  
};

module.exports = LanguageService
