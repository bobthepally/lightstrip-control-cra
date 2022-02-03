import React, { Component } from 'react';

import Box from '@material-ui/core/Box'

var tinycolor = require('tinycolor2')

class ColorPalette extends Component {
    constructor(props) {
        super(props);

        this.state = {
            colors: ["red", "green", "blue"]
        }

    }

    renderColorSquare(p_color) {
        let hexColor = tinycolor(p_color).toHexString();

        return (
            <svg width="35" height="35" >
                <rect width="35" height="35" rx="15" fill={hexColor} />
            </svg>
        )
    }

    render() {
        let currentColor = this.props.color;

        let colorSquares = this.state.colors.map( c => this.renderColorSquare(c));

        return (
            <Box>
                { colorSquares }
            </Box>
        );
    }
}

export default ColorPalette;
