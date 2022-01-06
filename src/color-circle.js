import React, { Component } from 'react';

class ColorCircle extends Component {
    render() {
        return (
            <svg>
                <clipPath id="circlePath" viewBox="0 0 100 200" >
                    <circle cx="50%" cy="50%" r="30%" />
                </clipPath>

                <g clipPath="url(#circlePath)">
                   <foreignObject x="0" y="0" width="100%" height="100%" >
                       <div style={{
                           display: "inline-block",
                           width: 200,
                           height: 200,
                           background: "conic-gradient(red, orange, yellow, green, blue, violet)"}} >
                        </div>
                   </foreignObject>
                </g>

            </svg>
        );
    }
};

export default ColorCircle;

/*
                <rect x={0} y={0} width="100%" height="100%" fill="red" /> 

                <foreignObject x={0} y={0}  clipPath="url(#circlePath)">
                    <div style={{backgroundColor: "red"}} />
                </foreignObject>

*/
