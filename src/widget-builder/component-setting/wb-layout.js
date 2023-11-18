import { useState, useRef, useEffect } from 'react';
import { layout_index } from "../section_data_json";
import { component_array } from '../components-data/component_array';
import Component_html_container from '../redux-container/component_html_container';
const { Fragment } = wp.element;

const Wb_layout = (props) => {

    var img_path = wdkitData.WDKIT_URL;

    /** Function to get unique id of 8 digit */
    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    const [Drag_event, setDrag] = useState(false); /** Drag-Drop validation for alow drag and drop event */
    const [component_index, setcomponent_index] = useState(layout_index); /** unique index for new section  */
    const [sectionToggle, setsectionToggle] = useState(0); /** Toggle event of section (only one section open at time) */

    const sec_drop_location = useRef(); /** Drop location id for section */
    const sec_drag_start = useRef(); /** section id which is dragged */
    const compo_drag_section_id = useRef(); /** section id of dragged component */

    const inp_default_val = useRef(); /**section name validation input value */


    /** Object for add new section */
    var builder_name = `builder-${component_index}`,
        section_name = `Section-${component_index}`,
        add_struct = {
            "name": builder_name,
            "section": section_name,
            "compo_index": component_index,
            "inner_sec": []
        }

    useEffect(() => {
        /**Inline Drag and drop of components*/
        var component_drag_start = document.querySelectorAll('.wb-main-component');
        if (component_drag_start.length > 0) {
            component_drag_start.forEach((compo) => {
                compo.addEventListener('dragstart', (event) => {
                    if (event.target.closest('.wb-main-component').dataset.array_type == props.array_type) {
                        event.stopImmediatePropagation();
                        compo_drag_section_id.current = event.target.closest('.wb-main-component').dataset;
                    }
                })
            })
        }

        var component_drop_event = document.querySelectorAll('.wb-drop');
        if (component_drop_event.length > 0) {
            component_drop_event.forEach((compo) => {
                compo.addEventListener('drop', (event) => {
                    if (event.dataTransfer.getData('controller_id') && event.target.nextElementSibling.dataset.sec_id) {
                        event.stopImmediatePropagation();
                        let item = event.dataTransfer.getData('controller_id');
                        let sec_index = event.target.nextElementSibling.dataset.sec_id;
                        let compo_index = event.target.nextElementSibling.dataset.compo_id;
                        const val = component_array[item].name;
                        if (event.target.nextSibling.dataset.nha) {
                            var add_val = Object.assign({}, component_array[item], { "name": val + "_" + keyUniqueID(), "key": event.target.nextSibling.dataset.nha });
                        } else {
                            var add_val = Object.assign({}, component_array[item], { "name": val + "_" + keyUniqueID() });
                        }
                        let old_array = [...props.cardData];
                        if (event.target.nextSibling.dataset.rnp) {
                            let repeater_id = event.target.nextSibling.dataset.rnp;
                            let data = old_array[0][props.array_type][sec_index].inner_sec[compo_index]
                            let array = [...data.fields]
                            array.splice(repeater_id, 0, add_val);
                            let obj = Object.assign({}, data, { 'fields': array })
                            old_array[0][props.array_type][sec_index].inner_sec[compo_index] = obj;
                        } else {
                            old_array[0][props.array_type][sec_index].inner_sec.splice(compo_index, 0, add_val);
                        }
                        event.target.classList.remove("wb_drag-over")
                        props.addToCarthandler(old_array)
                    } else {
                        if (event.target.nextElementSibling.dataset.array_type == props.array_type) {
                            event.stopImmediatePropagation()
                            let data_set = event.target.nextElementSibling.dataset;
                            event.target.classList.remove("wb_drag-over")
                            Component_Inline_Drag(data_set)
                        }
                    }
                })
            })
        }
    })

    /** component inline drag and drop functions */
    const Component_Inline_Drag = (data_set) => {
        let drag_secId = compo_drag_section_id.current?.sec_id,
            drag_componentId = compo_drag_section_id.current?.compo_id,
            drag_RepeaterID = compo_drag_section_id.current?.rnp != undefined ? compo_drag_section_id.current?.rnp : "",
            drop_secId = data_set?.sec_id,
            drop_componentId = data_set?.compo_id,
            drop_RepeaterID = data_set?.rnp != undefined ? data_set?.rnp : "",
            old_array = [...props.cardData]

        if (old_array?.[0]?.[props?.array_type]?.[drag_secId]?.inner_sec[drag_componentId]) {
            if (drag_RepeaterID && drop_RepeaterID) {
                let data = old_array[0][props.array_type][drag_secId].inner_sec[drag_componentId].fields[drag_RepeaterID]
                old_array[0][props.array_type][drag_secId].inner_sec[drag_componentId].fields.splice(drag_RepeaterID, 1);
                if (drag_RepeaterID < drop_RepeaterID) {
                    old_array[0][props.array_type][drop_secId].inner_sec[drop_componentId].fields.splice(drop_RepeaterID - 1, 0, data);
                } else {
                    old_array[0][props.array_type][drop_secId].inner_sec[drop_componentId].fields.splice(drop_RepeaterID, 0, data);
                }
            } else if (drag_RepeaterID && !drop_RepeaterID) {
                let data = old_array[0][props.array_type][drag_secId].inner_sec[drag_componentId].fields[drag_RepeaterID]
                old_array[0][props.array_type][drag_secId].inner_sec[drag_componentId].fields.splice(drag_RepeaterID, 1);
                old_array[0][props.array_type][drop_secId].inner_sec.splice(drop_componentId, 0, data);
            } else {
                let data = old_array[0][props.array_type][drag_secId].inner_sec[drag_componentId];
                old_array[0][props.array_type][drag_secId].inner_sec.splice(drag_componentId, 1);
                if (drag_componentId < drop_componentId) {
                    old_array[0][props.array_type][drop_secId].inner_sec.splice(drop_componentId - 1, 0, data);
                } else {
                    old_array[0][props.array_type][drop_secId].inner_sec.splice(drop_componentId, 0, data);
                }
            }
            props.addToCarthandler(old_array)
            props.addToActiveController("");
        }
    }

    /** component drag and drop from elements side */
    const Component_drop = (event, index) => {
        let item = event.dataTransfer.getData('controller_id');
        if (item) {
            const val = component_array[item].name;
            const add_val = Object.assign({}, component_array[item], { "name": val + "_" + keyUniqueID() });
            let old_array = [...props.cardData];
            old_array[0][props.array_type][index].inner_sec.push(add_val);
            props.addToCarthandler(old_array)
        }
    }

    /** Section remove function */
    const Remove_section = (e, index) => {

        var editor_html = ace.edit("editor-html", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/html",
        });

        const ReplaceAll = (name) => {
            var range = editor_html.find(name, {
                wrap: true,
                caseSensitive: true,
                wholeWord: true,
                regExp: false,
                preventScroll: true // do not change selection
            })
            if (range != null) {
                editor_html?.session?.replace(range, "");
                ReplaceAll(name);
            }
        }

        let old_array = [...props.cardData];
        old_array[0][props.array_type][index].inner_sec?.map((controller) => {
            if (controller?.type == "repeater" || controller?.type == "popover") {
                ReplaceAll(`data-${controller.name}={${controller.name}}`);
                controller?.fields?.map((sub_controller) => {
                    if (sub_controller?.type == "gallery" || sub_controller?.type == "select2" || sub_controller?.type == "repeater") {
                        ReplaceAll(`data-${sub_controller?.name}={${sub_controller?.name}}`);
                    }
                    if (sub_controller?.type == "url") {
                        ReplaceAll(`{{${sub_controller.name}-url}}`);
                        ReplaceAll(`{{${sub_controller.name}-is_external}}`);
                        ReplaceAll(`{{${sub_controller.name}-nofollow}}`);
                    }
                    ReplaceAll(`{{${sub_controller?.name}}}`);
                })
            } else {
                if (controller?.type == "gallery" || controller?.type == "select2" || controller?.type == "repeater") {
                    ReplaceAll(`data-${controller?.name}={${controller?.name}}`);
                }
                if (controller?.type == "url") {
                    ReplaceAll(`{{${controller.name}-url}}`);
                    ReplaceAll(`{{${controller.name}-is_external}}`);
                    ReplaceAll(`{{${controller.name}-nofollow}}`);
                }
                ReplaceAll(`{{${controller?.name}}}`);
            }
        })

        old_array[0][props.array_type].splice(index, 1);
        props.addToCarthandler(old_array)
        props.addToActiveController("");
    }

    /**Section inline drag and drop functions */
    const Section_dragStart = (e, index) => {
        sec_drag_start.current = index;
    }

    const Section_dragEnter = (e, index) => {
        sec_drop_location.current = index;
    }

    const Section_drop = (e, index) => {
        if (!Object.values(e.target.classList).includes("wb-main-component")) {
            let old_array = [...props.cardData],
                drag_content = old_array[0][props.array_type][sec_drag_start.current];

            old_array[0][props.array_type].splice(sec_drag_start.current, 1);
            old_array[0][props.array_type].splice(sec_drop_location.current, 0, drag_content);
            props.addToCarthandler(old_array)

            sec_drag_start.current = null;
            sec_drop_location.current = null;
        }
    }

    /**Add section when click on btn */
    const section_add = (e, type) => {
        let old_array = [...props.cardData];
        old_array[0][props.array_type].push(add_struct);
        setsectionToggle(old_array[0][props.array_type].length - 1)
        props.addToCarthandler(old_array)
        setcomponent_index(component_index + 1);
        if (type != undefined) {
            let id = props?.cardData?.[0]?.[props?.array_type]?.length - 1;
            Component_drop(e, id);
        }
    }

    /** section name validation function */
    const Inp_focus = (value) => {
        inp_default_val.current = value;
    }

    const Inp_change = (value, index) => {
        let old_array = [...props.cardData];
        old_array[0][props.array_type][index].section = value;
        props.addToCarthandler(old_array)
    }

    const Inp_blur = (index) => {
        if (props?.cardData?.[0]?.[props.array_type]?.[index]?.section == "") {
            let old_array = [...props.cardData];
            old_array[0][props.array_type][index].section = inp_default_val.current;
            props.addToCarthandler(old_array)
        }
    }

    /** section duplication function */
    const Section_duplication = (e) => {
        let old_array = [...props.cardData];
        let sec_id = e.target.closest('.wb-section-header').dataset.sec_index;
        let data = old_array[0];
        let array = [...data[props.array_type]];
        let new_array = [];
        array[sec_id].inner_sec.map((loop) => {
            if (loop.type == 'repeater' || loop.type == 'popover' || loop.type == 'normalhover') {
                let rnp_array = [];
                loop.fields.map((rnp) => {
                    let rnp_obj = Object.assign({}, rnp, { "name": rnp.type + "_" + keyUniqueID() })
                    rnp_array.push(rnp_obj);
                })
                let obj = Object.assign({}, loop, { 'fields': rnp_array });
                let new_obj = Object.assign({}, obj, { "name": obj.type + "_" + keyUniqueID() })
                new_array.push(new_obj);
            } else {
                let new_obj = Object.assign({}, loop, { "name": loop.type + "_" + keyUniqueID() })
                new_array.push(new_obj);
            }
        })
        let obj = Object.assign({}, array[sec_id], { 'compo_index': component_index, "name": keyUniqueID(), 'inner_sec': new_array });
        let add_id = Number(sec_id);
        old_array[0][props.array_type].splice(add_id + 1, 0, obj);
        props.addToCarthandler(old_array)
    }

    return (
        <div className='wb-second-layout-content'>
            <div className='append'>
                {
                    Object.values(props.cardData[0][props.array_type])?.map((sections, index) => {
                        return (
                            <Fragment key={index}>
                                <div draggable={Drag_event}
                                    className='wb-section' id={`builder-${index}`} data-index={index}
                                    key={("builder-" + index).toString()}
                                    onDragEnd={(e) => { Section_drop(e, index), setDrag(false) }}
                                    onDragEnter={(e) => { Section_dragEnter(e, index), setsectionToggle(index) }}
                                    onDragStart={(e) => { Section_dragStart(e, index) }} >
                                    <div className='wb-section-header'
                                        data-sec_index={index}
                                        onClick={(e) => { !e.target.closest(".wb-section-btns") ? setsectionToggle(index) : "" }}>
                                        <div className='wb-section-title'>
                                            <div onMouseDown={() => { setDrag(true) }} onMouseUp={() => { setDrag(false) }}>
                                                <img draggable={false} className='wb-section-title-icon' src={img_path + 'assets/images/wb-svg/section-title.svg'} />
                                            </div>
                                            <input className='wb-section-title-text' onFocus={(e) => { Inp_focus(e.target.value) }} onBlur={() => { Inp_blur(index) }} value={sections?.section} onChange={(e) => { Inp_change(e.target.value, index) }} />
                                        </div>
                                        <div className='wb-section-btns'>
                                            <img className='wb-sec-btn' style={{ transform: sectionToggle == index ? "" : "rotate(180deg)" }} src={img_path + 'assets/images/wb-svg/uparrow.svg'} onClick={(e) => { sectionToggle == index ? setsectionToggle(-1) : setsectionToggle(index) }} />
                                            <img className='wb-sec-btn' src={img_path + 'assets/images/wb-svg/copy-icon.svg'} onClick={(e) => { Section_duplication(e, index) }} />
                                            <img className='wb-sec-btn' src={img_path + 'assets/images/wb-svg/trash-2.svg'} onClick={(e) => { Remove_section(e, index) }} />
                                        </div>
                                    </div>
                                    <div className={sectionToggle == index ? 'wb-components-settings wb-show' : 'wb-components-settings'}>
                                        {(sections?.inner_sec.length > 0) ?
                                            Object.values(sections?.inner_sec)?.map((dd, compo_index) => {
                                                return (
                                                    <Fragment key={compo_index}>
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
                                                            sec_index={index}
                                                            array_type={props.array_type}
                                                            compo_index={compo_index}
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
                                                            nha_type={dd.nha_type}
                                                        />
                                                    </Fragment>
                                                );
                                            }) : ""}
                                        <div className='wb-drop'
                                            onDragOver={(e) => { e.preventDefault() }}
                                            onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                                            onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                                            onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                                        </div>
                                        <div className='wb-main-component' draggable="false" data-compo_id={sections?.inner_sec.length} data-sec_id={index} data-array_type={props.array_type}></div>
                                        <div className="wb-droped"
                                            draggable
                                            onDragOver={(event) => { event.preventDefault() }}
                                            onDrop={(event) => { event.preventDefault(), Component_drop(event, index) }}
                                            onClick={(e) => { props.addToActiveController(""); }}>
                                            <img src={img_path + 'assets/images/wb-svg/black-plus-icon.svg'} />
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })
                }
            </div>
            <div className='wb-add-section' onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => { section_add(e, props.array_type) }}>
                <a className='add-section-btn' onClick={() => { section_add() }}>
                    <img className='wb-add-sec-icon' src={img_path + 'assets/images/wb-svg/add-section-icon.svg'} />
                    <span>Add Section</span>
                </a>
            </div>
        </div>
    );
}

export default Wb_layout;