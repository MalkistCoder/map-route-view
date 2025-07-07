import { Icon, Marker as LeafletMarker, Util, type LatLngBoundsExpression } from "leaflet"
import { useEffect, useRef, useState } from "react"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap  } from "react-leaflet"
import { destinations, routes, types, type Route } from "./data/route"

const carIcon = new Icon({
    iconUrl: '/car.svg',
    iconSize: [32, 32],
    iconAnchor: [16,16],
    popupAnchor: [0,-16]
})

const CAR_SPEED: number = 3
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

function MapContents({ typeFilter }: { typeFilter: string }) {
    const car = useRef<LeafletMarker>(new LeafletMarker([0,0]))
    const [carPosition, setCarPosition] = useState<[number, number]>([0, 0])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [running, setRunning] = useState<boolean>(true)
    const routeIndex = useRef<number>(0)

    const direction = useRef<number>(1)

    const nodeIndex = useRef<number>(0)
    const nodeT = useRef<number>(0)

    const lastTime = useRef(0)

    const [highlighted, setHighlighted] = useState(0)

    const map = useMap()

    function getCurrentRoute() {
        return routes[routeIndex.current]
    }

    useEffect(() => {
        map.addEventListener('mousedown', (e) => {
            console.log(e.latlng)
        })

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


            if (running) {
                Util.requestAnimFrame(animate)
            }
        }

        map.setMaxBounds(map.getBounds())

        if (running) {
            Util.requestAnimFrame(animate)
        }
    }, [map, running])

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
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            subdomains="ab"
        />
        {destinations.map((v) => (typeFilter === v.type || !typeFilter) &&
            <Marker position={[v.lat, v.lng]} key={v.name}>
                <Popup>
                    {v.name}
                </Popup>
            </Marker>
        )}
        <Marker position={carPosition} icon={carIcon} ref={car} attribution='<a href="https://www.svgrepo.com/svg/452176/car">Colored Interface And Logo Icons Collection</a>, Paths using <a href="https://www.graphhopper.com/">GraphHopper</a>'>
            <Popup>
                car
            </Popup>
        </Marker>
        <RoutesDisplay routes={routes} setRoute={setRoute} highlighted={highlighted} />
    </>)
}

function RoutesDisplay({ routes, setRoute, highlighted }: { routes: Route[], highlighted: number, setRoute: (index: number) => void }) {
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

function App() {
    const maxMapBounds: LatLngBoundsExpression = [
        [-6.205, 106.78],
        [-6.237, 106.82],
    ]

    const [typeFilter, setTypeFilter] = useState('')

    return (
        <div style={{ height: '100vh' }}>
            <MapContainer 
                center={[-6.2212, 106.79897508908876]} 
                maxBounds={maxMapBounds}
                minZoom={16} maxZoom={18} zoomControl={false}
                zoom={16}
                style={{height: '100%'}}
            >
                <MapContents typeFilter={typeFilter} />
            </MapContainer>
            <div className="filters" role="listbox">
                {types.map((type) => 
                    <button role="option" type="button" key={type} onClick={() => {
                        setTypeFilter(typeFilter === type ? '' : type)
                    }} aria-selected={typeFilter === type}>{type}</button>
                )}
            </div>
        </div>
    )
}

export default App
