import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import apiBlog from "../assets/js/BlogApiSettings";
import {Avatar, Comment, Input, List, Form, Button, Divider, Empty} from "antd";
import moment from "moment";

const {TextArea} = Input;

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            loading: true,
            user_comment: '',
            comment_sending: false,
        };
        this.apiBlog = apiBlog;
        this.updateCommentsIntervalId = null;
    }

    componentDidMount() {
        const {postid, type} = this.props;
        this.getComments(postid, type, true);
        this.updateCommentsIntervalId = setInterval(() => this.getComments(postid, type), 20000);
    }

    getComments = (postid, type, fristTime = false) => {
        if (type === 'post') {
            this.apiBlog.getComments(postid).then(response => {
                if (!response.success && response.success !== false) {
                    this.setState({comments: response})
                }
                fristTime && this.setState({loading: false})
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateCommentsIntervalId)
    }

    onChange = (e) => {
        this.setState({user_comment: e.target.value})
    }

    onSubmit = () => {
    }

    render() {
        const {comments, user_comment, comment_sending, loading} = this.state;
        const {user_info} = this.props;

        const commentEditor = <>
            <Form.Item>
                <TextArea rows={4} onChange={this.onChange} value={user_comment}/>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" loading={comment_sending} onClick={this.onSubmit} type="primary">
                    Добавить комментарий
                </Button>
            </Form.Item>
        </>

        return <div>
            <List header={'Комментарии'} pagination={comments.length > 10 && {defaultPageSize: 10}}
                  itemLayout="horizontal"
                  loading={loading}>
                {comments.length > 0 ? comments.map(item => {
                    if (item.moderated && !item.deleted) {
                        return <List.Item key={item.id} className={'post-comment-item'}>
                            <Comment author={item.creator.login}
                                     datetime={moment(parseInt(item.created_at) * 1000).locale('ru-RU').calendar()}
                                     avatar={
                                         <Avatar>{item.creator.login[0].toUpperCase()}</Avatar>}
                                     content={
                                         <div>{item.text}</div>}/>
                        </List.Item>
                    }
                    if (item.deleted) {
                        return <List.Item key={item.id} className={'post-comment-item'}>
                            <Comment content={"Этот комментарий был удален"}/>
                        </List.Item>
                    }
                    return <Empty description={'Комментариев пока нет'}/>
                }) : !loading && <Empty description={'Комментариев пока нет'}/>}
            </List>
            <Divider/>
            <Comment className={'post-comment-editor'}
                     avatar={<Avatar>{user_info && user_info.login[0].toUpperCase()}</Avatar>} content={commentEditor}/>
        </div>
            ;
    }
}

Comments.propTypes = {
    type: PropTypes.oneOf(["post"]).isRequired,
    postid: PropTypes.number
};

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(Comments);
