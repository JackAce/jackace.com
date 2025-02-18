//<![CDATA[

let indexes = ['a', 'b', 'c', 'd', 'f'];
let labels = ['A', 'B', 'C', 'D', 'F'];
let ratingsCountCeg = [0, 0, 0, 0, 0];
let ratingsCountJackAce = [0, 0, 0, 0, 0];
let backgroundColors = [
    'rgba(217, 90, 106, 1)',
    'rgba(223, 155, 123, 1)',
    'rgba(173, 101, 122, 1)',
    'rgba(160, 86, 168, 1)',
    'rgba(155, 154, 39, 1)'
];

$(document).ready(function() {
    updateUi();
});
    
function updateUi() {
    updateCharts();
}

function updateCharts() {
    let ratingsGraphCeg = document.getElementById("ratingsGraphCeg");
    if (ratingsGraphCeg) {
        ratingsGraphCeg.remove();
    }
    let ratingsGraphJackAce = document.getElementById("ratingsGraphJackAce");
    if (ratingsGraphJackAce) {
        ratingsGraphJackAce.remove();
    }

    for (let i = 0; i < 5; i++) {
        ratingsCountCeg[i] = parseInt($('#rating-ceg-' + indexes[i]).text());
        ratingsCountJackAce[i] = parseInt($('#rating-jackace-' + indexes[i]).text());
    }

    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'ratingsGraphCeg');
    canvas.setAttribute('width', '400');
    canvas.setAttribute('min-width', '300');
    canvas.setAttribute('max-width', '450');
    canvas.setAttribute('height', '400');
    canvas.setAttribute('min-height', '300');
    canvas.setAttribute('max-height', '450');
    document.querySelector('#chartContainerCegX').appendChild(canvas);

    // CEG Pie chart

    const ctx = $('#ratingsGraphCeg');
    const myChartCeg = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: ratingsCountCeg,
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

    let canvasJA = document.createElement('canvas');
    canvasJA.setAttribute('id', 'ratingsGraphJackAce');
    canvasJA.setAttribute('width', '400');
    canvasJA.setAttribute('min-width', '300');
    canvasJA.setAttribute('max-width', '450');
    canvasJA.setAttribute('height', '400');
    canvasJA.setAttribute('min-height', '300');
    canvasJA.setAttribute('max-height', '450');
    document.querySelector('#chartContainerJackAceX').appendChild(canvasJA);

    const ctxJA = $('#ratingsGraphJackAce');
    const myChartJA = new Chart(ctxJA, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: ratingsCountJackAce,
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