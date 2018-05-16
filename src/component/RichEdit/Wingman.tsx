import * as React from 'react';
import './sass/RichEdit.scss';

export class Wingman extends React.PureComponent<any, any> {
    setFocus = (isOnFocus: boolean = true) => {
        if (isOnFocus) {
            (document.getElementById('wingman') as HTMLTextAreaElement).focus();
        } else {
            (document.getElementById('wingman') as HTMLTextAreaElement).blur();
        }
    }

    clearValue = () => {
        (document.getElementById('wingman') as HTMLTextAreaElement).value = '';
    }

    componentDidMount() {
        const { setIsWingmanFocus } = this.props;
        (document.getElementById('wingman') as HTMLTextAreaElement).addEventListener('focus', () => { setIsWingmanFocus(true); });
        (document.getElementById('wingman') as HTMLTextAreaElement).addEventListener('blur', () => { setIsWingmanFocus(false); });
    }

    render() {
        return (
            <textarea id="wingman" className="wingman" tabIndex={-1} autoComplete="off" wrap="hard" />
        );
    }
}
