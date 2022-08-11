import React from 'react'
import Title from '../components/Title/Title'
import Header from '../layout/Header/Header'
import Bridge from '../components/Bridge/Bridge'

const approval = () => {
    return (
        <div style={{ width: "100%", height: "100%", background: "#191c26" }}>
            <Header />
            <Title />
            <Bridge confirmation={2} />
        </div>
    )
}

export default approval