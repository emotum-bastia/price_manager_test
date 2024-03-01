import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const Graphique = ({ data }) => {
  useEffect(() => {
    if (data) {
      // Créer le graphique à partir des données passées en props
      const chartLabels = data.map(entry => entry.site);
      const chartData = data.map(entry => entry.price);

      const ctx = document.getElementById('myChart');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Prix',
            data: chartData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [data]);

  return (
    <div>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
  );
};

export default Graphique;