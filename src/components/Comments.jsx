import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import apiBlog from "../assets/js/BlogApiSettings";
import {Avatar, Button, Comment, Divider, Empty, Form, List, message, Result, Tooltip} from "antd";
import moment from "moment";
import {convertToRaw, EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import Viewer from 'react-viewer';
import ReactMarkdown from "react-markdown";
import htmlParser from "react-markdown/plugins/html-parser";
import ClockCircleOutlined from "@ant-design/icons/lib/icons/ClockCircleOutlined";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import lang from "../assets/js/lang";

// dont work, lol
const parseHtml = htmlParser({
    // isValidNode: node => {
    //     // node.type !== 'script'
    //     return false;
    // },
    // processingInstructions: [
    //     {
    //         shouldProcessNode: function (node) {
    //             console.warn(node)
    //             return node.parent && node.parent.name && node.parent.name === 'img';
    //         },
    //         processNode: function (node, children) {
    //             console.log(node)
    //             return node
    //         }
    //     }
    // ]
})

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            loading: true,
            editorState: EditorState.createEmpty(),
            comment_sending: false,
            postId: null,
            imageViewerVisible: false,
            imageSelected: [],
            moderatedComments: 0,
        };
        this.apiBlog = apiBlog;
        this.updateCommentsIntervalId = null;
    }

    componentDidMount() {
        const {postid, type} = this.props;
        this.setState({postId: postid})
        this.getComments(postid, type);
        this.updateCommentsIntervalId = setInterval(() => this.getComments(postid, type), 20000);
        document.addEventListener('click', this.selectImage)
    }


    componentWillUnmount() {
        clearInterval(this.updateCommentsIntervalId)
    }

    getComments = (postId, type) => {
        if (type === 'post') {
            this.apiBlog.getComments(postId).then(response => {
                if (!response.success && response.success !== false) {
                    let count = 0;
                    for (let i in response) {
                        if (response[i].moderated) count++;
                    }
                    this.setState({comments: response, moderatedComments: count})
                }
            })
        }
        this.setState({loading: false})
    }

    onChange = (editorState) => {
        this.setState({editorState})
    }

    onSubmit = () => {
        const {editorState, postId} = this.state;
        const {locale} = this.props;
        this.setState({comment_sending: true});
        let comment = draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
        this.apiBlog.createComment(postId, comment).then(response => {
            if (response.success) {
                message.success(lang.comment_create_success[locale])
            } else {
                message.error(lang.comment_create_error[locale])
            }

            this.setState({comment_sending: false, editorState: EditorState.createEmpty()});
            this.getComments(postId, 'post')
        })
    }

    selectImage = (e) => {
        if (e.type === "click" && e.target.localName === 'img' && e.target.offsetParent.className === "ant-comment-content") {
            this.setState({
                imageSelected: [{
                    src: e.target.src,
                    alt: ''
                }]
            }, () => this.setState({imageViewerVisible: true}))
        }
        // this.setState({imageSelected: [{url: url}]});
    }

    render() {
        const {
            comments, editorState, comment_sending,
            imageSelected, loading, imageViewerVisible,
            moderatedComments
        } = this.state;
        const {user_info, locale} = this.props;

        const commentEditor = <>
            <Form.Item>
                <Editor editorClassName="comment-editor" editorState={editorState}
                        onEditorStateChange={this.onChange}/>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" disabled={comment_sending} loading={comment_sending} onClick={this.onSubmit}
                        type="primary">
                    {lang.comments_add_button[locale]}
                </Button>
            </Form.Item>
        </>

        // const allowedTypes = [
        //     'code', 'table', 'break', 'paragraph', 'strong',
        //     'link', 'image', 'text', 'list', 'listItem',
        //     'heading', 'inlineCode', 'blockquote', 'root', 'virtualHtml'
        // ];
        const viewerProps = {
            drag: false,
            rotatable: false,
            changeable: false,
            visible: imageViewerVisible,
            images: imageSelected,
            onClose: () => this.setState({imageViewerVisible: false, imageSelected: []}),
            onMaskClick: () => this.setState({imageViewerVisible: false, imageSelected: []}),
            loop: false,
            downloadUrl: imageSelected[0] && imageSelected[0].src,
            noNavbar: true,
            downloadable: true,
            showTotal: false,
            scalable: false
        };

        return <div>
            <Viewer {...viewerProps}/>

            <List header={lang.comments[locale]}
                  itemLayout="horizontal" dataSource={comments} renderItem={(item => {
                if (item.moderated && !item.deleted) {
                    return <List.Item key={item.id} className={'post-comment-item'}>
                        <Comment author={item.creator.login}
                                 datetime={moment(parseInt(item.created_at) * 1000).locale(locale === 'ru' ? "ru" : 'en').calendar()}
                                 avatar={
                                     <Avatar>{item.creator.login[0].toUpperCase()}</Avatar>}
                                 content={
                                     <div>
                                         <ReactMarkdown escapeHtml={false} astPlugins={[parseHtml]}
                                                        source={item.text}/>
                                     </div>}/>
                    </List.Item>
                }
                if (!item.moderated && (user_info && user_info.id === item.creator.id)) {
                    return <List.Item
                        extra={<Tooltip placement={"left"} title={lang.moderated_post_msg[locale]}>
                            <ClockCircleOutlined style={{color: "#ffba55"}}/>
                        </Tooltip>} key={item.id} className={'post-comment-item post-comment-item__moderate'}>
                        <Comment author={item.creator.login}
                                 datetime={moment(parseInt(item.created_at) * 1000).locale(locale === 'ru' ? "ru" : 'en').calendar()}
                                 avatar={
                                     <Avatar>{item.creator.login[0].toUpperCase()}</Avatar>}
                                 content={
                                     <div>
                                         <ReactMarkdown escapeHtml={false} astPlugins={[parseHtml]}
                                                        source={item.text}/>
                                     </div>}/>
                    </List.Item>
                }
                if (item.deleted) {
                    return <List.Item key={item.id} className={'post-comment-item'}
                                      extra={(user_info && user_info.id === item.creator.id) ?
                                          <Tooltip placement={"left"}
                                                   title={lang.deleted_post_msg[locale]}>
                                              <InfoCircleOutlined style={{color: "#ff5555"}}/>
                                          </Tooltip> : null}>
                        <Comment content={lang.comment_deleted[locale]}/>
                    </List.Item>
                }
            })}
                  loading={loading}>
                {((comments.length === 0 || moderatedComments === 0) && !loading) &&
                <Empty description={lang.comments_empty[locale]}/>}
            </List>
            <Divider/>
            {((user_info && parseInt(user_info.mask)) & 16) ?
                <Comment className={'post-comment-editor'}
                         avatar={<Avatar>{user_info && user_info.login[0].toUpperCase()}</Avatar>}
                         content={commentEditor}/>
                : <Result icon={<LockOutlined/>} subTitle={lang.comments_write_prohibited[locale]}/>}
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
