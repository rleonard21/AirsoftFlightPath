function drawFlightPath(timeData, positionData) {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    let flairColor1 = 'rgba(48,59,65,1)';
    let flairColor2 = 'rgba(48,59,65,0.075)';

    new Chart(ctx, {
        type: 'line', // type of chart

        data: { // the data; a new object for every plot on the chart
            labels: timeData,
            datasets: [{
                label: "Position (m)",
                borderColor: flairColor1,
                fill: flairColor1,
                data: positionData
            }]
        },

        // Configuration options go here
        options: {
            showLines: true,


            elements: {
                line: {
                    tension: 0.8
                },

                point: {
                    radius: 0
                }
            },

            animation: {
                duration: 1500, // general animation time
            },
            hover: {
                animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
        }
    });
}

