import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const data = {
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  datasets: [
    {
      label: '평균 고개 각도 (°)',
      data: [45, 43, 40, 39, 41, 44, 46],
      borderColor: 'rgba(123, 104, 238, 1)', // 보라색
      backgroundColor: 'rgba(123, 104, 238, 0.2)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgba(123, 104, 238, 1)',
      pointRadius: 4
    }
  ]
};

const options = {
  responsive: true,
  animation: {
    duration: 0, // 전체 애니메이션 제거
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#444',
        font: {
          size: 14
        }
      }
    }
  },
  scales: {
    y: {
      min: 30,
      max: 90,
      ticks: {
        color: '#666'
      },
      grid: {
        color: '#eee'
      }
    },
    x: {
      ticks: {
        color: '#666'
      },
      grid: {
        display: false
      }
    }
  }
};

function WeeklyAngleLineChart() {
  return (
    <div style={{ width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default WeeklyAngleLineChart;
