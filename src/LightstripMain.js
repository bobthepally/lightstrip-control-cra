/* React Core Libraries */
import React, { Component } from 'react';

/* Material-UI Components */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';

/* react-color components */
import { SketchPicker } from 'react-color';

// Custom color slider component
import ColorSlider from './color-slider';

class LightstripMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            color: {
                r: 0,
                g: 0,
                b: 0
            },
            pattern: 0,
        }

        this.handlePatternChange = this.handlePatternChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.sendLightstripColor = this.sendLightstripColor.bind(this);
    }

    handleColorChange(p_color) {

        this.setState((prevState, props) => {
            return {
                color: p_color,
                pattern: prevState.pattern
            }
        });
        // console.log("r: " + color.rgb.r);

        //this.setState(color.rgb);
    }

    handlePatternChange(event) {
        event.persist();

        this.setState((prevState, props) => {
            let p_pattern = parseInt(event.target.value);

            return {
                color: prevState.color,
                pattern: p_pattern
            }
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

        var colorJson = {
            red: this.state.color.r,
            green: this.state.color.g,
            blue: this.state.color.b,
            pattern: this.state.pattern,
        }

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
        // const colorValue = this.state.color
        const pattern = this.state.pattern;

        return (
            <div>
                <div style={{
                   margin: "auto",
                   width: "95%",
                   padding: "10px"
                }}>
                
                    <Grid container spacing={1} alignItems="flex-start" direction="column">
                        <Grid item> 
                            <ColorSlider onChange={this.handleColorChange} />
                        </Grid>

                        <Grid item>
                            <FormControl component="fieldset">
                                {/*<FormLabel component="legend">Pattern</FormLabel>*/}
                                <RadioGroup aria-label="pattern" value={pattern} onChange={this.handlePatternChange} >
                                    <FormControlLabel value={1} control={<Radio />} label="Dots"  />
                                    <FormControlLabel value={0} control={<Radio />} label="Solid"  />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                    </Grid>

                </div>

                <div style={{
                    margin: "auto",
                    width: "95%",
                    padding: "10px"
                }}>
                    <Button onClick={() => this.sendLightstripColor()} variant="contained" color="primary">Submit</Button>
                </div>
            </div>
        )
    }
}

export default LightstripMain;
