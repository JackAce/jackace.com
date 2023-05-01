//<![CDATA[
let indexes = ['0', '00', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36']

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

function doubleUp() {
    $('input').each(function() {
        if (this.type === 'text' && this.value) {
            let currentValue = parseFloat(this.value);
            this.value = currentValue * 2;
        }
    });
    
    updateUi();
}

function increment(value) {
    $('input').each(function() {
        if (this.type === 'text' && this.value) {
            let currentValue = parseFloat(this.value);
            this.value = currentValue + value;
        }
    });
    
    updateUi();
}

function distribute(amountToSubtract) {
    let straightUpAmounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const currentWheelType = getCurrentWheelType();
    for (let i = 0; i < indexes.length; i++) {
        let bet = $('#eq-' + indexes[i]).text();
        if (bet) {
            straightUpAmounts[i] = parseFloat(bet);
        }
    }

    clearAll();

    if (amountToSubtract) {
        for (let i = 0; i < indexes.length; i++) {
            if (straightUpAmounts[i] > 0) {
                straightUpAmounts[i] = formatDecimal(straightUpAmounts[i] - amountToSubtract);
            }
        }
    }
    
    for (let i = 0; i < indexes.length; i++) {
        if (straightUpAmounts[i] > 0) {
            if (currentWheelType === '0' && indexes[i] === '0') {
                $('#b-x1-0-single').val(formatDecimal(straightUpAmounts[i]));
            } else {
                $('#b-x1-' + indexes[i]).val(formatDecimal(straightUpAmounts[i]));
            }
        }
    }

    updateUi();
}

function setWheelType(wheelType) {
    let nextWheelType = '00';

    if (wheelType === '0') {
        $('#singleZero0InputCell').attr('class', 'spot-green');
        $('#doubleZero0InputCell').attr('class', 'spot-green double-zero-removed');
        $('#doubleZero00InputCell').attr('class', 'spot-green double-zero-removed');
        $('#doubleZero000SplitInputCell').attr('class', 'spot-split double-zero-removed');
        $('#win-00-cell').attr('class', 'win-disabled');
        $('#eq-00-cell').attr('class', 'spot-disabled');
        $('#b-x3-00_2_3').prop('disabled', true);
        $('#b-x3-0_00_2').prop('disabled', true);
        $('#b-x2-00_3').prop('disabled', true);
        $('#b-x5-top-line').prop('disabled', true);

        $('#b-x5-top-line').val('');
        $('#b-x3-00_2_3').val('');
        $('#b-x3-0_00_2').val('');
        $('#b-x2-00_3').val('');
        $('#b-x2-0_00').val('');
        $('#b-x1-00').val('');
        $('#win-00').text('');
        
        // Swap the 0 values
        $('#b-x1-0-single').val($('#b-x1-0').val());
        $('#b-x1-0').val('');
    } else if (wheelType === '00') {
        nextWheelType = '0';

        $('#singleZero0InputCell').attr('class', 'spot-green single-zero-removed');
        $('#doubleZero0InputCell').attr('class', 'spot-green');
        $('#doubleZero00InputCell').attr('class', 'spot-green');
        $('#doubleZero000SplitInputCell').attr('class', 'spot-split');
        $('#win-00-cell').attr('class', 'win-green');
        $('#eq-00-cell').attr('class', 'spot-green');
        $('#b-x3-00_2_3').prop('disabled', false);
        $('#b-x3-0_00_2').prop('disabled', false);
        $('#b-x2-00_3').prop('disabled', false);
        $('#b-x5-top-line').prop('disabled', false);

        // Swap the 0 values
        $('#b-x1-0').val($('#b-x1-0-single').val());
        $('#b-x1-0-single').val('');
    }

    $('#wheelTypeNextSpan').text(nextWheelType);
    updateUi();
}

function getNextWheelType() {
    return $('#wheelTypeNextSpan').text();
}

function getCurrentWheelType() {
    let nextWheelType = getNextWheelType();

    if (nextWheelType === '00') {
        return '0';
    }

    return '00';
}

function toggleWheelType() {
    let nextWheelType = getNextWheelType();
    setWheelType(nextWheelType);
}

function dismissWarning(id) {
    $(id).attr('class', 'hiddenRow');
}

function addEventHandlers() {
    $(document).on('change', 'input', updateUi);
}

function compareFn(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    // a must be equal to b
    return 0;
}

function updateChart() {
    let outcomeGraph = document.getElementById("outcomeGraph");
    if (outcomeGraph) {
        outcomeGraph.remove();
    }
    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'outcomeGraph');
    canvas.setAttribute('width', '828');
    canvas.setAttribute('min-width', '828');
    canvas.setAttribute('max-width', '828');
    canvas.setAttribute('height', '200');
    canvas.setAttribute('min-height', '200');
    canvas.setAttribute('max-height', '200');
    document.querySelector('#chartContainer').appendChild(canvas);

    const wheelType = getCurrentWheelType();

    let lossesAndWins = [];

    for (let i = 0; i < 38; i++) {
        if (wheelType === "0" && i === 1) {
            continue;
        }
        let value = $('#win-' + indexes[i]).text();
        if (value) {
            lossesAndWins.push(parseInt(value));
        } else {
            lossesAndWins.push(0);
        }
    }

    lossesAndWins.sort(compareFn);

    let labels = [];
    let graphData = [];
    let backgroundColors = [];
    let counter = 0;
    let worstLoss = 0;
    if (lossesAndWins.length > 0) {
        worstLoss = lossesAndWins[0];
    }
    for (let i = 0; i < lossesAndWins.length; i++) {
        counter += lossesAndWins[i];
        labels.push(i+1);
        graphData.push(lossesAndWins[i]);

        if (lossesAndWins[i] === worstLoss) {
            // Red bar
            backgroundColors.push('rgba(255, 0, 0, 1)');
        }
        else if (lossesAndWins[i] < 0) {
            // Yellow bar
            backgroundColors.push('rgba(255, 255, 0, 1)');
        }
        else {
            // Green bar
            backgroundColors.push('rgba(0, 255, 0, 1)');
        }
    }

    const ctx = $('#outcomeGraph');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Outcome',
                    data: graphData,
                    backgroundColor: backgroundColors
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    border: {
                        color: 'rgba(255, 255, 255, 1)'
                    }
                }
            }
        }
    });
}

function updateUi() {
    let totalBet = 0;
    let equityTable = [];
    let totalNumbersCovered = 0;
    
    let showTopLineBetWarning = false;
    let show36NumberBetWarning = false;
    let topLineBet = 0;
    const currentWheelType = getCurrentWheelType();

    $('#warningTopLineBetRow').attr('class', 'hiddenRow');
    $('#warning36NumbersBetRow').attr('class', 'hiddenRow');

    // Loop through all inputs
    $('input').each(function() {
    let currentBet = parseBet(this);
    
    if (currentBet.amount > 0) {
        totalBet += currentBet.amount
        
        for (let i = 0; i < currentBet.coveredNumbers.length; i++) {
            let currentNumber = currentBet.coveredNumbers[i];
            if (!equityTable[currentNumber]) {
                equityTable[currentNumber] = 0.0;
                totalNumbersCovered++;
            }

            if (currentBet.numberCount === 5) {
                // You get short changed on the 5-number bet
                showTopLineBetWarning = true;
                topLineBet = currentBet.amount;
                equityTable[currentNumber] += currentBet.amount * 35.0/180.0;
            }
            else {
                equityTable[currentNumber] += currentBet.amount / currentBet.numberCount;
            }
        }
    }
    });
    
    show36NumberBetWarning = totalNumbersCovered > 35;
    
    if (showTopLineBetWarning) {
        $('#warningTopLineBetRow').attr('class', '');
    }
    if (show36NumberBetWarning) {
        let allEquity = [];
        for (let key in equityTable) {
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
                // Set javascript link for removing equity
                $('#equityToRemoveFor36Button').attr("onclick", "distribute(" + formatDecimal(allEquity[0].amount) + ");");
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

        $('#totalNumbersBetSpan').text(totalNumbersCovered);
        $('#warning36NumbersBetRow').attr('class', '');
    }

    for (let i = 0; i < 38; i++) {
        // Clear out equity divs
        $('#eq-' + indexes[i]).text('');

        // Set win divs
        if (totalBet > 0) {
            if (currentWheelType !== '0' || indexes[i] !== '00') {
                $('#win-' + indexes[i]).text(-totalBet);
                $('#win-' + indexes[i]).attr('class', 'amt-neg');
            }
        } else {
            $('#win-' + indexes[i]).text('');
            $('#win-' + indexes[i]).attr('class', '');
        }
    }

    for (const [key, value] of Object.entries(equityTable)) {
        let truncatedValue = value.toFixed(2);
        $('#eq-' + key).text(truncatedValue);
    }

    for (const [key, value] of Object.entries(equityTable)) {
        let win = ((36 * value) - totalBet).toFixed(2);
        let winText = formatDecimal(win);

        $('#win-' + key).text(winText);

        if (win > 0) {
            $('#win-' + key).attr('class', 'amt-pos');
        }
        else if (win < 0) {
            $('#win-' + key).attr('class', 'amt-neg');
        }
        else {
            $('#win-' + key).attr('class', 'amt-0');
        }
    }

    let totalBetFormatted = formatDecimal(totalBet)
    $('#totalAmountBetDiv').text(totalBetFormatted);

    if (!showTopLineBetWarning) {
        if (currentWheelType === '0') {
            $('#totalExpectedValueDiv').text((- totalBet * 0.027).toFixed(2));
            $('#compValueDiv').text((totalBet * 0.027 * 0.20).toFixed(2));
        } else {
            // Simple calculation of house advantage
            $('#totalExpectedValueDiv').text((- totalBet * 0.0526).toFixed(2));
            $('#compValueDiv').text((totalBet * 0.0526 * 0.20).toFixed(2));
        }
    } else {
        // Complicated calculation because of 5-number bet
        // TODO: THIS SHOULD NOT UPDATE WHEN YOU DISMISS THE BASKET BET WARNING
        let otherBets = totalBet - topLineBet;
        let totalLoss = 0.0526 * otherBets + 0.0789 * topLineBet;
        $('#totalExpectedValueDiv').text((-totalLoss).toFixed(2));
        $('#compValueDiv').text((totalLoss * 0.20).toFixed(2));
    }

    updateChart();
}

function parseBet(inputElement) {
    let parts = inputElement.id.split("-");
    let numberCount = getNumberCount(parts[1]);
    let payout = getPayout(parts[1]);
    let coveredNumbers = getCoveredNumbers(parts[1], parts[2]);
    // TODO: validate that the value is an integer
    //let amount = parseInt(inputElement.value);
    let amount = parseFloat(inputElement.value);
    
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
    if (xType === 'x3' && identifier === '0_00_2') {
        // The 0-00-2 bet
        return ['0', '00', '2']
    }
    if (xType === 'x3' && identifier === '00_2_3') {
        // The 00-2-3 bet
        return ['00', '2', '3']
    }
    if (xType === 'x3' && identifier === '0_1_2') {
        // The 0-1-2 bet
        return ['0', '1', '2']
    }
    let parsedValue = parseInt(identifier);
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
    let returnValue = value.toString();

    if (returnValue.indexOf('.00') > -1) {
        // Truncate anything with zero cents
        returnValue = returnValue.replace('.00', '');
    }

    return returnValue;
}

// ]]>