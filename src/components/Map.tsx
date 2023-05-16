

import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from "react-dom/server";
import RoomIcon from '@mui/icons-material/Room';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L, { LatLngTuple } from "leaflet";
import { IconButton, Typography } from '@mui/joy';
const numWords = require('num-words');
// import L from 'leaflet-iconmaterial'

export const MapLayout = ({ markers }: any) => {
    const [position, setPosition] = useState<LatLngTuple>([51.505, -0.09])
    const iconMarkup = renderToStaticMarkup(
        <IconButton variant="plain">
            <RoomIcon />
        </IconButton>

    );
    function stringToColor(string:string) {
        let hash = 0;
        let i;
        let word = `${numWords(string)}`.trim();
        /* eslint-disable no-bitwise */
        for (i = 0; i < word.length; i += 1) {
          hash = word.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
    //   console.log('inrandom color ',string,word,color);
      
        return color;
      }
      
    
    // const customMarkerIcon = L.divIcon({
    //     html: iconMarkup,
    // });
    const customMarker: any = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40]
    });

    const customMarkerF=(communityId:string)=>{
        const color=stringToColor(communityId)
        // const iconPerson = new L.Icon({
        //     iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Font_Awesome_5_solid_map-marker-alt.svg",
        //     iconSize: new L.Point(25, 41),
            
        // });
        const myCustomColour = '#0c191b'

                const markerHtmlStyles = `
                background-color: ${color};
                width: 2rem;
                height: 2rem;
                display: block;
                left: -1.5rem;
                top: -1.5rem;
                position: relative;
                border-radius: 3rem 3rem 0;
                transform: rotate(45deg);
                border: 1px solid #FFFFFF
                text-align: center;
                `
                const textStyles = `
                position: absolute;
                transform: rotate(-42deg);
                text-align: center;
                left: 7px;
                top: 7px;
                bottom: 0;
                right: 0px;
                color: white;
                `

   // <span style="${textStyles}">
                // ${communityId}
                // </span>
                const icon = L.divIcon({
                className: "my-custom-pin",
                iconAnchor: [0, 24],
                popupAnchor: [0, -36],
                html: `<span style="${markerHtmlStyles}" >
                </span>
                `
                })
                return icon
    }
    const iconPerson = new L.Icon({
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Font_Awesome_5_solid_map-marker-alt.svg",
        iconSize: new L.Point(25, 41),
    });
    const ComponentResize = () => {
        const map = useMap()

        setTimeout(() => {
            map.invalidateSize()
        }, 0)

        return null
    }
    function LocationMarker() {
        const map = useMapEvents({
            click() {
                map.locate()
            },
            locationfound(e: any) {
                setPosition(e.latlng)
                map.flyTo(e.latlng, map.getZoom())
            },
        })

        return position === null ? null : (
            <Marker
                icon={customMarkerF("126")}
                position={position}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }
   
    return (
        <MapContainer
            style={{
                height: "100%",
                width: "100%",
            }}
            center={position}
            zoom={13}
            scrollWheelZoom={true}
        >
            <ComponentResize />
            <TileLayer
                // className={'ion-hide'}
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers[0] !== undefined ? markers?.map((row: any,index:number) => (
                <>
                {index<10?
                console.log('color',row?.communityId,stringToColor(row?.communityId)):""
                }
                <Marker
                    key={row?.id}
                    icon={customMarkerF(`${row?.communityId}`)}
                    position={row?.coordinates}>
                    <Popup>
                        <Typography level='h4'>{row?.name}</Typography>
                        {`
                   Id: ${row?.ID},
                    name: ${row?.name} ,
                    type: ${row?.type} ,
                    communityId: ${row?.communityId} `
                    }</Popup>
                </Marker> 
                </>
            )) : <></>}   
            <LocationMarker />
        </MapContainer>
    )
}