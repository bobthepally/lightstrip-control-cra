import React, { Component } from 'react';
// import { tinycolor } from 'tinycolor2';

// TODO: change this into an import statement
var tinycolor = require('tinycolor2');

class ColorCircle extends Component {
    
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.updateParentColor = this.updateParentColor.bind(this);
    }

    // taken from the arduino map() function
    mapRange(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    handleClick(evt) {
        let e = evt.target;
        let dim = e.getBoundingClientRect();
        let x = evt.clientX - dim.left;
        let y = evt.clientY - dim.top;

        let centerx = dim.width / 2;
        let centery = dim.height / 2;

        let cartesianX = x - centerx;
        let cartesianY = y - centery;

        // set 0 theta to the top of the circle, then normalize it to the range of 0 to 2*PI
        let theta = Math.atan2(cartesianY, cartesianX) + (Math.PI / 2);
        theta = (theta + 2 * Math.PI) % (2 * Math.PI)

        //let r = Math.sqrt(cartesianX * cartesianX + cartesianY * cartesianY);

        let degrees = theta * (180 / Math.PI);

        let hue = this.mapRange(degrees, 0, 360, 0, 360);

        let color = {
            h: hue,
            s: 1,
            v: 1,
            a: 1
        }

        this.updateParentColor(color);
    }

    updateParentColor(p_color) {
        let rgb_color = tinycolor(p_color).toRgb();
        // p_color.rgb = rgb_color;
        
        console.log(rgb_color);

        this.props.onChange(rgb_color);
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
