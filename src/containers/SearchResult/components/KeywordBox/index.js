import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

class KeywordBox extends Component {
    render() {
        const { text } = this.props
        return (
            <div className="keywordBox">
                <Link className="keywordBox__text" to="/search">{text}</Link>
            </div>
        )
    }
}

export default KeywordBox
