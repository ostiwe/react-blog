import React from 'react';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const ContentEditor = ({
  editorState, commentSending, onSubmit, onChange, buttonText,
}) => (
  <>
    <Form.Item>
      <SimpleMDE
        id="markdown-editor"
        onChange={onChange}
        value={editorState}
        options={{
          spellChecker: false,
        }}
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
