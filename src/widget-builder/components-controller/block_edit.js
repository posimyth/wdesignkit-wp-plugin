import '../style/block_edit.scss'
import { useRef } from 'react';
import { __ } from '@wordpress/i18n';

const { Fragment } = wp.element;

const Block_Edit = (props) => {

    let page_type = props?.widgetdata?.widgetdata?.type;
    const component_index = useRef();
    var img_path = wdkitData.WDKIT_URL;

    let disable_name = ['cpt', 'product_listing']
    let ai_support = ['text', 'textarea', 'wysiwyg', 'code', 'media'];

    /**
     * Show label block option for selected controler in Gutenberg
     * 
     * @since 1.0.4
    */
    const InlineBlockArray = (type) => {
        let controller = ['text', 'number', 'textarea', 'select', 'select2', 'headingtags'];
        if (page_type == 'gutenberg') {
            if (controller.includes(type)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    const UppercaseText = (name, temp_name = 'Tab') => {
        if (name) {
            return name[0].toUpperCase() + name.slice(1)
        } else {
            return temp_name;
        }

    }

    /** get unique string of 8 character */
    const keyUniqueID = () => {
        let year = new Date().getFullYear().toString().slice(-2),
            uid = Math.random().toString(36).substr(2, 6);
        return uid + year;
    }

    if (props?.controller?.controller) {
        component_index.current = props.controller.controller;
    }

    const Controller_name_validation = (name) => {

        var pattern = /^[a-zA-Z0-9_]+$/;
        let controller_name = [];


        props?.cardData.length > 0 && props?.cardData.map((tab) => {
            tab?.layout.length > 0 && tab?.layout.map((l_con, s_index) => {
                l_con?.inner_sec.length > 0 && l_con?.inner_sec.map((controller, c_index) => {
                    if (!controller_name.includes(controller.name)) {
                        controller_name.push(controller.name);
                    }
                    if (controller.type == 'repeater' || controller.type == 'normalhover' || controller.type == 'popover') {
                        controller?.fields?.length > 0 && controller.fields.map((f_controller, f_index) => {
                            if (!controller_name.includes(f_controller.name)) {
                                controller_name.push(f_controller.name);
                            }
                        })
                    } else {
                        if (!controller_name.includes(controller.name)) {
                            controller_name.push(controller.name);
                        }
                    }
                })
            })

            tab?.style.length > 0 && tab?.style.map((s_con, s_index) => {
                s_con?.inner_sec.length > 0 && s_con?.inner_sec.map((controller, c_index) => {
                    if (!controller_name.includes(controller.name)) {
                        controller_name.push(controller.name);
                    }
                    if (controller.type == 'repeater' || controller.type == 'normalhover' || controller.type == 'popover') {
                        controller?.fields?.length > 0 && controller.fields.map((f_controller, f_index) => {
                            if (!controller_name.includes(f_controller.name)) {
                                controller_name.push(f_controller.name);
                            }
                        })
                    } else {
                        if (!controller_name.includes(controller.name)) {
                            controller_name.push(controller.name);
                        }
                    }
                })
            })
        })

        // Check if the input matches the pattern
        if (pattern.test(name) && (!(controller_name.includes(name)))) {
            return true;
        } else {
            return false;
        }
    }

    /** change value of any field of controller */
    const Change_value = (e, type, id, unit_type) => {
        let old_array = [...props.cardData];

        if (component_index.current.repeater) {
            var array_data = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id].fields[component_index.current.repeater];
        } else {
            var array_data = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id];
        }

        if (type == "ai_support" || type == "showLable" || type == "lableBlock" || type == "is_external" || type == "nofollow" || type == "url_options" || type == "prevent_empty" || type == "global" || type == "responsive" || type == "alpha" || type == "multiple" || type == "conditions" || type == "dynamic" || type == "dismissible" || type == "parent_class") {
            array_data[type] = e.target.checked;
        } else if (type == "types") {
            if (e.target.checked == true) {
                let array = [...array_data[type]]

                if (id == "classic") {
                    array.splice(0, 0, `"classic"`);
                } else if (id == "gradient") {
                    array.splice(1, 0, `"gradient"`)
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
            let label_array = array_data?.['nha_array_lable'] ? [...array_data['nha_array_lable']] : [];

            if (e.target.checked == true) {

                if (id == 0) {
                    array[0] = "normal";
                    if (label_array[0] == undefined) {
                        label_array[0] = 'Normal';
                    }
                } else if (id == 1) {
                    array[1] = "hover";
                    if (label_array[1] == undefined) {
                        label_array[1] = 'Hover';
                    }
                } else if (id == 2) {
                    array[2] = "active";
                    if (label_array?.[2] == undefined) {
                        label_array[2] = 'Active';
                    }
                }
                array_data[type] = array;
                array_data['nha_array_lable'] = label_array;
            } else if (e.target.checked == false && array.length > 2) {
                array[id] = null;

                array_data[type] = array
            }
        } else if (type == "nha_array_name") {

            let array = array_data?.['nha_array_lable'] ? [...array_data['nha_array_lable']] : [];
            if (id == 0) {
                array[0] = e.target.value;
            } else if (id == 1) {
                array[1] = e.target.value;
            } else if (id == 2) {
                array[2] = e.target.value;
            }
            array_data['nha_array_lable'] = array;
        } else if (type == "nha_null_name") {
            let array = array_data?.['nha_array_lable'] ? [...array_data['nha_array_lable']] : [];
            if (id == 0) {
                array[0] = 'Normal';
            } else if (id == 1) {
                array[1] = 'Hover';
            } else if (id == 2) {
                array[2] = 'Active';
            }
            array_data['nha_array_lable'] = array;
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
            let Name_validation = Controller_name_validation(e.target.value);
            let old_name = selected_controller?.name;

            if (!Name_validation) {
                return false;
            }

            props?.cardData.length > 0 && props?.cardData.map((tab) => {
                tab?.layout.length > 0 && tab?.layout.map((l_con, s_index) => {
                    l_con?.inner_sec.length > 0 && l_con?.inner_sec.map((controller, c_index) => {
                        if (controller.type == 'repeater' || controller.type == 'normalhover' || controller.type == 'popover') {
                            controller?.fields?.length > 0 && controller.fields.map((f_controller, f_index) => {
                                f_controller?.condition_value?.values?.length > 0 && f_controller.condition_value.values.map((condition, cd_index) => {
                                    if (condition.name == old_name) {
                                        var old_cd = old_array[0]?.layout?.[s_index]?.inner_sec?.[c_index]?.fields?.[f_index]?.condition_value.values[cd_index];
                                        old_cd.name = e.target.value;

                                        props.addToCarthandler(old_array);
                                    }
                                })
                            })
                        } else {
                            controller?.condition_value?.values?.length > 0 && controller.condition_value.values.map((condition, cd_index) => {
                                if (condition.name == old_name) {
                                    var old_cd = old_array[0]?.layout?.[s_index].inner_sec[c_index]?.condition_value.values[cd_index];
                                    old_cd.name = e.target.value;

                                    props.addToCarthandler(old_array);
                                }
                            })
                        }
                    })
                })

                tab?.style.length > 0 && tab?.style.map((s_con, s_index) => {
                    s_con?.inner_sec.length > 0 && s_con?.inner_sec.map((controller, c_index) => {

                        if (controller.type == 'repeater' || controller.type == 'normalhover' || controller.type == 'popover') {
                            controller?.fields?.length > 0 && controller.fields.map((f_controller, f_index) => {
                                f_controller?.condition_value?.values?.length > 0 && f_controller.condition_value.values.map((condition, cd_index) => {
                                    if (condition.name == old_name) {
                                        var old_cd = old_array[0]?.style?.[s_index]?.inner_sec?.[c_index]?.fields?.[f_index]?.condition_value.values[cd_index];
                                        old_cd.name = e.target.value;

                                        props.addToCarthandler(old_array);
                                    }
                                })
                            })
                        } else {
                            controller?.condition_value?.values?.length > 0 && controller.condition_value.values.map((condition, cd_index) => {
                                if (condition.name == old_name) {
                                    var old_cd = old_array[0]?.style?.[s_index].inner_sec[c_index]?.condition_value.values[cd_index];
                                    old_cd.name = e.target.value;

                                    props.addToCarthandler(old_array);
                                }
                            })
                        }
                    })
                })
            })

            let ids = component_index.current;
            if (ids?.sec_id &&
                ids?.compo_id &&
                ids?.array_type &&
                props?.cardData?.[0]?.[ids.array_type]?.[ids.sec_id]?.inner_sec?.[ids.compo_id]) {

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
        } else if (type == 'show_unit') {

            if (e.target.checked == true) {
                array_data[type] = e.target.checked;
                array_data['responsive'] = true;
            } else {
                array_data[type] = e.target.checked;
            }

        } else {
            array_data[type] = e.target.value;
        }

        props.addToCarthandler(old_array);
    }

    const Change_deprecatedNotice = (e, type, id, value) => {
        let old_array = [...props.cardData];

        if (component_index.current.repeater) {
            var array_data = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id].fields[component_index.current.repeater];
        } else {
            var array_data = old_array[0][component_index.current.array_type][component_index.current.sec_id].inner_sec[component_index.current.compo_id];
        }
        let array = [...array_data.deprecatedValue];
        array[id][value] = e.target.value;

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

        data.splice(id, 1)
        props.addToCarthandler(old_array)

        if (data.length == 0) {
            Add_option(type, id)
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
            <div className='wkit-widget-detail'>
                <div className='wb-block-detail-content'>
                    {selected_controller?.lable != undefined && ('elementor' === page_type || ('bricks' === page_type && 'heading' !== selected_controller.type) || ('gutenberg' === page_type && 'gradient' !== selected_controller.type)) &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Label', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip wkit-bottom-toolTip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The label that appears above of the field.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.lable} type='text' onChange={(e) => {
                                        Change_value(e, "lable");
                                    }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.lable != undefined && 'bricks' === page_type && 'heading' === selected_controller?.type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Label', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The label that appears above of the field.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <textarea className='wb-block-text-inp' value={selected_controller.lable} rows={3} onChange={(e) => {
                                        Change_value(e, "lable");
                                    }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.input_type != undefined && page_type == "elementor" &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Input Type', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The input field type. Available values are all HTML5 supported types.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.input_type}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='text' onClick={(e) => { Change_value(e, 'input_type') }}>{__('Text', 'wdesignkit')}</option>
                                            <option value='number' onClick={(e) => { Change_value(e, 'input_type') }}>{__('Number', 'wdesignkit')}</option>
                                            <option value='color' onClick={(e) => { Change_value(e, 'input_type') }}>{__('Color', 'wdesignkit')}</option>
                                            <option value='date' onClick={(e) => { Change_value(e, 'input_type') }}>{__('Date', 'wdesignkit')}</option>
                                            <option value='datetime-local' onClick={(e) => { Change_value(e, 'input_type') }}>{__('Datetime-Local', 'wdesignkit')}</option>
                                            <option value='month' onClick={(e) => { Change_value(e, 'input_type') }}>{__('Month', 'wdesignkit')}</option>
                                            <option value='time' onClick={(e) => { Change_value(e, 'input_type') }}>{__('Time', 'wdesignkit')} </option>
                                            <option value='week' onClick={(e) => { Change_value(e, 'input_type') }}>{__('Week', 'wdesignkit')} </option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.name != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Name', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The name must be unique and should only contain letters, numbers and underscore (_).', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.name} type='text' onChange={(e) => { Change_value(e, "name") }} disabled={disable_name.includes(selected_controller?.type) || props.controller.controller.cpt_controller} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.repeater_type != undefined && page_type == "elementor" &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Repeater type', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The name must be unique and should only contain letters, numbers and underscore (_).', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.repeater_type}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='Old' onClick={(e) => { Change_value(e, 'repeater_type') }}>{__('Old', 'wdesignkit')}</option>
                                            <option value='New' onClick={(e) => { Change_value(e, 'repeater_type') }}>{__('New', 'wdesignkit')}</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.description != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-texarea'>
                                    <span className='wb-block-title'>
                                        <span>{__('Description', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The description that appears below the field.', 'wdesignkit')}</span>
                                        </div>
                                    </span>
                                    <textarea className='wb-block-text-inp' value={selected_controller.description} type='textarea' onChange={(e) => { Change_value(e, "description") }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.title_field != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Title field', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Field that will be used as the repeater title in the fields list when the item is minimized.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.title_field} type='text' onChange={(e) => { Change_value(e, "title_field") }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.placeHolder != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Placeholder', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The field placeholder that appears when the field has no values.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.placeHolder} type='text' onChange={(e) => { Change_value(e, "placeHolder") }} />
                                </div>

                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.defaultValue != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Default Value', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
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
                                                        : selected_controller && selected_controller.type && selected_controller.type == 'datetime' ? <input className='wb-block-text-inp' value={selected_controller.defaultValue} type="datetime-local" onChange={(e) => { Change_value(e, "defaultValue") }} />
                                                            : selected_controller && selected_controller.type && selected_controller.type == 'switcher' ? <label className="wb-switch">
                                                                <input type="checkbox" checked={selected_controller.defaultValue} onChange={(e) => { Change_value(e, 'switcher_defaultValue') }} />
                                                                <span className="wb-slider"></span>
                                                            </label>
                                                                : selected_controller && selected_controller.type && selected_controller.input_type && selected_controller.type == 'text' ?
                                                                    <input className='wb-block-text-inp' value={selected_controller.defaultValue} type='text' onChange={(e) => { Change_value(e, "defaultValue") }} />
                                                                    : <input className='wb-block-text-inp' value={selected_controller.defaultValue} type='text' onChange={(e) => { Change_value(e, "defaultValue") }} />
                                    }
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.alert_type != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Alert Type', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Select the type of Alert message.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.alert_type}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='warning' onClick={(e) => { Change_value(e, 'alert_type') }}>{__('Warning', 'wdesignkit')}</option>
                                            <option value='info' onClick={(e) => { Change_value(e, 'alert_type') }}>{__('info', 'wdesignkit')}</option>
                                            <option value='success' onClick={(e) => { Change_value(e, 'alert_type') }}>{__('Success', 'wdesignkit')}</option>
                                            <option value='danger' onClick={(e) => { Change_value(e, 'alert_type') }}>{__('Danger', 'wdesignkit')}</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.parent_class != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Parent Class', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to select the parent class.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.parent_class} onChange={(e) => { Change_value(e, "parent_class") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.notice_type != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Notice Type', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Select the type of Noitce message.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.notice_type}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='warning' onClick={(e) => { Change_value(e, 'notice_type') }}>{__('Warning', 'wdesignkit')}</option>
                                            <option value='info' onClick={(e) => { Change_value(e, 'notice_type') }}>{__('info', 'wdesignkit')}</option>
                                            <option value='success' onClick={(e) => { Change_value(e, 'notice_type') }}>{__('Success', 'wdesignkit')}</option>
                                            <option value='danger' onClick={(e) => { Change_value(e, 'notice_type') }}>{__('Danger', 'wdesignkit')}</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.dismissible != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Dismissible', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to prevent deleting the first notice.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.dismissible} onChange={(e) => { Change_value(e, "dismissible") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.deprecatedValue && 'elementor' === page_type &&
                        <>
                            {selected_controller?.deprecatedValue.map((item, index) => (
                                <>
                                    {
                                        Object.entries(item).map(([key, value]) => (
                                            <>
                                                <div key={index} className='wb-block-name'>
                                                    <div className='wp-block-wrapper'>
                                                        <div className='wb-block-title'>
                                                            <span>{key}</span>
                                                            <div className='wkit-wb-tooltip'>
                                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" alt="info icon" />
                                                                <span className="wkit-wb-tooltiptext">{__('Enter value for ' + key + '.', 'wdesignkit')}</span>
                                                            </div>
                                                        </div>
                                                        <input className='wb-block-text-inp' value={value} type='text' onChange={(e) => { Change_deprecatedNotice(e, 'deprecatedValue', index, key) }} />
                                                    </div>
                                                </div>
                                                <hr className='wb-controller-hr' />
                                            </>
                                        ))
                                    }
                                </>
                            ))}
                        </>
                    }
                    {selected_controller?.slider_defaultValue &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Default Value', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
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
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.s_template_defaultValue != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Default Value', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown'>
                                        <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                            <label>{__('Select Template', 'wdesignkit')}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option selected>{__('Select Template', 'wdesignkit')}</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.select_defaultValue != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Default Value', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
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
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.hTags_defaultValue != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Default Value', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown'>
                                        <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                            <label>{selected_controller.hTags_defaultValue}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value="h1" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>{__('H1', 'wdesignkit')}</option>
                                            <option value="h2" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>{__('H2', 'wdesignkit')}</option>
                                            <option value="h3" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>{__('H3', 'wdesignkit')}</option>
                                            <option value="h4" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>{__('H4', 'wdesignkit')}</option>
                                            <option value="h5" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>{__('H5', 'wdesignkit')}</option>
                                            <option value="h6" onClick={(e) => { Change_value(e, "hTags_defaultValue") }}>{__('H6', 'wdesignkit')}</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.align_defaultValue != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Default Value', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
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
                                                        }
                                                        {array.includes(icon.align_icon) ?
                                                            icon.align_value == selected_controller.align_defaultValue ?
                                                                <img className='wkit-wb-align-icon wb-icon-selected' src={`${img_path}assets/images/wb-svg/${icon.align_icon}.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                                :
                                                                <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/${icon.align_icon}.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                            : icon.align_value == selected_controller.align_defaultValue ?
                                                                <img className='wkit-wb-align-icon wb-icon-selected' src={`${img_path}assets/images/wb-svg/info-white.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                                :
                                                                <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/info.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                        }
                                                    </div>
                                                </Fragment>
                                            );
                                        })

                                        }
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.options && selected_controller.select2_defaultValue != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Default Value', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' style={{ width: '50%' }}>
                                        <div className='wkit-wb-custom-dropDown-header wkit-multi-select-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                            {selected_controller.select2_defaultValue && selected_controller.select2_defaultValue.map((val, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <div className='wkit-wb-multi-selected'>
                                                            <div className='wkit-wb-remove-value' onClick={(e) => { Change_value(e, "select2_defaultValue", index, 'remove') }}>
                                                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                                                            </div>
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
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.dimension_defaultValue != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-dimension_defaultValue'>
                                        <div className='wb-dimension_defaultValue-part'>
                                            <div className='wb-dimension_defaultValue-lable'>
                                                <span>{__('Default Value', 'wdesignkit')}</span>
                                                <div className='wkit-wb-tooltip'>
                                                    <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                    <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
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
                                        <hr className='wb-controller-hr' />
                                        <div className='wb-dimension-default_unit'>
                                            <div className='wb-dimension_defaultValue-lable'>
                                                <span>{__('Select Default Unit', 'wdesignkit')}</span>
                                                <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                    <span className="wkit-wb-tooltiptext">{__('The field default value.', 'wdesignkit')}</span>
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
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.rows != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Rows', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Number of rows.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-number-inp' min={0} value={selected_controller.rows} type='number' onChange={(e) => {
                                        Change_value(e, "rows");
                                    }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.defaultCount != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Default Count', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('default Count of Repeater item.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-number-inp' min={selected_controller.prevent_empty == true ? 1 : 0} value={selected_controller.defaultCount} type='number' onChange={(e) => {
                                        Change_value(e, "defaultCount");
                                    }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.show_unit != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <label className='wb-block-title'>
                                        <span>{__('Show Unit', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('An array of available CSS units like px, em, rem, %, deg, vh or custom.', 'wdesignkit')}</span>
                                        </div>
                                    </label>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.show_unit} onChange={(e) => { Change_value(e, "show_unit") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.size_units != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-number-setting'>
                                        <div className='wb-block-title'>
                                            <span>{__('Size Unit & Range', 'wdesignkit')}</span>
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                <span className="wkit-wb-tooltiptext">{__('An array of ranges for each register size.', 'wdesignkit')}</span>
                                            </div>
                                        </div>
                                        <div className='wb-select-unit-label'>
                                            <label style={{ width: '20%' }}></label>
                                            <div className='wb-select-unit-content' >
                                                <label>{__('Min', 'wdesignkit')}</label>
                                                <label>{__('Max', 'wdesignkit')}</label>
                                                <label>{__('Step', 'wdesignkit')}</label>
                                            </div>
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
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.dimension_units != undefined &&
                        <>
                            <div className='wb-dimension-unit'>
                                <div className='wb-block-title'>
                                    <span>{__('Size Unit', 'wdesignkit')}</span>
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">{__('An array of available CSS units like px, em, rem, %, deg, vh or custom.', 'wdesignkit')}</span>
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
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.label_on != undefined && selected_controller.label_off != undefined && page_type == 'elementor' &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-title'>
                                    <span>{__('Switcher Label', 'wdesignkit')}</span>
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">{__('The label for the “unchecked” state and “checked” state.', 'wdesignkit')}</span>
                                    </div>
                                </div>
                                <div className="wkit-wb-switcher">
                                    <div className='wb-switcher-lable'>
                                        <div className='wb-block-swither-title'>{__('Switch is on', 'wdesignkit')}</div>
                                        <input className='wb-switcher-lable-inp' value={selected_controller.label_on} type='text' placeholder='Yes' onChange={(e) => {
                                            Change_value(e, "label_on");
                                        }} />
                                    </div>
                                    <div className='wb-switcher-lable'>
                                        <div className='wb-block-swither-title'>{__('Switch is off', 'wdesignkit')}</div>
                                        <input className='wb-switcher-lable-inp' value={selected_controller.label_off} type='text' placeholder='No' onChange={(e) => {
                                            Change_value(e, "label_off");
                                        }} />
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.url_options != undefined && /** Don't need */
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Options', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Turn on for url_options value.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.url_options} onChange={(e) => { Change_value(e, "url_options") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.is_external != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Is External', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to open the url in the same tab or in a new one.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.is_external} onChange={(e) => { Change_value(e, "is_external") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.nofollow != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('No Follow', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to add nofollow attribute.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.nofollow} onChange={(e) => { Change_value(e, "nofollow") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.custom_attributes != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Attributes', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Custom attributes string that come as a string of comma-delimited key|value pairs.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.custom_attributes} type='text' onChange={(e) => {
                                        Change_value(e, "custom_attributes");
                                    }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller && selected_controller.return_value != undefined && 'bricks' != page_type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Return Value', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The value returned when checked.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.return_value} type='text' onChange={(e) => {
                                        Change_value(e, "return_value");
                                    }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.showLable != undefined && 'bricks' != page_type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Show Label', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to display the label.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.showLable} onChange={(e) => { Change_value(e, "showLable") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.lableBlock != undefined && selected_controller?.showLable == true && selected_controller?.type != 'switcher' && InlineBlockArray(selected_controller?.type) &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Label Block', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to display the label in a separate line.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.lableBlock} onChange={(e) => { Change_value(e, "lableBlock") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.media_types != undefined && page_type != 'bricks' &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-title wkit-bottom-space'>
                                    <span>{__('Media Types', 'wdesignkit')}</span>
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">{__('Supported media types. Available values are image, video, and svg.', 'wdesignkit')}</span>
                                    </div>
                                </div>
                                <div className='wb-option-select'>
                                    <div className='wb-select-component'>
                                        <input className='wb-select-component-inp' id='select-1' type='checkbox' checked={selected_controller.media_types.indexOf(`"image"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "media_types", "image") }} />
                                        <label htmlFor='select-1'>{page_type == 'gutenberg' ? __('Image & Svg', 'wdesignkit') : __('Image', 'wdesignkit')}</label>
                                    </div>
                                    <div className='wb-select-component'>
                                        <input className='wb-select-component-inp' id='select-2' type='checkbox' checked={selected_controller.media_types.indexOf(`"video"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "media_types", "video") }} />
                                        <label htmlFor='select-2'>{__('Video', 'wdesignkit')}</label>
                                    </div>
                                    {page_type !== 'gutenberg' &&
                                        <div className='wb-select-component'>
                                            <input className='wb-select-component-inp' id='select-3' type='checkbox' checked={selected_controller.media_types.indexOf(`"svg"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "media_types", "svg") }} />
                                            <label htmlFor='select-3'>{__('Svg', 'wdesignkit')}</label>
                                        </div>

                                    }
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.skin != undefined && 'gutenberg' !== page_type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-skin-content'>
                                    <div className='wb-block-title'>
                                        <span>{__('Types', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Used to change the appearance of the control. There are two options: media or inline. The inline skin\'s design is based on the Choose Control.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.skin}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='media' onClick={(e) => { Change_value(e, 'skin') }} >{__('Media', 'wdesignkit')}</option>
                                            <option value='inline' onClick={(e) => { Change_value(e, 'skin') }} >{__('Inline', 'wdesignkit')}</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.nha_array != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-type'>
                                    <div className='wkit-wb-option'>
                                        <span>{__('Type', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to display the NHA type.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wb-NHA-option-select'>
                                        <div className='wb-select-component'>
                                            <div className='wb-select-component-content'>
                                                <input className='wb-select-component-inp' id='select-1' type='checkbox'
                                                    checked={selected_controller.nha_array[0] && selected_controller?.nha_array?.[0] !== null ? true : false}
                                                    onChange={(e) => { Change_value(e, "nha_array", 0) }} />
                                                <input className='wb-select-component-name'
                                                    type='text'
                                                    value={selected_controller?.nha_array_lable?.[0] != undefined ? selected_controller?.nha_array_lable?.[0] : UppercaseText(selected_controller?.nha_array?.[0], 'Normal')}
                                                    onChange={(e) => { Change_value(e, "nha_array_name", 0) }}
                                                    onBlur={(e) => {
                                                        if (!selected_controller?.nha_array_lable?.[0]) {
                                                            Change_value(e, "nha_null_name", 0)
                                                        }
                                                    }} />
                                            </div>
                                        </div>
                                        <div className='wb-select-component'>
                                            <div className='wb-select-component-content'>
                                                <input className='wb-select-component-inp' id='select-2' type='checkbox'
                                                    checked={selected_controller.nha_array[1] && selected_controller?.nha_array?.[1] !== null ? true : false}
                                                    onChange={(e) => { Change_value(e, "nha_array", 1) }} />
                                                <input className='wb-select-component-name'
                                                    type='text'
                                                    value={selected_controller?.nha_array_lable?.[1] != undefined ? selected_controller?.nha_array_lable?.[1] : UppercaseText(selected_controller?.nha_array?.[1], 'Hover')}
                                                    onChange={(e) => { Change_value(e, "nha_array_name", 1) }}
                                                    onBlur={(e) => {
                                                        if (!selected_controller?.nha_array_lable?.[1]) {
                                                            Change_value(e, "nha_null_name", 1)
                                                        }
                                                    }} />
                                            </div>
                                        </div>
                                        <div className='wb-select-component'>
                                            <div className='wb-select-component-content'>
                                                <input className='wb-select-component-inp' id='select-3' type='checkbox'
                                                    checked={selected_controller?.nha_array?.[2] && selected_controller.nha_array[2] !== null ? true : false}
                                                    onChange={(e) => { Change_value(e, "nha_array", 2) }} />
                                                <input className='wb-select-component-name'
                                                    type='text'
                                                    value={selected_controller?.nha_array_lable?.[2] != undefined ? selected_controller.nha_array_lable[2] : UppercaseText(selected_controller?.nha_array?.[2], 'Active')}
                                                    onChange={(e) => { Change_value(e, "nha_array_name", 2) }}
                                                    onBlur={(e) => {
                                                        if (!selected_controller?.nha_array_lable?.[2]) {
                                                            Change_value(e, "nha_null_name", 2)
                                                        }
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.types != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wb-block-type'>
                                    <div className='wkit-wb-option wkit-bottom-space'>
                                        <span>{__('Type', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('The specific background types to use. Available types are classic, gradient and video. Default is an empty array, including all the types.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wb-option-select'>
                                        {page_type == 'elementor' &&
                                            <div className='wb-select-component'>
                                                <input className='wb-select-component-inp' id='select-1' type='checkbox' checked={selected_controller.types.indexOf(`"classic"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "types", "classic") }} />
                                                <label htmlFor='select-1'>{__('Classic', 'wdesignkit')}</label>
                                            </div>
                                        }
                                        {page_type == 'gutenberg' &&
                                            <div className='wb-select-component'>
                                                <input className='wb-select-component-inp' id='select-1' type='checkbox' checked={selected_controller.types.indexOf(`"classic"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "types", "classic") }} />
                                                <label htmlFor='select-1'>{__('Color & Image', 'wdesignkit')}</label>
                                            </div>
                                        }
                                        <div className='wb-select-component'>
                                            <input className='wb-select-component-inp' id='select-2' type='checkbox' checked={selected_controller.types.indexOf(`"gradient"`) !== -1 ? true : false} onChange={(e) => { Change_value(e, "types", "gradient") }} />
                                            <label htmlFor='select-2'>{__('Gradient', 'wdesignkit')}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.options != undefined && selected_controller.type != 'headingtags' && selected_controller.type != 'cpt' && !props.controller.controller.cpt_controller &&
                        <>
                            <div className='wb-options-main'>
                                <div className='wkit-wb-option'>
                                    <span>{__('Drop Down Value', 'wdesignkit')}</span>
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">{__('An array of key => value pairs: [ \'key\' => \'value\', ... ]', 'wdesignkit')}</span>
                                    </div>
                                </div>
                                <div className='wb-options-content'>
                                    <label className="wb-options-lable">{__('Value', 'wdesignkit')}</label>
                                    <label className="wb-options-lable">{__('Options', 'wdesignkit')}</label>
                                    {selected_controller.type == 'styleimage' && <label className="wb-options-lable">{__('Svg', 'wdesignkit')}</label>}
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
                                        <svg className='wb-addOption-icon' width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M6.04167 1H6.95833V6.04167H12V6.95833H6.95833V12H6.04167V6.95833H1V6.04167H6.04167V1Z" />
                                        </svg>
                                        <label className="wb-addOption-lable">{__('Add', 'wdesignkit')}</label>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.align_option != undefined &&
                        <>
                            <div className='wb-options-main'>
                                <div className='wkit-wb-option'>
                                    <span>{__('Options', 'wdesignkit')}</span>
                                    <div className='wkit-wb-tooltip'>
                                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                        <span className="wkit-wb-tooltiptext">{__('An array of key => value pairs: [ \'key\' => \'value\', ... ]', 'wdesignkit')}</span>
                                    </div>
                                </div>
                                <div className='wb-options-content'>
                                    <label className="wb-options-lable" style={{ width: '25%' }}>{__('Label', 'wdesignkit')}</label>
                                    <label className="wb-options-lable" style={{ width: '25%' }}>{__('Value', 'wdesignkit')}</label>
                                    <label className="wb-options-lable" style={{ width: '45%' }}>{__('Icon', 'wdesignkit')}</label>
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
                                                            <option value='eicon-text-align-left' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Align-Left', 'wdesignkit')}</option>
                                                            <option value='eicon-text-align-right' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Align-Right', 'wdesignkit')}</option>
                                                            <option value='eicon-text-align-center' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Align-Center', 'wdesignkit')}</option>
                                                            <option value='eicon-text-align-justify' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Align-Justify', 'wdesignkit')}</option>
                                                            <option value='eicon-arrow-up' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Up-Arrow', 'wdesignkit')}</option>
                                                            <option value='eicon-arrow-down' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Down-Arrow', 'wdesignkit')}</option>
                                                            <option value='eicon-arrow-right' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Right-Arrow', 'wdesignkit')}</option>
                                                            <option value='eicon-arrow-left' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Left-Arrow', 'wdesignkit')}</option>
                                                            <option value='' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Custom Icon', 'wdesignkit')}</option>
                                                            {page_type == "gutenberg" &&
                                                                <Fragment>
                                                                    <option value='align_title' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Custom Title', 'wdesignkit')}</option>
                                                                    <option value='align_svg' onClick={(e) => { Change_value(e, "align_icon", index) }}>{__('Custom Svg', 'wdesignkit')}</option>
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
                                        <svg className='wb-addOption-icon' width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.04167 1H6.95833V6.04167H12V6.95833H6.95833V12H6.04167V6.95833H1V6.04167H6.04167V1Z" /></svg>
                                        <label className="wb-addOption-lable">{__('Add', 'wdesignkit')}</label>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.alignType != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Align Type', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Select the Align CSS property you want to use.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.alignType}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='text-align' onClick={(e) => { Change_value(e, 'alignType') }}>{__('text-align', 'wdesignkit')}</option>
                                            <option value='justify-content' onClick={(e) => { Change_value(e, 'alignType') }}>{__('justify-content', 'wdesignkit')}</option>
                                            <option value='align-items' onClick={(e) => { Change_value(e, 'alignType') }}>{__('align-items', 'wdesignkit')}</option>
                                            <option value='flex-direction' onClick={(e) => { Change_value(e, 'alignType') }}>{__('flex-direction', 'wdesignkit')}</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.number_setting != undefined && page_type != 'gutenberg' &&
                        <>
                            <div className={`wb-block-name ${selected_controller.name}`} >
                                <div className='wb-block-title'>Number Setting
                                </div>
                                <div className='wb-number-setting-content'>
                                    <div className='wb-num-feild'>
                                        <div className='wb-number-setting-title'>
                                            <span>{__('Min', 'wdesignkit')}</span>
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info-gray.svg'} width="13" />
                                                <span className="wkit-wb-tooltiptext">{__('The minimum number ( only affects the spinners, the user can still type a lower value ).', 'wdesignkit')}</span>
                                            </div>
                                        </div>
                                        <input className={`wb-num-inp ${selected_controller.name}`} id={selected_controller.name} name={selected_controller.name} min value={selected_controller.number_setting.min} type="number" onChange={(e) => { Change_value(e, "num-min") }} />
                                    </div>
                                    <div className='wb-num-feild'>
                                        <div className='wb-number-setting-title'>
                                            <span>{__('Max', 'wdesignkit')}</span>
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info-gray.svg'} width="13" />
                                                <span className="wkit-wb-tooltiptext wkit-center-side-tooltip">{__('The minimum and maximum number (only affects the spinners, the user can still type a lower value).', 'wdesignkit')}</span>
                                            </div>
                                        </div>
                                        <input className='wb-num-inp max' value={selected_controller.number_setting.max} type="number" onChange={(e) => { Change_value(e, "num-max") }} />
                                    </div>
                                    <div className='wb-num-feild'>
                                        <div className='wb-number-setting-title'>
                                            <span>{__('Step', 'wdesignkit')}</span>
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info-gray.svg'} width="13" />
                                                <span className="wkit-wb-tooltiptext wkit-right-side-tooltip">{__('The intervals value that will be incremented or decremented when using the controls\' spinners. Default is empty, the value will be incremented by 1.', 'wdesignkit')}</span>
                                            </div>
                                        </div>
                                        <input className='wb-num-inp step' value={selected_controller.number_setting.step} type="number" onChange={(e) => { Change_value(e, "num-step") }} />
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.language != undefined &&
                        <>
                            <div className='wb-language-setting'>
                                <div className='wb-block-title'>
                                    <div className='wkit-wb-black-division'>
                                        <span>{__('Code', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to display the label.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                    <div className='wkit-wb-custom-dropDown-header'>
                                        <label style={{ textTransform: 'uppercase' }}>{selected_controller.language}</label>
                                        <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                    </div>
                                    <div className='wkit-wb-custom-dropDown-content'>
                                        <option value="html" onClick={(e) => { Change_value(e, "language") }}>{__('HTML', 'wdesignkit')}</option>
                                        <option value="css" onClick={(e) => { Change_value(e, "language") }}>{__('CSS', 'wdesignkit')}</option>
                                        <option value="javascript" onClick={(e) => { Change_value(e, "language") }}>{__('JAVASCRIPT', 'wdesignkit')}</option>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.exclude_inline_options != undefined && selected_controller.skin == 'inline' &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Exclude Inline Options', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Used with the inline skin only, to hide an option (Icon Library/SVG) from the inline icon control\'s buttons.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <select className={`wb-category-option ${selected_controller.name}`} onChange={(e) => { Change_value(e, "exclude_inline_options") }}>
                                        <option value='none' selected={selected_controller.exclude_inline_options === "none" ? true : false}>{__('None', 'wdesignkit')}</option>
                                        <option value='icon' selected={selected_controller.exclude_inline_options === "icon" ? true : false}>{__('Icon', 'wdesignkit')}</option>
                                        <option value='svg' selected={selected_controller.exclude_inline_options === "svg" ? true : false}>{__('Svg', 'wdesignkit')}</option>
                                    </select>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.separator != undefined && 'bricks' !== page_type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Separator', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Set the position of the control separator. Available values are default, before and after. default will position the separator depending on the control type. before / after will position the separator before/after the control.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                        <div className='wkit-wb-custom-dropDown-header'>
                                            <label>{selected_controller.separator}</label>
                                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                        </div>
                                        <div className='wkit-wb-custom-dropDown-content'>
                                            <option value='default' onClick={(e) => { Change_value(e, 'separator') }}>{__('Default', 'wdesignkit')}</option>
                                            <option value='before' onClick={(e) => { Change_value(e, 'separator') }}>{__('Before', 'wdesignkit')}</option>
                                            <option value='after' onClick={(e) => { Change_value(e, 'separator') }}>{__('After', 'wdesignkit')}</option>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.controlClass != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Classes', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Add custom classes to control wrapper in the panel. ', 'wdesignkit')}
                                                <a href='https://learn.wdesignkit.com/docs/use-control-classes-to-style-ui-elements/' className='wkit-ct-doc-link' target="_blank" rel="noopener noreferrer">{__('Read More', 'wdesignkit')}</a>
                                            </span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.controlClass} type='text' onChange={(e) => { Change_value(e, "controlClass") }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.selectors != undefined && selected_controller.selector_value != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-selector-content wb-selector-value'>
                                        <div className='wb-block-title'>
                                            <span>{__('Selectors Value', 'wdesignkit')}</span>
                                            <div className='wkit-wb-tooltip'>
                                                <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                <span className="wkit-wb-tooltiptext">{__('Enter CSS properties (e.g., color, font-size, background-color) to apply to the selected class or ID.', 'wdesignkit')}</span>
                                            </div>
                                        </div>
                                        <input type='text' value={selected_controller.selector_value} className='wb-block-text-inp' onChange={(e) => { Change_value(e, "selector_value"); }} />
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-selector-content wb-selector-class'>
                                        <div className='wb-block-title'>
                                            <span>{__('Selectors', 'wdesignkit')}</span>
                                            <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                <span className="wkit-wb-tooltiptext">{__('Add a CSS class (e.g., .my-class) or ID (e.g., #my-id) to target and style elements.', 'wdesignkit')}</span>
                                            </div>
                                        </div>
                                        <input className='wb-block-text-inp' value={selected_controller.selectors} type='text' onChange={(e) => { Change_value(e, "selectors") }} />
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.selectors != undefined && 'align' == selected_controller.type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-selector-content wb-selector-class'>
                                        <div className='wb-block-title'>
                                            <span>{__('Selectors', 'wdesignkit')}</span>
                                            <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                                <span className="wkit-wb-tooltiptext">{__('Add a CSS class (e.g., .my-class) or ID (e.g., #my-id) to target and style elements.', 'wdesignkit')}</span>
                                            </div>
                                        </div>
                                        <input className='wb-block-text-inp' value={selected_controller.selectors} type='text' onChange={(e) => { Change_value(e, "selectors") }} />
                                    </div>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.selector != undefined &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Selectors', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Add a CSS class (e.g., .my-class) or ID (e.g., #my-id) to target and style elements.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <input className='wb-block-text-inp' value={selected_controller.selector} type='text' onChange={(e) => { Change_value(e, "selector") }} />
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.multiple != undefined && 'bricks' !== page_type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Multiple', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to allow multiple value selection.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.multiple} onChange={(e) => { Change_value(e, "multiple") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.alpha != undefined && page_type != 'bricks' &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Alpha', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to allow alpha channel.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.alpha} onChange={(e) => { Change_value(e, "alpha") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.global != undefined && page_type != 'bricks' &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Global Color', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Default color in RGB, RGBA, or HEX format.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.global} onChange={(e) => { Change_value(e, "global") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.prevent_empty != undefined && 'bricks' !== page_type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Prevent Empty', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to prevent deleting the first repeater field. To keep at least one repeater field.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.prevent_empty} onChange={(e) => { Change_value(e, "prevent_empty") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.responsive != undefined && ('gutenberg' !== page_type || 'number' !== selected_controller.type) &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <label className='wb-block-title'>
                                        <span>{__('Responsive', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Switch to Mobile, Laptop, Tablet mode', 'wdesignkit')}</span>
                                        </div>
                                    </label>
                                    <label className="wb-switch" style={(selected_controller?.type == 'slider' && page_type == 'gutenberg' && selected_controller?.show_unit == true) ? { opacity: '0.5' } : {}}>
                                        <input type="checkbox" checked={selected_controller.responsive} onChange={(e) => { Change_value(e, "responsive") }} disabled={(selected_controller?.type == 'slider' && page_type == 'gutenberg' && selected_controller?.show_unit == true) ? true : false} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {ai_support.includes(selected_controller?.type) && 'elementor' == page_type &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('AI Support', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'>
                                            <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Want AI Support or not.', 'wdesignkit')}</span>
                                        </div>
                                    </div>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.ai_support} onChange={(e) => { Change_value(e, "ai_support") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.dynamic != undefined && ('elementor' === page_type || ('gutenberg' === page_type && 'slider' !== selected_controller.type)) &&
                        <>
                            <div className='wb-block-name'>
                                <div className='wp-block-wrapper'>
                                    <label className='wb-block-title'>
                                        <span>{__('Dynamic', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Turn on for dynamic value', 'wdesignkit')}</span>
                                        </div>
                                    </label>
                                    <label className="wb-switch">
                                        <input type="checkbox" checked={selected_controller.dynamic} onChange={(e) => { Change_value(e, "dynamic") }} />
                                        <span className="wb-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <hr className='wb-controller-hr' />
                        </>
                    }
                    {selected_controller?.condition_value?.values != undefined &&
                        <>
                            <div className='wb-block-name' style={{ marginBottom: '2px' }}>
                                <div className='wp-block-wrapper'>
                                    <div className='wb-block-title'>
                                        <span>{__('Conditions', 'wdesignkit')}</span>
                                        <div className='wkit-wb-tooltip'> <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/info.svg'} width="15" />
                                            <span className="wkit-wb-tooltiptext">{__('Whether to apply the conditions.', 'wdesignkit')}</span>
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
                                    {page_type != 'bricks' &&
                                        <div className='wb-condition-relation'>
                                            <label className='wb-relation-lable'>{__('Relation of Condition', 'wdesignkit')}</label>
                                            <div className='wkit-wb-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                                <div className='wkit-wb-custom-dropDown-header'>
                                                    <label style={{ textTransform: 'uppercase' }}>{selected_controller.condition_value.relation}</label>
                                                    <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                                </div>
                                                <div className='wkit-wb-custom-dropDown-content'>
                                                    <option value="or" onClick={(e) => { Change_value(e, 'condition_relation') }}>{__('OR', 'wdesignkit')}</option>
                                                    <option value="and" onClick={(e) => { Change_value(e, 'condition_relation') }}>{__('AND', 'wdesignkit')}</option>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className='wb-options-main'>
                                        <div className='wb-options-content'>
                                            <label className="wb-options-lable">{__('Name', 'wdesignkit')}</label>
                                            <label className="wb-options-lable">{__('Operator', 'wdesignkit')}</label>
                                            <label className="wb-options-lable">{__('Value', 'wdesignkit')}</label>
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
                                                <svg className='wb-addOption-icon' xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" >
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.04167 1H6.95833V6.04167H12V6.95833H6.95833V12H6.04167V6.95833H1V6.04167H6.04167V1Z" />
                                                </svg>
                                                <label className="wb-addOption-lable">{__('Add', 'wdesignkit')}</label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default Block_Edit;