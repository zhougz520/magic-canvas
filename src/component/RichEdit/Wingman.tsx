import * as React from 'react';
import './sass/RichEdit.scss';

export class Wingman extends React.PureComponent<any, any> {
    docWingman = (): HTMLTextAreaElement => {
        return (document.getElementById('wingman') as HTMLTextAreaElement);
    }

    setFocus = (isOnFocus: boolean = true) => {
        if (isOnFocus) {
            this.docWingman().focus();
        } else {
            this.docWingman().blur();
        }
    }

    clearValue = () => {
        this.docWingman().value = '';
    }

    componentDidMount() {
        const { setIsWingmanFocus } = this.props;
        this.docWingman().addEventListener('focus', () => { setIsWingmanFocus(true); });
        this.docWingman().addEventListener('blur', () => { setIsWingmanFocus(false); });
    }

    render() {
        return (
            <textarea id="wingman" className="Wingman" tabIndex={-1} autoComplete="off" wrap="hard" />
        );
    }
}
