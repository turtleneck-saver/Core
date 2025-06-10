import React from "react";
import DailyStatsCard from "../components/DailyStatsCard";
import WeeklyStatsChart from "../components/WeeklyStatsChart";
import WeeklyAngleLineChart from "../components/WeeklyAngleLineChart";
import MonthlyPostureTrend from "../components/MonthlyPostureTrend";

function Dashboard() {
  return (
    <div
      style={{
        padding: "60px 20px",
        fontFamily: "Arial",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #8e9edc, #a0d8ef)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridAutoRows: "auto",
          gap: "30px",
          maxWidth: "1200px",
          width: "100%",
          background: "#eceef1",
          padding: "50px",
          borderRadius: "20px",
          boxShadow: "0 15px 50px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
        }}
      >
        {/* 오늘의 요약 (도넛) */}
        <div
          style={{ ...cardStyle, gridColumn: "1 / span 2", minHeight: "300px" }}
        >
          <DailyStatsCard />
        </div>

        {/* 주간 차트: 막대 + 선형 */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            gridColumn: "1 / span 2",
            width: "100%",
          }}
        >
          <div style={{ ...cardStyle, flex: 1, minHeight: "280px" }}>
            <WeeklyStatsChart />
          </div>
          <div style={{ ...cardStyle, flex: 1, minHeight: "280px" }}>
            <WeeklyAngleLineChart />
          </div>
        </div>

        {/* 월간 추세 그래프 + 요약 카드 */}
        <div style={{ display: "flex", gap: "30px", gridColumn: "1 / span 2" }}>
          <div style={{ ...cardStyle, flex: 2, minHeight: "280px" }}>
            <MonthlyPostureTrend />
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #7b81ec, #81d1f0)",
              color: "white",
              borderRadius: "16px",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.5rem",
              minHeight: "280px",
              flex: 1,
              transition: "none",
            }}
          >
            <p style={{ fontSize: "1.2rem" }}>📊 이번 달 총 경고 횟수</p>
            <strong style={{ fontSize: "2.5rem" }}>54회</strong>
            <p style={{ marginTop: "1rem" }}>
              📏 평균 각도: <strong>41.3°</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  boxSizing: "border-box",
  width: "100%",
  transition: "none",
};

export default Dashboard;
