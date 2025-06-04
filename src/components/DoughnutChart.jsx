import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const DoughnutChart = ({ data, colors }) => {
  const theme = useTheme();
  const chartColors = colors || [
    tokens(theme.palette.mode).blueAccent[500],
    tokens(theme.palette.mode).greenAccent[500],
    tokens(theme.palette.mode).redAccent[500],
    tokens(theme.palette.mode).yellowAccent[500],
  ];

  return (
    <div className="h-full w-full">
      <ResponsivePie
        data={data}
        theme={{
          tooltip: {
            container: {
              background: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
              color: theme.palette.mode === "dark" ? "#ffffff" : "#1e293b",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={chartColors}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={
          theme.palette.mode === "dark" ? "#e2e8f0" : "#334155"
        }
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "ruby",
            },
            id: "dots",
          },
          {
            match: {
              id: "c",
            },
            id: "dots",
          },
          {
            match: {
              id: "go",
            },
            id: "dots",
          },
          {
            match: {
              id: "python",
            },
            id: "dots",
          },
          {
            match: {
              id: "scala",
            },
            id: "lines",
          },
          {
            match: {
              id: "lisp",
            },
            id: "lines",
          },
          {
            match: {
              id: "elixir",
            },
            id: "lines",
          },
          {
            match: {
              id: "javascript",
            },
            id: "lines",
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: theme.palette.mode === "dark" ? "#e2e8f0" : "#334155",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default DoughnutChart;