import { useMemo } from 'react'
import { destinations, destinationTypes } from '../data/route'

export default function DisplayDestinatonInfo({ popupIndex, active, setPopupIndex }: {
    popupIndex: number,
    setPopupIndex: (n: number) => void,
    active: boolean
}) {
    const destination = useMemo(() => destinations[popupIndex], [popupIndex])

    return (
        <aside className={active ? 'active' : undefined}>
            { popupIndex !== -1 && <>
            <img src={destination?.imageUrl ?? 'https://picsum.photos/id/193/800/600'} />
            <div className='popup-content-container'>
                <hgroup>
                    <div>
                        <h1>{destination.name}</h1>
                        <p>{destinationTypes[destination.type].name}</p>
                    </div>
                    <button className='material-symbols-rounded popup-close' onClick={() => setPopupIndex(-1)}>close</button>
                </hgroup>
                <div className="popup-content">
                    {destination.description && destination.description.map(v => <p>{v}</p>)}
                </div>
            </div>
            </>
            }
        </aside>
    )
}
