/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import * as d3 from 'd3';


const squareSize = 250;
const strokeDash = 5;
const strokeWidth = 1;
const foreignObjectWidth = 160;
const foreignObjectHeight = 120;

let data;

function getDegrees(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function dragAngle(d) {
  // It's better to use the position relative to the page.
  // This way I can avoid the wierdness of negative Y values
  const scale = d3.select('.line-container').attr('scale-data-holder') || 1;
  console.log(scale);
  const img = d3.select(this.parentNode);
  const center = { x: +img.attr('x'), y: +img.attr('y') };

  d.r = getDegrees(center, d3.event.sourceEvent, scale) + 90;
  console.log(center, img);
  console.log(d3.event, d3.event.sourceEvent.y);
  d3.select(this.parentNode).attr('transform', function (d1) {
    const widthOffset = +d3.select(this).select('foreignObject').attr('width') / 2;
    const heightOffset = +d3.select(this).select('foreignObject').attr('height') / 2;
    // TODO x and y should probably take scale into acount also
    return `rotate(${d1.r}, ${d1.x + widthOffset}, ${d1.y + heightOffset})`;
  });
}

function drag(d) {
  d.x = d3.event.x;
  d.y = d3.event.y;
  d3.select(this)
    .attr('transform', function (d1) {
      const widthOffset = +(d3.select(this).select('foreignObject').attr('width') / 2);
      const heightOffset = +(d3.select(this).select('foreignObject').attr('height') / 2);
      return `rotate(${d1.r}, ${d3.event.x + widthOffset}, ${d3.event.y + heightOffset})`;
    })
    .select('foreignObject')
    .attr('x', d.x)
    .attr('y', d.y);

  d3.select(this)
    .select('circle')
    .attr('cx', d.x + 135)
    .attr('cy', d.y + 90);

  d3.select(this)
    .select('text')
    .attr('x', d.x + 135)
    .attr('y', d.y + 94);

  d3.select(this)
    .select('circle.angler')
    .attr('cx', d1 => d1.x + (foreignObjectWidth / 2))
    .attr('cy', d1 => d1.y);
}

function drawSigns(svg) {
  const groupEnter = d3.select(svg)
    .select('.sign-container')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', d1 => `rotate(${d1.r} 100 100)`)
    .on('touchmove', () => {}) // This is all that is needed to enable touch events, the drag events will now bbe triggered on touch events
    .call(d3.drag()
    // TODO find a way to use this without making it mess up x and y
    //  .on('start', function () { // must be regular function to get the correct this
    //   d3.select(this).raise();
    // })
      .on('drag', drag));

  groupEnter.append('foreignObject')
    .attr('width', foreignObjectWidth)
    .attr('height', foreignObjectHeight)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('transform', 'translate(0,0)') // Firefox workaround for stacking bugg: https://bugzilla.mozilla.org/show_bug.cgi?id=984312
    .append('xhtml:div')
    .append('img')
    .attr('src', (d) => {
      const number = `${d.number}`.substr(1);
      // eslint-disable-next-line
      return require(`./assets/signs/${d.class}/${number}.png`);
    })
    .attr('style', 'border: 2px solid black;')
    .attr('width', 150);

  groupEnter.append('circle')
    .attr('cx', d => d.x + 135)
    .attr('cy', d => d.y + 90)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'white')
    .attr('r', 15);

  groupEnter.append('text')
    .attr('x', d => d.x + 135)
    .attr('y', d => d.y + 94)
    .text(d => d.a)
    .attr('text-anchor', 'middle');

  groupEnter.append('circle')
    .attr('class', 'angler')
    .attr('cx', d => d.x + (foreignObjectWidth / 2))
    .attr('cy', d => d.y)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'white')
    .attr('r', 15)
    .call(d3.drag()
      .on('start', function () {
        const img = d3.select(this.parentNode);
        const scale = d3.select('.line-container').attr('scale-data-holder') || 1;
        console.log(img.node()
          .getBoundingClientRect());
        const center = {
          x: img.node()
            .getBoundingClientRect()
            .left + (foreignObjectWidth * scale / 2), //* scale,
          y: img.node()
            .getBoundingClientRect()
            .top + (foreignObjectHeight * scale / 2), //* scale,
        };
        img.attr('x', center.x)
          .attr('y', center.y);
      })
      .on('drag', dragAngle));
}

function drawLines(svg) {
  const width = +d3.select(svg).attr('width');
  const height = +d3.select(svg).attr('height');

  const verticalData = d3.range(-width, width * 2, squareSize);
  d3.select(svg).select('.line-container').selectAll('.vertical-line')
    .data(verticalData)
    .enter()
    .append('line')
    .attr('class', 'vertical-line')
    .attr('stroke', '#000')
    .attr('x1', d => d)
    .attr('x2', d => d)
    .attr('y1', -height * 2)
    .attr('y2', height * 3);

  const horizontalData = d3.range(-height, height * 2, squareSize);
  d3.select(svg).select('.line-container').selectAll('.horizontal-line')
    .data(horizontalData)
    .enter()
    .append('line')
    .attr('class', 'horizontal-line')
    .attr('stroke', '#000')
    .attr('x1', -height * 2)
    .attr('x2', height * 3)
    .attr('y1', d => d)
    .attr('y2', d => d);

  d3.select(svg).select('.line-container').selectAll('line')
    .attr('stroke-width', strokeWidth)
    .attr('stroke-dasharray', strokeDash);
}

function zoomed() {
  const { k } = d3.event.transform;
  d3.select('.sign-container')
    .attr('transform', d3.event.transform)
    .selectAll('foreignObject');
  // .attr('transform', d1 => `rotate(${-d1.r}, ${d3.event.x}, ${d3.event.y})`);
  d3.select('.line-container')
    .attr('scale-data-holder', k)
    .attr('transform', d3.event.transform);

  d3.select('.line-container').selectAll('line')
    .attr('stroke-width', strokeWidth / k)
    .attr('stroke-dasharray', strokeDash / k);
}


const zoom = d3.zoom()
  .scaleExtent([0.4, 2])
  .on('zoom', zoomed);

export default {
  start(svg) {
    d3.select(svg)
      .append('g')
      .attr('class', 'line-container');

    d3.select(svg)
      .append('g')
      .attr('class', 'sign-container');

    d3.select(svg)
      .call(zoom);
  },
  draw(svg, inData) {
    data = inData;
    drawLines(svg);
    drawSigns(svg);
  },
  addSign(svg, sign) {
    const zoomLevels = d3.zoomTransform(d3.select(svg).node());
    data.push(sign);
    this.draw(svg, data);
    zoom.transform(d3.select(svg), zoomLevels);
  },
};
