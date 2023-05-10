//<![CDATA[

let indexes = ['0', '00', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];
let hits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let spotsRed = ['1','3','5','7','9','12','14','16','18','19','21','23','25','27','30','32','34','36'];

$(document).ready(function() {
    console.log('DO IT');
    updateUi();
    console.log('IBBE DONE');
});
    
function updateUi() {
    updateChart();
}

function updateChart() {
    let distributionGraph = document.getElementById("distributionGraph");
    if (distributionGraph) {
        distributionGraph.remove();
    }
    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'distributionGraph');
    canvas.setAttribute('width', '710');
    canvas.setAttribute('min-width', '710');
    canvas.setAttribute('max-width', '710');
    canvas.setAttribute('height', '200');
    canvas.setAttribute('min-height', '200');
    canvas.setAttribute('max-height', '200');
    document.querySelector('#chartContainerX').appendChild(canvas);

    for (let i = 0; i < 38; i++) {
        hits[i] = parseInt($('#hits-' + indexes[i]).text());
    }

    console.log(hits);

    let graphData = [];
    let backgroundColors = [];
    let totalSpins = 0;
    let smallestValue = 999999999;

    for (let i = 0; i < 38; i++) {
        totalSpins += hits[i];
        graphData.push(hits[i]);
        if (hits[i] < smallestValue) {
            smallestValue = hits[i];
        }

        if (i < 2) {
            // Green bar
            backgroundColors.push('rgba(0, 255, 0, 1)');
        }
        else if (spotsRed.includes(indexes[i])) {
            // Red bar
            backgroundColors.push('rgba(255, 0, 0, 1)');
        }
        else {
            // Black bar
            backgroundColors.push('rgba(32, 32, 32, 1)');
        }
    }

    const ctx = $('#distributionGraph');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: indexes,
            datasets: [
                {
                    label: '',
                    data: graphData,
                    backgroundColor: backgroundColors
                }
            ]
        },
        options: {
            responsive: true,
            layout: {
                padding: {
                    top: 40,
                    right: 10
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'right'
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

// ]]>