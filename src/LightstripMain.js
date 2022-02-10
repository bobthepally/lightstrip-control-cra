/* React Core Libraries */
import React, { Component } from 'react';

/* Material-UI Components */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';

import { v4 as uuidv4 } from 'uuid';

// Pre-built color circle
import CircularColor from 'react-circular-color';

// Custom color slider component
import ColorSlider from './color-slider';

// Custom color palette component
import ColorPalette from './color-palette.js'

var tinycolor = require('tinycolor2');

// TODO: figure out how css is properly done in a react app
const colorPalette = {
    lightest: "#f0f1f3",
    light: "#7cdbef",
    middle: "#308EE4",
    dark: "#21408F",
    darkest: "#131D44"
};

const textInputStyle = {
    color: colorPalette.lightest,
    backgroundColor: colorPalette.dark,
    borderRadius: "5px",
    paddingLeft: "5px",
    paddingRight: "5px"
};

const radioButtonStyle = {
    color: colorPalette.lightest,
    backgroundColor: colorPalette.dark,
    borderRadius: "5px",
    paddingLeft: "5px",
};

const radioStyle = {
    color: colorPalette.middle,
};

const buttonStyle = {
    color: colorPalette.lightest,
    backgroundColor: colorPalette.dark,
};

class LightstripMain extends Component {
    constructor(props) {
        super(props);

        let startingColor = {
            r: 0,
            g: 0, 
            b: 0
        };
    
        // attaches a unique uuid key to each color, for use in a list later
        let startingColorPalette = [startingColor].map(c => { return { id: uuidv4(), value: c };});

        this.state = {
            color: startingColor,
            pattern: 0,
            palette: {
                colors: startingColorPalette, 
                selectedColor: 0
            }
        }

        this.handlePatternChange = this.handlePatternChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.sendLightstripColor = this.sendLightstripColor.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handlePaletteQuantityChange = this.handlePaletteQuantityChange.bind(this);
    }

    handleColorChange(p_color) {

        let rgb = tinycolor(p_color).toRgb();

        this.setState((prevState) => {
            let index = prevState.palette.selectedColor;
            prevState.color = rgb;
            prevState.palette.colors[index].value = rgb;
            return prevState;
        });
        // console.log("r: " + color.rgb.r);

    }

    handlePatternChange(event) {
        let p_pattern = parseInt(event.target.value);

        // note that setState is async, so the event is garbage collected by the time it's called. 
        // this is why the parseInt function happens outside setState
        this.setState((prevState) => {
            prevState.pattern = p_pattern;
            return prevState;
        });
    }

    handleSelectedChange(index) {

        let newSelectedColor = tinycolor(this.state.palette.colors[index].value).toRgb();

        this.setState((prevState) => {
            prevState.palette.selectedColor = index;
            prevState.color = newSelectedColor;
            return prevState;
        });
    }

    handleInputChange(event, color) {

        let newValue = event.target.value === '' ? '' : Number(event.target.value)

        if (newValue > 255)
            newValue = 255;

        let newColor = this.state.color;
        if (color === "red")
            newColor.r = newValue;
        else if (color === "green")
            newColor.g = newValue;
        else if (color === "blue")
            newColor.b = newValue;

        this.handleColorChange(newColor);
    }

    handlePaletteQuantityChange(operation) {
        
        let newPalette = this.state.palette;
        if (operation === "add") {
            let newColor = {
                id: uuidv4(),
                value: {r: 0, g: 0, b: 0}
            }

            newPalette.colors.splice(this.state.palette.selectedColor + 1, 0, newColor);
            
            // switch the currently selected palette to the new one
            newPalette.selectedColor++;

        } else if (operation === "remove") {            
            // make sure there's at least one color remaining
            if (newPalette.colors.length <= 1)
                return

            newPalette.colors.splice(this.state.palette.selectedColor, 1);

            // decrement the selectedColor counter, but *not* below zero
            if (newPalette.selectedColor > 0)
                newPalette.selectedColor--;

        } else {
            console.error("Error: invalid palette operation");
            return;
        }

        this.setState((prevState) => {
            prevState.palette = newPalette;
            prevState.color = tinycolor(newPalette.colors[newPalette.selectedColor].value).toRgb(); // this just does what handleSelectedChange() does but oh well.
            return prevState;
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
        var setEndpoint = "/api/set";

        if (window.location.href !== "") {
            
            var port = parseInt(window.location.port);
            if (Number.isNaN(port)) // If no port is specified in the URL, assume port 80
                port = 80
            
            portAddr = ":" + port
        }

        // Hard-coding http in here until it becomes a problem
        var dest = "http://" + window.location.hostname + portAddr + setEndpoint;

        // strip the ID and alpha values out of the colors
        var colors = this.state.palette.colors.map(c => { return {r: c.value.r, g: c.value.g, b: c.value.b}; });
        // console.log(colors);

        var colorJson = {
            colors: colors,
            pattern: this.state.pattern,
            selectedColor: this.state.palette.selectedColor
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(colorJson)
        };

        console.log("Sending " + requestOptions.method + " request to backend at: " + dest);

        fetch(dest, requestOptions)
            .then(async response => {
                const data = await response;

                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
            })
            .catch(error => {
                console.error('Error sending colors to server', error);
            });
    }

    render() {
        const colorValue = this.state.color
        const pattern = this.state.pattern;
        const hexValue = tinycolor(colorValue).toHexString();

        // console.log(hexValue);

        return (
            <div>
                <div style={{
                   margin: "auto",
                   width: "95%",
                   padding: "10px"
                }}>
                
                    <Grid container spacing={1} alignItems="flex-start" direction="column">

                        <Grid item> 
                            <CircularColor size={320} onChange={this.handleColorChange} numberOfSectors={360} color={hexValue} />
                        </Grid>

                        <Grid item> 
                            <ColorSlider onChange={this.handleColorChange} color={colorValue} showHueSlider={false} />
                        </Grid>

                        <Grid item>
                            <Grid container spacing={2}> 
                                <Grid item>
                                    <Input
                                        value={colorValue.r}
                                        margin="dense"
                                        style={textInputStyle}
                                        onChange={(e) => {this.handleInputChange(e, "red");}}
                                        inputProps={{
                                            min: 0,
                                            max: 255,
                                            type: 'number'
                                        }}
                                    />
                                </Grid>

                                <Grid item>
                                    <Input
                                        value={colorValue.g}
                                        margin="dense"
                                        style={textInputStyle}
                                        onChange={(e) => {this.handleInputChange(e, "green");}}
                                        inputProps={{
                                            min: 0,
                                            max: 255,
                                            type: 'number'
                                        }}
                                    />
                                </Grid>

                                <Grid item>
                                    <Input
                                        value={colorValue.b}
                                        margin="dense"
                                        style={textInputStyle}
                                        onChange={(e) => {this.handleInputChange(e, "blue");}}
                                        inputProps={{
                                            min: 0,
                                            max: 255,
                                            type: 'number'
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <ColorPalette colors={this.state.palette.colors} selectedColor={this.state.palette.selectedColor} onChange={this.handleSelectedChange} onPaletteChange={this.handlePaletteQuantityChange} />
                        </Grid>

                        <Grid item>
                            <FormControl component="fieldset">
                                {/*<FormLabel component="legend">Pattern</FormLabel>*/}
                                <RadioGroup aria-label="pattern" value={pattern} onChange={this.handlePatternChange} style={radioButtonStyle}>
                                    <FormControlLabel value={0} control={<Radio style={radioStyle} />} label="Solid"        />
                                    <FormControlLabel value={1} control={<Radio style={radioStyle} />} label="Fade"         />
                                    <FormControlLabel value={2} control={<Radio style={radioStyle} />} label="Cycle"         />
                                    <FormControlLabel value={3} control={<Radio style={radioStyle} />} label="Rainbow"      />
                                    <FormControlLabel value={4} control={<Radio style={radioStyle} />} label="Beat-Saber"   />
                                    <FormControlLabel value={5} control={<Radio style={radioStyle} />} label="Karaoke"      />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                    </Grid>

                </div>

                <div style={{
                    margin: "auto",
                    width: "95%",
                    padding: "10px",
                }}>
                    <Button onClick={() => this.sendLightstripColor()} variant="contained" color="inherit" style={buttonStyle} >Submit</Button>
                </div>
            </div>
        )
    }
}

export default LightstripMain;
