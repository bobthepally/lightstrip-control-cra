import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import { HuePicker, AlphaPicker } from 'react-color';

// TODO: make this an import, I think?
var tinycolor = require('tinycolor2');

class ColorSlider extends Component {
    
    constructor(props) {
        super(props);

        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
    }

    handleColorChange(color) {

        color.v = 1;
        color.a = 1;

        this.updateParent(color);
    }

    // we're going to convert the alpha value to the v of hsv
    handleBrightnessChange(color) {
        
        let brightness = color.hsv.a;
        
        color.hsv.v = brightness;
        color.hsv.a = 1;

        this.updateParent(color);

    }

    updateParent(p_color) {
        // we'll convert the color to rgb first
        let rgb_color = tinycolor(p_color.hsv).toRgb();
        p_color.rgb = rgb_color;

        this.props.onChange(rgb_color);
    }

    render() {

        const colorValue = this.props.color;
        const colorHSV = tinycolor(colorValue).toHsv();
        
        const brightness = {
            h: colorHSV.h,
            s: colorHSV.s,
            v: 1,
            a: colorHSV.v
        };

        return (
            <div className="colorslider">
                <Grid container spacing={1} alignItems="flex-start" direction="column">
                    <Grid item>
                        <HuePicker onChange={this.handleColorChange} color={colorValue} />
                    </Grid>

                    <Grid item>
                        <AlphaPicker onChange={this.handleBrightnessChange} color={brightness} />
                    </Grid>
                
                </Grid>
            </div>
        );
    }

}

export default ColorSlider;
