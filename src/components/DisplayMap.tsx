import { DivIcon, Icon, Marker as LeafletMarker, Util, type LatLngBoundsExpression, DomUtil, type LatLngTuple } from "leaflet"
import { useEffect, useRef, useState } from "react"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap  } from "react-leaflet"
import { destinations, routes, destinationTypes, type Route, type RouteDestination } from "../data/route"

const defaultMarker = new DivIcon({
    className: `marker`,
    html: `<span class="material-symbols-rounded"></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -40],
})

const CAR_SPEED: number = 10
const FPS: number = 30

const requiredDelta = 1000 / FPS

function lerp(a: number, b: number, t: number) {
    return a + t * (b - a)
}

function lerpBetweenPoints(a: [number, number], b: [number, number], t: number): [number, number] {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]
}

function getSegmentDistance(pa: [number, number], pb: [number, number]) {
    // Squared distance since Math.sqrt() is slow
    // Math.sqrt(x)^2 = x
    const a = pa[0] - pb[0]
    const b = pa[1] - pb[1]

    return Math.sqrt(a * a + b * b)
}

function MovingCar() {
    const map = useMap()
    map.doubleClickZoom.disable()

    const car = useRef<LeafletMarker>(new LeafletMarker([0,0]))
    const [carPosition, setCarPosition] = useState<[number, number]>([0, 0])

    const running = useRef<boolean>(true)
    const routeIndex = useRef<number>(0)

    const direction = useRef<number>(1)

    const nodeIndex = useRef<number>(0)
    const nodeT = useRef<number>(0)

    const lastTime = useRef(0)

    const [highlighted, setHighlighted] = useState(0)

    const carIcon = new Icon({
        iconUrl: '/car.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    })

    function getCurrentRoute() {
        return routes[routeIndex.current]
    }

    function startCar() {
        function animate(elapsed: number) {
            const dt = elapsed - lastTime.current
            if (dt === 0) {
                return
            }

            if (dt >= requiredDelta) {
                lastTime.current = elapsed
                
                const route = getCurrentRoute()
    
                const pointA = route.nodes[nodeIndex.current]
                const pointB = route.nodes[nodeIndex.current + 1]

                const interpolatedPoint = lerpBetweenPoints(pointA, pointB, nodeT.current)

                setCarPosition(interpolatedPoint)
    
                const segmentDistance = getSegmentDistance(pointA, pointB) * 8388608 // Multiply by a large number to make numbers more reasonable
    
                nodeT.current += dt * direction.current * CAR_SPEED / segmentDistance
    
                if (nodeT.current > 1) {
                    nodeT.current = 0
                    nodeIndex.current++

                    if (nodeIndex.current + 1 >= route.nodes.length) {
                        routeIndex.current = routeIndex.current + 1
                        
                        if (routeIndex.current === routes.length) {
                            routeIndex.current--
                            direction.current = -1
                            nodeIndex.current = getCurrentRoute().nodes.length - 2
                        } else {
                            nodeIndex.current = 0
                        }
                        
                        setHighlighted(routeIndex.current)
                    }
                } else if (nodeT.current < 0) {
                    nodeT.current = 1
                    nodeIndex.current--

                    if (nodeIndex.current <= -1) {
                        routeIndex.current = routeIndex.current - 1
                        
                        if (routeIndex.current === -1) {
                            routeIndex.current = 0
                            direction.current = 1
                            nodeIndex.current = 0
                        } else {
                            nodeIndex.current = getCurrentRoute().nodes.length - 2
                        }

                        setHighlighted(routeIndex.current)
                    }
                }
            }

            if (running.current) {
                Util.requestAnimFrame(animate)
            }
            map.invalidateSize()
        }

        if (running.current) {
            Util.requestAnimFrame(animate)
        }
    }

    function toggleCar() {
        if (running.current) {
            running.current = false
        } else {
            running.current = true
            startCar()
        }
    }

    useEffect(startCar, [])

    function setRoute(index: number) {
        if (index === routeIndex.current) return

        routeIndex.current = index
        setHighlighted(index)

        if (index === 0) {
            direction.current = 1
        } else if (index + 1 === routes.length) {
            direction.current = -1
        }

        nodeIndex.current = direction.current === 1 ? 0 : getCurrentRoute().nodes.length - 2
        nodeT.current = direction.current === 1 ? 0 : 1
    }

    return (<>
        <Marker position={carPosition} icon={carIcon} ref={car} attribution='<a href="https://www.svgrepo.com/svg/452176/car">Colored Interface And Logo Icons Collection</a>, Paths using <a href="https://www.graphhopper.com/">GraphHopper</a>' eventHandlers={{ popupopen: toggleCar, popupclose: toggleCar }}>
            <Popup>
                Taxi Car
            </Popup>
        </Marker>
        <RoutesDisplay routes={routes} setRoute={setRoute} highlighted={highlighted} />
    </>)
}

function DestinationMarkers({ setPopupIndex }: { setPopupIndex: (n: number) => void }) {
    const typeIcons: Map<string, DivIcon> = new Map()
    const map = useMap()
    const timeoutId = useRef(-1)

    for (const type of destinationTypes) {
        if (type.icon) {
            typeIcons.set(type.id, new DivIcon({
                className: `marker marker-${type.id}`,
                html: `<span class="material-symbols-rounded"><span>${type.icon}</span></span>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -40],
            }))
        }
    }

    function handleClick(v: RouteDestination, i: number) {
        setPopupIndex(i)
        if (timeoutId.current !== -1) clearTimeout(timeoutId.current)
        map.panTo([v.lat, v.lng], { duration: 0.3 })

        timeoutId.current = setTimeout(() => {
            map.panTo([v.lat, v.lng], { duration: 0.3 })
            timeoutId.current = -1
        }, 300)
    }

    return <>
        {destinations.map((v, i) => 
            <Marker position={[v.lat, v.lng]} icon={typeIcons.get(destinationTypes[v.type].id) ?? defaultMarker} key={v.name} eventHandlers={{
                click: () => handleClick(v, i)
            }}>
            </Marker>
        )}
    </>
}

function RoutesDisplay({ routes, setRoute, highlighted }: { routes: Route[], highlighted: number, setRoute: (index: number) => void }) {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.leafletMap = useMap()
    return (<>{routes.map((route, i) =>
        <RoutePolyline key={i} route={route} routeIndex={i} setRoute={setRoute} currentRouteIndex={highlighted} />)}</>)
}

function RoutePolyline({ currentRouteIndex, setRoute, routeIndex, route }: { routeIndex: number, currentRouteIndex: number, setRoute: (index: number) => void, route: Route }) {
    const [hovered, setHovered] = useState(false)

    return (
        <Polyline positions={route.nodes} smoothFactor={0.1} pathOptions={{
            lineCap: 'round',
            weight: hovered ? 6 : 4,
            color: currentRouteIndex === routeIndex ? '#0080ff' : hovered ? '#777777' : '#888888'
        }} eventHandlers={{
            click: () => setRoute(routeIndex),
            mouseover: () => setHovered(true),
            mouseout: () => setHovered(false)
        }} />
    )
}

function DisplayMap({ setPopupIndex }: {
    setPopupIndex: (n: number) => void
}) {
    const maxMapBounds: LatLngBoundsExpression = [
        [-6.188854026387887, 106.84830665588379],
        [-6.2511415806683095, 106.76178932189941],
    ]

    const centerMap: LatLngTuple = [
        (maxMapBounds[0][0] + maxMapBounds[1][0]) * 0.5,
        (maxMapBounds[0][1] + maxMapBounds[1][1]) * 0.5
    ]

    const [typeFilter, setTypeFilter] = useState<number | undefined>(undefined)

    useEffect(() => {
        const markerPane = document.querySelector<HTMLSpanElement>('.leaflet-marker-pane.leaflet-pane')

        if (!markerPane) {
            return
        }

        for (const className of Array.from(markerPane.classList.values()).filter(c => c.startsWith('marker-filter-'))) {
            DomUtil.removeClass(markerPane, className)
        }

        if (typeFilter !== undefined) {
            const type = destinationTypes[typeFilter]

            console.log(type)

            if (!markerPane.classList.contains('marker-filter')) DomUtil.addClass(markerPane, 'marker-filter')

            DomUtil.addClass(markerPane, 'marker-filter-' + type.id)
        } else {
            DomUtil.removeClass(markerPane, 'marker-filter')
        }
    }, [typeFilter])


    return (
        <div className="map-container">
            <MapContainer 
                center={centerMap} 
                maxBounds={maxMapBounds}
                minZoom={14} maxZoom={18} zoomControl={false}
                zoom={16}
                style={{height: '100vh'}}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    subdomains="ab"
                />
                <MovingCar />
                <DestinationMarkers setPopupIndex={setPopupIndex} />
            </MapContainer>
            <div className="filters" role="listbox">
                {destinationTypes.map((type, i) => 
                    <button role="option" type="button" key={i} onClick={() => {
                        setTypeFilter(typeFilter === i ? undefined : i)
                    }} aria-selected={typeFilter === i}>{type.name}</button>
                )}
            </div>
        </div>
    )
}

export default DisplayMap
