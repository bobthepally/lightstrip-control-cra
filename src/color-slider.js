import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import { HuePicker, AlphaPicker } from 'react-color';

// TODO: make this an import, I think?
var tinycolor = require('tinycolor2');

class ColorSlider extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            color: {
                hsv: {
                    h: 0,
                    s: 1,
                    v: 1,
                    a: 0,
                }
            }
        };

        /*
        this.props.color = {
            hsv: {
                h: 0,
                s: 1,
                v: 1,
                a: 0,
            }
        }
        */
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
    }

    handleColorChange(color) {

        let hue = color.hsv.h;
        let sat = color.hsv.s;
        
        let newColor = this.state.color;
        
        newColor.hsv.h = hue;
        newColor.hsv.s = sat;

        this.setState((prevState, props) => {
            prevState.color = newColor;
            return prevState;
        });

        this.updateParent(newColor);
    }

    // we're going to convert the alpha value to the v of hsv
    handleBrightnessChange(color) {
        
        let brightness = color.hsv.a;
        
        let newColor = this.state.color;
        newColor.hsv.v = brightness;

        this.setState((prevState, props) => {
            prevState.color.hsv.v = brightness;
            return prevState;
        });

        this.updateParent(newColor);

    }

    updateParent(p_color) {
        // we'll convert the color to rgb first
        let rgb_color = tinycolor(p_color.hsv).toRgb();
        p_color.rgb = rgb_color;

        this.props.onChange(rgb_color);
    }

    render() {

        //const colorValue = this.state.color;
        //const test = {h: 100, s: 0, v: 0, a: 0.75}; 

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
