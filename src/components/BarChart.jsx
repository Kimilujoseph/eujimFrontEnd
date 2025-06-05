import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = ({ data, keys, indexBy, isInteractive = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100], fontSize: '11px' },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
            fontSize: '12px'
          }
        },
        tooltip: {
          container: {
            background: colors.primary[400],
            color: colors.grey[100],
            fontSize: '12px'
          },
        },
      }}
      margin={{
        top: 10,
        right: data.length > 5 ? 10 :5,
        bottom: data.length > 5 ? 100 :60,
        left: 70,
      }}
      padding={0.4}
      colors={({ id, data }) => data[`${id}Color`] || colors.greenAccent[500]}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: data.length > 5 ? -45 : 0,
        legendPosition: "middle",
        legendOffset: data.length > 5 ? 70 : 40,
        legendText: { fontSize: '12px' }
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
        format: value =>
          value >= 1000 ? `${value / 1000}k` : value,
        ...(typeof window !== "undefined" && window.innerWidth < 768
          ? { tickValues: 5 }
          : {})
      }}
      enableLabel={false}
      labelSkipWidth={16}
      labelSkipHeight={16}
      layout={data.length > 8 ? 'vertical' : 'horizontal'}
      isInteractive={isInteractive}
    />
  );
};

export default BarChart;