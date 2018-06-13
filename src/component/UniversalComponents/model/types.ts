import { PropertiesEnum } from '../types';

export interface IProperty {
    pTitle: string;
    pKey: string;
    pValue: any;
    pType: PropertiesEnum;
}

export interface IFontState {
    fontColor: string;
    fontStyle: string;
    fontSize: number;
    fontWeight: string;
    textAlign: string;
    textDecoration: string;
    textValue: string;
}
