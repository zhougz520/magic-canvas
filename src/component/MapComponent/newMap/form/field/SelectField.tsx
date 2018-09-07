import * as React from 'react';
import { MapComponent } from '../../index';
import { IFieldProps } from './IFieldProps';
import { Input, Popover, Menu, Icon } from 'antd';
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
}

export class SelectField extends MapComponent<IMapProps, any> {
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
		map_form_f_type: 'MapComponent/newMap/form/field/SelectField'
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
		const { map_form_f_title, map_form_f_default, map_form_f_state, map_form_f_disabled, map_form_f_hidden_t, titleWidth, selectedId, id } = this.props;
		const { selectType, value } = this.state;
		const stateClass = getStateClass(map_form_f_state);
		// 获取下拉选项
		const arrOption = map_form_f_default === undefined ? [''] : map_form_f_default.split(/\r?\n/);
		const content = arrOption.map((option, index) => {
			return <Menu.Item key={index} >{option}</Menu.Item>;
		});
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
												<Popover placement="bottomRight" title={null} content={content} trigger="click" overlayStyle={{ width: 200 }} overlayClassName="select-field-card" visible={selectType}>
													<div className="select-field">
														<Input
															readOnly
															className={`select-field-text ${map_form_f_disabled ? borderClass : ''}`}
															// onBlur={this.onBlur}
															value={value}
														/>
														<span onClick={this.onSelectClick} className="select-field-btn">
															<Icon style={{ color: '#BFBFBF' }} type={selectType ? 'caret-up' : 'caret-down'} />
														</span>
													</div>
												</Popover>
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

	private onSelectClick = () => {
		let { selectType } = this.state;
		if (selectType) {
			selectType = false;
		} else {
			selectType = true;
		}
		this.setState({
			selectType
		});
	}
}
