import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

StatCard.propTypes = {
    chartID: PropTypes.string.isRequired,
    chartType: PropTypes.oneOf(['line', 'bar', 'pie', 'doughnut']).isRequired,
    chartOptions: PropTypes.object.isRequired,
    chartData: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string),
        datasets: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,

};

function StatCard({chartID, chartData, chartOptions, chartType}) {


    const getChart = () => {
        new Chart(document.getElementById(chartID).getContext('2d'), {
            type: chartType,
            data: {
                labels: chartData.labels,
                datasets: chartData.datasets
            },
            options: chartOptions
        });
    }

    setTimeout(getChart,200);
    return (
        <div className={'stat-card'}>
            <canvas width={300} height={150} id={chartID}/>
        </div>
    );

}

export default StatCard;