/* React Core Libraries */
import React, { Component } from 'react';

/* Material-UI Components */
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';

const styles = {
    colorslider: {
        width: 300
    }
}

class LightstripMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            red: 0,
            green: 0,
            blue: 0,
        }

        this.updateColor = this.updateColor.bind(this);
        this.sendLightstripColor = this.sendLightstripColor.bind(this);
        //this.getRGBString = this.getRGBString.bind(this);
    }

    updateColor(color, value) {
        this.setState( (prevState, props) => {
            return prevState[color] = value
        });

    }

    getRGBString(r, g, b) {
        var rgbStr = 'rgb(' + [r, g, b].join(',') + ')';
        
        //console.log(rgbStr);
        
        return rgbStr;
    }

    sendLightstripColor() {
        var portAddr = "";

        // TODO: figure out where to store the relevant endpoint of the REST API rather than in this function
        var setEndpoint = "/set";

        if (window.location.href != "")
            portAddr = ":" + parseInt(window.location.port);

        // Hard-coding http in here until it becomes a problem
        var dest = "http://" + window.location.hostname + portAddr + setEndpoint;

        var colorJson = {
            red: this.state.red,
            green: this.state.green,
            blue: this.state.blue
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(colorJson)
        };

        fetch(dest, requestOptions)
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
            })
            .catch(error => {
                console.error('Error sending colors to server', error);
            });

        console.log("Sending POST request to backend at: " + dest);

    }

    render() {
        return (
            <div>
                <div>
                    <div style={{
                        backgroundColor: this.getRGBString(this.state.red, this.state.green, this.state.blue), 
                        height: 40,
                    }} />
                
                    <Grid container spacing={1} alignItems="flex-start" direction="column">

                        <Grid item>
                            <ColorSlider
                                color="red"
                                updateColor={this.updateColor}
                            />
                        </Grid>

                        <Grid item>
                            <ColorSlider
                                color="green"
                                updateColor={this.updateColor}
                            />
                        </Grid>

                        <Grid item>
                            <ColorSlider
                                color="blue"
                                updateColor={this.updateColor}
                            />
                        </Grid>
                    
                    </Grid>
                </div>

                <div>
                    <Button onClick={() => this.sendLightstripColor()} variant="contained" color="primary">Submit</Button>
                </div>
            </div>
        )
    }
}

class ColorSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorValue: 0
        }

        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleColorChange(e, newValue) {
        this.setState({
            colorValue: newValue
        })

        this.props.updateColor(this.props.color, newValue);
    }

    handleInputChange(event) {
        // TODO: input validation here

        var newValue = event.target.value === '' ? '' : Number(event.target.value)

        if (newValue > 255)
            newValue = this.state.colorValue;

        this.setState({
            colorValue: newValue
        })

        this.props.updateColor(this.props.color, newValue);
    }

    render() {
        return (
            <div className="colorslider">
                <Grid container spacing={2}>
                    <Grid item>
                        <Slider
                            style={styles.colorslider}
                            value={this.state.colorValue}
                            onChange={this.handleColorChange}
                            max={255}
                            min={0}
                            type='number'
                            aria-labelledby="input-slider"
                        />
                    </Grid>

                    <Grid item>
                        <Input
                            value={this.state.colorValue}
                            margin="dense"
                            onChange={this.handleInputChange}
                            inputProps={{
                                min: 0,
                                max: 255,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default LightstripMain;
