// <![CDATA[
  const MAX_GUESSES = 6;
  const MAX_WORD_LENGTH = 5;

  const ASCII_CODE_A = 97;
  const ASCII_CODE_Z = 132;

  const KEY_CODE_BACKSPACE = 8;
  const KEY_CODE_DELETE = 46;
  const KEY_CODE_ENTER = 13;
  const KEY_CODE_ESCAPE = 27;
  const KEY_CODE_A = 65;
  const KEY_CODE_Z = 90;

  const LETTER_STATE_UNSET = -1;
  const LETTER_STATE_WHIFF = 0;
  const LETTER_STATE_NEAR_MISS = 1;
  const LETTER_STATE_HIT = 2;

  const ASCII_CODE_ENTER = 13;

  const CSSCLASS_LETTER_STATE_DISABLED = "guess-disabled";
  const CSSCLASS_LETTER_STATE_WHIFF = "guess-whiff";
  const CSSCLASS_LETTER_STATE_NEAR_MISS = "guess-near-miss";
  const CSSCLASS_LETTER_STATE_HIT = "guess-hit";
  
  let currentWord = 0;
  let currentLetterIndex = 0;

  // ==================================================
  // Convenience function for getting the keyboard letter id

  function getLetterId(letterIndex) {
    return '#keyboard-letter-' + String.fromCharCode(ASCII_CODE_A + letterIndex);
  }

  // ==================================================
  // Convenience function for getting the input id

  function getInputId(wordIndex, letterIndex) {
    return '#layout-letter-' + wordIndex + '-' + letterIndex;
  }

  // ==================================================
  // Returns the score for a letter

  function getInputState(wordIndex, letterIndex) {
    let id = getInputId(wordIndex, letterIndex);
    let cssClass = $(id).attr('class');

    let returnValue = LETTER_STATE_UNSET;
    if (cssClass.indexOf(CSSCLASS_LETTER_STATE_HIT) > -1) {
      returnValue = LETTER_STATE_HIT;
    }
    else if (cssClass.indexOf(CSSCLASS_LETTER_STATE_NEAR_MISS) > -1) {
      returnValue = LETTER_STATE_NEAR_MISS;
    }
    else if (cssClass.indexOf(CSSCLASS_LETTER_STATE_WHIFF) > -1) {
      returnValue = LETTER_STATE_WHIFF;
    }
    return returnValue;
  }

  // ==================================================
  // Gets the word for the guess index

  function getWord(wordIndex) {
    let returnValue = "";
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      let id = getInputId(wordIndex, i);
      returnValue += $(id).text();
    }
    return returnValue;
  }

  // ==================================================
  // Builds a score array for the word in question based on the css

  function getMatches(wordIndex) {
    // TODO: Ensure word length is set properly
    let returnValue = [LETTER_STATE_UNSET, LETTER_STATE_UNSET, LETTER_STATE_UNSET, LETTER_STATE_UNSET, LETTER_STATE_UNSET];
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      returnValue[i] = getInputState(wordIndex, i);
    }
    return returnValue;
  }

  // ==================================================
  // Checks to see if the user is submitting a solved wordle
  // TODO: Make sure it's consistent?

  function wordleIsSolved() {
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      if (getInputState(currentWord, i) !== LETTER_STATE_HIT) {
        return false;
      }
    }
    return true;
  }

  // ==================================================
  // Mark WORDLE as solved

  function setSolvedState() {
    displayMessage('Congratulations! Solved in ' + (currentWord + 1) + ' guesses!');
    clearCopy();
    let word = getWord(currentWord);
    addWordGuess(word, true);
    // Disable clicking/entering
    currentWord = MAX_GUESSES;
  }

  // ==================================================
  // Reset current word

  function resetCurrentWord() {
    let timesToBackspace = currentLetterIndex;
    for (let i = 0; i < timesToBackspace; i++) {
      processDelete();
    }
  }

  // ==================================================
  // Cycles through the 3 letter states
  // WHIFF -> NEAR MISS -> HIT -> WHIFF

  function getNextLetterState(currentState) {
    if (currentState === LETTER_STATE_UNSET) {
      return LETTER_STATE_NEAR_MISS;
    }

    let returnValue = currentState + 1;
    if (returnValue > LETTER_STATE_HIT) {
      returnValue = LETTER_STATE_WHIFF;
    }

    return returnValue;
  }

  // ==================================================
  // Is the specified letter a direct hit?

  function letterIsHitForPosition(letter, letterIndex, includeCurrentWord) {
    let wordsToInclude = currentWord;
    if (includeCurrentWord) {
      wordsToInclude++;
    }

    for (let i = 0; i < wordsToInclude; i++) {
      let id = getInputId(i, letterIndex);
      let letterInPosition = $(id).text();

      if (letterInPosition === letter) {
        const letterState = getInputState(i, letterIndex);

        if (letterState == LETTER_STATE_HIT) {
          return true;
        }
      }
    }

    return false;
  }

  // ==================================================
  // Is the specified letter a near miss?

  function letterIsNearMissForPosition(letter, letterIndex, includeCurrentWord) {
    let wordsToInclude = currentWord;
    if (includeCurrentWord) {
      wordsToInclude++;
    }

    for (let i = 0; i < wordsToInclude; i++) {
      for (let j = 0; j < MAX_WORD_LENGTH; j++) {

        let id = getInputId(i, j);
        let letterInPosition = $(id).text();
        if (letterInPosition === letter) {
          const letterState = getInputState(i, j);

          if (letterState == LETTER_STATE_NEAR_MISS) {
            if (j === letterIndex) {
              // THIS MEANS THE LETTER CANNOT BE IN THIS POSITION!!
              return false;
              // TODO: THIS SHOULD COLOR THE TILE RED
            }
  
            return true;
          }
        }
      }
    }

    return false;
  }

  // ==================================================
  // Inserts a letter at the cursor

  function processLetter(letter) {
    if (currentWord === MAX_GUESSES) {
      return;
    }
    if (currentLetterIndex === MAX_WORD_LENGTH) {
      return;
    }

    let id = getInputId(currentWord, currentLetterIndex);
    $(id).text(letter);

    // Toggle the tile if the letter is a near miss
    let letterIsMiss = letterIsNearMissForPosition(letter, currentLetterIndex, false);
    if (letterIsMiss) {
      setLetterState(currentLetterIndex, LETTER_STATE_NEAR_MISS);
    }

    // Toggle the tile if the letter is a hit
    let letterIsHit = letterIsHitForPosition(letter, currentLetterIndex, false);
    if (letterIsHit) {
      setLetterState(currentLetterIndex, LETTER_STATE_HIT);
    }

    currentLetterIndex++;
  }

  // ==================================================
  // Handles the press of delete/backspace

  function processDelete() {
    if (currentWord === MAX_GUESSES) {
      return;
    }
    if (currentLetterIndex === 0) {
      return;
    }

    currentLetterIndex--;
    let id = getInputId(currentWord, currentLetterIndex);
    $(id).text('');
    $(id).attr('class', 'letter-input ' + CSSCLASS_LETTER_STATE_WHIFF);
  }

  function processAjaxResponse(response) {
    clearCopy();

    let totalSuggestions = response.suggestionsOfficial.length + response.suggestionsAllowed.length;

    if (totalSuggestions === 0) {
      displayError('No suggestions found');
      return;
    }

    for (let i = 0; i < response.suggestionsOfficial.length; i++) {
      addWordGuess(response.suggestionsOfficial[i].word, true);
    }
    for (let i = 0; i < response.suggestionsAllowed.length; i++) {
      addWordGuess(response.suggestionsAllowed[i].word, false);
    }

    currentWord++;
    currentLetterIndex = 0;
    activateWord(currentWord);
    setLetterStatuses(response.letterStatuses);
  }

  // ==================================================
  // Validates and submits word(s)

  function processEnter() {
    dismissMessage();
    if (currentWord === MAX_GUESSES) {
      return;
    }
    if (currentLetterIndex < MAX_WORD_LENGTH) {
      console.log('word is not long enough');
      return;
    }

    if (wordleIsSolved()) {
      setSolvedState();
      return;
    }

    let request = buildRequest();

    $.ajax({
      url: "https://jackace-wordle-solver.herokuapp.com/wordle",
      //url: "http://18.212.115.147:3000/wordle",
      //url: "http://localhost:3000/wordle",
      type: "POST",
      data: JSON.stringify(request),
      dataType: "json",
      contentType: "application/json",
      beforeSend: function(x) {
        if (x && x.overrideMimeType) {
          x.overrideMimeType("application/json");
        }
      },
      success: function(dataX) {
        processAjaxResponse(dataX);
      },
      error: function(err) {
        displayError('There was an error with your request.');
        console.log(err);
      }
    });
  }

  // ==================================================
  // Builds the json request object

  function buildRequest() {
    let returnValue = { guesses: [] };
    for (let i = 0; i <= currentWord; i++) {
      returnValue.guesses[i] = {
        word: getWord(i),
        matches: getMatches(i)
      }
    }
    return returnValue;
  }

  // ==================================================
  // Set the letter state for the current word

  function setLetterState(letterIndex, letterState) {
    let id = getInputId(currentWord, letterIndex);

    if (letterState === LETTER_STATE_WHIFF) {
      $(id).attr('class', 'letter-input ' + CSSCLASS_LETTER_STATE_WHIFF);
    }
    else if (letterState === LETTER_STATE_NEAR_MISS) {
      $(id).attr('class', 'letter-input ' + CSSCLASS_LETTER_STATE_NEAR_MISS);
    }
    else if (letterState === LETTER_STATE_HIT) {
      $(id).attr('class', 'letter-input ' + CSSCLASS_LETTER_STATE_HIT);
    }
  }

  // ==================================================
  // Cycle a letter beween whiff/miss/hit for the current word

  function toggleLetterState(letterIndex) {
    // Out of guesses or wordle solved
    if (currentWord === MAX_GUESSES) {
      return;
    }

    // Current word completed
    if (letterIndex >= currentLetterIndex) {
      return;
    }

    let id = getInputId(currentWord, letterIndex);
    let inputState = getInputState(currentWord, letterIndex);
    let nextState = getNextLetterState(inputState);

    setLetterState(letterIndex, nextState);

    // Undo any text selection
    document.getSelection().removeAllRanges();
  }

  // ==================================================
  // Sets the current word

  function setWord(word) {
    resetCurrentWord();
    for (let i = 0; i < word.length; i++) {
      processLetter(word[i].toUpperCase());
    }

    // Undo any text selection
    document.getSelection().removeAllRanges();
  }

  // ==================================================
  // Display message

  function displayMessage(message) {
    $('#message-div').text(message);
    $('#message-div').attr('class', 'message');
  }

  // ==================================================
  // Display error

  function displayError(message) {
    $('#message-div').text(message);
    $('#message-div').attr('class', 'message message-error');
  }

  // ==================================================
  // Dismiss error

  function dismissMessage() {
    $('#message-div').text('');
    $('#message-div').attr('class', 'hidden');
  }

  // ==================================================
  // Start over

  function reset() {
    dismissMessage();
    for (let i = 0; i < 26; i++) {
      let id = getLetterId(i);
      $(id).attr('class', 'keyboard-letter');
    }
    currentWord = 0;
    currentLetterIndex = 0;
  
    for (let i = 0; i < MAX_GUESSES; i++) {
      for (let j = 0; j < MAX_WORD_LENGTH; j++) {
        let id = getInputId(i, j);
        $(id).text('');
        $(id).attr('class', 'letter-input ' + CSSCLASS_LETTER_STATE_DISABLED);
      }
    }

    activateWord(0);

    clearCopy();

    // Hard coded list to save an ajax call
    addWordGuess('aisle', true);
    addWordGuess('arose', true);
    addWordGuess('bayou', true);
    addWordGuess('opera', true);
    addWordGuess('raise', true);
    addWordGuess('trace', true);
    addWordGuess('adieu', false);
  }
  
  // ==================================================
  // Clear suggestions

  function clearCopy() {
    $('#instructions-div').html('');
  }

  // ==================================================
  // Add a suggested word (letterStatuses)

  function addWordGuess(wordToAdd, isOfficial) {
    let currentHtml = $('#instructions-div').html();

    currentHtml += '<div style="clear: both;" onclick="setWord(\'' + wordToAdd + '\');">';

    for (let i = 0; i < wordToAdd.length; i++) {
      let letter = wordToAdd[i].toUpperCase();

      let cssClass = "guess-letter ";

      if (isOfficial) {
        cssClass += "guess-official ";
      }

      let letterIsMiss = letterIsNearMissForPosition(letter, i, true);
      let letterIsHit = letterIsHitForPosition(letter, i, true);

      if (letterIsMiss && !letterIsHit) {
        cssClass += CSSCLASS_LETTER_STATE_NEAR_MISS;
      }

      if (letterIsHit) {
          cssClass += CSSCLASS_LETTER_STATE_HIT;
      }

      currentHtml += '<span class="' + cssClass + '">';
      currentHtml += letter;
      currentHtml += '</span>';
    }
    currentHtml += '</div>';

    $('#instructions-div').html(currentHtml);
  }

  // ==================================================
  // Activate a guess row

  function activateWord(wordIndex) {
    currentLetterIndex = 0;
    currentWord = wordIndex;
  
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      let id = getInputId(wordIndex, i);
      $(id).attr('class', 'letter-input guess-whiff');
    }
  }

  // ==================================================
  // Sets the css class for the keyboard letters to indicate
  // hit/miss/whiff status from the AJAX response

  function setLetterStatuses(letterStatuses) {
    for (let i = 0; i < letterStatuses.length; i++) {
      if (letterStatuses[i] > -1) {
        let id = getLetterId(i);
        let cssClass = 'keyboard-letter keyboard-' + letterStatuses[i];
        $(id).attr('class', cssClass);
      }
    }
  }

  // ==================================================
  // Event handler for keyPress events

  function handleKeyPress(event) {
    let keyId = event.keyCode;
  
    if (keyId === KEY_CODE_BACKSPACE
      || keyId === KEY_CODE_DELETE
      || keyId === KEY_CODE_ENTER
      || keyId === KEY_CODE_ESCAPE
      || (keyId >= KEY_CODE_A && keyId <= KEY_CODE_Z)) {

      switch (keyId) {
        case KEY_CODE_BACKSPACE:
        case KEY_CODE_DELETE:
          processDelete();
          break;
        case KEY_CODE_ENTER:
          processEnter();
          break;
        case KEY_CODE_ESCAPE:
          reset();
          break;
        default:
          let letter = String.fromCharCode(keyId);
          processLetter(letter);
          break;
      }
    }
  }

  $(document).ready(function() {
    document.addEventListener("keydown", handleKeyPress);
    reset();
});
// ]]>