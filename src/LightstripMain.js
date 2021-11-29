/* React Core Libraries */
import React, { Component } from 'react';

/* Material-UI Components */
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';

/* react-color components */
import { SketchPicker } from 'react-color';

const styles = {
    colorslider: {
        width: 300
    }
}

class LightstripMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        }

        this.sendLightstripColor = this.sendLightstripColor.bind(this);
    }

    handleColorChange = (color) => {

        console.log("r: " + color.rgb.r);

        this.setState(color.rgb);
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
            red: this.state.r,
            green: this.state.g,
            blue: this.state.b
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
        const colorValue = {r: this.state.r, g: this.state.g, b: this.state.b };

        return (
            <div>
                <div style={{
                   margin: "auto",
                   width: "95%",
                   padding: "10px"
                }}>
                
                    <Grid container spacing={1} alignItems="flex-start" direction="column">
                        <SketchPicker 
                            style={{
                                border: "none"
                            }}
                            disableAlpha={true}
                            color={colorValue}
                            onChange={this.handleColorChange}
                        />
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
