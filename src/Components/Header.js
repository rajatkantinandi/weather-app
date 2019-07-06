import React from 'react';
import UnitToggle from './UnitToggle'

export default function Header(props) {
    const { locationName, unit, handleUnitChange } = props;

    return <header className="header">
        <div className="icon-pin" />
        <h1 className="place">{locationName}</h1>
        <UnitToggle {...{ unit, handleUnitChange }} />
    </header>;
}