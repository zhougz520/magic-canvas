import { Map } from 'immutable';

export interface ICommandProps {
    titleBarCollapsed: boolean;
    onTitleBarCollapse: (collapsed: boolean) => void;
    onFireCommand: (cid: string, cProperty: {pName: string, pValue: any, pType: string}) => void;
}

export interface ICommandState {
    selectedComs: Map<string, any>;
}

export interface ICommandComponent {
    setCommandState: (selectedComs: Map<string, any>) => void;
}
