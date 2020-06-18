import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import apiBlog from "../assets/js/BlogApiSettings";
import {Avatar, Button, Comment, Divider, Empty, Form, List, Result} from "antd";
import moment from "moment";
import {EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
// import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";


class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            loading: true,
            editorState: EditorState.createEmpty(),
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

    onChange = (editorState) => {
        this.setState({editorState})
    }

    onSubmit = () => {
    }

    render() {
        const {comments, editorState, comment_sending, loading} = this.state;
        const {user_info} = this.props;

        const commentEditor = <>
            <Form.Item>
                <Editor editorClassName="comment-editor" editorState={editorState}
                        onEditorStateChange={this.onChange}/>
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
            {((user_info && parseInt(user_info.mask)) & 16) ?
                <Comment className={'post-comment-editor'}
                         avatar={<Avatar>{user_info && user_info.login[0].toUpperCase()}</Avatar>}
                         content={commentEditor}/>
                : <Result icon={<LockOutlined/>} subTitle={'Вы не можете оставлять тут комментарии'}/>}
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
