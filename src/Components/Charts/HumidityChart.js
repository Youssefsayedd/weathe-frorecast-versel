import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function HumidityChart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 300, height = 200;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Parse the time from HHMM format to a Date object
    const parseTime = d => {
      const hours = Math.floor(d / 100);
      const minutes = d % 100;
      return new Date(0, 0, 0, hours, minutes);
    };

    const timeData = data.map(d => ({
      ...d,
      time: parseTime(parseInt(d.time, 10))
    }));

    // Define x and y scales
    const x = d3.scaleTime()
      .domain(d3.extent(timeData, d => d.time))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(timeData, d => d.humidity)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Define the line generator
    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.humidity))
      .curve(d3.curveMonotoneX);

    // Add the y-axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("transform", `translate(${margin.left}, 0)`);

    // Add the x-axis with formatted time
    svg.append("g")
      .call(d3.axisBottom(x).ticks(8).tickFormat(d3.timeFormat("%H:%M")))
      .attr("transform", `translate(0,${height - margin.bottom})`);

    // Add the line path
    svg.append("path")
      .datum(timeData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return <svg ref={chartRef} width="300" height="200"></svg>;
}

export default HumidityChart;
