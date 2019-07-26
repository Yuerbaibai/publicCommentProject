import React, { Component } from 'react';
import Header from "../../components/Header"
import PurchaseForm from "./components/PurchaseForm"
import Tip from "../../components/Tip"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions as purchaseActions, getQuantity, getTipStatus, getProducts, getTotalPrice } from '../../redux/modules/purchase'
import { getUsername } from '../../redux/modules/login'
import { actions as detailActions } from '../../redux/modules/detail'
import { withRouter } from 'react-router-dom'

class Purchase extends Component {
    render() {
        const { quantity, showTip, product, phone, totalPrice } = this.props
        return (
            <div>
                <Header title="下单" onBack={this.handleBack} />
                {product ?
                    <PurchaseForm
                        totalPrice={totalPrice}
                        quantity={quantity}
                        phone={phone}
                        onSubmit={this.handleSubmit}
                        onSetQuantity={this.handleSetQuantity}
                    />
                    : null}
                {showTip ? <Tip message="购买成功！" onClose={this.handleCloseTip} /> : null}
            </div>
        );
    }
    componentDidMount() {

        const { product } = this.props
        if (!product) {
            const productId = this.props.match.params.id
            this.props.detailActions.loadProductDetail(productId)
        }
    }

    componentWillUnmount() {
        this.props.purchaseActions.setOrderQuantity(1)
    }

    handleBack = () => {
        this.props.history.goBack();
    }

    handleSubmit = () => {
        const productId = this.props.match.params.id
        const { purchaseActions: { submitOrder } } = this.props
        submitOrder(productId)
    }

    handleSetQuantity = (quantity) => {
        const { purchaseActions: { setOrderQuantity } } = this.props
        setOrderQuantity(quantity)
    }
    handleCloseTip = () => {
        const { purchaseActions: { closeTip } } = this.props
        closeTip()
        this.props.history.push('/user')
    }
}

const mapStateToProps = (state, props) => {
    console.log(props)
    const productId = props.match.params.id
    return {
        quantity: getQuantity(state),
        showTip: getTipStatus(state),
        product: getProducts(state, productId),
        phone: getUsername(state),
        totalPrice: getTotalPrice(state, productId)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        purchaseActions: bindActionCreators(purchaseActions, dispatch),
        detailActions: bindActionCreators(detailActions, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Purchase));