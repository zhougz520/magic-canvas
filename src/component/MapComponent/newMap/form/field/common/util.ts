import { List } from 'immutable';
import { IpList, IFilterCondition } from '../../../../../UniversalComponents/model/types';
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

export const filterCondition: IFilterCondition[] = [
    { pFilterValue: 'MapComponent/newMap/form/field/SelectField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_list'}, {groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/RadioField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_list'}, {groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/CheckBoxField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_list'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/TextField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/InputField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/InputNumberField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/LinkField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/DataTimeField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/LookUpField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/InputIconField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_default'}] },
    { pFilterValue: 'MapComponent/newMap/form/field/TextAreaField', pFilterFun: 'isShow', pFilterKey: [{groupKey: 'mapProps', pKey: 'map_form_f_default'}] }
];

export const fieldTypeList: IpList[] = [
    { key: 'MapComponent/newMap/form/field/TextField', value: '纯文本' },
    { key: 'MapComponent/newMap/form/field/InputField', value: '文本录入' },
    { key: 'MapComponent/newMap/form/field/InputNumberField', value: '数字录入' },
    { key: 'MapComponent/newMap/form/field/LinkField', value: '超链接' },
    { key: 'MapComponent/newMap/form/field/SelectField', value: '下拉选择' },
    { key: 'MapComponent/newMap/form/field/DataTimeField', value: '日期录入' },
    { key: 'MapComponent/newMap/form/field/LookUpField', value: '弹出选择' },
    { key: 'MapComponent/newMap/form/field/RadioField', value: '单选框' },
    { key: 'MapComponent/newMap/form/field/CheckBoxField', value: '复选框' },
    { key: 'MapComponent/newMap/form/field/InputIconField', value: '文本&图片' },
    { key: 'MapComponent/newMap/form/field/TextAreaField', value: '多行文本' },
    { key: 'MapComponent/newMap/form/field/NullField', value: '空白区' }
];

export const getFieldCommonPropertyList = (props: any) => {
    const {
        map_form_f_title,
        map_form_f_default,
        map_form_f_state,
        map_form_f_cols,
        map_form_f_disabled,
        map_form_f_hidden_t,
        map_form_f_type,
        map_form_f_list
    } = props;
    let propertyList: List<IProperty> = List();

    // 列表属性
    propertyList = propertyList.push(
        { pTitle: '显示标题', pKey: 'map_form_f_hidden_t', pValue: map_form_f_hidden_t, pType: PropertiesEnum.SWITCH },
        { pTitle: '标题', pKey: 'map_form_f_title', pValue: map_form_f_title, pType: PropertiesEnum.INPUT_TEXT },
        { pTitle: '默认选项', pKey: 'map_form_f_list', pValue: map_form_f_list, pType: PropertiesEnum.INPUT_LIST, pRequire: false },
        { pTitle: '默认值', pKey: 'map_form_f_default', pValue: map_form_f_default, pType: PropertiesEnum.INPUT_TEXT, pRequire: false },
        { pTitle: '只读', pKey: 'map_form_f_disabled', pValue: map_form_f_disabled, pType: PropertiesEnum.SWITCH },
        { pTitle: '字段状态', pKey: 'map_form_f_state', pValue: map_form_f_state, pType: PropertiesEnum.SELECT, pList: [{ key: '0', value: '非必填' }, { key: '1', value: '必填' }] },
        { pTitle: '横跨列数', pKey: 'map_form_f_cols', pValue: map_form_f_cols, pType: PropertiesEnum.INPUT_NUMBER },
        { pTitle: '数据类型', pKey: 'map_form_f_type', pValue: map_form_f_type, pType: PropertiesEnum.SELECT, pList: fieldTypeList,  pFilterCondition: filterCondition}
    );

    return propertyList;
};
