import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import { HuePicker, AlphaPicker } from 'react-color';

class ColorSlider extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            color: {
                hsv: {
                    h: 0,
                    s: 1,
                    v: 1,
                    a: 1,
                }
            }
        };

        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
    }

    handleColorChange(color) {

        let hue = color.hsv.h;
        let sat = color.hsv.s;
        this.setState((prevState, props) => {
            prevState.color.hsv.h = hue;
            prevState.color.hsv.s = sat;
            return prevState;
        });

        //console.log(this.state);
    }

    // we're going to convert the alpha value to the v of hsv
    handleBrightnessChange(color) {
        let brightness = color.hsv.a;

        this.setState((prevState, props) => {
            prevState.color.hsv.v = brightness;
            return prevState;
        });

        //console.log(this.state);

    }


    render() {

        const colorValue = this.state.color;
        //const test = {h: 100, s: 0, v: 0, a: 0.75}; 

        const brightness = {
            h: this.state.color.hsv.h,
            s: this.state.color.hsv.s,
            v: 1,
            a: this.state.color.hsv.v
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
