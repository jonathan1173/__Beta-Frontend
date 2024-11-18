import React from 'react';
import { Editor } from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language , height = "400px", theme = "vs-dark" }) => {
    return (
        <Editor
            height={height}
            language={language}
            value={value}
            onChange={onChange}
            theme={theme}
            options={{
                selectOnLineNumbers: true,
                automaticLayout: true,
            }}
        />
    );
};

export default CodeEditor;
