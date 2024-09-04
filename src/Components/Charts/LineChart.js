import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ClimateLineChart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    const container = d3.select(chartRef.current).node().parentNode;
    const svgWidth = container.getBoundingClientRect().width; 
    const svgHeight = 400;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;


    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current)
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(+d.absMaxTemp, +d.avgMinTemp))])
      .range([height, 0]);

    const lineMaxTemp = d3.line()
      .x(d => xScale(d.name))
      .y(d => yScale(d.absMaxTemp));

    const lineMinTemp = d3.line()
      .x(d => xScale(d.name))
      .y(d => yScale(d.avgMinTemp));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

 
    svg.append('g')
      .call(d3.axisLeft(yScale));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'tomato')
      .attr('stroke-width', 2)
      .attr('d', lineMaxTemp);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', lineMinTemp);

    svg.selectAll('.dot-max')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot-max')
      .attr('cx', d => xScale(d.name))
      .attr('cy', d => yScale(d.absMaxTemp))
      .attr('r', 4)
      .attr('fill', 'tomato')
      .on('mouseover', function(event, d) {
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('z-index', '10')
          .style('background', 'white')
          .style('border', '1px solid #ccc')
          .style('padding', '5px')
          .style('border-radius', '5px')
          .style('opacity', '0.9')
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .text(`Max Temp: ${d.absMaxTemp}°C`);
      })
      .on('mouseout', function() {
        d3.select('.tooltip').remove();
      });

    svg.selectAll('.dot-min')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot-min')
      .attr('cx', d => xScale(d.name))
      .attr('cy', d => yScale(d.avgMinTemp))
      .attr('r', 4)
      .attr('fill', 'steelblue')
      .on('mouseover', function(event, d) {
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('z-index', '10')
          .style('background', 'white')
          .style('border', '1px solid #ccc')
          .style('padding', '5px')
          .style('border-radius', '5px')
          .style('opacity', '0.9')
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .text(`Min Temp: ${d.avgMinTemp}°C`);
      })
      .on('mouseout', function() {
        d3.select('.tooltip').remove();
      });

    // Add Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, 10)`);

    legend.append('rect')
      .attr('x', 60)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', 'tomato');

    legend.append('text')
      .attr('x', 80)
      .attr('y', 10)
      .text('Max Temp')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white');

    legend.append('rect')
      .attr('x', 60)
      .attr('y', 20)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', 'steelblue');

    legend.append('text')
      .attr('x', 80)
      .attr('y', 30)
      .text('Min Temp')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white');
  };

  return (
    <svg ref={chartRef}></svg>
  );
}

export default ClimateLineChart;