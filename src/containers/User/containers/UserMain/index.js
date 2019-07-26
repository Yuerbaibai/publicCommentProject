import React, { Component } from 'react'
import OrderItem from '../../components/OrderItem'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import {
    actions as userActions, getCurrentTab, getDeletingOrderId,
    getcommentingOrderId, getCurrentOrderComment, getCurrentOrderStars
} from '../../../../redux/modules/user'
import Confirm from '../../../../components/Confirm'
import './style.css'

const tabTitles = ['全部订单', '待付款', '可使用', '退款/售后']

class UserMain extends Component {
    render() {
        const { currentTab, data, deleteOrderId, commentOrderId, orderComment, orderStars } = this.props
        console.log(this.props)
        return (
            <div className="userMain">
                <div className="userMain__menu">
                    {tabTitles.map((item, index) => {
                        return (
                            <div className="userMain__tab" key={index} onClick={this.handleClick.bind(this, index)}>
                                <span className={currentTab === index ? "userMain__title userMain__title--active" : "userMain__title"}>
                                    {item}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div className="userMain__content">
                    {data && data.length > 0 ? (
                        data.map((item, index) => {
                            return <OrderItem
                                key={index}
                                data={item}
                                onRemove={this.handleRemove.bind(this, item.id)}
                                isCommenting={item.id === commentOrderId}
                                comment={item.id === commentOrderId ? orderComment : ''}
                                stars={item.id === commentOrderId ? orderStars : 0}
                                onCommentChange={this.handleCommentChange}
                                onStarsChange={this.handleStarsChange}
                                onComment={this.handleComment.bind(this, item.id)}
                                onSubmitComment={this.handleSubmitComment}
                                onCancelComment={this.handleCancelComment}
                            />
                        }
                        )) : (
                            <div className="userMain__empty">
                                <div className="userMain__emptyIcon" />
                                <div className="userMain__emptyText1">您还没有相关订单</div>
                                <div className="userMain__emptyText2">去逛逛看有哪些想买的</div>
                            </div>
                        )}
                </div>
                {deleteOrderId ? this.renderConfirmDialog() : null}
            </div>
        )
    }
    handleClick = (index) => {
        console.log(this.props.userActions)
        this.props.userActions.setCurrentTab(index)
    }
    //删除订单
    handleRemove = (orderId) => {
        this.props.userActions.showDeleteDialog(orderId)
    }
    //删除对话框
    renderConfirmDialog = () => {
        const { userActions: { hideDeleteDialog, removeOrder } } = this.props
        return (
            <Confirm content='确定清除该订单吗'
                cancelText="取消"
                confirmText="确定"
                onCancel={hideDeleteDialog}
                onConfirm={removeOrder} />
        )
    }
    //监听评论信息的变化
    handleCommentChange = (comment) => {
        const { userActions: { setComment } } = this.props
        setComment(comment)
    }

    //监听评级变化
    handleStarsChange = stars => {
        const { userActions: { setStars } } = this.props
        setStars(stars)
    }

    //是否打开评论区域
    handleComment = orderId => {
        const { userActions: { showCommentArea } } = this.props
        showCommentArea(orderId)
    }

    //提交评论信息
    handleSubmitComment = () => {
        const { userActions: { submitComment } } = this.props
        submitComment()
    }

    //取消提交评论xx
    handleCancelComment = () => {
        const { userActions: { hideCommentArea } } = this.props
        hideCommentArea()
    }
}

const mapStateToProps = state => ({
    currentTab: getCurrentTab(state),
    deleteOrderId: getDeletingOrderId(state),
    commentOrderId: getcommentingOrderId(state),
    orderComment: getCurrentOrderComment(state),
    orderStars: getCurrentOrderStars(state)
})

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMain)
