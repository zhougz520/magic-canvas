import { Map } from 'immutable';

export interface ICommandProps {
    titleBarCollapsed: boolean;
    onTitleBarCollapse: (collapsed: boolean) => void;
    onFireCommand: (cId: string, cProperty: {pKey: string, pValue: any}) => void;
}

export interface ICommandState {
    selectedComs: Map<string, any>;
}

export interface ICommandComponent {
    setCommandState: (selectedComs: Map<string, any>) => void;
}
