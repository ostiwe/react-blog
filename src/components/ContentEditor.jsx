import React from 'react';
import { Button, Form } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';

const ContentEditor = ({
  editorState, commentSending, onSubmit, onChange, buttonText,
}) => (
  <>
    <Form.Item>
      <Editor
        editorClassName="comment-editor"
        editorState={editorState}
        onEditorStateChange={onChange}
      />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        disabled={commentSending}
        loading={commentSending}
        onClick={onSubmit}
        type="primary"
      >
        {buttonText}
      </Button>
    </Form.Item>
  </>
);

ContentEditor.propTypes = {
  editorState: PropTypes.instanceOf(EditorState).isRequired,
  commentSending: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default ContentEditor;
