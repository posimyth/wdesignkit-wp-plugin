import '../style/block_edit.scss'
import { useRef, useState } from 'react';

const { Fragment } = wp.element;

const Block_Edit = (props) => {

    let page_type = props?.widgetdata?.widgetdata?.type;

    /** get unique string of 8 character */
    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    const component_index = useRef();
    var img_path = wdkitData.WDKIT_URL;

    if (props?.controller?.controller) {
        component_index.current = props.controller.controller;
    }

    /** change value of any field of controller */
    const Change_value = (e, type, id, unit_type) => {
        let old_array = [...props.cardData];

        if (component_index.current.repeater) {
            var array_data = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id].fields[component_index.current.repeater];
        } else {
            var array_data = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id];
        }

        if (type == "showLable" || type == "lableBlock" || type == "is_external" || type == "nofollow" || type == "show_unit" || type == "url_options" || type == "prevent_empty" || type == "global" || type == "responsive" || type == "alpha" || type == "multiple" || type == "conditions" || type == "dynamic") {
            array_data[type] = e.target.checked;
        } else if (type == "types") {
            if (e.target.checked == true) {
                let array = [...array_data[type]]

                if (id == "classic") {
                    array.splice(0, 0, `"classic"`);
                } else if (id == "gradient") {
                    array.splice(1, 0, `"gradient"`)
                } else if (id == "video") {
                    array.splice(2, 0, `"video"`)
                }
                array_data[type] = array;
            } else if (e.target.checked == false) {
                let array = [...array_data[type]],
                    index = array_data[type].indexOf(`"${id}"`);

                array.splice(index, 1)
                array_data[type] = array
            }
        } else if (type == "nha_array") {
            let array = [...array_data[type]]
            if (e.target.checked == true) {

                if (id == "normal") {
                    array.splice(0, 0, "normal");
                } else if (id == "hover") {
                    array.splice(1, 0, "hover")
                } else if (id == "active") {
                    array.splice(2, 0, "active")
                }
                array_data[type] = array;
            } else if (e.target.checked == false && array.length > 2) {
                let index = array_data[type].indexOf(id);

                array.splice(index, 1)
                array_data[type] = array
            }
        } else if (type == "media_types") {
            if (e.target.checked == true) {
                let array = [...array_data[type]]
                if (id == "image") {
                    array.splice(0, 0, `"image"`)
                } else if (id == "video") {
                    array.splice(1, 0, `"video"`)
                } else if (id == "svg") {
                    array.splice(2, 0, `"svg"`)
                }
                array_data[type] = array;
            } else if (e.target.checked == false) {
                let array = [...array_data[type]];
                let index = array_data[type].indexOf(`"${id}"`);
                array.splice(index, 1)
                array_data[type] = array;
            }
        } else if (type == "options_value") {
            let array = [...array_data.options];
            if (array_data.type == 'select2') {
                array_data.select2_defaultValue?.map((val, index) => {
                    if (JSON.stringify(val) == JSON.stringify(array[id])) {
                        array_data.select2_defaultValue.splice(index, 1);
                    }
                })
            }
            if (e.target.value[e.target.value.length - 1] == " ") {
                var data = e.target.value.replace(" ", "_")
                let obj = Object.assign({}, array[id], { "value": data })
                array[id] = obj;
            } else {
                let obj = Object.assign({}, array[id], { "value": e.target.value })
                array[id] = obj;
            }
            array_data.options = array;
        } else if (type == "options_lable") {
            let array = [...array_data.options]
            if (array_data.type == 'select2') {
                array_data.select2_defaultValue?.map((val, index) => {
                    if (JSON.stringify(val) == JSON.stringify(array[id])) {
                        array_data.select2_defaultValue.splice(index, 1);
                    }
                })
            }
            let obj = Object.assign({}, array[id], { 'lable': e.target.value })
            array[id] = obj;
            array_data.options = array
        } else if (type == "options_svg") {
            let array = [...array_data.options]
            let obj = Object.assign({}, array[id], { 'svg': e.target.value })
            array[id] = obj;
            array_data.options = array
        } else if (type == "align_lable" || type == "align_value" || type == "align_icon" || type == "align_title" || type == "align_svg") {
            let array = [...array_data.align_option];
            let obj = Object.assign({}, array[id], { [type]: e.target.value });
            array[id] = obj;
            array_data.align_option = array;
        } else if (type == "conditions_operator") {
            let array = [...array_data.condition_value.values];
            let obj = Object.assign({}, array[id], { 'operator': e.target.value });
            array[id] = obj;
            let final_obj = Object.assign({}, array_data.condition_value, { 'values': array })
            array_data.condition_value = final_obj;
        } else if (type == "conditions_name") {
            let array = [...array_data.condition_value.values];
            let obj = Object.assign({}, array[id], { 'name': e.target.value })
            array[id] = obj;
            let final_obj = Object.assign({}, array_data.condition_value, { 'values': array })
            array_data.condition_value = final_obj;
        } else if (type == "conditions_value") {
            let array = [...array_data.condition_value.values];
            let obj = Object.assign({}, array[id], { 'value': e.target.value });
            array[id] = obj;
            let final_obj = Object.assign({}, array_data.condition_value, { 'values': array })
            array_data.condition_value = final_obj;
        } else if (type == "condition_relation") {
            let array = { ...array_data.condition_value };
            array.relation = e.target.value;
            array_data.condition_value = array
        } else if (type == "num-min") {
            let newdata = Object.assign({}, array_data.number_setting, { 'min': e.target.value });
            array_data.number_setting = newdata;
        } else if (type == "num-max") {
            let newdata = Object.assign({}, array_data.number_setting, { 'max': e.target.value });
            array_data.number_setting = newdata;
        } else if (type == "num-step") {
            let newdata = Object.assign({}, array_data.number_setting, { 'step': e.target.value });
            array_data.number_setting = newdata;
        } else if (type == "slider_value") {
            let array = [...array_data.slider_defaultValue];
            if (id == "unit") {
                array[0] = e.target.value;
            } else if (id == "number") {
                array[1] = e.target.value;
            }
            array_data.slider_defaultValue = array;
        } else if (type == "size_units") {
            let array = [...array_data.size_units];
            if (unit_type == "checked") {
                let obj = Object.assign({}, array[id], { 'checked': e.target.checked });
                array[id] = obj;
            } else {
                let obj = Object.assign({}, array[id], { [unit_type]: e.target.value });
                array[id] = obj;
            }
            array_data.size_units = array;
        } else if (type == "url_options_array") {
            let data = e.target.value;

            let value_array = data.split(',');
            array_data.url_options_array = value_array;
        } else if (type == "switcher_defaultValue") {
            array_data.defaultValue = e.target.checked;
        } else if (type == 'dimension_defaultValue') {
            let array = { ...array_data.dimension_defaultValue };
            if (id != 'isLinked') {
                array[id] = e.target.value;
            } else if (id == 'isLinked') {
                array[id] = !array_data.dimension_defaultValue[id];
            }
            array_data.dimension_defaultValue = array;
        } else if (type == 'dimension_units') {
            let array = [...array_data.dimension_units];
            if (e.target.checked == true) {
                array.push(e.target.value)
            } else if (e.target.checked == false) {
                let index = array.indexOf(e.target.value);
                array.splice(index, 1)
            }
            array_data.dimension_units = array;
        } else if (type == 'align_defaultValue') {
            array_data[type] = id;
        } else if (type == 'name') {
            let ids = component_index.current;
            if (ids &&
                ids.sec_id &&
                ids.compo_id &&
                ids.array_type &&
                props.cardData &&
                props.cardData[0][ids.array_type] &&
                props.cardData[0][ids.array_type][ids.sec_id] &&
                props.cardData[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id]) {

                var editor_html = ace.edit("editor-html", {
                    theme: "ace/theme/cobalt",
                    mode: "ace/mode/html",
                });

                const ReplaceAll = (controller_name, type) => {
                    var range = editor_html.find(controller_name, {
                        wrap: true,
                        caseSensitive: true,
                        wholeWord: true,
                        regExp: false,
                        preventScroll: true // do not change selection
                    })
                    if (range != null) {
                        if (type == "loop") {
                            editor_html.session.replace(range, `data-${e.target.value}={${e.target.value}}`);
                        } else if (type == "name") {
                            editor_html.session.replace(range, `{{${e.target.value}}}`);
                        }
                        ReplaceAll(controller_name, type);
                    }
                }

                if (ids.repeater != undefined) {
                    let controller = props.cardData[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.repeater];
                    if (controller.type == "gallery" || controller.type == "select2" || controller.type == "repeater") {
                        ReplaceAll(`data-${controller.name}={${controller.name}}`, "loop");
                    }
                    ReplaceAll(`{{${controller.name}}}`, "name");
                    if (controller.type == 'repeater' || controller.type == 'popover') {
                        controller.fields.map((sub_controller) => {
                            if (sub_controller.type == "gallery" || sub_controller.type == "select2" || sub_controller.type == "repeater") {
                                ReplaceAll(`data-${sub_controller.name}={${sub_controller.name}}`, "loop");
                            }
                            ReplaceAll(`{{${sub_controller.name}}}`, "name");
                        })
                    }
                } else {
                    var controller = props.cardData[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id];
                    if (controller.type == "gallery" || controller.type == "select2" || controller.type == "repeater") {
                        ReplaceAll(`data-${controller.name}={${controller.name}}`, "loop");
                    }
                    ReplaceAll(`{{${controller.name}}}`, "name");
                    if (controller.type == 'repeater' || controller.type == 'popover') {
                        controller.fields.map((sub_controller) => {
                            if (sub_controller.type == "gallery" || sub_controller.type == "select2" || sub_controller.type == "repeater") {
                                ReplaceAll(`data-${sub_controller.name}={${sub_controller.name}}`, "loop");
                            }
                            ReplaceAll(`{{${sub_controller.name}}}`, "name");
                        })
                    }
                }
            }
            array_data[type] = e.target.value;

        } else if (type == 'select2_defaultValue') {
            if (unit_type == 'add') {
                let array = [...array_data[type]];
                array.push(id);
                array_data[type] = array;
            } else if (unit_type == 'remove') {
                let array = [...array_data[type]]
                array.splice(id, 1);
                array_data[type] = array;
            }
        } else if (type == 'select_defaultValue') {
            array_data[type] = id;
        } else {
            array_data[type] = e.target.value;
        }

        props.addToCarthandler(old_array);
    }

    if (props.cardData.length > 0) {
        let old_array = [...props.cardData];
        if (component_index.current !== undefined) {
            if (old_array?.[0]?.[component_index?.current?.array_type]?.[component_index?.current?.sec_id]?.inner_sec?.[component_index?.current?.compo_id]) {
                if (old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id]?.fields?.[component_index?.current?.repeater]) {
                    var selected_controller = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id].fields[component_index.current.repeater];
                } else {
                    var selected_controller = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id];
                }
            }
        }
    }

    /** add more option in select, align-option and condition value repeater */
    const Add_option = (type, index) => {
        let old_array = [...props.cardData];
        let Controller = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id]
        if (type == "options") {
            if (component_index.current.repeater != undefined) {
                var data = Controller.fields[component_index.current.repeater];
                let array = [...data.options];
                if (selected_controller.type == 'styleimage') {
                    array.push({ "value": "value-" + index, "lable": "label-" + index, "svg": "" })
                } else {
                    array.push({ "value": "value-" + index, "lable": "label-" + index })
                }
                data.options = array;
            } else {
                var data = Controller;
                let array = [...data.options];
                if (selected_controller.type == 'styleimage') {
                    array.push({ "value": "value-" + index, "lable": "label-" + index, "svg": "" })
                } else {
                    array.push({ "value": "value-" + index, "lable": "label-" + index })
                }
                data.options = array;
            }
        } else if (type == "conditions") {
            if (component_index.current.repeater != undefined) {
                var data = Controller.fields[component_index.current.repeater];
                let array = [...data.condition_value.values];
                array.push({ "name": "", "operator": "==", "value": "" })
                let final_obj = Object.assign({}, data.condition_value, { 'values': array })
                data.condition_value = final_obj;
            } else {
                var data = Controller;
                let array = [...data.condition_value.values];
                array.push({ "name": "", "operator": "==", "value": "" })
                let final_obj = Object.assign({}, data.condition_value, { 'values': array })
                data.condition_value = final_obj;
            }
        } else if (type == "align_option") {
            if (component_index.current.repeater != undefined) {
                var data = Controller.fields[component_index.current.repeater];
                let array = [...data.align_option];
                array.push({ "align_lable": "label" + index, "align_value": "value" + index, "align_icon": "eicon-text-align-left" })
                data.align_option = array;
            } else {
                var data = Controller;
                let array = [...data.align_option];
                array.push({ "align_lable": "label" + index, "align_value": "value" + index, "align_icon": "eicon-text-align-left" })
                data.align_option = array;
            }
        }
        props.addToCarthandler(old_array)
    }

    /** remopve option from select, align-option and condition value repeater */
    const Remove_option = (id, type) => {
        let old_array = [...props.cardData];
        let Controller = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id]

        if (type == "options") {
            if (component_index.current.repeater != undefined) {
                var data = Controller.fields[component_index.current.repeater].options;
            } else {
                var data = Controller.options;
            }
        } else if (type == "conditions") {
            if (component_index.current.repeater != undefined) {
                var data = Controller.fields[component_index.current.repeater].condition_value.values;
            } else {
                var data = Controller.condition_value.values;
            }
        } else if (type == "repeater") {
            var data = Controller.defaultValue;
        } else if (type == "align_option") {
            if (component_index.current.repeater != undefined) {
                var data = Controller.fields[component_index.current.repeater].align_option;
            } else {
                var data = Controller.align_option;
            }
        }
        if (data.length > 1) {
            data.splice(id, 1)
            props.addToCarthandler(old_array)
        }
    }

    /** custom drop down functionality */
    const Drop_down_toggle = (e) => {
        let main_object = e.target.closest(".wkit-wb-custom-dropDown")
        let drop_down = main_object.querySelector(".wkit-wb-custom-dropDown-content") ? main_object.querySelector(".wkit-wb-custom-dropDown-content") : "";
        if (drop_down) {
            if (Object.values(drop_down.classList).includes("wkit-wb-show")) {
                drop_down.classList.remove("wkit-wb-show");
            } else {
                drop_down.classList.add("wkit-wb-show");
            }
        }
    }

    return (
        <div className='wkit-wb-third-part-content show'>
            <div className='tp-block-detail'>
                <div className='wb-block-detail-content'>
                    {selected_controller?.lable != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Label
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The label that appears above of the field.</span>
                                        </div>
                                    </div>

                                    <input className='wb-block-text-inp' value={selected_controller.lable} type='text' onChange={(e) => {
                                        Change_value(e, "lable");
                                    }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.input_type != undefined && page_type == "elementor" && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Input Type
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The input field type. Available values are all HTML5 supported types.</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.input_type}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='text' onClick={(e) => { Change_value(e, 'input_type') }}>Text</option>
                                            <option value='number' onClick={(e) => { Change_value(e, 'input_type') }}>Number</option>
                                            <option value='color' onClick={(e) => { Change_value(e, 'input_type') }}>Color</option>
                                            <option value='date' onClick={(e) => { Change_value(e, 'input_type') }}>Date</option>
                                            <option value='datetime-local' onClick={(e) => { Change_value(e, 'input_type') }}>Datetime-Local</option>
                                            <option value='month' onClick={(e) => { Change_value(e, 'input_type') }}>Month</option>
                                            <option value='time' onClick={(e) => { Change_value(e, 'input_type') }}>Time</option>
                                            <option value='week' onClick={(e) => { Change_value(e, 'input_type') }}>Week</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.name != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Name
                                        <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The name must be unique and should only contain letters, numbers and underscore (_).</span>
                                        </div>
                                    </div>

                                    <input className='wb-block-text-inp' value={selected_controller.name} type='text' onChange={(e) => { Change_value(e, "name") }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.repeater_type != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Repeater type
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The name must be unique and should only contain letters, numbers and underscore (_).</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.repeater_type}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='Old' onClick={(e) => { Change_value(e, 'repeater_type') }}>Old</option>
                                            <option value='New' onClick={(e) => { Change_value(e, 'repeater_type') }}>New</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.description != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-texarea'>
                                    <span className='wb-block-title'>Block Description
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The description that appears below the field.</span>
                                        </div>
                                    </span>
                                    <textarea className='wb-block-text-inp' value={selected_controller.description} type='textarea' onChange={(e) => { Change_value(e, "description") }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.title_field != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Title field
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Field that will be used as the repeater title in the fields list when the item is minimized.</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.title_field} type='text' onChange={(e) => { Change_value(e, "title_field") }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.placeHolder != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Placeholder
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field placeholder that appears when the field has no values.</span>
                                        </div>
                                    </div>

                                    <input className='wb-block-text-inp' value={selected_controller.placeHolder} type='text' onChange={(e) => { Change_value(e, "placeHolder") }} />
                                </div>

                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.defaultValue != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Default Value
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field default value.</span>
                                        </div>
                                    </div>
                                    {selected_controller && selected_controller.type != undefined && (selected_controller.type == "textarea" || selected_controller.type == "wysiwyg" || selected_controller.type == "rawhtml" || selected_controller.type == "code") ?
                                        <textarea className='wb-block-text-inp' value={selected_controller.defaultValue} onChange={(e) => { Change_value(e, "defaultValue") }} />
                                        : selected_controller &&
                                            selected_controller.type &&
                                            selected_controller.type == 'number' &&
                                            selected_controller.number_setting &&
                                            selected_controller.number_setting.min &&
                                            selected_controller.number_setting.max &&
                                            selected_controller.number_setting.step ? <input className='wb-block-text-inp' min={selected_controller.number_setting.min} max={selected_controller.number_setting.max} step={selected_controller.number_setting.step} value={selected_controller.defaultValue} type="number" onChange={(e) => { Change_value(e, "defaultValue") }} />
                                            : selected_controller && selected_controller.type && selected_controller.type == 'color' ? <div className='wkit-wb-default-color'><input className='wkit-wb-default-color-inp' value={selected_controller.defaultValue} type="color" onChange={(e) => { Change_value(e, "defaultValue") }} /></div>
                                                : selected_controller && selected_controller.type && selected_controller.type == 'date-time' ? <input className='wb-block-text-inp' value={selected_controller.defaultValue} type="datetime-local" onChange={(e) => { Change_value(e, "defaultValue") }} />
                                                    : selected_controller && selected_controller.type && selected_controller.type == 'url' ? <input className='wb-block-text-inp' value={selected_controller.defaultValue} type="url" onChange={(e) => { Change_value(e, "defaultValue") }} />
                                                        : selected_controller && selected_controller.type && selected_controller.type == 'switcher' ? <label className="wb-switch">
                                                            <input type="checkbox" checked={selected_controller.defaultValue} onChange={(e) => { Change_value(e, 'switcher_defaultValue') }} />
                                                            <span className="wb-slider"></span>
                                                        </label>
                                                            : selected_controller && selected_controller.type && selected_controller.input_type && selected_controller.type == 'text' ? <input className='wb-block-text-inp' value={selected_controller.defaultValue} type='text' onChange={(e) => { Change_value(e, "defaultValue") }} />
                                                                : <input className='wb-block-text-inp' value={selected_controller.defaultValue} type="text" onChange={(e) => { Change_value(e, "defaultValue") }} />
                                    }
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.slider_defaultValue && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Default Value
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field default value.</span>
                                        </div>
                                    </div>
                                    <div className='wb-slider-default'>
                                        {selected_controller.size_units && selected_controller.slider_defaultValue[0] && selected_controller.size_units.map((value, index) => {
                                            if (value.checked == true && value.type == selected_controller.slider_defaultValue[0]) {
                                                return (
                                                    <Fragment key={index}>
                                                        <input type='number' min={value.min} max={value.max} step={value.step} value={selected_controller.slider_defaultValue[1]} className='wb-slider-default-value' onChange={(e) => { Change_value(e, "slider_value", "number") }} />
                                                    </Fragment>
                                                );
                                            }
                                        })
                                        }
                                        <div className='wkit-wb-custom-dropDown' style={{ width: '50%' }} onClick={(e) => { Drop_down_toggle(e) }}>
                                            <div className='wkit-wb-custom-dropDown-header'>
                                                <label>{selected_controller.slider_defaultValue[0]}</label>
                                                <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                            </div>
                                            <div className='wkit-wb-custom-dropDown-content'>
                                                {selected_controller.size_units && selected_controller.size_units.map((units, index) => {
                                                    if (units.checked == true) {
                                                        return (
                                                            <Fragment key={index}>
                                                                <option key={index} onClick={(e) => { Change_value(e, "slider_value", "unit") }}>{units.type}</option>
                                                            </Fragment>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.s_template_defaultValue != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Default Value
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field default value.</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown'>
                                        <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                            <label>Select Template</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option selected>Select Template</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.select_defaultValue != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Default Value
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field default value.</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown'>
                                        <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                            <label>{selected_controller.select_defaultValue[1]}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            {selected_controller.options?.map((val, index) => {
                                                let array = [val.value, val.lable];
                                                return (
                                                    <Fragment key={index}>
                                                        <option onClick={(e) => { Change_value(e, "select_defaultValue", array) }}>{val.lable}</option>
                                                    </Fragment>
                                                );
                                            })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.hTags_defaultValue != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Default Value
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field default value.</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown'>
                                        <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                            <label>{selected_controller.hTags_defaultValue}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value="h1" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>H1</option>
                                            <option value="h2" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>H2</option>
                                            <option value="h3" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>H3</option>
                                            <option value="h4" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>H4</option>
                                            <option value="h5" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>H5</option>
                                            <option value="h6" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>H6</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.align_defaultValue != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Default Value
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field default value.</span>
                                        </div>
                                    </div>
                                    <div className='wb-icons'>
                                        {selected_controller.align_option && selected_controller.align_option.map((icon, index) => {
                                            let array = ['eicon-text-align-left', 'eicon-text-align-right', 'eicon-text-align-center', 'eicon-text-align-justify', 'eicon-arrow-up', 'eicon-arrow-down', 'eicon-arrow-right', 'eicon-arrow-left'];
                                            return (
                                                <Fragment key={index}>
                                                    <div className='wkit-wb-alignIcon-content'>
                                                        {icon.align_lable &&
                                                            <div className='wkit-wb-align-icon-lable'>{icon.align_lable}<div className='wkit-wb-align-icon-tooltip'></div></div>
                                                        }{array.includes(icon.align_icon) ?
                                                            icon.align_value == selected_controller.align_defaultValue ?
                                                                <img className='wkit-wb-align-icon wb-icon-selected' src={`${img_path}assets/images/wb-svg/${icon.align_icon}-white.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                                : <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/${icon.align_icon}.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                            : icon.align_value == selected_controller.align_defaultValue ?
                                                                <img className='wkit-wb-align-icon wb-icon-selected' src={`${img_path}assets/images/wb-svg/info-white.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                                : <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/info.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                        }
                                                    </div>
                                                </Fragment>
                                            );
                                        })

                                        }
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.options && selected_controller.select2_defaultValue != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Default Value
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field default value.</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' style={{ width: '55%' }}>
                                        <div className='wkit-wb-custom-dropDown-header wkit-multi-select-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                            {selected_controller.select2_defaultValue && selected_controller.select2_defaultValue.map((val, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <div className='wkit-wb-multi-selected'>
                                                            <div className='wkit-wb-remove-value' onClick={(e) => { Change_value(e, "select2_defaultValue", index, 'remove') }}>&times;</div>
                                                            <label>{val.lable}</label>
                                                        </div>
                                                    </Fragment>
                                                );
                                            })}
                                            <img src={img_path + 'assets/images/wb-svg/plus-icon.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content wkit-multi-select-dropDown' style={{ marginBottom: (-35 * (selected_controller.options.length - selected_controller.select2_defaultValue.length)) + "px" }}>
                                            {selected_controller.options.map((val, index) => {
                                                let array = { 'value': val.value, 'lable': val.lable };
                                                return (
                                                    <Fragment key={index}>
                                                        <div className='wkit-wb-multiSelect-value'>
                                                            {selected_controller.select2_defaultValue.find(item => item.value == array.value) &&
                                                                selected_controller.select2_defaultValue.find(item => item.lable == array.lable) ? "" :
                                                                <>
                                                                    <input type='checkbox' style={{ display: 'none' }} onChange={(e) => { Change_value(e, "select2_defaultValue", array, 'add') }} />
                                                                    <label onClick={(e) => { e.target.previousSibling.click() }}>{val.lable}</label>
                                                                </>
                                                            }
                                                        </div>
                                                    </Fragment>
                                                );
                                            })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.dimension_defaultValue != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-dimension_defaultValue'>
                                        <div className='wb-dimension_defaultValue-part'>
                                            <div className='wb-dimension_defaultValue-lable'>Default Value
                                                <div className='wkit-wb-tooltip'>
                                                    <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                    <span className="wkit-wb-tooltiptext">The field default value.</span>
                                                </div>
                                            </div>
                                            <div className='wb-dimension_defaultValue-content'>
                                                <input className='wb-dimension-values wkit-top' type='number' value={selected_controller.dimension_defaultValue.top} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `top`) }} />
                                                <input className='wb-dimension-values' type='number' value={selected_controller.dimension_defaultValue.isLinked == true ? selected_controller.dimension_defaultValue.top : selected_controller.dimension_defaultValue.right} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${selected_controller.dimension_defaultValue.isLinked == true ? 'top' : 'right'}`) }} />
                                                <input className='wb-dimension-values' type='number' value={selected_controller.dimension_defaultValue.isLinked == true ? selected_controller.dimension_defaultValue.top : selected_controller.dimension_defaultValue.bottom} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${selected_controller.dimension_defaultValue.isLinked == true ? 'top' : 'bottom'}`) }} />
                                                <input className='wb-dimension-values' type='number' value={selected_controller.dimension_defaultValue.isLinked == true ? selected_controller.dimension_defaultValue.top : selected_controller.dimension_defaultValue.left} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${selected_controller.dimension_defaultValue.isLinked == true ? 'top' : 'left'}`) }} />
                                                <div className={selected_controller.dimension_defaultValue.isLinked == true ? 'wb-dimension-isLink wkit-wb-dark' : 'wb-dimension-isLink'} onClick={(e) => { e, Change_value(e, 'dimension_defaultValue', 'isLinked') }}>
                                                    <img src={img_path + 'assets/images/wb-svg/link.svg'} />
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='wb-dimension-default_unit'>
                                            <div className='wb-dimension_defaultValue-lable'>Select Default Unit
                                                <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                    <span className="wkit-wb-tooltiptext">The field default value.</span>
                                                </div>
                                            </div>
                                            <div className='wkit-wb-custom-dropDown' style={{ width: '20%' }} onClick={(e) => { Drop_down_toggle(e) }}>
                                                <div className='wkit-wb-custom-dropDown-header'>
                                                    <label>{selected_controller.dimension_defaultValue.unit}</label>
                                                    <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                                </div>
                                                <div className='wkit-wb-custom-dropDown-content'>
                                                    {selected_controller.dimension_units && selected_controller.dimension_units.map((unit, index) => {

                                                        return (
                                                            <Fragment key={index}>
                                                                <option onClick={(e) => { e, Change_value(e, 'dimension_defaultValue', 'unit') }}>{unit}</option>
                                                            </Fragment>
                                                        );
                                                    })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.rows != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Rows
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Number of rows.</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-number-inp' min={0} value={selected_controller.rows} type='number' onChange={(e) => {
                                        Change_value(e, "rows");
                                    }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.defaultCount != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>default Count
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">default Count of Repeater item.</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-number-inp' min={selected_controller.prevent_empty == true ? 1 : 0} value={selected_controller.defaultCount} type='number' onChange={(e) => {
                                        Change_value(e, "defaultCount");
                                    }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.title != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Tool-Tip
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The field title that appears on mouse hover.</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.title} type='text' onChange={(e) => {
                                        Change_value(e, "title");
                                    }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.show_unit != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <label className='wb-block-title'>show_unit
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">An array of available CSS units like px, em, rem, %, deg, vh or custom.</span>
                                        </div>
                                    </label>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.show_unit} onChange={(e) => { Change_value(e, "show_unit") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.size_units != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-number-setting'>
                                        <div className='wb-block-title'>Size_unit & Range
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                <span className="wkit-wb-tooltiptext">An array of ranges for each register size.</span>
                                            </div>
                                        </div>
                                        <div className='wb-select-unit-label'>
                                            <label style={{ width: '10px' }}> </label>
                                            <label>Min</label>
                                            <label>Max</label>
                                            <label>Step</label>
                                        </div>
                                        {selected_controller.size_units.map((units, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    <div className='wb-select-unit'>
                                                        <div className='wb-select-unit-checkbox'>
                                                            <input className='wb-select-unit-inp' id={`wb-${units.type}-select`} type='checkbox' checked={units.checked == true ? true : false} onChange={(e) => { Change_value(e, "size_units", index, "checked") }} />
                                                            <label style={{ opacity: units.checked == true ? "1" : "0.5" }} htmlFor={`wb-${units.type}-select`}>{units.type}</label>
                                                        </div>
                                                        <div className='wb-unit-range-content'>
                                                            <div className='wb-num-feild'>
                                                                <input className='wb-num-inp min' disabled={!units.checked} value={units.min} type="number" onChange={(e) => { Change_value(e, "size_units", index, "min") }} />
                                                            </div>
                                                            <div className='wb-num-feild'>
                                                                <input className='wb-num-inp max' disabled={!units.checked} value={units.max} type="number" onChange={(e) => { Change_value(e, "size_units", index, "max") }} />
                                                            </div>
                                                            <div className='wb-num-feild'>
                                                                <input className='wb-num-inp step' disabled={!units.checked} value={units.step} type="number" onChange={(e) => { Change_value(e, "size_units", index, "step") }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.dimension_units != undefined && /** done */
                        <>
                            <div className='wb-dimension-unit'>
                                <div className='wb-block-title'>Size_unit
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">An array of available CSS units like px, em, rem, %, deg, vh or custom.</span>
                                    </div>
                                </div>
                                <div className='wb-dimension-unit'>
                                    <div className='wb-units'>
                                        <input value='px' type='checkbox' checked={selected_controller.dimension_units.includes('px') ? true : false} onChange={(e) => { Change_value(e, 'dimension_units') }} />
                                        <label>px</label>
                                    </div>
                                    <div className='wb-units'>
                                        <input value='%' type='checkbox' checked={selected_controller.dimension_units.includes('%') ? true : false} onChange={(e) => { Change_value(e, 'dimension_units') }} />
                                        <label>%</label>
                                    </div>
                                    <div className='wb-units'>
                                        <input value='deg' type='checkbox' checked={selected_controller.dimension_units.includes('deg') ? true : false} onChange={(e) => { Change_value(e, 'dimension_units') }} />
                                        <label>deg</label>
                                    </div>
                                    <div className='wb-units'>
                                        <input value='rem' type='checkbox' checked={selected_controller.dimension_units.includes('rem') ? true : false} onChange={(e) => { Change_value(e, 'dimension_units') }} />
                                        <label>rem</label>
                                    </div>
                                    <div className='wb-units'>
                                        <input value='em' type='checkbox' checked={selected_controller.dimension_units.includes('em') ? true : false} onChange={(e) => { Change_value(e, 'dimension_units') }} />
                                        <label>em</label>
                                    </div>
                                    <div className='wb-units'>
                                        <input value='vh' type='checkbox' checked={selected_controller.dimension_units.includes('vh') ? true : false} onChange={(e) => { Change_value(e, 'dimension_units') }} />
                                        <label>vh</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.label_on != undefined && selected_controller.label_off != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-title'>Switcher Label
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">The label for the “unchecked” state and “checked” state.</span>
                                    </div>
                                </div>
                                <div className="wkit-wb-switcher">
                                    <div className='wb-switcher-lable'>
                                        <div className='wb-block-swither-title'>When Switch is on</div>
                                        <input className='wb-switcher-lable-inp' value={selected_controller.label_on} type='text' placeholder='Yes' onChange={(e) => {
                                            Change_value(e, "label_on");
                                        }} />
                                    </div>
                                    <div className='wb-switcher-lable'>
                                        <div className='wb-block-swither-title'>When Switch is off</div>
                                        <input className='wb-switcher-lable-inp' value={selected_controller.label_off} type='text' placeholder='No' onChange={(e) => {
                                            Change_value(e, "label_off");
                                        }} />
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.url_options != undefined && /** Don't need */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Options
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Turn on for url_options value.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.url_options} onChange={(e) => { Change_value(e, "url_options") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.url_options != undefined && selected_controller?.url_options == true && selected_controller?.url_options_array && /** Don't need */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Url Options Array
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">An array of URL options to show. By default it shows all the options. But you can select which URL elements to show. Setting the options to false we disable all the options.s</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.url_options_array} type='text' onChange={(e) => {
                                        Change_value(e, "url_options_array");
                                    }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.is_external != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Is External
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to open the url in the same tab or in a new one.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.is_external} onChange={(e) => { Change_value(e, "is_external") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.nofollow != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>No Follow
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to add nofollow attribute.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.nofollow} onChange={(e) => { Change_value(e, "nofollow") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.custom_attributes != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Custom Attributes
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Custom attributes string that come as a string of comma-delimited key|value pairs.</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.custom_attributes} type='text' onChange={(e) => {
                                        Change_value(e, "custom_attributes");
                                    }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller && selected_controller.return_value != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Return Value
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The value returned when checked.</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.return_value} type='text' onChange={(e) => {
                                        Change_value(e, "return_value");
                                    }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.showLable != undefined && page_type == "elementor" && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Show Label
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to display the label.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.showLable} onChange={(e) => { Change_value(e, "showLable") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.lableBlock != undefined && selected_controller?.showLable == true && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Label Block
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to display the label in a separate line.</span>
                                        </div>
                                    </div>

                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.lableBlock} onChange={(e) => { Change_value(e, "lableBlock") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>

                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.media_types != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-title'>Media Types
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">Supported media types. Available values are image, video, and svg.</span>
                                    </div>
                                </div>
                                <div className='wb-option-select'>
                                    <div className='wb-select-component'>
                                        <input className='wb-select-component-inp' id='select-1' type='checkbox' checked={selected_controller.media_types.indexOf(`"image"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "media_types", "image") }} />
                                        <label htmlFor='select-1'>Image</label>
                                    </div>
                                    <div className='wb-select-component'>
                                        <input className='wb-select-component-inp' id='select-2' type='checkbox' checked={selected_controller.media_types.indexOf(`"video"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "media_types", "video") }} />
                                        <label htmlFor='select-2'>Video</label>
                                    </div>
                                    <div className='wb-select-component'>
                                        <input className='wb-select-component-inp' id='select-3' type='checkbox' checked={selected_controller.media_types.indexOf(`"svg"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "media_types", "svg") }} />
                                        <label htmlFor='select-3'>Svg</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.skin != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-skin-content'>
                                    <div className='wb-block-title'>Types
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Used to change the appearance of the control. There are two options: media or inline. The inline skin’s design is based on the Choose Control.</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.skin}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='media' onClick={(e) => { Change_value(e, 'skin') }} >Media</option>
                                            <option value='inline' onClick={(e) => { Change_value(e, 'skin') }} >Inline</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.nha_array != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-type'>
                                    <div className='wkit-wb-option'>type
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to display the NHA type.</span>
                                        </div>
                                    </div>
                                    <div className='wb-option-select'>
                                        <div className='wb-select-component'>
                                            <input className='wb-select-component-inp' id='select-1' type='checkbox' checked={selected_controller.nha_array.indexOf("normal") !== -1 ? true : false} onChange={(e) => { Change_value(e, "nha_array", "normal") }} />
                                            <label htmlFor='select-1'>Normal</label>
                                        </div>
                                        <div className='wb-select-component'>
                                            <input className='wb-select-component-inp' id='select-2' type='checkbox' checked={selected_controller.nha_array.indexOf("hover") !== -1 ? true : false} onChange={(e) => { Change_value(e, "nha_array", "hover") }} />
                                            <label htmlFor='select-2'>Hover</label>
                                        </div>
                                        <div className='wb-select-component'>
                                            <input className='wb-select-component-inp' id='select-3' type='checkbox' checked={selected_controller.nha_array.indexOf("active") !== -1 ? true : false} onChange={(e) => { Change_value(e, "nha_array", "active") }} />
                                            <label htmlFor='select-3'>Active</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.types != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-type'>
                                    <div className='wkit-wb-option'>Type
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The specific background types to use. Available types are classic, gradient and video. Default is an empty array, including all the types.</span>
                                        </div>
                                    </div>
                                    <div className='wb-option-select'>
                                        <div className='wb-select-component'>
                                            <input className='wb-select-component-inp' id='select-1' type='checkbox' checked={selected_controller.types.indexOf(`"classic"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "types", "classic") }} />
                                            <label htmlFor='select-1'>Classic</label>
                                        </div>
                                        <div className='wb-select-component'>
                                            <input className='wb-select-component-inp' id='select-2' type='checkbox' checked={selected_controller.types.indexOf(`"gradient"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "types", "gradient") }} />
                                            <label htmlFor='select-2'>Gradient</label>
                                        </div>
                                        <div className='wb-select-component'>
                                            <input className='wb-select-component-inp' id='select-3' type='checkbox' checked={selected_controller.types.indexOf(`"video"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "types", "video") }} />
                                            <label htmlFor='select-3'>Video</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.options != undefined && /** done */
                        <>
                            <div className='wb-options-main'>
                                <div className='wkit-wb-option'>Drop Down Value
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">{`An array of key => value pairs: [ 'key' => 'value', ... ]`}</span>
                                    </div>
                                </div>
                                <div className='wb-options-content'>
                                    <label className="wb-options-lable">Value</label>
                                    <label className="wb-options-lable">Options</label>
                                    {selected_controller.type == 'styleimage' && <label className="wb-options-lable">Svg</label>}
                                </div>
                                <div className='wb-option-feild'>
                                    {selected_controller.options.map((data, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <div className="wb-option">
                                                    <input className={`wb-options-inp val ${keyUniqueID()}`} type='text' value={data.value} placeholder={`value-${index}`} onChange={(e) => { Change_value(e, "options_value", index) }} />
                                                    <input className={`wb-options-inp opt ${keyUniqueID()}`} opt type='text' value={data.lable} placeholder={`label-${index}`} onChange={(e) => { Change_value(e, "options_lable", index) }} />
                                                    {selected_controller.type == 'styleimage' &&
                                                        <input className={`wb-options-inp opt ${keyUniqueID()}`} opt type='text' value={data.svg} placeholder={`svg-${index}`} onChange={(e) => { Change_value(e, "options_svg", index) }} />
                                                    }
                                                    <div className='wb-option-close' onClick={() => { Remove_option(index, "options") }}>
                                                        <img className='popup-inp-remove-icon' src={img_path + 'assets/images/wb-svg/popup-remove.svg'} />
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                    }
                                    <div className='wb-add-option' onClick={() => { Add_option("options", selected_controller.options.length) }}>
                                        <svg className='wb-addOption-icon' width="13" height="13" viewBox="0 0 13 13" fill={props.widgetdata.widgetdata.type == "elementor" ? "#91003B" : "#3E58E1"} xmlns="http://www.w3.org/2000/svg">
                                            <rect x="6" y="0.5" width="1" height="12" />
                                            <rect x="12.5" y="6" width="1" height="12" transform="rotate(90 12.5 6)" />
                                        </svg>

                                        <label className="wb-addOption-lable">Add</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.align_option != undefined && /** done  */
                        <>
                            <div className='wb-options-main'>
                                <div className='wkit-wb-option'>Options
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">{`An array of key => value pairs: [ 'key' => 'value', ... ]`}</span>
                                    </div>
                                </div>
                                <div className='wb-options-content'>
                                    <label className="wb-options-lable" style={{ width: '25%' }}>Label</label>
                                    <label className="wb-options-lable" style={{ width: '25%' }}>Value</label>
                                    <label className="wb-options-lable" style={{ width: '45%' }}>Icon</label>
                                </div>
                                <div className='wb-option-feild'>
                                    {selected_controller.align_option.map((data, index) => {
                                        let array = ['eicon-text-align-left', 'eicon-text-align-right', 'eicon-text-align-center', 'eicon-text-align-justify', 'eicon-arrow-up', 'eicon-arrow-down', 'eicon-arrow-right', 'eicon-arrow-left', 'align_title', 'align_svg'];

                                        return (
                                            <Fragment key={index}>
                                                <div className="wb-option wkit-wb-align-options">
                                                    <input className={`wb-options-inp val-${keyUniqueID()}`} style={{ width: '25%' }} type='text' value={data.align_lable} placeholder={`label-${index}`} onChange={(e) => { Change_value(e, "align_lable", index) }} />
                                                    <input className={`wb-options-inp opt-${keyUniqueID()}`} style={{ width: '25%' }} type='text' value={data.align_value} placeholder={`value-${index}`} onChange={(e) => { Change_value(e, "align_value", index) }} />
                                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }} style={{ minWidth: '40%' }}>
                                                        <div className='wkit-wb-custom-dropDown-header'>
                                                            {!array.includes(data.align_icon) ?
                                                                <input type='text' className='wkit-wb-choose-inp' value={data.align_icon} placeholder='custome-icon' onChange={(e) => { Change_value(e, 'align_icon', index) }} style={{ width: '100%' }} />
                                                                : (data.align_icon == 'align_title' || data.align_icon == 'align_svg')
                                                                    ? <input type='text' className='wkit-wb-choose-inp' placeholder={data.align_icon} value={data[data.align_icon]} onChange={(e) => { Change_value(e, data.align_icon, index) }} style={{ width: '100%' }} />
                                                                    : <label className='wkit-wb-choose-inp' >{data.align_icon}</label>
                                                            }
                                                            <img className='wkit-wb-choose-img' src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                                        </div>
                                                        <div className='wkit-wb-custom-dropDown-content'>
                                                            <option value='eicon-text-align-left' onClick={(e) => { Change_value(e, "align_icon", index) }}>Align-Left</option>
                                                            <option value='eicon-text-align-right' onClick={(e) => { Change_value(e, "align_icon", index) }}>Align-Right</option>
                                                            <option value='eicon-text-align-center' onClick={(e) => { Change_value(e, "align_icon", index) }}>Align-Center</option>
                                                            <option value='eicon-text-align-justify' onClick={(e) => { Change_value(e, "align_icon", index) }}>Align-Justify</option>
                                                            <option value='eicon-arrow-up' onClick={(e) => { Change_value(e, "align_icon", index) }}>Up-Arrow</option>
                                                            <option value='eicon-arrow-down' onClick={(e) => { Change_value(e, "align_icon", index) }}>Down-Arrow</option>
                                                            <option value='eicon-arrow-right' onClick={(e) => { Change_value(e, "align_icon", index) }}>Right-Arrow</option>
                                                            <option value='eicon-arrow-left' onClick={(e) => { Change_value(e, "align_icon", index) }}>Left-Arrow</option>
                                                            <option value='' onClick={(e) => { Change_value(e, "align_icon", index) }}>Custom Icon</option>
                                                            {page_type == "gutenberg" &&
                                                                <Fragment>
                                                                    <option value='align_title' onClick={(e) => { Change_value(e, "align_icon", index) }}>Custom Title</option>
                                                                    <option value='align_svg' onClick={(e) => { Change_value(e, "align_icon", index) }}>Custom Svg</option>
                                                                </Fragment>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='wb-option-close' onClick={() => { Remove_option(index, "align_option") }}>
                                                        <img src={img_path + 'assets/images/wb-svg/popup-remove.svg'} />
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                    }
                                    <div className='wb-add-option' onClick={() => { Add_option("align_option", selected_controller.align_option.length) }}>
                                        <img className='wb-addOption-icon' src={img_path + 'assets/images/wb-svg/red-add-icon.svg'} />
                                        <label className="wb-addOption-lable">Add</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.number_setting != undefined && /** done */
                        <>
                            <div className={`wb-block-name ${selected_controller.name}`} >
                                <div className='wb-block-title'>Number Setting
                                </div>
                                <div className='wb-number-setting-content'>
                                    <div className='wb-num-feild'>
                                        <div className='wb-number-setting-title'>Min
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info-gray.svg'} width="13" />
                                                <span className="wkit-wb-tooltiptext">The minimum number (only affects the spinners, the user can still type a lower value).</span>
                                            </div>
                                        </div>
                                        <input className={`wb-num-inp ${selected_controller.name}`} id={selected_controller.name} name={selected_controller.name} min value={selected_controller.number_setting.min} type="number" onChange={(e) => { Change_value(e, "num-min") }} />
                                    </div>
                                    <div className='wb-num-feild'>
                                        <div className='wb-number-setting-title'>Max
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info-gray.svg'} width="13" />
                                                <span className="wkit-wb-tooltiptext">The minimum and maximum number (only affects the spinners, the user can still type a lower value).</span>
                                            </div>
                                        </div>
                                        <input className='wb-num-inp max' value={selected_controller.number_setting.max} type="number" onChange={(e) => { Change_value(e, "num-max") }} />
                                    </div>
                                    <div className='wb-num-feild'>
                                        <div className='wb-number-setting-title'>Step
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info-gray.svg'} width="13" />
                                                <span className="wkit-wb-tooltiptext">The intervals value that will be incremented or decremented when using the controls’ spinners. Default is empty, the value will be incremented by 1.</span>
                                            </div>
                                        </div>
                                        <input className='wb-num-inp step' value={selected_controller.number_setting.step} type="number" onChange={(e) => { Change_value(e, "num-step") }} />
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.language != undefined &&
                        <>
                            <div className='wb-language-setting'>
                                <div className='wb-block-title'>
                                    <div className='wkit-wb-black-division'>
                                        <div>Code</div>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to display the label.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                    <div className='wkit-wb-custom-dropDown-header'>
                                        <label style={{ textTransform: 'uppercase' }}>{selected_controller.language}</label>
                                        <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                    </div>
                                    <div className='wkit-wb-custom-dropDown-content'>
                                        <option value="html" onClick={(e) => { Change_value(e, "language") }}>HTML</option>
                                        <option value="css" onClick={(e) => { Change_value(e, "language") }}>CSS</option>
                                        <option value="javascript" onClick={(e) => { Change_value(e, "language") }}>JAVASCRIPT</option>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.exclude_inline_options != undefined && selected_controller.skin == 'inline' && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Exclude Inline Options
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Used with the inline skin only, to hide an option (Icon Library/SVG) from the inline icon control’s buttons.</span>
                                        </div>
                                    </div>
                                    <select className={`wb-category-option ${selected_controller.name}`} onChange={(e) => { Change_value(e, "exclude_inline_options") }}>
                                        <option value='none' selected={selected_controller.exclude_inline_options == "none" ? true : false}>None</option>
                                        <option value='icon' selected={selected_controller.exclude_inline_options == "icon" ? true : false}>Icon</option>
                                        <option value='svg' selected={selected_controller.exclude_inline_options == "svg" ? true : false}>Svg</option>
                                    </select>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.separator != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Separator
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Set the position of the control separator. Available values are default, before and after. default will position the separator depending on the control type. before / after will position the separator before/after the control.</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.separator}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='default' onClick={(e) => { Change_value(e, 'separator') }}>Default</option>
                                            <option value='before' onClick={(e) => { Change_value(e, 'separator') }}>Before</option>
                                            <option value='after' onClick={(e) => { Change_value(e, 'separator') }}>After</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.controlClass != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Control Classes
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Add custom classes to control wrapper in the panel.</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.controlClass} type='text' onChange={(e) => { Change_value(e, "controlClass") }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.selectors != undefined && selected_controller.selector_value != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-selector-content wb-selector-value'>
                                        <div className='wb-block-title'>Selectors value
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                <span className="wkit-wb-tooltiptext">Add Custom Classes to control Class in the panel</span>
                                            </div>
                                        </div>
                                        <input type='text' value={selected_controller.selector_value} className='wb-block-text-inp' onChange={(e) => { Change_value(e, "selector_value"); }} />
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-selector-content wb-selector-class'>
                                        <div className='wb-block-title'>Selectors
                                            <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                <span className="wkit-wb-tooltiptext">Add Custom Classes to control Class in the panel</span>
                                            </div>
                                        </div>
                                        <input className='wb-block-text-inp' value={selected_controller.selectors} type='text' onChange={(e) => { Change_value(e, "selectors") }} />
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.selector != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Selectors
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">The name must be unique and should only contain letters, numbers and underscore (_).</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.selector} type='text' onChange={(e) => { Change_value(e, "selector") }} />
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.multiple != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Multiple
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to allow multiple value selection.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.multiple} onChange={(e) => { Change_value(e, "multiple") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.alpha != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Alpha
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to allow alpha channel.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.alpha} onChange={(e) => { Change_value(e, "alpha") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.global != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Global Color
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Default color in RGB, RGBA, or HEX format.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.global} onChange={(e) => { Change_value(e, "global") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.prevent_empty != undefined && /** done */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Prevent Empty
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to prevent deleting the first repeater field. To keep at least one repeater field.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.prevent_empty} onChange={(e) => { Change_value(e, "prevent_empty") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.responsive != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <label className='wb-block-title'>Responsive
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Switch to Mobile, Laptop, Tablet mode</span>
                                        </div>
                                    </label>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.responsive} onChange={(e) => { Change_value(e, "responsive") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.dynamic != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <label className='wb-block-title'>Dynamic
                                        <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Turn on for dynamic value</span>
                                        </div>
                                    </label>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.dynamic} onChange={(e) => { Change_value(e, "dynamic") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr />
                        </>
                    }
                    {selected_controller?.condition_value?.values != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>Conditions
                                        <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">Whether to apply the conditions.</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.conditions} onChange={(e) => { Change_value(e, "conditions") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            {selected_controller && selected_controller.conditions && selected_controller.conditions == true &&
                                <>
                                    <div className='wb-condition-relation'>
                                        <label className='wb-relation-lable'>Relation of Condition</label>
                                        <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                            <div className='wkit-wb-custom-dropDown-header'>
                                                <label style={{ textTransform: 'uppercase' }}>{selected_controller.condition_value.relation}</label>
                                                <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                            </div>
                                            <div className='wkit-wb-custom-dropDown-content'>
                                                <option value="or" onClick={(e) => { Change_value(e, 'condition_relation') }}>OR</option>
                                                <option value="and" onClick={(e) => { Change_value(e, 'condition_relation') }}>AND</option>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='wb-options-main'>
                                        <div className='wb-options-content'>
                                            <label className="wb-options-lable">Name</label>
                                            <label className="wb-options-lable">Operator</label>
                                            <label className="wb-options-lable">Value</label>
                                        </div>
                                        <div className='wb-option-feild'>
                                            {selected_controller.condition_value.values.map((data, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <div className="wb-option">
                                                            <div className='wkit-wb-dd-toption'>
                                                                <input className='wkit-wb-options-inp' type='text' value={data.name} placeholder={`name-${index}`} onChange={(e) => { Change_value(e, "conditions_name", index) }} />
                                                            </div>
                                                            <div className='wkit-wb-dd-toption'>
                                                                <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }} style={{ width: '100%' }}>
                                                                    <div className='wkit-wb-custom-dropDown-header'>
                                                                        <label>{data.operator}</label>
                                                                        <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                                                    </div>
                                                                    <div className='wkit-wb-custom-dropDown-content'>
                                                                        <option value='==' onClick={(e) => { Change_value(e, "conditions_operator", index) }}>==</option>
                                                                        <option value='!=' onClick={(e) => { Change_value(e, "conditions_operator", index) }}>!=</option>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='wkit-wb-dd-toption'>
                                                                <input className='wkit-wb-options-inp' type='text' value={data.value} placeholder={`value-${index}`} onChange={(e) => { Change_value(e, "conditions_value", index) }} />
                                                            </div>
                                                            <div className='wb-option-close' onClick={() => { Remove_option(index, "conditions") }}>
                                                                <img className='popup-inp-remove-icon' src={img_path + 'assets/images/wb-svg/popup-remove.svg'} />
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                )
                                            })
                                            }
                                            <div className='wb-add-option' onClick={() => { Add_option("conditions") }}>
                                                <img className='wb-addOption-icon' src={img_path + 'assets/images/wb-svg/red-add-icon.svg'} />
                                                <label className="wb-addOption-lable">Add</label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            <hr />
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default Block_Edit;