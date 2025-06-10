// src/components/MonthlyPostureTrend.jsx

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

function MonthlyPostureTrend() {
  // 예시: 주차별 평균 바른자세 비율 (임의 그룹핑)
  const weekLabels = ["1주차", "2주차", "3주차", "4주차"];

  // 7일 데이터에서 4개 주차로 그룹핑 (더미용)
  const weekAverages = [30, 10, 35, 10];

  const data = {
    labels: weekLabels,
    datasets: [
      {
        label: "바른자세 비율 (%)",
        data: weekAverages,
        fill: true,
        backgroundColor: "rgba(128, 203, 196, 0.3)", // 민트색 면
        borderColor: "#80CBC4",
        pointBackgroundColor: "#4DB6AC",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "📈 월간 바른자세 유지 비율 추세",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "%",
        },
      },
    },
  };

  return (
    <div style={{ width: "600px", margin: "30px auto" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default MonthlyPostureTrend;
