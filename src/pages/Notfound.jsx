import React from 'react'
import Icon from '../components/Icon'
import "../css/unfound.css";
function Notfound() {
    return (
        <>
            <div style={{ width: '40%', margin: '2% auto' }}>
                <Icon />
                <div className="row text-center">
                    <a className=' btn btn-primary' href="/">Back to home</a>

                </div>
            </div>
        </>
    )
}

export default Notfound