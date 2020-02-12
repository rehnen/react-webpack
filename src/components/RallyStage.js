import React, { Component, createRef } from 'react';
import Rally from '../rallyD3';

const data = [
  {
    a: 1, x: 1, y: 1, r: 0, class: 'beginner', number: 104,
  },
  {
    a: 2, x: 1, y: 1, r: 0, class: 'beginner', number: 104,
  },
  {
    a: 3, x: 1, y: 1, r: 0, class: 'beginner', number: 104,
  },
  {
    a: 4, x: 1, y: 1, r: 0, class: 'beginner', number: 104,
  },
];

export default class RallyStage extends Component {
  constructor() {
    super();
    this.svg = createRef();
    this.state = { width: window.innerWidth - 100, height: window.innerHeight - 100 };
    this.resize = () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', this.resize);
  }

  componentDidMount() {
    Rally.start(this.svg.current);
    Rally.draw(this.svg.current, data);
  }

  render() {
    const {
      height = 500,
      width = 500,
    } = this.state;

    return (
      <div>
        <svg
          width={width}
          height={height}
          ref={this.svg}
          style={{ border: '1px solid black' }}
        />
      </div>
    );
  }
}
