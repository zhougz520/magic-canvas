import { List } from 'immutable';
import { IProperty, PropertiesEnum } from '../../../../../UniversalComponents';

export const getStateClass = (state: string) => {
    switch (state) {
        case '1':
            return 'required';
        case '2':
            return 'optional';
        default:
            return '';
    }
};

export const getFieldCommonPropertyList = (props: any) => {
    const {
        map_form_f_title,
        map_form_f_default,
        map_form_f_state,
        map_form_f_cols,
        map_form_f_disabled,
        map_form_f_hidden_t
    } = props;
    let propertyList: List<IProperty> = List();

    // 列表属性
    propertyList = propertyList.push(
        { pTitle: '显示标题', pKey: 'map_form_f_hidden_t', pValue: map_form_f_hidden_t, pType: PropertiesEnum.SWITCH },
        { pTitle: '标题', pKey: 'map_form_f_title', pValue: map_form_f_title, pType: PropertiesEnum.INPUT_TEXT },
        { pTitle: '默认值', pKey: 'map_form_f_default', pValue: map_form_f_default, pType: PropertiesEnum.INPUT_TEXT },
        { pTitle: '只读', pKey: 'map_form_f_disabled', pValue: map_form_f_disabled, pType: PropertiesEnum.SWITCH },
        { pTitle: '字段状态', pKey: 'map_form_f_state', pValue: map_form_f_state, pType: PropertiesEnum.SELECT, pList: [{ key: '0', value: '非必填' }, { key: '1', value: '必填' }] },
        { pTitle: '横跨列数', pKey: 'map_form_f_cols', pValue: map_form_f_cols, pType: PropertiesEnum.INPUT_NUMBER }
    );

    return propertyList;
};
