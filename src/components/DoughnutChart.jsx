import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../theme";

const DoughnutChart = ({ data, colors }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const chartColors = colors || [
    tokens(theme.palette.mode).blueAccent[500],
    tokens(theme.palette.mode).greenAccent[500],
    tokens(theme.palette.mode).redAccent[500],
    tokens(theme.palette.mode).yellowAccent[500],
  ];

  // Responsive values
  const margin = isMobile 
    ? { top: 20, right: 20, bottom: 100, left: 20 } 
    : isTablet 
      ? { top: 30, right: 40, bottom: 100, left: 40 } 
      : { top: 40, right: 80, bottom: 80, left: 80 };
  
  const innerRadius = isMobile ? 0.4 : 0.5;
  const arcLinkLabelsSkipAngle = isMobile ? 15 : 10;
  const arcLabelsSkipAngle = isMobile ? 15 : 10;

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
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              padding: "8px 12px"
            },
          },
          legends: {
            text: {
              fontSize: isMobile ? 10 : 12,
            }
          }
        }}
        margin={margin}
        innerRadius={innerRadius}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={chartColors}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
        arcLinkLabelsTextColor={
          theme.palette.mode === "dark" ? "#e2e8f0" : "#334155"
        }
        arcLinkLabelsThickness={isMobile ? 1 : 2}
        arcLinkLabelsColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        arcLinkLabelsDiagonalLength={isMobile ? 6 : 10}
        arcLinkLabelsStraightLength={isMobile ? 8 : 12}
        arcLabelsSkipAngle={arcLabelsSkipAngle}
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
            direction: isMobile ? "column" : "row",
            justify: false,
            translateX: 0,
            translateY: isMobile ? 75 : 56,
            itemsSpacing: isMobile ? 5 : 0,
            itemWidth: isMobile ? 80 : 100,
            itemHeight: 18,
            itemTextColor: theme.palette.mode === "dark" ? "#e2e8f0" : "#334155",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: isMobile ? 12 : 18,
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