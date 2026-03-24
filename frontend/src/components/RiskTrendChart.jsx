import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiskTrendChart = ({ history }) => {
  if (!history || history.length < 2) {
    return (
      <div className="empty-chart-state">
        <p>Insufficient data for trend analysis. Tracking will begin after your next assessment.</p>
      </div>
    );
  }

  // Transform date to readable format
  const data = history.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="risk-trend-chart w-full h-[300px] mt-5 font-dm">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans'}} axisLine={false} tickLine={false} dy={10} />
          <YAxis stroke="#64748b" tick={{fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans'}} domain={[0, 100]} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid #e2e8f0', 
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'DM Sans'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'DM Sans' }} />
          
          <Line type="monotone" dataKey="overall_score" stroke="#3b82f6" strokeWidth={2} name="Overall Health Risk" dot={{ r: 4 }} />
          {/* Individual disease lines could be added here if the data is dense enough, 
              but keeping it simple with Overall Score for now to avoid clutter */}
          <Line type="monotone" dataKey="Kidney Disease" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="Heart Disease" stroke="#f97316" strokeWidth={1} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-legend-note text-center text-[0.8rem] text-slate-500 mt-[10px] font-dm italic">
        *Dashed lines represent individual organ risks
      </div>
    </div>
  );
};

export default RiskTrendChart;
