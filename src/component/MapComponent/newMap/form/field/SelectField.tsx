import * as React from 'react';
import { MapComponent } from '../../index';
import { IFieldProps } from './IFieldProps';
import { Input, Popover, Menu, Icon } from 'antd';
import { MaskLayer } from '../../../../BaseComponent/mask/MaskLayer';
import { getStateClass, getFieldCommonPropertyList } from './common/util';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty } from '../../../../UniversalComponents';

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref indent */
export interface IMapProps extends IFieldProps {
	map_form_f_title: string;
	map_form_f_default: string;
	map_form_f_state: string;
	map_form_f_cols: number;
	map_form_f_disabled: boolean;
	map_form_f_hidden_t: boolean;
	map_form_f_type: string;
	titleWidth: number;
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
			hidden: false,
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
		const { selectType, value, hover, hidden } = this.state;
		const { map_form_f_title, map_form_f_default, map_form_f_cols, currUnit, map_form_f_state, map_form_f_hidden_t, titleWidth, map_form_f_disabled, id, selectedId, doChildDbClickToEdit } = this.props;
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
					<MaskLayer id={id} onDoubleClick={doChildDbClickToEdit} />
					<div className={`field-title ${map_form_f_hidden_t ? '' : ' bar-hide'}`} style={{ width: titleWidth }}>
						<label
							ref={(ref) => this.editCom = ref}
							style={{
								visibility: hidden ? 'hidden' : 'visible'
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
					</div>
				</div>
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
