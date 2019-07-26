import React, { Component } from 'react'

export default function asyncComponent(importComponent) {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props)
            this.state = {
                component: null
            }
        }
        render() {
            const Component = this.state.component
            return Component ? <Component {...this.props} /> : null

        }
        componentDidMount() {
            importComponent().then(mod => {
                this.setState({
                    component: mod.default
                })
            })
        }
    }
    return AsyncComponent
}
