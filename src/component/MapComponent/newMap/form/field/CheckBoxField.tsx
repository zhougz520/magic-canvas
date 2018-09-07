import * as React from 'react';
import { MapComponent } from '../../index';
import { IFieldProps } from './IFieldProps';
// import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { MaskLayer } from '../../../../BaseComponent/mask/MaskLayer';
import { getStateClass, getFieldCommonPropertyList } from './common/util';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty } from '../../../../UniversalComponents';
// import { Checkbox } from 'antd';

// tslint:disable:indent
// tslint:disable:jsx-no-multiline-js
export interface ICurrProps extends IFieldProps {
	map_form_f_default: string;
}

export class CheckBoxField extends MapComponent<ICurrProps, any> {
	static defaultOptionProps = {
		map_form_f_title: '字段',
		map_form_f_default: '',
		map_form_f_state: '0',
		map_form_f_cols: 1,
		map_form_f_disabled: false,
		map_form_f_hidden_t: true,
		titleWidth: 110,
		map_form_f_type: 'MapComponent/newMap/form/field/InputField'
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
			currX: 0,
			resizing: false
		};
	}
	public getItemStyle = (draggableStyle: any, isDragging: any) => ({
		// change background colour if dragging
		background: isDragging ? 'blue' : '',

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
			{ groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
		);
		propertyList = List();

		return propertyGroup;
	}
	public render() {
		// const { value } = this.state;
		const { map_form_f_title, map_form_f_default, map_form_f_state, map_form_f_hidden_t, titleWidth, selectedId, id } = this.props;
		const stateClass = getStateClass(map_form_f_state);

		const arrRadio = map_form_f_default === undefined ? [] : map_form_f_default.replace(/<br>/g, '\r\n').split(/\r?\n/);

		const currUnit = '100%';

		return (
			<div
				ref={(ref) => this.com = ref}
				style={Object.assign({}, { width: currUnit })}
				className={`field-bar ${selectedId === id ? 'map-select-open' : ''}`}
				// tslint:disable-next-line:jsx-no-lambda
				onMouseDown={(e: any) => { this.selectedCom(e); }}
			>
				<MaskLayer id={id} />
				<table className="field-tb">
					<tbody>
						<tr>
							<td className={`field-title  ${map_form_f_hidden_t ? '' : ' bar-hide'}`} style={{ width: titleWidth }}>
								{map_form_f_title}
							</td>
							<td className="field-content">
								<table style={{ width: '100%' }}>
									<tbody>
										<tr>
											<td className="new-require">
												<div className={`${stateClass}`} style={{ display: `${map_form_f_state === '1' ? 'block' : 'none'}` }}>*</div>
											</td>
											<td>
												{
													arrRadio.map((chkBox, index) => {
														if (chkBox === '') return '';

														return (
															<div key={index} style={{ float: 'left', marginRight: 8 }}>
																<input className="checkbox ux-checkbox" type="checkbox" onClick={this.onChange} />
																{chkBox}
															</div>
														);
													})
												}
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	private onChange = (e: any) => {
		e.target.checked;
	}
}
