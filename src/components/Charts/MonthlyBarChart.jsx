import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyBarChart = ({ data, formatCurrency }) => {
  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="chart-tooltip" style={{ padding:'12px 16px', background:'var(--bg-card-2)', border:'1px solid var(--border-hover)', borderRadius:12 }}>
          <p style={{ fontWeight:700, marginBottom:6, fontFamily:"'Space Grotesk',sans-serif" }}>{label}</p>
          {payload.map((p,i) => (
            <p key={i} style={{ color:p.fill, fontSize:13 }}>{p.dataKey}: {formatCurrency(p.value)}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top:16, right:20, left:0, bottom:4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--t3)" fontSize={11} tickLine={false} />
        <YAxis stroke="var(--t3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v>=1000?`${(v/1000).toFixed(0)}k`:v}`} />
        <Tooltip content={renderTooltip} cursor={{ fill:'rgba(255,255,255,0.02)' }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize:12, color:'var(--t2)' }} />
        <Bar dataKey="Income"  fill="#10d97e" radius={[4,4,0,0]} maxBarSize={36} />
        <Bar dataKey="Expense" fill="#ff5f72" radius={[4,4,0,0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default MonthlyBarChart;
