import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DailyStatsCard() {
  const today = [12, 1, 12];

  const data = {
    labels: ["바른자세", "나쁜자세"],
    datasets: [
      {
        data: [30, 100 - 30],
        backgroundColor: ["#80CBC4", "#E57373"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    animation: false, // ✅ 애니메이션 제거
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%", // 도넛 내부 비율
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>📅 오늘의 자세 요약</h2>
      <p>
        <strong>경고 횟수:</strong> {12}회
      </p>
      <p>
        <strong>평균 각도:</strong> {45}°
      </p>

      <div style={{ width: "220px", margin: "0 auto" }}>
        <Doughnut data={data} options={options} />
        <p style={{ marginTop: "10px" }}>
          바른 자세 유지율: <strong>{30}%</strong>
        </p>
      </div>
    </div>
  );
}

export default DailyStatsCard;
