import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceBarChart = ({ chartData, title, yAxisLabel }) => {
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">{title}</h3>
        <p className="text-gray-500">No data available to display the chart.</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            font: {
                size: 14,
                family: 'Inter, sans-serif'
            },
            color: '#4A5568'
        }
      },
      title: {
        display: true,
        text: title,
        font: {
            size: 18,
            weight: 'bold',
            family: 'Inter, sans-serif'
        },
        color: '#2D3748', // gray-800
        padding: {
            top: 10,
            bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: { size: 14, family: 'Inter, sans-serif' },
        bodyFont: { size: 12, family: 'Inter, sans-serif' },
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += context.parsed.y + (yAxisLabel ? ' ' + yAxisLabel.toLowerCase() : '');
                }
                return label;
            }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel,
          font: {
            size: 14,
            family: 'Inter, sans-serif'
          },
          color: '#4A5568'
        },
        ticks: {
            color: '#718096',
            font: { family: 'Inter, sans-serif' },
            precision: 0
        },
        grid: {
            color: '#E2E8F0'
        }
      },
      x: {
        ticks: {
            color: '#718096',
            font: { family: 'Inter, sans-serif' },
        },
        grid: {
            display: false
        }
      }
    },
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
      {/* Wrapper to control chart height */}
      <div style={{ height: '400px', position: 'relative' }}> 
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default PerformanceBarChart;