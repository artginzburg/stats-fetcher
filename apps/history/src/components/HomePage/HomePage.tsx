import {
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type dataHistory from '~/../../dataHistory.json';

export function HomePage({ history }: { history: typeof dataHistory }) {
  const data = history.map(({ content, date }) => {
    return {
      date: new Date(date),
      ...content,
    };
  });

  type DataKey = keyof (typeof data)[number];

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={'90svh'}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={'date' satisfies DataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={'wakatimeMinutes' satisfies DataKey}
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey={'githubDownloads' satisfies DataKey}
          stroke="#ab7a32"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey={'npmDownloads' satisfies DataKey}
          stroke="#dd5555"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey={'mustappHours' satisfies DataKey}
          stroke="#27ac5a"
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
