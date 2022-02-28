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
  
  var currentWord = 0;
  var currentLetterIndex = 0;

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
    var id = getInputId(wordIndex, letterIndex);
    var cssClass = $(id).attr('class');

    var returnValue = LETTER_STATE_UNSET;
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
    var returnValue = "";
    for (var i = 0; i < MAX_WORD_LENGTH; i++) {
      var id = getInputId(wordIndex, i);
      returnValue += $(id).text();
    }
    return returnValue;
  }

  // ==================================================
  // Builds a score array for the word in question based on the css

  function getMatches(wordIndex) {
    // TODO: Ensure word length is set properly
    var returnValue = [LETTER_STATE_UNSET, LETTER_STATE_UNSET, LETTER_STATE_UNSET, LETTER_STATE_UNSET, LETTER_STATE_UNSET];
    for (var i = 0; i < MAX_WORD_LENGTH; i++) {
      returnValue[i] = getInputState(wordIndex, i);
    }
    return returnValue;
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

    for (var i = 0; i < wordsToInclude; i++) {
      var id = getInputId(i, letterIndex);
      var letterInPosition = $(id).text();

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

    for (var i = 0; i < wordsToInclude; i++) {
      for (var j = 0; j < MAX_WORD_LENGTH; j++) {

        var id = getInputId(i, j);
        var letterInPosition = $(id).text();
        //console.log('letterInPosition [' + letterInPosition + ']');
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

    var id = getInputId(currentWord, currentLetterIndex);
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
    var id = getInputId(currentWord, currentLetterIndex);
    $(id).text('');
    $(id).attr('class', 'letter-input ' + CSSCLASS_LETTER_STATE_WHIFF);
  }

  // ==================================================
  // Validates and submits word(s)

  function processEnter() {
    if (currentWord === MAX_GUESSES) {
      return;
    }
    if (currentLetterIndex < MAX_WORD_LENGTH) {
      console.log('word is not long enough');
      return;
    }

    var request = buildRequest();

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
        clearCopy();
        for (var i = 0; i < dataX.suggestionsOfficial.length; i++) {
          //addWordGuess(dataX.suggestionsOfficial[i].word, true, dataX.letterStatuses);
          addWordGuess(dataX.suggestionsOfficial[i].word, true);
        }
        for (var i = 0; i < dataX.suggestionsAllowed.length; i++) {
          //addWordGuess(dataX.suggestionsAllowed[i].word, false, dataX.letterStatuses);
          addWordGuess(dataX.suggestionsAllowed[i].word, false);
        }
  
        currentWord++;
        currentLetterIndex = 0;
        activateWord(currentWord);
        setLetterStatuses(dataX.letterStatuses);
      }
    });
  }

  // ==================================================
  // Builds the json request object

  function buildRequest() {
    var returnValue = { guesses: [] };
    for (var i = 0; i <= currentWord; i++) {
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
    var id = getInputId(currentWord, letterIndex);

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
    if (letterIndex >= currentLetterIndex) {
      return;
    }

    var id = getInputId(currentWord, letterIndex);
    var inputState = getInputState(currentWord, letterIndex);
    var nextState = getNextLetterState(inputState);

    setLetterState(letterIndex, nextState);

    // Undo any text selection
    document.getSelection().removeAllRanges();
  }

  // ==================================================
  // Sets the current word

  function setWord(word) {
    currentLetterIndex = 0;
    for (var i = 0; i < word.length; i++) {
      processLetter(word[i].toUpperCase());
    }

    // Undo any text selection
    document.getSelection().removeAllRanges();
  }

  // ==================================================
  // Start over

  function reset() {
    for (var i = 0; i < 26; i++) {
      var id = getLetterId(i);
      $(id).attr('class', 'keyboard-letter');
    }
    currentWord = 0;
    currentLetterIndex = 0;
  
    for (var i = 0; i < MAX_GUESSES; i++) {
      for (var j = 0; j < MAX_WORD_LENGTH; j++) {
        var id = getInputId(i, j);
        $(id).text('');
        $(id).attr('class', 'letter-input ' + CSSCLASS_LETTER_STATE_DISABLED);
      }
    }

    activateWord(0);

    clearCopy();

    // TODO: pick the top 5-10 initial words to use
    addWordGuess('adieu', true);
    addWordGuess('aloud', true);
    addWordGuess('bayou', true);
    addWordGuess('raise', true);
    addWordGuess('storm', true);
    addWordGuess('trace', true);
  }
  
  // ==================================================
  // Clear suggestions

  function clearCopy() {
    $('#instructions-div').html('');
  }

  // ==================================================
  // Add a suggested word (letterStatuses)

  function addWordGuess(wordToAdd, isOfficial) {
    var currentHtml = $('#instructions-div').html();

    currentHtml += '<div style="clear: both;" onclick="setWord(\'' + wordToAdd + '\');">';

    for (var i = 0; i < wordToAdd.length; i++) {
      var letter = wordToAdd[i].toUpperCase();
      //var letterCode = wordToAdd.charCodeAt(i);
      //var status = -1;
      
      // if (letterStatuses) {
      //   status = letterStatuses[letterCode - ASCII_CODE_A];
      // }

      var cssClass = "guess-letter ";

      if (isOfficial) {
        cssClass += "guess-official ";
      }

      // // Toggle the tile if the letter is a near miss
      // let letterIsMiss = letterIsNearMissForPosition(letter, currentLetterIndex);
      // if (letterIsMiss) {
      //   setLetterState(currentLetterIndex, LETTER_STATE_NEAR_MISS);
      // }

      // // Toggle the tile if the letter is a hit
      // let letterIsHit = letterIsHitForPosition(letter, currentLetterIndex);
      // if (letterIsHit) {
      //   setLetterState(currentLetterIndex, LETTER_STATE_HIT);
      // }

      let letterIsMiss = letterIsNearMissForPosition(letter, i, true);
      let letterIsHit = letterIsHitForPosition(letter, i, true);

      if (letterIsMiss && !letterIsHit) {
        cssClass += CSSCLASS_LETTER_STATE_NEAR_MISS;
      }

      if (letterIsHit) {
          cssClass += CSSCLASS_LETTER_STATE_HIT;
      }

      // if (status === LETTER_STATE_WHIFF) {
      //   var cssClass = "guess-letter " + CSSCLASS_LETTER_STATE_WHIFF;
      // }
      // if (status === LETTER_STATE_NEAR_MISS) {
      //   var cssClass = "guess-letter " + CSSCLASS_LETTER_STATE_NEAR_MISS;
      // }
      // if (status === LETTER_STATE_HIT) {
      //   var cssClass = "guess-letter " + CSSCLASS_LETTER_STATE_HIT;
      // }

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
  
    for (var i = 0; i < MAX_WORD_LENGTH; i++) {
      var id = getInputId(wordIndex, i);
      $(id).attr('class', 'letter-input guess-whiff');
    }
  }

  // ==================================================
  // Sets the css class for the keyboard letters to indicate
  // hit/miss/whiff status from the AJAX response

  function setLetterStatuses(letterStatuses) {
    for (var i = 0; i < letterStatuses.length; i++) {
      if (letterStatuses[i] > -1) {
        var id = getLetterId(i);
        var cssClass = 'keyboard-letter keyboard-' + letterStatuses[i];
        $(id).attr('class', cssClass);
      }
    }
  }

  // ==================================================
  // Event handler for keyPress events

  function handleKeyPress(event) {
    var keyId = event.keyCode;
  
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
          var letter = String.fromCharCode(keyId);
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