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
            text: { fill: colors.grey[100] },
          },
        },
        legends: { text: { fill: colors.grey[100] } },
        tooltip: {
          container: {
            background: colors.primary[400],
            color: colors.grey[100],
          },
        },
      }}
      margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
      padding={0.3}
      colors={({ id, data }) => data[`${id}Color`] || colors.greenAccent[500]}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: "Certifications",
        legendPosition: "middle",
        legendOffset: 60,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Graduates",
        legendPosition: "middle",
        legendOffset: -50,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      animate={true}
      motionConfig="gentle"
      isInteractive={isInteractive}
    />
  );
};

export default BarChart;
