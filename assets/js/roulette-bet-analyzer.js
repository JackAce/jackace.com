//<![CDATA[
var indexes = ['0', '00', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36']

$(document).ready(function() {
    addEventHandlers();
    updateUi();
});

function clearAll() {
    $('input').each(function() {
    if (this.type === 'text') {
        this.value = '';
    }
    });
    
    updateUi();
}

function dismissWarning(id) {
    $(id).attr('class', 'hiddenRow');
}

function addEventHandlers() {
    $(document).on('change', 'input', updateUi);
}

function updateUi() {
    var totalBet = 0;
    var equityTable = [];
    var totalNumbersCovered = 0;
    
    var showBasketBetWarning = false;
    var show36NumberBetWarning = false;
    var basketBet = 0;

    $('#warningBasketBetRow').attr('class', 'hiddenRow');
    $('#warning36NumbersBetRow').attr('class', 'hiddenRow');

    // Loop through all inputs
    $('input').each(function() {
    var currentBet = parseBet(this);
    
    if (currentBet.amount > 0) {
        totalBet += currentBet.amount
        
        for (var i = 0; i < currentBet.coveredNumbers.length; i++) {
            var currentNumber = currentBet.coveredNumbers[i];
            if (!equityTable[currentNumber]) {
                equityTable[currentNumber] = 0.0;
                totalNumbersCovered++;
            }
            //var currentEquity = parseFloat(equityTable[currentNumber]);

            if (currentBet.numberCount === 5) {
                // You get short changed on the 5-number bet
                showBasketBetWarning = true;
                basketBet = currentBet.amount;
                equityTable[currentNumber] += currentBet.amount * 35.0/180.0;
            }
            else {
                equityTable[currentNumber] += currentBet.amount / currentBet.numberCount;
            }
        }
    }
    });
    
    show36NumberBetWarning = totalNumbersCovered > 35;
    
    if (showBasketBetWarning) {
        $('#warningBasketBetRow').attr('class', '');
    }
    if (show36NumberBetWarning) {
        var allEquity = [];
        for (var key in equityTable) {
            allEquity.push({
                number: key,
                amount: equityTable[key]
            });
        }

        // sort ascending (lowest first)
        allEquity.sort(function(a, b) {
            if (a.amount !== b.amount) {
                return a.amount - b.amount;
            }

            if (a.number === '0' || a.number === '00') {
                return -1;
            }

            if (b.number === '0' || b.number === '00') {
                return 1;
            }

            return a.number - b.number;
        });

        $('#equityToRemoveFor36Div').attr('class', 'divHidden');
        $('#equityToRemoveFor37Div').attr('class', 'divHidden');
        $('#equityToRemoveFor38Div').attr('class', 'divHidden');
        $('#removeEverythingDiv').attr('class', 'divHidden');
        $('.totalEquityToRemove').text('');
        $('.totalEquityToKeep37').text('');
        $('.totalEquityToKeep38').text('');
        $('.numberToKeep37').text('');
        $('.numberToKeep38').text('');

        if (totalNumbersCovered === 36) {
            // TODO: Check to see whether we can remove ALL bets!
            if (allEquity[0].amount < allEquity[35].amount) {
                $('#equityToRemoveFor36Div').attr('class', null);
                $('.totalEquityToRemove').text(formatDecimal(allEquity[0].amount));
            } else {
                $('#removeEverythingDiv').attr('class', null);
            }
        }
        else if (totalNumbersCovered === 37) {
            if (allEquity[0].amount < allEquity[36].amount) {
                $('#equityToRemoveFor37Div').attr('class', null);
                $('.totalEquityToRemove').text(formatDecimal(allEquity[1].amount));
                $('.totalEquityToKeep37').text(formatDecimal(allEquity[0].amount));
                $('.numberToKeep37').text(allEquity[0].number);
            } else {
                $('#removeEverythingDiv').attr('class', null);
            }
        }
        else if (totalNumbersCovered === 38) {
            if (allEquity[0].amount < allEquity[37].amount) {
                $('#equityToRemoveFor38Div').attr('class', null);
                $('.totalEquityToRemove').text(formatDecimal(allEquity[2].amount));
                $('.totalEquityToKeep37').text(formatDecimal(allEquity[0].amount));
                $('.numberToKeep37').text(allEquity[0].number);
                $('.totalEquityToKeep38').text(formatDecimal(allEquity[1].amount));
                $('.numberToKeep38').text(allEquity[1].number);
            } else {
                $('#removeEverythingDiv').attr('class', null);
            }
        }

        //console.log(allEquity);

        $('#totalNumbersBetSpan').text(totalNumbersCovered);
        $('#warning36NumbersBetRow').attr('class', '');
    }

    for (var i = 0; i < 38; i++) {
    // Clear out equity divs
    $('#eq-' + indexes[i]).text('');

    // Set win divs
    if (totalBet > 0) {
        $('#win-' + indexes[i]).text(-totalBet);
        $('#win-' + indexes[i]).attr('class', 'amt-neg');
    }
    else {
        $('#win-' + indexes[i]).text('');
        $('#win-' + indexes[i]).attr('class', '');
    }
    }

    for (const [key, value] of Object.entries(equityTable)) {
    var truncatedValue = value.toFixed(2);
    $('#eq-' + key).text(truncatedValue);
    }

    for (const [key, value] of Object.entries(equityTable)) {
        var win = ((36 * value) - totalBet).toFixed(2);
        var winText = formatDecimal(win);

        $('#win-' + key).text(winText);
        
        if (win > 0) {
            $('#win-' + key).attr('class', 'amt-pos');
        }
        else if (win < 0) {
            //console.log('key: ' + key);
            $('#win-' + key).attr('class', 'amt-neg');
        }
        else {
            $('#win-' + key).attr('class', 'amt-0');
        }
    }

    $('#totalAmountBetDiv').text(totalBet);

    if (!showBasketBetWarning) {
        // Simple calculation of house advantage
        $('#totalExpectedValueDiv').text((- totalBet * 0.0526).toFixed(2));
    } else {
        // Complicated calculation because of 5-number bet
        var otherBets = totalBet - basketBet;
        var totalLoss = 0.0526 * otherBets + 0.0789 * basketBet;
        $('#totalExpectedValueDiv').text((-totalLoss).toFixed(2));
    }
}

function fixBets() {
    
}

function parseBet(inputElement) {
    var parts = inputElement.id.split("-");
    var numberCount = getNumberCount(parts[1]);
    var payout = getPayout(parts[1]);
    var coveredNumbers = getCoveredNumbers(parts[1], parts[2]);
    // TODO: validate that the value is an integer
    //var amount = parseInt(inputElement.value);
    var amount = parseFloat(inputElement.value);
    
    return {
        identifier: parts[2],
        numberCount: numberCount,
        payout: payout,
        coveredNumbers: coveredNumbers,
        amount: amount
    }
}

function getNumberCount(xType) {
    return parseInt(xType.substring(1));
}

function getPayout(xType) {
    switch (xType) {
    case 'x1':
        return 35;
    case 'x2':
        return 17;
    case 'x3':
        return 11;
    case 'x4':
        return 8;
    case 'x5':
        return 6;
    case 'x6':
        return 5;
    case 'x12':
        return 2;
    case 'x18':
        return 1;
    }
    
    return 0;
}

function getCoveredNumbers(xType, identifier) {
    var parsedValue = parseInt(identifier);
    switch (xType) {
    case 'x1':
        return [identifier];
    case 'x2':
        return identifier.split('_');
    case 'x3':
        return [(parsedValue).toString(), (parsedValue + 1).toString(), (parsedValue + 2).toString()];
    case 'x4':
        return [(parsedValue).toString(), (parsedValue + 1).toString(), (parsedValue + 3).toString(), (parsedValue + 4).toString() ];
    case 'x5':
        return ['0', '00', '1', '2', '3'];
    case 'x6':
        return [(parsedValue).toString(), (parsedValue + 1).toString(), (parsedValue + 2).toString(), (parsedValue + 3).toString(), (parsedValue + 4).toString() , (parsedValue + 5).toString() ];
    case 'x12':
        return getCoveredNumbersX12(identifier);
    case 'x18':
        return getCoveredNumbersX18(identifier);
    }
    
    return [];
}

function getCoveredNumbersX12(identifier) {
    switch (identifier) {
    case 'd1':
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    case 'd2':
        return ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
    case 'd3':
        return ['25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];
    case 'c1':
        return ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28', '31', '34'];
    case 'c2':
        return ['2', '5', '8', '11', '14', '17', '20', '23', '26', '29', '32', '35'];
    case 'c3':
        return ['3', '6', '9', '12', '15', '18', '21', '24', '27', '30', '33', '36'];
    }
    
    return [];
}

function getCoveredNumbersX18(identifier) {
    switch (identifier) {
    case 'h1':
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
    case 'h2':
        return ['19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];
    case 'even':
        return ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36'];
    case 'odd':
        return ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31', '33', '35'];
    case 'red':
        return ['1', '3', '5', '7', '9', '12', '14', '16', '18', '19', '21', '23', '25', '27', '30', '32', '34', '36'];
    case 'black':
        return ['2', '4', '6', '8', '10', '11', '13', '15', '17', '20', '22', '24', '26', '28', '29', '31', '33', '35'];
    }
    
    return [];
}

function formatDecimal(value) {
    value = parseFloat(value);
    value = value.toFixed(2);
    var returnValue = value.toString();

    if (returnValue.indexOf('.00') > -1) {
        // Truncate anything with zero cents
        returnValue = returnValue.replace('.00', '');
    }

    return returnValue;
}

// ]]>