import * as React from 'react';
import { MapComponent } from '../../index';
import { IFieldProps } from './IFieldProps';
import { Input } from 'antd';
import { MaskLayer } from '../../../../BaseComponent/mask/MaskLayer';
import { getStateClass, getFieldCommonPropertyList } from './common/util';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty } from '../../../../UniversalComponents';

// tslint:disable:indent
// tslint:disable:jsx-no-multiline-js
export interface IMapProps extends IFieldProps {
	map_form_f_title: string;
	map_form_f_default: string;
	map_form_f_state: string;
	map_form_f_cols: number;
	map_form_f_disabled: boolean;
	map_form_f_hidden_t: boolean;
	map_form_f_type: string;
	titleWidth: number;
	unit: number;
	currUnit: number;
	index: number;
	map_mi_ico?: string;
}

export class InputIconField extends MapComponent<IMapProps, any> {
	static defaultProps = {
		map_form_f_title: '字段',
		map_form_f_default: '',
		map_form_f_state: '0',
		map_form_f_cols: 1,
		map_form_f_disabled: false,
		map_form_f_hidden_t: true,
		titleWidth: 110,
		unit: 1,
		currUnit: 2,
		map_form_f_type: 'MapComponent/newMap/form/field/InputIconField'
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
			resizing: false,
			hover: {}
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
		const { map_form_f_title, map_form_f_default, map_form_f_state, map_form_f_disabled, map_form_f_hidden_t, titleWidth, map_mi_ico, selectedId, id } = this.props;
		const stateClass = getStateClass(map_form_f_state);
		let borderClass = '';
		if (map_form_f_disabled) {
			borderClass = ' read-only';
		}

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
							<td className={`field-title ${map_form_f_hidden_t ? '' : ' bar-hide'}`} style={{ width: titleWidth }}>
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
												<table className="field-tb">
													<tbody>
														<tr>
															<td >
																<Input
																	type="text"
																	placeholder=""
																	className={`${map_form_f_disabled ? borderClass : ''}`}
																	onChange={this.onChangeText}
																	disabled={map_form_f_disabled}
																	value={map_form_f_default}
																/>
															</td>
															<td className="td-lookup">
																<img className={`ico ${map_mi_ico}`} src="" />
															</td>
														</tr>
													</tbody>
												</table>
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

	private onChangeText = (e: any) => {
		this.setState({
			value: e.target.value
		});
	}
}
