//<![CDATA[

let indexes = [
    'flat-bet',
    'positive-progression',
    'negative-progression',
    'martingale',
    'ladder',
    'multi-leg',
    'other'
];
let labels = [
    'Flat Bet',
    'Positive Progression',
    'Negative Progression',
    'Martingale',
    'Ladder',
    'Multi-Leg',
    'Other'
];
let typesCount = [0, 0, 0, 0, 0, 0, 0];
let backgroundColors = [
    'rgba(251, 228, 68, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(242, 155, 38, 1)',
    'rgba(149, 120, 81, 1)',
    'rgba(181, 86, 93, 1)',
    'rgba(128, 128, 128, 1)'
];

$(document).ready(function() {
    updateUi();
});
    
function updateUi() {
    updateCharts();
}

function updateCharts() {
    let systemTypesGraph = document.getElementById("systemTypesGraph");
    if (systemTypesGraph) {
        systemTypesGraph.remove();
    }

    for (let i = 0; i < 7; i++) {
        typesCount[i] = parseInt($('#system-type-' + indexes[i]).text());
    }

    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'systemTypesGraph');
    canvas.setAttribute('width', '400');
    canvas.setAttribute('min-width', '300');
    canvas.setAttribute('max-width', '450');
    canvas.setAttribute('height', '400');
    canvas.setAttribute('min-height', '300');
    canvas.setAttribute('max-height', '450');
    document.querySelector('#chartContainerSystemTypes').appendChild(canvas);

    // CEG Pie chart

    const ctx = $('#systemTypesGraph');
    const myChartCeg = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: typesCount,
                    backgroundColor: backgroundColors
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            layout: {
                padding: 10
            }
        }
    });

}

// ]]>