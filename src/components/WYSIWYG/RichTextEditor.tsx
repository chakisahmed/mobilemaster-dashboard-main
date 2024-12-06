import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
    initialValue: string;
    height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, height }) => {
    const handleEditorChange = (content: string) => {
        console.log('Content was updated:', content);
    };

    return (
        <Editor
            apiKey='lk5bwf0zmumhovi5c9w1zkb6skhpevfclq73ss0ss7wo4p2m'
            initialValue={initialValue}
            init={{
                height: height ?? 500,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
            }}
            onEditorChange={handleEditorChange}
        />
    );
};

export default RichTextEditor;