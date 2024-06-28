import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './ScatterPlot_2nd.module.css';

const ScatterPlot = () => {
    const svgRef = useRef(null);
    const width = 640;
    const height = 450;
    const margin = { top : 40, right : 20, bottom : 30, left : 50 };
    const chartWidth
}