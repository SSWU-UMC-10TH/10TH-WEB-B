import React from 'react'
import { Link } from 'react-router-dom'

const Page03 = () => {
    return (
        <div>
            <h1>Page03</h1>
            <Link to='/'>Main</Link>
            <Link to='/Page01'>Page01</Link>
            <Link to='/Page02'>Page02</Link>
            <Link to='/Page03'>Page03</Link>
        </div>
    )
}

export default Page03
