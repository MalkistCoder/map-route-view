import { useEffect, useState } from 'react'
import DisplayMap from './components/DisplayMap'
import DisplayDestinatonInfo from './components/DisplayDestinatonInfo'

export default function App() {
    const [popupIndex, setPopupIndex] = useState(-1)
    const [displayPopupIndex, setDisplayPopupIndex] = useState(-1)

    useEffect(() => {
        if (popupIndex !== -1) {
            setDisplayPopupIndex(popupIndex)
        }
    }, [popupIndex])

    return (
        <main>
            <DisplayDestinatonInfo
                active={popupIndex !== -1}
                popupIndex={displayPopupIndex}
                setPopupIndex={setPopupIndex}
            />
            <DisplayMap setPopupIndex={setPopupIndex} />
        </main>
    )
}
