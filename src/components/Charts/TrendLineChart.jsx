import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const TrendLineChart = ({ data, formatCurrency }) => {
  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="chart-tooltip" style={{ padding:'12px 16px', background:'var(--bg-card-2)', border:'1px solid var(--border-hover)', borderRadius:12 }}>
          <p style={{ fontWeight:700, marginBottom:4, fontFamily:"'Space Grotesk',sans-serif" }}>{label}</p>
          <p style={{ color:'#f0a500', fontSize:13 }}>Expense: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top:16, right:20, left:0, bottom:4 }}>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f0a500" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f0a500" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--t3)" fontSize={11} tickLine={false} />
        <YAxis stroke="var(--t3)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip content={renderTooltip} />
        <Area type="monotone" dataKey="amount" stroke="#f0a500" strokeWidth={2.5} fill="url(#goldGrad)"
          dot={{ r:4, fill:'var(--bg-card)', stroke:'#f0a500', strokeWidth:2 }}
          activeDot={{ r:6, fill:'#f0a500' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default TrendLineChart;
