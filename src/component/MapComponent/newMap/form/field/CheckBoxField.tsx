import * as React from 'react';
import { MapComponent } from '../../../index';
import { IFieldProps } from './IFieldProps';
import { IFieldState } from './IFieldState';

import { MaskLayer } from '../../../../BaseComponent/mask/MaskLayer';
import { getStateClass, getFieldCommonPropertyList } from './common/util';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty } from '../../../../UniversalComponents';
import * as DragStyle from '../../DragStyle';

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref indent no-empty-interface */
export interface IMapProps extends IFieldProps {
}

export interface IMapState extends IFieldState {
}

export class CheckBoxField extends MapComponent<IMapProps, IMapState> {
	static defaultProps = {
		map_form_f_title: '字段',
		map_form_f_list: [],
		map_form_f_default: '',
		map_form_f_state: '0',
		map_form_f_cols: 1,
		map_form_f_disabled: false,
		map_form_f_hidden_t: true,
		titleWidth: 110,
		currUnit: 2,
		map_form_f_type: 'MapComponent/newMap/form/field/CheckBoxField'
	};

	public resizing = false;
	public mousePosition = {
		x: 0
	};
	public startW = 0;
	public dragWidth: HTMLElement | null = null;

	constructor(props: any, context?: any) {
		super(props, context);
		this.state = {
			hidden: false,
			currX: 0,
			resizing: false
		};
	}
	public getItemStyle = (draggableStyle: any, isDragging: any) => ({
		// change background colour if dragging
		background: isDragging ? DragStyle.BaseDragStyle.background : '',

		// styles we need to apply on draggables
		...draggableStyle
	})
	/**
	 * 获取组件属性列表
	 */
	public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
		let propertyList: List<IProperty> = List();
		let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();
		propertyList = getFieldCommonPropertyList(this.props);
		// 组件属性整理
		propertyGroup = propertyGroup.add(
			{ groupTitle: '组件属性', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
		);
		propertyList = List();

		return propertyGroup;
	}

    /**
     * 获取组件文本
     */
	public getRichChildNode = (): any => {
		return this.props.map_form_f_title;
	}

    /**
     * 构建要设置的文本属性对象
     */
	public buildRichChildNode = (value: any): any => {
		const obj: any = {};
		obj['map_form_f_title'] = value;

		return obj;
	}

	public render() {
		// const { value } = this.state;
		const { hover, hidden } = this.state;
		const { map_form_f_title, map_form_f_list, map_form_f_cols, currUnit, map_form_f_state, map_form_f_hidden_t, titleWidth, id, selectedId, doChildDbClickToEdit, map_form_f_disabled, pageMode } = this.props;
		const stateClass = getStateClass(map_form_f_state);

		return (
			<div
				ref={(ref) => this.com = ref}
				style={Object.assign({}, { width: `${((map_form_f_cols / currUnit) * 100).toFixed(2)}%` }, hover)}
				className={`field-bar ${selectedId === id ? 'map-select-open' : ''}`}
				onMouseDown={this.selectedCom}
				draggable
				onDragOver={this.handleFieldOver}
				// onDragOver={this.onDrageOver}
				onDragLeave={this.handleLeave}
				onDragEnd={this.handleLeave}
			>
				<div
					className="field-tb"
				>
					<MaskLayer id={id} pageMode={pageMode} onDoubleClick={doChildDbClickToEdit} />
					<div className={`field-title ${map_form_f_hidden_t ? '' : ' bar-hide'}`} style={{ width: titleWidth }}>
						<label
							ref={(ref) => this.editCom = ref}
							style={{
								visibility: hidden ? 'hidden' : 'visible',
								width: titleWidth
							}}
						>
							{map_form_f_title}
						</label>
					</div>
					<div className="field-content">
						<table style={{ width: '100%' }}>
							<tbody>
								<tr>
									<td className="new-require">
										<div className={`${stateClass}`} style={{ display: `${map_form_f_state === '1' ? 'block' : 'none'}` }}>*</div>
									</td>
									<td>
										{
											map_form_f_list.map((chkBox, index) => {
												return (
													<div key={index} style={{ float: 'left', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
														<input style={{ width: '16px', height: '16px' }} type="checkbox" disabled={map_form_f_disabled} onClick={this.onChange} />
														<span style={{ marginRight: '15px', marginLeft: '5px' }}>{chkBox}</span>
													</div>
												);
											})
										}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}

	private onChange = (e: any) => {
		e.target.checked;
	}
}
