import React, { Component } from 'react';

class ColorCircle extends Component {
    
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        let e = evt.target;
        let dim = e.getBoundingClientRect();
        let x = evt.clientX - dim.left;
        let y = evt.clientY - dim.top;

        alert("x: " + x + " y: " + y);
    }
    
    render() {
        return (
            <div style={
                {
                    background: "conic-gradient(red, orange, yellow, lime, blue, violet, red 95%)",
                    clipPath: "circle(29%)"
                }} >
                <svg>
                    <circle cx="50%" cy="50%" r="30%" fill="transparent" onClick={this.handleClick} />
                </svg>
            </div>
        );
    }
};

export default ColorCircle;

/*
                <rect x={0} y={0} width="100%" height="100%" fill="red" /> 

                <foreignObject x={0} y={0}  clipPath="url(#circlePath)">
                    <div style={{backgroundColor: "red"}} />
                </foreignObject>

*/
