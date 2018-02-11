import * as React from 'react';

export interface IDraftEditorState {
    contentsKey: number;
}

export interface IDraftEditorProps {
    readOnly?: boolean;
}

export class DraftEditor extends React.Component<IDraftEditorProps, IDraftEditorState> {
    public static defaultProps = {
        readOnly: false
    };

    public constructor(props: IDraftEditorProps) {
        super(props);

        this.state = { contentsKey: 0 };
    }

    public render(): React.ReactNode {
        const { readOnly } = this.props;

        return (
            <div
                contentEditable={!readOnly}
                suppressContentEditableWarning
            >
                Hello!
            </div>
        );
    }
}
