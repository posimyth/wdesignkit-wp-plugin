import '../style/component_layout.scss';
import { useState, useEffect, useRef } from 'react';
import { component_array } from '../components-data/component_array';
import Component_html_container from '../redux-container/component_html_container';

const { Fragment } = wp.element;

var site_url = wdkitData.WDKIT_SITE_URL;
var img_path = wdkitData.WDKIT_URL;


const Component_html = (props) => {

    /** custome slider color for slider controller */
    if (props && props.widgetdata && props.widgetdata.type == "elementor") {
        var slider_color = "#91003b";
    } else if (props && props.widgetdata && props.widgetdata.type == "gutenberg") {
        var slider_color = "#3E58E1";
    }

    const [shadow, setshadow] = useState("Inset");
    const [type, settype] = useState("normal");
    const [active, setactive] = useState("normal");
    const [repeater_display, setrepeater_display] = useState(true);
    const [Drag_event, setDrag_event] = useState(false);

    /** make unique string of 8 character */
    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    /** for change the value of controller from layout side */
    const Change_value = (e, type, id, action) => {

        let old_array = [...props.cardData.CardItems.cardData],
            ids = e.target.closest('.wb-main-component').dataset;

        if (ids.rnp) {
            var data = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.rnp];
        } else {
            var data = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id]
        }

        if (type == 'nofollow' || type == 'is_external') {
            var AddItem = Object.assign({}, data, { [type]: e.target.checked });
        } else if (type == 'defaultValue_slider') {
            let old_value = [...data.slider_defaultValue]
            old_value[1] = e.target.value;
            var AddItem = Object.assign({}, data, { 'slider_defaultValue': old_value });
        } else if (type == 'switcher_defaultValue') {
            var AddItem = Object.assign({}, data, { 'defaultValue': e.target.checked });
        } else if (type == 'dimension_defaultValue') {
            if (id != 'isLinked') {
                var default_value = Object.assign({}, data.dimension_defaultValue, { [id]: e.target.value });
                var AddItem = Object.assign({}, data, { 'dimension_defaultValue': default_value });
            } else if (id == 'isLinked') {
                let old_data = data.dimension_defaultValue[id]
                var default_value = Object.assign({}, data.dimension_defaultValue, { [id]: !old_data });
                var AddItem = Object.assign({}, data, { 'dimension_defaultValue': default_value });
            }
        } else if (type == 'align_defaultValue') {
            var AddItem = Object.assign({}, data, { 'align_defaultValue': id });
        } else if (type == 'select2_defaultValue') {
            if (action == "add") {
                let array = [...data[type]]
                array.push(id);
                var AddItem = Object.assign({}, data, { [type]: array });
            } else if (action == "remove") {
                let array = [...data[type]]
                array.splice(id, 1);
                var AddItem = Object.assign({}, data, { [type]: array });
            }
        } else if (type == 'select_defaultValue') {
            var AddItem = Object.assign({}, data, { [type]: id });
        } else if (type == 'nha_type') {
            var AddItem = Object.assign({}, data, { [type]: id });
        } else {
            var AddItem = Object.assign({}, data, { [type]: e.target.value });
        }

        if (ids.rnp) {
            old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields.splice(ids.rnp, 1, AddItem)
        } else {
            old_array[0][ids.array_type][ids.sec_id].inner_sec.splice(ids.compo_id, 1, AddItem)
        }
        props.addToCarthandler(old_array)
    }

    /** function for drop other copntroller inside repeater and popover controller */
    const Rnp_Component_drop = (event, sec_index, compo_index, array_type, rnp_val) => {
        let item = event.dataTransfer.getData('controller_id');
        if (item) {
            const val = component_array[item].name;
            const add_val = Object.assign({}, component_array[item], { "name": val + "_" + keyUniqueID() });
            let old_array = [...props.cardData.CardItems.cardData];
            if (rnp_val != undefined) {
                let data = old_array[0][array_type][sec_index].inner_sec[compo_index].fields[rnp_val];
                let array = [...data.fields];
                array.push(add_val);
                let obj = Object.assign({}, data, { 'fields': array })
                old_array[0][array_type][sec_index].inner_sec[compo_index].fields[rnp_val] = obj;
            } else {
                let data = old_array[0][array_type][sec_index].inner_sec[compo_index];
                let array = [...data.fields];
                array.push(add_val);
                let obj = Object.assign({}, data, { 'fields': array })
                old_array[0][array_type][sec_index].inner_sec[compo_index] = obj;
            }
            setrepeater_display(true);
            props.addToCarthandler(old_array);
        }
    }

    /** function for drop other controller inside Normal/Hover controller tabs */
    const Nha_Component_drop = (event, sec_index, compo_index, array_type, nha_type) => {
        let item = event.dataTransfer.getData('controller_id');
        if (item) {
            const val = component_array[item].name;
            const add_val = Object.assign({}, component_array[item], { "name": val + "_" + keyUniqueID(), "key": nha_type });
            let old_array = [...props.cardData.CardItems.cardData];
            let data = old_array[0][array_type][sec_index].inner_sec[compo_index];
            let array = [...data.fields];
            array.push(add_val);
            let obj = Object.assign({}, data, { 'fields': array })
            old_array[0][array_type][sec_index].inner_sec[compo_index] = obj;
            setrepeater_display(true);
            props.addToCarthandler(old_array);
        }
    }

    /** delete controller from layout panel */
    const Delete_component = (e) => {
        let ids = e.target.closest('.wb-main-component').dataset;
        let old_array = [...props.cardData.CardItems.cardData];
        var editor_html = ace.edit("editor-html", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/html",
        });

        let html_code = editor_html.getValue();
        const ReplaceAll = (old_name) => {
            if (html_code.search([old_name]) > -1) {
                var range = editor_html.find(old_name, {
                    wrap: true,
                    caseSensitive: true,
                    wholeWord: true,
                    regExp: false,
                    preventScroll: true // do not change selection
                })
                if (range != null) {
                    editor_html.session.replace(range, "");
                    ReplaceAll(old_name);
                }
            }
        }

        const Replace_controller = (controller) => {
            if (controller.type == "gallery" || controller.type == "select2" || controller.type == "repeater") {
                ReplaceAll(`data-${controller.name}={${controller.name}}`);
            }
            if (controller.type == "url") {
                ReplaceAll(`{{${controller.name}-url}}`);
                ReplaceAll(`{{${controller.name}-is_external}}`);
                ReplaceAll(`{{${controller.name}-nofollow}}`);
            }
            ReplaceAll(`{{${controller.name}}}`);
        }

        if (ids.rnp) {
            var controller = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.rnp];
            Replace_controller(controller);

            if (controller.type == 'repeater' || controller.type == 'popover') {
                controller.fields.map((sub_controller) => {
                    Replace_controller(sub_controller);
                })
            }
        } else {
            var controller = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id];
            Replace_controller(controller);

            if (controller.type == 'repeater' || controller.type == 'popover') {
                controller.fields.map((sub_controller) => {
                    Replace_controller(sub_controller);
                })
            }
        }

        if (ids.rnp) {
            old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields.splice(ids.rnp, 1)
            props.addToCarthandler(old_array)
        } else {
            old_array[0][ids.array_type][ids.sec_id].inner_sec.splice(ids.compo_id, 1)
            props.addToCarthandler(old_array)
        }
        props.addToActiveController("");

    }

    /** duplication of controller inside layout panel */
    const Duplicate_component = async (e) => {
        let ids = e.target.closest('.wb-main-component').dataset;
        let old_array = [...props.cardData.CardItems.cardData];
        let unique_name = keyUniqueID();

        if (ids.rnp) {
            if (ids.rnp2 != 'false') {
                let old_repeater_name = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.rnp].fields[ids.rnp2];
                let AddItem = Object.assign({}, old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.rnp].fields[ids.rnp2], { "name": old_repeater_name + "_" + unique_name });
                let add_id = Number(ids.rnp2);
                old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.rnp].fields.splice(add_id + 1, 0, AddItem)
            } else {
                let old_repeater_name = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.rnp].type;
                let AddItem = Object.assign({}, old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.rnp], { "name": old_repeater_name + "_" + unique_name });
                let add_id = Number(ids.rnp);
                old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields.splice(add_id + 1, 0, AddItem)
            }
        } else {
            let type = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].type;
            if (type == "repeater" || type == "popover" || type == "normalhover") {
                let data = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id];
                let newItem = Object.assign({}, data, { "name": type + "_" + unique_name });
                let array = [];
                data.fields.map((controller) => {
                    let controller_type = controller.type
                    let newController = Object.assign({}, controller, { "name": controller_type + "_" + keyUniqueID() });
                    array.push(newController);
                })

                let AddItem = Object.assign({}, newItem, { "fields": array });
                let add_id = Number(ids.compo_id);
                old_array[0][ids.array_type][ids.sec_id].inner_sec.splice(add_id + 1, 0, AddItem)
            } else {
                let old_name = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].type;
                let AddItem = Object.assign({}, old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id], { "name": old_name + "_" + unique_name });
                let add_id = Number(ids.compo_id);
                old_array[0][ids.array_type][ids.sec_id].inner_sec.splice(add_id + 1, 0, AddItem)
            }
        }
        props.addToCarthandler(old_array)
    }

    /** activate controller on click of that controller layout */
    const Activate_controller = (e) => {
        if (document.querySelector('.wkit-expand-icon-box-border.wkit-wb-selected')) {
            document.querySelector('.wkit-expand-icon-box-border').click();
        }
        let data = e.target.closest('.wb-main-component');
        if (!e.target.closest('.duplicate-btn') && !e.target.closest('.remove-btn')) {
            if (data && data.dataset.compo_id && data.dataset.sec_id && data.dataset.array_type && data.dataset.rnp) {
                let controller = {
                    'compo_id': data.dataset.compo_id,
                    'sec_id': data.dataset.sec_id,
                    'array_type': data.dataset.array_type,
                    'repeater': data.dataset.rnp
                };
                props.addToActiveController(controller);

            } else if (data && data.dataset.compo_id && data.dataset.sec_id && data.dataset.array_type) {
                let controller = {
                    'compo_id': data.dataset.compo_id,
                    'sec_id': data.dataset.sec_id,
                    'array_type': data.dataset.array_type,
                };

                props.addToActiveController(controller);
            }
        }
    }

    /** get controller which is selected */
    const Select_controller = () => {
        if (props.controller && props.controller.controller) {
            let ids = props.controller.controller;
            if (props?.cardData?.CardItems?.cardData?.[0]?.[ids?.array_type]?.[ids?.sec_id]?.inner_sec?.[ids?.compo_id]?.fields?.[ids?.repeater]?.name) {
                return props.cardData.CardItems.cardData[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.repeater].name;
            } else if (props?.cardData?.CardItems?.cardData?.[0]?.[ids?.array_type]?.[ids?.sec_id]?.inner_sec?.[ids?.compo_id]?.name) {
                return props.cardData.CardItems.cardData[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].name;
            }
        }
    }

    /** custome drop down functionality for all controller*/
    const Drop_down_toggle = (e) => {
        let main_object = e.target.closest(".wkit-wb-custom-dropDown")
        let drop_down = main_object.querySelector(".wkit-wb-custom-dropDown-content") ? main_object.querySelector(".wkit-wb-custom-dropDown-content") : "";
        if (drop_down) {
            if (Object.values(drop_down.classList).includes("wkit-wb-show")) {
                drop_down.classList.remove("wkit-wb-show");
            } else {
                drop_down.classList.add("wkit-wb-show");
            }
            // Object.values(drop_down.classList).includes("wkit-wb-show") ? e.target.nextSibling.classList.remove("wkit-wb-show") : e.target.nextSibling.classList.add("wkit-wb-show")
        }
    }

    if (props.type == "text") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-append-content wb-main-component ${Select_controller() === props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable={false} className='tp-sec-edit' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className="wb-append-label" value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-right-append'>
                            <input className='wb-append-inp' value={props.defaultValue} type='text' placeholder={props.placeHolder}
                                onChange={(e) => {
                                    Change_value(e, "defaultValue")
                                }} />
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "number") {
        return (
            <>
                <div className='wb-drop'
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragOver={(e) => { e.preventDefault() }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-append-content wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}  >
                        <img draggable='false' className='wkit-wb-sec-edit' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className="wb-append-label" value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-right-append'>
                            <input className='wb-append-inp' value={props.defaultValue} type='number' placeholder={props.placeHolder} min={props.number_setting.min} max={props.number_setting.max} step={props.number_setting.step} onChange={(e) => { Change_value(e, "defaultValue") }} />
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => Activate_controller(e)}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "wysiwyg") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-textarea wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-textarea-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner' style={{ display: props.lableBlock == true ? "block" : "flex" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <textarea className='wb-textarea-inp' value={props.defaultValue} placeholder={props.placeHolder} onChange={(e) => { Change_value(e, "defaultValue") }}></textarea>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "code") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-textarea wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-textarea-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner' style={{ display: props.lableBlock == true ? "block" : "flex" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <textarea className='wb-textarea-inp' rows={props.rows} value={props.defaultValue} placeholder={props.placeHolder} onChange={(e) => { Change_value(e, "defaultValue") }}></textarea>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "choose") {
        let array = ['eicon-text-align-left', 'eicon-text-align-right', 'eicon-text-align-center', 'eicon-text-align-justify', 'eicon-arrow-up', 'eicon-arrow-down', 'eicon-arrow-right', 'eicon-arrow-left'];
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-alignment wb-main-component wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className="wb-alignment-header">
                        <div className='wb-append-inner' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <div className='wb-icons'>
                                {props.align_option && props.align_option.map((icon, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <div className='wkit-wb-alignIcon-content'>
                                                {icon.align_lable &&
                                                    <div className='wkit-wb-align-icon-lable'>{icon.align_lable}<div className='wkit-wb-align-icon-tooltip'></div></div>
                                                }{array.includes(icon.align_icon) ?
                                                    icon.align_value == props.align_defaultValue ?
                                                        <img className='wkit-wb-align-icon wb-icon-selected' src={`${img_path}assets/images/wb-svg/${icon.align_icon}-white.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                        : <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/${icon.align_icon}.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
                                                    : icon.align_value == props.align_defaultValue ?
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
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "font") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-select wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <select className='select-dropdown' >
                            <option>font-1</option>
                            <option>font-2</option>
                            <option>font-3</option>
                        </select>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "datetime") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-date-time wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' className='tp-sec-edit' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className="wb-append-label" value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-right-append'>
                            <input className='wb-append-inp wb-date-time-w' value={props.defaultValue} type='datetime-local' placeholder={props.placeHolder}
                                onChange={(e) => {
                                    Change_value(e, "defaultValue")
                                }} />
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "gallery") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-gallery wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-gallery-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner' style={{ width: "60%" }}>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "block" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-gallery-image'>
                            <div className="wb-gallery-image-header">
                                <label>No Images Selected</label>
                            </div>
                            <div className="wb-gallery-image-content">
                                <div className='wb-gallery-image-backgorund'>
                                    <img src={img_path + "assets/images/wb-svg/add-section-icon.svg"} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "background") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-background wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className="wb-background-header">
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-icons'>
                            <img style={{ display: props.types.indexOf(`"classic"`) == -1 ? "none" : "block" }} className='wb-background-icon left' src={img_path + 'assets/images/wb-svg/bg-pencil.svg'} />
                            <img style={{ display: props.types.indexOf(`"gradient"`) == -1 ? "none" : "block" }} className='wb-background-icon' src={img_path + 'assets/images/wb-svg/grediant.svg'} />
                            <img style={{ display: props.types.indexOf(`"video"`) == -1 ? "none" : "block" }} className='wb-background-icon right' src={img_path + 'assets/images/wb-svg/Image.svg'} />
                        </div>
                    </div>
                    {/* {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    } */}
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "border") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-border wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className="wb-border-header">
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-icons'>
                            <img className='wb-border-icon left' src={img_path + 'assets/images/wb-svg/border 1.svg'} />
                            <img className='wb-border-icon' src={img_path + 'assets/images/wb-svg/border 2.svg'} />
                            <img className='wb-border-icon' src={img_path + 'assets/images/wb-svg/border 3.svg'} />
                            <img className='wb-border-icon right' src={img_path + 'assets/images/wb-svg/border 4.svg'} />
                        </div>
                    </div>
                    <div className="wb-border-color">
                        <span>Border Color</span>
                        <img className='wb-color-icon' src={img_path + 'assets/images/wb-svg/box.svg'} />
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "boxshadow") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-box-shadow wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-box-shadow-header'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                    </div>
                    <div className='wb-box-shadow-content'>
                        <div className='content-1'>
                            <span className='content-text'>Color</span>
                            <img className='wb-color-icon' src={img_path + 'assets/images/wb-svg/box.svg'} />
                        </div>
                        <div className='content-2'>
                            <span className='content-text'>X</span>
                            <input className='shadow-inp' type="number" />
                        </div>
                        <div className='content-3'>
                            <span className='content-text'>Y</span>
                            <input className='shadow-inp' type="number" />
                        </div>
                        <div className='content-4'>
                            <span className='content-text'>Blur</span>
                            <input className='shadow-inp' type="number" />
                        </div>
                        <div className='content-5'>
                            <span className='content-text'>Spread</span>
                            <input className='shadow-inp' type="number" />
                        </div>
                    </div>
                    <div className='wb-shadow-switcher'>
                        <span>{shadow}</span>
                        <div>
                            <span className={shadow == "Inset" ? "shadow-btn active-shadow" : "shadow-btn"} onClick={() => { setshadow("Inset") }} >Inset</span>
                            <span className={shadow == "Outset" ? "shadow-btn active-shadow" : "shadow-btn"} onClick={() => { setshadow("Outset") }} >Outset</span>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "textshadow") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-box-shadow wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-box-shadow-header'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                    </div>
                    <div className='wb-box-shadow-content'>
                        <div className='content-1'>
                            <span className='content-text'>Color</span>
                            <img className='wb-color-icon' src={img_path + 'assets/images/wb-svg/box.svg'} />
                        </div>
                        <div className='content-2'>
                            <span className='content-text'>X</span>
                            <input className='shadow-inp' type="number" />
                        </div>
                        <div className='content-3'>
                            <span className='content-text'>Y</span>
                            <input className='shadow-inp' type="number" />
                        </div>
                        <div className='content-4'>
                            <span className='content-text'>Blur</span>
                            <input className='shadow-inp' type="number" />
                        </div>
                        <div className='content-5'>
                            <span className='content-text'>Spread</span>
                            <input className='shadow-inp' type="number" />
                        </div>
                    </div>
                    <div className='wb-shadow-switcher'>
                        <span>{shadow}</span>
                        <div>
                            <span className={shadow == "Inset" ? "shadow-btn active-shadow" : "shadow-btn"} onClick={() => { setshadow("Inset") }} >Inset</span>
                            <span className={shadow == "Outset" ? "shadow-btn active-shadow" : "shadow-btn"} onClick={() => { setshadow("Outset") }} >Outset</span>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "color") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-color wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className="wb-border-color">
                        <div className='wb-append-inner-color' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <div className='wb-color-icon'>
                                <input className='wb-color-picker' type='color' value={props.defaultValue} onChange={(e) => {
                                    Change_value(e, "defaultValue")
                                }} />
                            </div>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "cssfilter") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-css-filter wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-css-filter-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <img className='wb-css-filter-icon' src={img_path + "assets/images/wb-svg/pana-icon.svg"} />
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn'>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "dimension") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-dimension wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-inner' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        {props.dimension_defaultValue &&
                            <div className='wb-dimension-content'>
                                <div className='wb-dimension-inp'>
                                    <input className='dimension-inp top-inp' value={props.dimension_defaultValue.top} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `top`) }} type='number' />
                                    <span className='wb-dimension-lable'>TOP</span>
                                </div>
                                <div className='wb-dimension-inp'>
                                    <input className='dimension-inp right-inp' value={props.dimension_defaultValue.isLinked == true ? props.dimension_defaultValue.top : props.dimension_defaultValue.right} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${props.dimension_defaultValue.isLinked == true ? 'top' : 'right'}`) }} type='number' />
                                    <span className='wb-dimension-lable'>RIGHT</span>
                                </div>
                                <div className='wb-dimension-inp'>
                                    <input className='dimension-inp bottom-inp' value={props.dimension_defaultValue.isLinked == true ? props.dimension_defaultValue.top : props.dimension_defaultValue.bottom} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${props.dimension_defaultValue.isLinked == true ? 'top' : 'bottom'}`) }} type='number' />
                                    <span className='wb-dimension-lable'>BOTTOM</span>
                                </div>
                                <div className='wb-dimension-inp'>
                                    <input className='dimension-inp left-inp' value={props.dimension_defaultValue.isLinked == true ? props.dimension_defaultValue.top : props.dimension_defaultValue.left} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${props.dimension_defaultValue.isLinked == true ? 'top' : 'left'}`) }} type='number' />
                                    <span className='wb-dimension-lable'>LEFT</span>
                                </div>
                                <div className='wb-dimension-icon' onClick={(e) => { e, Change_value(e, 'dimension_defaultValue', 'isLinked') }}>
                                    <img className={props.dimension_defaultValue.isLinked == true ? 'dimension-icon wkit-wb-dark' : 'dimension-icon'} src={img_path + 'assets/images/wb-svg/link.svg'} />
                                </div>
                            </div>
                        }
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "typography") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-typography wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-typography-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <img className='wb-typography-icon' src={img_path + "assets/images/wb-svg/pana-icon.svg"} />
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "gradientcolor") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-grediant-color wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-grediant-color-content'>
                        <div className='wb-grediant-color-bar'></div>
                        <div className='wb-grediant-color-selector'>
                            <div className='wb-append-inner'>
                                <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            </div>
                            <select className='gradiant-color-dropDown'>
                                <option>Linear</option>
                                <option>radial</option>
                                <option>conic</option>
                            </select>
                            <input className='grediant-color-inp' value='135' type='text' />
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "heading") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-heading wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-header-content'>
                        <div className='wb-append-inner' >
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "repeater") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-main-component wb-repeater ${Select_controller() == props.name ? 'wkit-wb-main-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-main-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-repeater-content'>
                        <div className='wb-append-inner' >
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-repeater-field' onClick={() => { setrepeater_display(!repeater_display) }}>
                            <input className='wb-repeater-field-title' value={props.title_field} onChange={(e) => { Change_value(e, "title_field") }} />
                        </div>
                        <div className='wb-repeater-options' style={{ display: repeater_display == true ? "block" : "none" }}>
                            {props.fields &&
                                props.fields.map((dd, repeater_index) => {
                                    return (
                                        <div key={repeater_index}>
                                            <Component_html_container
                                                name={dd.name}
                                                showLable={dd.showLable}
                                                separator={dd.separator}
                                                lableBlock={dd.lableBlock}
                                                placeHolder={dd.placeHolder}
                                                type={dd.type}
                                                description={dd.description}
                                                defaultValue={dd.defaultValue}
                                                lable={dd.lable}
                                                sec_index={props.sec_index}
                                                array_type={props.array_type}
                                                compo_index={props.compo_index}
                                                rnp_id={props.rnp_id != undefined ? props.rnp_id : repeater_index}
                                                rnp2_id={props.rnp_id != undefined && repeater_index}
                                                types={dd.types}
                                                number_setting={dd.number_setting}
                                                title_field={dd.title_field}
                                                fields={dd.fields}
                                                return_value={dd.return_value}
                                                is_external={dd.is_external}
                                                nofollow={dd.nofollow}
                                                size_units={dd.size_units}
                                                options={dd.options}
                                                rows={dd.rows}
                                                dimension_defaultValue={dd.dimension_defaultValue}
                                                align_option={dd.align_option}
                                                align_defaultValue={dd.align_defaultValue}
                                                select_defaultValue={dd.select_defaultValue}
                                                select2_defaultValue={dd.select2_defaultValue}
                                                hTags_defaultValue={dd.hTags_defaultValue}
                                                slider_defaultValue={dd.slider_defaultValue}
                                                nha_array={dd.nha_array}
                                                nha_type={dd.nha_type} />
                                        </div>
                                    );
                                })
                            }
                            <div className='wb-drop'
                                onDragOver={(e) => { e.preventDefault() }}
                                onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                                onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                                onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                            </div>
                            <div className='wb-main-component' draggable="false" data-compo_id={props.compo_index} data-rnp={props.fields.length} data-sec_id={props.sec_index} data-array_type={props.array_type}></div>
                            <div className={`wb-repeater-droped class-${props.sec_index}-${props.compo_index}`}
                                draggable
                                onDragOver={(event) => { event.preventDefault() }}
                                onDrop={(event) => { event.preventDefault(), Rnp_Component_drop(event, props.sec_index, props.compo_index, props.array_type, props.rnp_id) }}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.25 0H5.25V5.25H0V6.25H5.25V12H6.25V6.25H12V5.25H6.25V0Z" fill="#888888" />
                                </svg>
                                <span>Add More Controller </span>
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-main-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "popover") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-popover wb-main-component ${Select_controller() == props.name ? 'wkit-wb-main-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-main-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-popover-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner wkit-wb-popoverLable'>
                            <input className='wb-append-label wkit-wb-popoverInput' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-popover-options'>
                            {props.fields &&
                                props.fields.map((dd, popover_index) => {
                                    return (
                                        <div key={popover_index}>
                                            <Component_html_container
                                                name={dd.name}
                                                showLable={dd.showLable}
                                                separator={dd.separator}
                                                lableBlock={dd.lableBlock}
                                                placeHolder={dd.placeHolder}
                                                type={dd.type}
                                                description={dd.description}
                                                defaultValue={dd.defaultValue}
                                                lable={dd.lable}
                                                sec_index={props.sec_index}
                                                array_type={props.array_type}
                                                compo_index={props.compo_index}
                                                rnp_id={props.rnp_id != undefined ? props.rnp_id : popover_index}
                                                rnp2_id={props.rnp_id != undefined && popover_index}
                                                types={dd.types}
                                                number_setting={dd.number_setting}
                                                title_field={dd.title_field}
                                                fields={dd.fields}
                                                return_value={dd.return_value}
                                                is_external={dd.is_external}
                                                nofollow={dd.nofollow}
                                                size_units={dd.size_units}
                                                options={dd.options}
                                                rows={dd.rows}
                                                dimension_defaultValue={dd.dimension_defaultValue}
                                                align_option={dd.align_option}
                                                align_defaultValue={dd.align_defaultValue}
                                                select_defaultValue={dd.select_defaultValue}
                                                hTags_defaultValue={dd.hTags_defaultValue}
                                                select2_defaultValue={dd.select2_defaultValue}
                                                slider_defaultValue={dd.slider_defaultValue}
                                                nha_array={dd.nha_array}
                                                nha_type={dd.nha_type} />
                                        </div>
                                    );
                                })
                            }
                            <div className='wb-drop'
                                onDragOver={(e) => { e.preventDefault() }}
                                onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                                onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                                onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                            </div>
                            <div className='wb-main-component' draggable="false" data-compo_id={props.compo_index} data-rnp={props.fields.length} data-sec_id={props.sec_index} data-array_type={props.array_type}></div>
                            <div className={`wb-popover-droped class-${props.sec_index}-${props.compo_index}`}
                                draggable
                                onDragOver={(event) => { event.preventDefault() }}
                                onDrop={(event) => { event.preventDefault(), Rnp_Component_drop(event, props.sec_index, props.compo_index, props.array_type, props.rnp_id) }}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.25 0H5.25V5.25H0V6.25H5.25V12H6.25V6.25H12V5.25H6.25V0Z" fill="#888888" />
                                </svg>
                                <span>Add More Controller </span>
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-main-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "normalhover") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-popover wb-main-component ${Select_controller() == props.name ? 'wkit-wb-main-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-main-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-popover-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label'
                                style={{ display: props.showLable == true ? "" : "none" }}
                                value={props.lable}
                                onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-popover-options'>
                            <div className='wkit-wb-normalHover'>
                                {props.nha_array?.includes('normal') &&
                                    <div className='wkit-wb-normalHoverList' style={{ backgroundColor: props.nha_type == 'normal' ? '#A73362' : 'white', color: props.nha_type == 'normal' ? '#fff' : 'black', width: `${100 / Number(props.nha_array.length)}%` }} onClick={(e) => { Change_value(e, "nha_type", 'normal') }}>Normal</div>
                                }
                                {props.nha_array?.includes('hover') &&
                                    <div className='wkit-wb-normalHoverList' style={{ backgroundColor: props.nha_type == 'hover' ? '#A73362' : 'white', color: props.nha_type == 'hover' ? '#fff' : 'black', width: `${100 / Number(props.nha_array.length)}%` }} onClick={(e) => { Change_value(e, "nha_type", 'hover') }}>Hover</div>
                                }
                                {props.nha_array?.includes('active') &&
                                    <div className='wkit-wb-normalHoverList' style={{ backgroundColor: props.nha_type == 'active' ? '#A73362' : 'white', color: props.nha_type == 'active' ? '#fff' : 'black', width: `${100 / Number(props.nha_array.length)}%` }} onClick={(e) => { Change_value(e, "nha_type", 'active') }}>Active</div>
                                }
                            </div>
                            {props.fields &&
                                props.fields.map((dd, nha_index) => {
                                    if (dd.key == props.nha_type) {
                                        return (
                                            <div key={nha_index}>
                                                <Component_html_container
                                                    name={dd.name}
                                                    showLable={dd.showLable}
                                                    separator={dd.separator}
                                                    lableBlock={dd.lableBlock}
                                                    placeHolder={dd.placeHolder}
                                                    type={dd.type}
                                                    description={dd.description}
                                                    defaultValue={dd.defaultValue}
                                                    lable={dd.lable}
                                                    sec_index={props.sec_index}
                                                    array_type={props.array_type}
                                                    compo_index={props.compo_index}
                                                    rnp_id={props.rnp_id != undefined ? props.rnp_id : nha_index}
                                                    rnp2_id={props.rnp_id != undefined && nha_index}
                                                    nha_id={nha_index}
                                                    types={dd.types}
                                                    number_setting={dd.number_setting}
                                                    title_field={dd.title_field}
                                                    fields={dd.fields}
                                                    return_value={dd.return_value}
                                                    is_external={dd.is_external}
                                                    nofollow={dd.nofollow}
                                                    size_units={dd.size_units}
                                                    options={dd.options}
                                                    rows={dd.rows}
                                                    dimension_defaultValue={dd.dimension_defaultValue}
                                                    align_option={dd.align_option}
                                                    align_defaultValue={dd.align_defaultValue}
                                                    select_defaultValue={dd.select_defaultValue}
                                                    hTags_defaultValue={dd.hTags_defaultValue}
                                                    select2_defaultValue={dd.select2_defaultValue}
                                                    slider_defaultValue={dd.slider_defaultValue}
                                                    nha_type={props.nha_type}
                                                    nha_array={props.nha_array}
                                                />
                                            </div>
                                        );
                                    }
                                })
                            }
                            <div className='wb-drop'
                                onDragOver={(e) => { e.preventDefault() }}
                                onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                                onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                                onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}
                            >
                            </div>
                            <div className='wb-main-component'
                                draggable="false"
                                data-compo_id={props.compo_index}
                                data-rnp={props.fields.length}
                                data-sec_id={props.sec_index}
                                data-array_type={props.array_type}
                                data-nha={props.nha_type}
                            >
                            </div>
                            <div className={`wb-popover-droped class-${props.sec_index}-${props.compo_index}`}
                                draggable
                                onDragOver={(event) => { event.preventDefault() }}
                                onDrop={(event) => { event.preventDefault(), Nha_Component_drop(event, props.sec_index, props.compo_index, props.array_type, props.nha_type) }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.25 0H5.25V5.25H0V6.25H5.25V12H6.25V6.25H12V5.25H6.25V0Z" fill="#888888" />
                                </svg>
                                <span>Add More Controller </span>
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-main-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "divider") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-heading wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-header-content'>
                        Divider
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "rawhtml") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-heading wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-header-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-right-append'>
                            <textarea className='wb-append-inp' style={{ width: '100%' }} value={props.defaultValue} type='text' placeholder={props.placeHolder}
                                onChange={(e) => {
                                    Change_value(e, "defaultValue")
                                }} />
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "icon") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-icon-list wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-icon-list-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <img className='wb-icon-list-icon' src={img_path + "assets/images/wb-svg/pana-icon.svg"} />
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "hidden") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-icon-list wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-icon-list-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <img className='wb-icon-list-icon' src={img_path + "assets/images/wb-svg/pana-icon.svg"} />
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "media") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-media wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-media-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner' style={{ display: props.showLable == true ? "block" : "none" }}>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <img className='wb-media-icon' style={{ width: props.lableBlock == true ? "100%" : "65%" }} src={img_path + "assets/images/wb-png/placeholder.png"} />
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "iconscontrol") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-icon-list wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-icon-list-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <img className='wb-icon-list-icon' src={img_path + "assets/images/wb-svg/pana-icon.svg"} />
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "linksearch") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-link-search wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-link-search-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <img className='wb-link-search-icon' src={img_path + "assets/images/wb-svg/pana-icon.svg"} />
                    </div>
                </div>
            </>
        );
    } else if (props.type == "multirange") {
        useEffect(() => {
            const inputLeft = document.getElementById("input-left");
            const inputRight = document.getElementById("input-right");

            const thumbLeft = document.querySelector(".slider > .thumb.left");
            const thumbRight = document.querySelector(".slider > .thumb.right");
            const range = document.querySelector(".slider > .range");

            const setLeftValue = () => {
                const _this = inputLeft;
                const [min, max] = [parseInt(_this.min), parseInt(_this.max)];
                _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
                const percent = ((_this.value - min) / (max - min)) * 100;
                thumbLeft.style.left = percent + "%";
                range.style.left = percent + "%";
            };

            const setRightValue = () => {
                const _this = inputRight;
                const [min, max] = [parseInt(_this.min), parseInt(_this.max)];
                _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
                const percent = ((_this.value - min) / (max - min)) * 100;
                thumbRight.style.right = 100 - percent + "%";
                range.style.right = 100 - percent + "%";
            };

            inputLeft.addEventListener("input", setLeftValue);
            inputRight.addEventListener("input", setRightValue);
        })
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-multi-range wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-multi-range-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className="middle">
                            <div className="multi-range-slider">
                                <input type="range" id="input-left" min="0" max="100" value="25" />
                                <input type="range" id="input-right" min="0" max="100" value="75" />

                                <div className="slider">
                                    <div className="track"></div>
                                    <div className="range"></div>
                                    <div className="thumb left"></div>
                                    <div className="thumb right"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "notice") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-note wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-note-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div>
                            <textarea className='wb-note-inp' value={props.defaultValue} placeholder='Write Your Note here....' onChange={(e) => { Change_value(e, "defaultValue") }}></textarea>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "radioadvanced") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-radio-advanced wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-radio-advanced-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-radio-color'>
                            <div className={type == "normal" ? "radio-btn active-ra" : "radio-btn"} onClick={() => { settype("normal") }}>Normal</div>
                            <div className={type == "grediant" ? "radio-btn active-ra" : "radio-btn"} onClick={() => { settype("grediant") }}>grediant</div>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "slider") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-range wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-range-content'>
                        <div className='wb-append-inner' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <div className='wb-range-bar'>
                                {props && props.size_units && props.slider_defaultValue && props.slider_defaultValue[0] && props.size_units.map((value, index) => {
                                    if (props.slider_defaultValue[0] == value.type) {
                                        return (
                                            <Fragment key={index}>
                                                <input className='wb-range-inp'
                                                    min={value.min} max={value.max} step={value.step}
                                                    type='range'
                                                    value={props.slider_defaultValue[1]}
                                                    onChange={(e) => { Change_value(e, 'defaultValue_slider') }}
                                                    style={{ background: `linear-gradient(to right, ${slider_color} 0%, ${slider_color} ${((props.slider_defaultValue[1] - value.min) * 100) / (value.max - value.min)}%, #e1e1e1 0%, #e1e1e1 0%)` }} />
                                                <input className='range-inp-val' min={value.min} max={value.max} step={value.step} type='number' value={props.slider_defaultValue[1]} onChange={(e) => { Change_value(e, 'defaultValue_slider') }} />
                                            </Fragment>
                                        );
                                    }
                                })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "select") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-select wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wkit-wb-custom-dropDown'>
                            <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                <label>{props.select_defaultValue[1]}</label>
                                <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                            </div>
                            <div className='wkit-wb-custom-dropDown-content'>
                                {props.options.map((val, index) => {
                                    let array = [val.value, val.lable];
                                    return (
                                        <Fragment key={index}>
                                            <option value={val.lable} onClick={(e) => { Change_value(e, 'select_defaultValue', array) }}>{val.lable}</option>
                                        </Fragment>
                                    );
                                })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "selecttemplate") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-select wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wkit-wb-custom-dropDown'>
                            <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                <label>Select Template</label>
                                <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                            </div>
                            <div className='wkit-wb-custom-dropDown-content'>
                                <option selected="Select Template">Select Template</option>
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "headingtags") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-select wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wkit-wb-custom-dropDown'>
                            <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                <label>{props.hTags_defaultValue}</label>
                                <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                            </div>
                            <div className='wkit-wb-custom-dropDown-content'>
                                <option value="h1" onClick={(e) => { Change_value(e, 'hTags_defaultValue') }}>H1</option>
                                <option value="h2" onClick={(e) => { Change_value(e, 'hTags_defaultValue') }}>H2</option>
                                <option value="h3" onClick={(e) => { Change_value(e, 'hTags_defaultValue') }}>H3</option>
                                <option value="h4" onClick={(e) => { Change_value(e, 'hTags_defaultValue') }}>H4</option>
                                <option value="h5" onClick={(e) => { Change_value(e, 'hTags_defaultValue') }}>H5</option>
                                <option value="h6" onClick={(e) => { Change_value(e, 'hTags_defaultValue') }}>H6</option>
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "select2") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-main-component wb-select2 ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select2-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wkit-wb-custom-dropDown' style={{ width: '55%' }}>
                            <div className='wkit-wb-custom-dropDown-header wkit-multi-select-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                {props.select2_defaultValue && props.select2_defaultValue.map((val, index) => {
                                    return (
                                        <div className='wkit-wb-multi-selected' key={index}>
                                            <div className='wkit-wb-remove-value' onClick={(e) => { Change_value(e, "select2_defaultValue", index, 'remove') }}>&times;</div>
                                            <label>{val.lable}</label>
                                        </div>
                                    );
                                })}
                                <img src={img_path + 'assets/images/wb-svg/plus-icon.svg'} />
                            </div>
                            <div className='wkit-wb-custom-dropDown-content wkit-multi-select-dropDown' style={{ marginBottom: (-37 * (props.options.length - props.select2_defaultValue.length)) + "px" }}>
                                {props.options.map((val, index) => {
                                    let array = { 'value': val.value, "lable": val.lable };
                                    return (
                                        <div className='wkit-wb-multiSelect-value' key={index}>
                                            {props.select2_defaultValue.find(item => item.value == array.value) &&
                                                props.select2_defaultValue.find(item => item.lable == array.lable) ? "" :
                                                <>
                                                    <input type='checkbox' style={{ display: 'none' }} onChange={(e) => { Change_value(e, "select2_defaultValue", array, 'add') }} />
                                                    <label onClick={(e) => { e.target.previousSibling.click() }}>{val.lable}</label>
                                                </>
                                            }
                                        </div>
                                    );
                                })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "textarea") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-textarea wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-textarea-content'>
                        <div className='wb-append-inner' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <textarea className='wb-textarea-inp' rows={props.rows} value={props.defaultValue} placeholder={props.placeHolder} onChange={(e) => { Change_value(e, "defaultValue") }}></textarea>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "switcher") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-toggle wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-toggle-content'>
                        <div className='wb-append-inner' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <label className="wb-switch">
                                <input type="checkbox" checked={props.defaultValue} onChange={(e) => { Change_value(e, "switcher_defaultValue") }} />
                                <span className="wb-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "url") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-url wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-inner' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        <div>
                            <div className='wb-url-content'>
                                <input className='wb-url-inp' style={{ width: props.lableBlock == true ? "100%" : "" }} type='url' placeholder={props.placeHolder} value={props.defaultValue} onChange={(e) => {
                                    Change_value(e, "defaultValue")
                                }} />
                                {/* <img className='inp-url-icon' src={img_path + 'assets/images/wb-svg/setting.svg'} onClick={(e) => { e.target.parentElement.nextSibling.classList.add("wb-show") }} /> */}
                                <img className='inp-url-icon' src={img_path + 'assets/images/wb-svg/setting.svg'}
                                    onClick={(e) => {
                                        Object.values(e.target.parentElement.nextSibling.classList).includes("wb-show") ?
                                            e.target.parentElement.nextSibling.classList.remove("wb-show") : e.target.parentElement.nextSibling.classList.add("wb-show")
                                    }} />
                            </div>
                            <div className='wb-url-options'>
                                <div className='url-opt'>
                                    <input type='checkbox' checked={props.is_external} onChange={(e) => { Change_value(e, "is_external") }} />
                                    <label>Open in new window</label>
                                </div>
                                <div className='url-opt'>
                                    <input type='checkbox' checked={props.nofollow} onChange={(e) => { Change_value(e, "nofollow") }} />
                                    <label>Add Nofollow</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <input className='wb-append-dec' value={props.description} />
                    }
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} />
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (props.type == "styleimage") {


        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-select wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select-content' style={{ flexDirection: "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wkit-wb-custom-dropDown'>
                            <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                <label>{props.select_defaultValue[1]}</label>
                                <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                            </div>
                            <div className='wkit-wb-custom-dropDown-content'>

                                {props.options.map((val, index) => {
                                    let array = [val.value, val.lable];
                                    return (
                                        <Fragment key={index}>
                                            <option value={val.lable} onClick={(e) => { Change_value(e, 'select_defaultValue', array) }}>{val.lable}</option>
                                        </Fragment>
                                    );
                                })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='wb-hover-component'>
                        <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-pen.svg'} draggable="false" />
                        </div>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-copy2.svg'} draggable="false" />
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <img src={img_path + 'assets/images/wb-svg/white-delete.svg'} draggable="false" />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Component_html;