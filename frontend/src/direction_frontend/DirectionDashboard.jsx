import React, { useEffect, useRef } from 'react';
import DirectionLayout from './DirectionLayout';
import Chart from 'chart.js/auto';

const DirectionDashboard = () => {
  // Refs for all charts
  const trendLineRef = useRef(null);
  const departmentChartRef = useRef(null);
  const filiereChartRef = useRef(null);
  const impressionChartRef = useRef(null);
  const colorChartRef = useRef(null);
  const comparisonChartRef = useRef(null);

  useEffect(() => {
    // Initialize all charts when component mounts
    const charts = [];

    // Trend Line Chart
    const trendLineChart = new Chart(trendLineRef.current, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Commandes 2024',
            data: [30, 50, 40, 70, 90, 120, 150, 140, 130, 110, 80, 60],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Commandes 2023',
            data: [20, 40, 30, 60, 80, 100, 130, 120, 100, 90, 70, 50],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mois'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Nombre de Commandes'
            },
            beginAtZero: true
          }
        }
      }
    });
    charts.push(trendLineChart);

    // Department Chart
    const departmentChart = new Chart(departmentChartRef.current, {
      type: 'bar',
      data: {
        labels: ['DE', 'DRE', 'R&D', 'DRI', 'LEC', 'CC', 'Scolarité (SC)', 'Administration (ADM)', 'IT', 'Direction Générale (DG)'],
        datasets: [{
          label: 'Commandes',
          data: [30, 40, 20, 50, 10, 25, 35, 15, 45, 20],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Départements'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de Commandes'
            }
          }
        }
      }
    });
    charts.push(departmentChart);

    // Filiere Chart
    const filiereChart = new Chart(filiereChartRef.current, {
      type: 'bar',
      data: {
        labels: ['IMS', 'GI-LI', 'GI-TH', 'GI-CP', 'GI-TC', 'ITTI', 'CTM', 'MS-MPTH', 'MS-E-Log', 'MS-DM', 'MS-HSE', 
                'LP-DH', 'LP-GPH', 'LP-GPT', 'LP-GCL', 'LP-GAS', 'CTS', 'RSA'],
        datasets: [{
          label: 'Commandes',
          data: [15, 25, 35, 20, 30, 40, 10, 50, 45, 25, 30, 20, 15, 35, 25, 30, 10, 5],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Filières'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de Commandes'
            }
          }
        }
      }
    });
    charts.push(filiereChart);

    // Impression Type Chart
    const impressionChart = new Chart(impressionChartRef.current, {
      type: 'pie',
      data: {
        labels: ['Recto', 'Recto-Verso'],
        datasets: [{
          data: [60, 40],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
    charts.push(impressionChart);

    // Color Chart
    const colorChart = new Chart(colorChartRef.current, {
      type: 'pie',
      data: {
        labels: ['Couleur', 'Noir et Blanc'],
        datasets: [{
          data: [30, 70],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
    charts.push(colorChart);

    // Comparison Chart
    const comparisonChart = new Chart(comparisonChartRef.current, {
      type: 'bar',
      data: {
        labels: ['Recto', 'Recto-Verso'],
        datasets: [
          {
            label: 'Couleur',
            data: [20, 10],
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Noir et Blanc',
            data: [40, 30],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Type d\'Impression'
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de Copies'
            }
          }
        }
      }
    });
    charts.push(comparisonChart);

    // Cleanup function to destroy charts when component unmounts
    return () => {
      charts.forEach(chart => chart.destroy());
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <DirectionLayout pageTitle="Dashboard des Commandes">
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold mb-2">Total Commandes</div>
            <div className="text-3xl font-bold">769</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold mb-2">En Attente</div>
            <div className="text-3xl font-bold">20</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold mb-2">Validées</div>
            <div className="text-3xl font-bold">749</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Courbe de Tendance : Évolution des Commandes</h2>
          <canvas ref={trendLineRef}></canvas>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Commandes par Département</h2>
            <canvas ref={departmentChartRef}></canvas>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Commandes par Filière</h2>
            <canvas ref={filiereChartRef}></canvas>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Répartition par Type d'Impression</h2>
            <canvas ref={impressionChartRef}></canvas>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Répartition par Couleur</h2>
            <canvas ref={colorChartRef}></canvas>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Comparaison : Impression et Couleur</h2>
            <canvas ref={comparisonChartRef}></canvas>
          </div>
        </div>
      </div>
    </DirectionLayout>
  );
};

export default DirectionDashboard;