import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function WindChart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();
    
    const width = 300, height = 200;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const x = d3.scaleLinear().domain([0, data.length - 1]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.windspeedKmph)]).nice().range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d.windspeedKmph))
      .curve(d3.curveMonotoneX);
    
    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("transform", `translate(${margin.left}, 0)`);

    svg.append("g")
      .call(d3.axisBottom(x))
      .attr("transform", `translate(0,${height - margin.bottom})`);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return <svg ref={chartRef} width="300" height="200"></svg>;
}

export default WindChart;
