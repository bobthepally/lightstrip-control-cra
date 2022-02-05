import React, { Component } from 'react';

var tinycolor = require('tinycolor2')

class ColorPalette extends Component {
    constructor(props) {
        super(props);

        this.handleSelectedChange = this.handleSelectedChange.bind(this);
    }

    handleSelectedChange(index) {
        this.props.onChange(index);
    }

    render() {

        let colorSquares = this.props.colors.map( (c, i) => <ColorSquare color={c.value} index={i} border={i === this.props.selectedColor} onClick={this.handleSelectedChange} key={c.id} />);
        
        return (
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px" }} >
                { colorSquares }
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
        border: false
    }

    updateSelected() {
        this.props.onClick(this.props.index);
    }

    render() {
        let hexColor = tinycolor(this.props.color).toHexString();
        let selectedOutline = this.props.border ? 3 : 0;

        return (
            <svg width="35" height="35" >
                <rect width="35" height="35" rx="10" fill={hexColor} strokeWidth={selectedOutline} stroke="white" onClick={this.updateSelected} />
            </svg>
        )
    }
}

export default ColorPalette;
