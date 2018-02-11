import * as React from 'react';
import { DraftPublic } from '../../../src';
import styled from 'styled-components';

const { Editor } = DraftPublic;

export default class Example extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        interface ICustProps { type: string; }
        const CustOl = styled<ICustProps, 'ol'>('ol')`
            list-style-type: ${
                (p: ICustProps) => {
                    switch (p.type) {
                        case 'ol':
                            return 'lower-roman';
                        default:
                            return 'upper-roman';
                    }
                }
            };
        `;

        return (
            <div className="RichEditor-root">
                <Editor />
                <CustOl type="de">
                    <li>123</li>
                </CustOl>
                <CustOl type="ol">
                    <li>123</li>
                </CustOl>
            </div>
        );
    }
}
