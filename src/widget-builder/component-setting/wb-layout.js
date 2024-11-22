const { __ } = wp.i18n;

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

                        if (event.target.nextSibling.dataset.editable) {
                            props.wdkit_set_toast(['Not Valid', 'You Can Not put this controller here', '', 'danger']);
                            event.target.classList.remove("wb_drag-over")
                            return false;
                        }

                        if (event.target.nextSibling.dataset.rnp) {

                            if ('repeater' == val || 'popover' == val || 'normalhover' == val || "cpt" == val || "product_listing" == val || "taxonomy" == val) {
                                props.wdkit_set_toast(['Not Valid', 'You Can Not put this controller here', '', 'danger']);
                            } else {
                                let repeater_id = event.target.nextSibling.dataset.rnp;
                                let data = old_array[0][props.array_type][sec_index].inner_sec[compo_index]
                                let array = [...data.fields]
                                array.splice(repeater_id, 0, add_val);
                                let obj = Object.assign({}, data, { 'fields': array })
                                old_array[0][props.array_type][sec_index].inner_sec[compo_index] = obj;
                            }

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

                if (old_array[0][props.array_type][drag_secId].inner_sec[drag_componentId].type == 'normalhover') {
                    if (data?.key != undefined) {
                        delete data.key;
                    }
                }
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
            let uniqe_id = keyUniqueID();
            const val = component_array[item];

            let new_array = [];
            if (item.toLowerCase() == 'cpt' || item.toLowerCase() == 'product_listing' || item.toLowerCase() == 'taxonomy') {
                if (val?.fields.length > 0) {
                    val.fields.map((f_con) => {
                        let new_obj = Object.assign({}, f_con, { 'name': f_con.name + "_" + uniqe_id })
                        new_array.push(new_obj);
                    })
                }
            }

            const add_val = Object.assign({}, component_array[item], { "name": val.name + "_" + uniqe_id, 'unique_id': uniqe_id, 'fields': new_array });
            let old_array = [...props.cardData];
            old_array[0][props.array_type][index].inner_sec.push(add_val);
            props.addToCarthandler(old_array);
        }
    }

    /** Section remove function */
    const Remove_section = (e, index) => {

        var editor_html = ace.edit("editor-html", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/html",
        });

        const ReplaceAll = (name, data) => {
            var range = editor_html.find(name, {
                wrap: true,
                caseSensitive: true,
                wholeWord: true,
                regExp: false,
                preventScroll: true // do not change selection
            })
            if (range != null) {
                if (data) {
                    editor_html?.session?.replace(range, data);
                    ReplaceAll(name, data);
                } else {
                    editor_html?.session?.replace(range, "");
                    ReplaceAll(name);
                }
            }
        }

        let old_array = [...props.cardData];
        old_array[0][props.array_type][index]?.inner_sec?.map((controller) => {
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
                    if (sub_controller?.type == "headingtags") {
                        ReplaceAll(sub_controller.name, `div`);
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
                if (controller.type == "cpt" || controller.type == "product_listing") {
                    ReplaceAll(`data-${controller.name}={${controller.name}}`);
                    ReplaceAll(`data-${controller.name}_cat={${controller.name}_cat}`);
                    ReplaceAll(`data-${controller.name}_tag={${controller.name}_tag}`);
                    ReplaceAll(`{{title_${controller.name}}}`);
                    ReplaceAll(`{{description_${controller.name}}}`);
                    ReplaceAll(`{{thumbnail_${controller.name}}}`);
                    ReplaceAll(`{{category_${controller.name}}}`);
                    ReplaceAll(`{{cat_name_${controller.name}}}`);
                    ReplaceAll(`{{cat_url_${controller.name}}}`);
                    ReplaceAll(`{{tag_${controller.name}}}`);
                    ReplaceAll(`{{tag_name_${controller.name}}}`);
                    ReplaceAll(`{{tag_url_${controller.name}}}`);
                    ReplaceAll(`{{post_date_${controller.name}}}`);
                    ReplaceAll(`{{post_link_${controller.name}}}`);
                    ReplaceAll(`{{auth_name_${controller.name}}}`);
                    ReplaceAll(`{{auth_email_${controller.name}}}`);
                    ReplaceAll(`{{auth_url_${controller.name}}}`);
                    ReplaceAll(`{{auth_id_${controller.name}}}`);
                    ReplaceAll(`{{auth_profile_${controller.name}}}`);
                }

                if (controller.type == "taxonomy") {
                    ReplaceAll(`data-${controller.name}={${controller.name}}`);
                    ReplaceAll(`{{title_${controller.name}}}`);
                    ReplaceAll(`{{description_${controller.name}}}`);
                    ReplaceAll(`{{taxo_image_${controller.name}}}`);
                    ReplaceAll(`{{taxo_slug_${controller.name}}}`);
                    ReplaceAll(`{{taxo_link_${controller.name}}}`);
                }

                if (controller?.type == "headingtags") {
                    ReplaceAll(controller.name, `div`);
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
        let old_array = [...props.cardData],
            drag_content = old_array[0][props.array_type][sec_drag_start.current];

        if (sec_drag_start.current !== null && sec_drag_start.current !== undefined && sec_drag_start.current !== index) {
            old_array[0][props.array_type][sec_drag_start.current] = old_array[0][props.array_type][index];
            old_array[0][props.array_type][index] = drag_content;
            sec_drag_start.current = index;
            props.addToCarthandler(old_array);

        }

        sec_drop_location.current = index;
        props.addToActiveSection({ 'sec_id': index, 'array_type': props.array_type })
    }

    const Section_drop = (e, index) => {
        sec_drag_start.current = null;
        sec_drop_location.current = null;
    }

    const section_add = (e, type) => {
        let old_array = [...props.cardData];
        const newComponentIndex = component_index + 1;

        const newSectionName = `Section-${newComponentIndex}`;

        const isUnique = old_array[0][props.array_type].every(
            section => section.section !== newSectionName
        );

        if (isUnique) {
            const add_struct = {
                "name": `builder-${newComponentIndex}`,
                "section": newSectionName,
                "compo_index": newComponentIndex,
                "inner_sec": []
            };

            old_array[0][props.array_type].push(add_struct);
            props.addToCarthandler(old_array);
            setcomponent_index(newComponentIndex);


            if (type !== undefined) {
                let id = old_array[0][props.array_type].length - 1;
                Component_drop(e, id);
                props.addToActiveSection({ 'sec_id': Number(id), 'array_type': props.array_type })
            }
        } else {
            const add_struct = {
                "name": `builder-${newComponentIndex + 1}`,
                "section": `Section-${newComponentIndex + 1}`,
                "compo_index": newComponentIndex + 1,
                "inner_sec": []
            };

            old_array[0][props.array_type].push(add_struct);
            props.addToCarthandler(old_array);
            setcomponent_index(newComponentIndex + 1);

            if (type !== undefined) {
                let id = old_array[0][props.array_type].length - 1;
                Component_drop(e, id);
                props.addToActiveSection({ 'sec_id': Number(id), 'array_type': props.array_type })
            }
        }
    };

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
    const Section_duplication = (e, index) => {
        let old_array = [...props.cardData];
        let sec_name = old_array[0][props.array_type][index].section
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
        });

        function generateUniqueName(baseName, existingArray) {
            let newName = baseName;
            let counter = 2;

            while (existingArray.some(item => item.section === newName)) {
                newName = baseName + counter;
                counter++;
            }

            return newName;
        }

        let baseName = sec_name + "-copy";
        let newName = generateUniqueName(baseName, old_array[0][props.array_type]);

        let obj = Object.assign({}, array[sec_id], { 'compo_index': component_index, "name": keyUniqueID(), 'inner_sec': new_array, 'section': newName });
        let add_id = Number(sec_id);
        old_array[0][props.array_type].splice(add_id + 1, 0, obj);
        props.addToCarthandler(old_array)
    }

    const SectionToggle = (id) => {

        if (props.section_id.sec_id == id) {
            props.addToActiveSection({ 'sec_id': -1, 'array_type': props.array_type })
        } else {
            props.addToActiveSection({ 'sec_id': id, 'array_type': props.array_type })
        }
    };

    const Controller_drop = (e, type) => {
        let html = e.target.closest('.wb-droped')

        if (type == 'add') {
            html.classList.add('wkit-drag-over');
        } else if (type == 'remove') {
            html.classList.remove('wkit-drag-over');
        }
    }

    return (
        <div className='wb-second-layout-container'>
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
                                        onDragEnter={(e) => { Section_dragEnter(e, index) }}
                                        onDragStart={(e) => { Section_dragStart(e, index) }} >
                                        <div className='wb-section-header'
                                            data-sec_index={index}
                                            onClick={(e) => { (!e.target.closest(".wb-section-btns")) && props.section_id.sec_id != index && SectionToggle(index) }}
                                        >
                                            <div className='wb-section-title'>
                                                <div onMouseDown={() => { setDrag(true) }} onMouseUp={() => { setDrag(false) }}>
                                                    <svg draggable={false} className='wb-section-title-icon' xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="#B9B9B9">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M0.540132 0.5C0.241825 0.5 0 0.741825 0 1.04013V2.95987C0 3.25817 0.241825 3.5 0.540132 3.5H2.45987C2.75817 3.5 3 3.25817 3 2.95987V1.04013C3 0.741825 2.75817 0.5 2.45987 0.5H0.540132ZM0.54 5.5C0.241766 5.5 0 5.74177 0 6.04V7.96C0 8.25823 0.241766 8.5 0.54 8.5H2.46C2.75823 8.5 3 8.25823 3 7.96V6.04C3 5.74177 2.75823 5.5 2.46 5.5H0.54ZM0 11.04C0 10.7418 0.241766 10.5 0.54 10.5H2.46C2.75823 10.5 3 10.7418 3 11.04V12.96C3 13.2582 2.75823 13.5 2.46 13.5H0.54C0.241766 13.5 0 13.2582 0 12.96V11.04ZM5.59535 0.5C5.26655 0.5 5 0.766548 5 1.09535V2.90465C5 3.23345 5.26655 3.5 5.59535 3.5H7.40465C7.73345 3.5 8 3.23345 8 2.90465V1.09535C8 0.766548 7.73345 0.5 7.40465 0.5H5.59535ZM5 6.04C5 5.74177 5.24177 5.5 5.54 5.5H7.46C7.75823 5.5 8 5.74177 8 6.04V7.96C8 8.25823 7.75823 8.5 7.46 8.5H5.54C5.24177 8.5 5 8.25823 5 7.96V6.04ZM5.54 10.5C5.24177 10.5 5 10.7418 5 11.04V12.96C5 13.2582 5.24177 13.5 5.54 13.5H7.46C7.75823 13.5 8 13.2582 8 12.96V11.04C8 10.7418 7.75823 10.5 7.46 10.5H5.54Z" />
                                                    </svg>
                                                </div>
                                                <input className='wb-section-title-text' onFocus={(e) => { Inp_focus(e.target.value) }} onBlur={() => { Inp_blur(index) }} value={sections?.section} onChange={(e) => { Inp_change(e.target.value, index) }} />
                                            </div>
                                            <div className='wb-section-btns'>
                                                <img className='wb-sec-btn' src={img_path + 'assets/images/wb-svg/uparrow.svg'} style={{ transform: props.section_id.sec_id == index ? "" : "rotate(180deg)" }} onClick={(e) => { SectionToggle(index) }} />
                                                <img className='wb-sec-btn' src={img_path + 'assets/images/wb-svg/copy-icon.svg'} onClick={(e) => { Section_duplication(e, index) }} />
                                                <img className='wb-sec-btn' src={img_path + 'assets/images/wb-svg/trash-2.svg'} onClick={(e) => { Remove_section(e, index) }} />
                                            </div>
                                        </div>
                                        <div className={props.section_id.sec_id == index ? 'wb-components-settings wb-show' : 'wb-components-settings'}>
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
                                                                nha_array_lable={dd.nha_array_lable}
                                                                alignType={dd.alignType}
                                                                alert_type={dd.alert_type}
                                                                notice_type={dd.notice_type}
                                                                deprecatedValue={dd.deprecatedValue}
                                                                dismissible={dd.dismissible}
                                                                parent_class={dd.parent_class}
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
                                                onDragEnter={(event) => { Controller_drop(event, 'add') }}
                                                onDragLeave={(event) => { Controller_drop(event, 'remove') }}
                                                onDrop={(event) => { event.preventDefault(), Component_drop(event, index), Controller_drop(event, 'remove') }}
                                                onClick={(e) => { props.addToActiveController(""); }}>
                                                Add More
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            );
                        })
                    }
                </div>
                <div className='wb-add-section' onClick={() => { section_add() }} onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => { section_add(e, props.array_type) }}>
                    <a className='add-section-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.75 0H5.25V5.25H0V6.75H5.25V12H6.75V6.75H12V5.25H6.75V0Z" fill="black" />
                        </svg>
                        <span>{__('Add Section')}</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Wb_layout;