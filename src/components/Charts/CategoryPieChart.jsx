import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#f0a500', '#10d97e', '#ff5f72', '#4da6ff', '#e07c3e', '#a78bfa', '#34d399', '#fb923c'];

const CategoryPieChart = ({ data, formatCurrency }) => {
  const renderTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="chart-tooltip" style={{ padding:'12px 16px', background:'var(--bg-card-2)', border:'1px solid var(--border-hover)', borderRadius:12 }}>
          <p style={{ fontWeight:700, marginBottom:4, fontFamily:"'Space Grotesk',sans-serif" }}>{payload[0].name}</p>
          <p style={{ color: payload[0].payload.fill, fontSize:14 }}>{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip content={renderTooltip} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize:12, color:'var(--t2)' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default CategoryPieChart;
