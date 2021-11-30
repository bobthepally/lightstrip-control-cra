import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import { HuePicker } from 'react-color';

class ColorSlider extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            color: {
                h: 0,
                s: 0,
                v: 0,
            }
        };
    }

    render() {

        return (
            <div className="colorslider">
                <Grid>
                    <HuePicker />
                </Grid>
            </div>
        );
    }

}

export default ColorSlider;
