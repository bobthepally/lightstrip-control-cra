import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

var tinycolor = require('tinycolor2')

const colorPalette = {
    lightest: "#f0f1f3",
    light: "#7cdbef",
    middle: "#308EE4",
    dark: "#21408F",
    darkest: "#131D44"
};

const buttonStyle = {
    color: colorPalette.lightest,
    backgroundColor: colorPalette.dark,
};


class ColorPalette extends Component {
    constructor(props) {
        super(props);

        this.handleSelectedChange = this.handleSelectedChange.bind(this);
    }

    handleSelectedChange(index) {
        this.props.onChange(index);
    }

    handlePaletteChange(operation) {
        // "add" increments the number of colors
        // "remove" decrements it
        // but this is handled at the level above

        this.props.onPaletteChange(operation);
    }

    render() {

        let colorSquares = this.props.colors.map( (c, i) => <ColorSquare color={c.value} index={i} border={i === this.props.selectedColor} onClick={this.handleSelectedChange} key={c.id} />);
        
        return (
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px", alignItems: "center" }} >

                <Button variant="constrained" color="inherit" style={buttonStyle} onClick={() => { this.handlePaletteChange("remove") }} >-</Button>

                { colorSquares }
            
                <Button variant="constrained" color="inherit" style={buttonStyle} onClick={() => { this.handlePaletteChange("add") }} >+</Button>

                {/*
                <svg width="25" height="25">
                    <rect width="25" height="25" rx="5" fill="lightblue" strokeWidth="3" stroke="black" />
                    <rect width="20" height="5" x="2.5" y="10" fill="black" />
                    <rect width="5" height="20" x="10" y="2.5" fill="black" />
                </svg>
                */}
            
            </div>
        );
    }
}

// Helper class solely to store the index of the square (there has to be a better way to do this)
class ColorSquare extends Component {
    constructor(props) {
        super(props);

        this.updateSelected = this.updateSelected.bind(this);
    }

    static defaultProps = {
        index: -1,
        color: "black",
        border: false,
        width: 35,
        height: 35,
        rx: 10
    }

    updateSelected() {
        this.props.onClick(this.props.index);
    }

    render() {
        let hexColor = tinycolor(this.props.color).toHexString();
        let selectedOutline = this.props.border ? 3 : 0;

        return (
            <svg width={this.props.width} height={this.props.height} >
                <rect width={this.props.height} height={this.props.width} rx={this.props.rx} fill={hexColor} strokeWidth={selectedOutline} stroke="white" onClick={this.updateSelected} />
            </svg>
        )
    }
}

export default ColorPalette;
