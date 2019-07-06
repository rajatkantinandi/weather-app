import React from 'react'

export default function UnitToggle(props) {
    const { unit, handleUnitChange } = props;

    return <div className="toggle">
        <input type="checkbox" onChange={handleUnitChange} className="temp-toggle" id="temp-toggle" checked={unit === '˚C'} />
        <label htmlFor="temp-toggle"></label>
    </div>;
}