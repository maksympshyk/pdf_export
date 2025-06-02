import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import features from '../data/features.json';
import { geoCentroid } from "d3-geo";
import { Annotation } from "react-simple-maps";

type Location = {
    lat: number;
    long: number;
    country: string;
    // Add other properties if needed
};

interface WorldMapProps {
    locations: Location[];
}

type GeographyType = {
  rsmKey: string;
  id: string;
  // Add more if needed
};

const WorldMap: React.FC<WorldMapProps> = ({ locations }) => {
    return (
        <div className="bg-[#aeaeae]">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ 
                    center: [-10, 20], // Adjust the center of the map
                    // scale: 150
                }}
            >
                <Geographies geography={features} stroke="#FFF">
                    {({ geographies }: { geographies: GeographyType[] }) =>
                        geographies.map((geo) => {
                            const isLocation = locations.some(
                                element => (element.country === geo.id)
                            );

                            const filledColor = isLocation ? '#a4b5e7' : '#ffffff';
                            return (
                                <g key={geo.rsmKey}>
                                    <Geography key={geo.rsmKey} geography={geo} fill={filledColor} />
                                    {isLocation && (
                                        <Annotation
                                            subject={geoCentroid(geo as any)}
                                            dx={0}
                                            dy={0}
                                            connectorProps={{ stroke: "none" }}
                                            >
                                            <text
                                                textAnchor="middle"
                                                fontSize={4}
                                                fill="#222"
                                                style={{ pointerEvents: "none" }}
                                            >
                                                {(geo as any).properties?.NAME || (geo as any).properties?.name || geo.id}
                                            </text>
                                        </Annotation>
                                    )}
                                </g>
                            )
                        })
                    }
                </Geographies>
                {locations.map((loc, i) => (
                    <Marker key={i} coordinates={[loc.long, loc.lat]}>
                    <circle r={7} fill="#303b76" />
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    )
}

export default WorldMap;