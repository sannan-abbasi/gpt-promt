import { useEffect, useState } from "react"
import App from "./App"


const Wrapper = () => {
    const [authenticated, setAuthenticated] = useState(true)

    useEffect(() => {
        browser.runtime.sendMessage({ action: 'authenticate' }, (response) => {
            setAuthenticated(response.ok)
        })

    }, [])
    return (
        authenticated ? <App /> : <h1 style={{ padding: 20, color: 'white', placeItems: 'center' }}>Authentication failed. Please contact the right full owner</h1>
    )
}

export default Wrapper