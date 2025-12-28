import { useState, useEffect } from "react";

// ======================================
// Heavy Charts Component (Lazy Loaded)
// ======================================
// This simulates a heavy charting library component
// In production, this would be actual chart components from recharts, chart.js, etc.

// Simulate some "heavy" data processing
const generateChartData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    orders: Math.floor(Math.random() * 500) + 100,
    users: Math.floor(Math.random() * 1000) + 200,
  }));
};

// Simple Bar Chart Component
function BarChart({ data, dataKey, color, title }) {
  const maxValue = Math.max(...data.map((d) => d[dataKey]));

  return (
    <div className="chart-container">
      <h4>{title}</h4>
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div
              className="bar"
              style={{
                height: `${(item[dataKey] / maxValue) * 100}%`,
                background: color,
              }}
            >
              <span className="bar-value">
                {item[dataKey].toLocaleString()}
              </span>
            </div>
            <span className="bar-label">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Line Chart Component (simulated with CSS)
function LineChart({ data, dataKey, color, title }) {
  const maxValue = Math.max(...data.map((d) => d[dataKey]));

  return (
    <div className="chart-container">
      <h4>{title}</h4>
      <div className="line-chart">
        <svg viewBox="0 0 320 100" className="line-svg">
          {/* Line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data
              .map((item, i) => {
                const x = (i / (data.length - 1)) * 300 + 10;
                const y = 90 - (item[dataKey] / maxValue) * 80;
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {/* Points */}
          {data.map((item, i) => {
            const x = (i / (data.length - 1)) * 300 + 10;
            const y = 90 - (item[dataKey] / maxValue) * 80;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="chart-point"
              >
                <title>
                  {item.month}: {item[dataKey].toLocaleString()}
                </title>
              </circle>
            );
          })}
        </svg>
        <div className="line-labels">
          {data.map((item, i) => (
            <span key={i}>{item.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeavyCharts() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulate heavy data processing
    console.log("📊 HeavyCharts: Loading chart data...");
    setChartData(generateChartData());
  }, []);

  return (
    <div className="heavy-charts">
      <div className="charts-grid">
        <BarChart
          data={chartData}
          dataKey="revenue"
          color="linear-gradient(180deg, #667eea 0%, #764ba2 100%)"
          title="Monthly Revenue ($)"
        />
        <LineChart
          data={chartData}
          dataKey="orders"
          color="#27ae60"
          title="Monthly Orders"
        />
        <BarChart
          data={chartData}
          dataKey="users"
          color="linear-gradient(180deg, #f39c12 0%, #e74c3c 100%)"
          title="New Users"
        />
      </div>

      <div className="chart-footer">
        <p>✅ HeavyCharts component successfully lazy loaded!</p>
        <p>
          In a real application, this would contain libraries like{" "}
          <code>recharts</code>, <code>chart.js</code>, or <code>d3</code> that
          add significant bundle size.
        </p>
      </div>
    </div>
  );
}
