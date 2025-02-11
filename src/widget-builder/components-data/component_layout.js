import '../style/component_layout.scss';
import { useState, useEffect, useRef } from 'react';
import { component_array } from '../components-data/component_array';
import Component_html_container from '../redux-container/component_html_container';
import { __ } from '@wordpress/i18n';

const { Fragment } = wp.element;

var site_url = wdkitData.WDKIT_SITE_URL;
var img_path = wdkitData.WDKIT_URL;

const Component_html = (props) => {

    /** Custome slider color for slider controller */
    const SelectBuilderColor = () => {
        if (props && props.widgetdata && props.widgetdata.type == "elementor") {
            var builder_color = "#91003b";
        } else if (props && props.widgetdata && props.widgetdata.type == "gutenberg") {
            var builder_color = "#287CB2";
        } else if (props && props.widgetdata && props.widgetdata.type == "bricks") {
            var builder_color = "#FFD64F";
        }

        return builder_color;
    }

    const [shadow, setshadow] = useState("Inset");
    const [type, settype] = useState("normal");
    const [active, setactive] = useState("normal");
    const [repeater_display, setrepeater_display] = useState(true);
    const [Drag_event, setDrag_event] = useState(false);

    /**
     * NhaTabingStyle
     * 
     * @since 1.0.0
     * @version 1.0.6
     * 
    */
    const NhaTabingStyle = (type, index) => {
        let final_array = props?.nha_array.filter(element => element !== null);

        if ('width' === type) {
            if (final_array?.length > 0) {
                let ln = final_array.length;

                return `${(100 / Number(ln))}%`;
            } else {
                return `100%`;
            }
        } else if ('border' === type) {
            let length = Number(final_array?.length) - 1;

            if (length == index) {
                return 'none';
            } else {
                return '';
            }
        } else if ('label' === type) {
            let id = props?.nha_array.findIndex((id) => id == index);

            if (id > -1 && props?.nha_array_lable?.[id]) {
                return props?.nha_array_lable[id];
            } else {
                return index.charAt(0).toUpperCase() + index.slice(1);
            }
        }
    }

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

    /** Function for drop other copntroller inside repeater and popover controller */
    const Rnp_Component_drop = (event, sec_index, compo_index, array_type, rnp_val) => {

        let item = event.dataTransfer.getData('controller_id');

        if (item) {

            if ("repeater" == item || "popover" == item) {

                props.wdkit_set_toast([__('Not Valid', 'wdesignkit'), __('You Can Not put this controller here', 'wdesignkit'), '', 'danger']);

            } else {

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
    }

    /** function for drop other controller inside Normal/Hover controller tabs */
    const Nha_Component_drop = (event, sec_index, compo_index, array_type, nha_type) => {

        let item = event.dataTransfer.getData('controller_id');

        if (item) {

            if ("normalhover" == item) {
                props.wdkit_set_toast([__('Not Valid', 'wdesignkit'), __('You Can Not put this controller here', 'wdesignkit'), '', 'danger']);

            } else {
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
        const ReplaceAll = (old_name, data) => {
            if (html_code.search([old_name]) > -1) {
                var range = editor_html.find(old_name, {
                    wrap: true,
                    caseSensitive: true,
                    wholeWord: true,
                    regExp: false,
                    preventScroll: true // do not change selection
                })
                if (range != null) {
                    if (data) {
                        editor_html.session.replace(range, data);
                        ReplaceAll(old_name, data);
                    } else {
                        editor_html.session.replace(range, "");
                        ReplaceAll(old_name);
                    }
                }
            }
        }

        const Replace_controller = (controller) => {
            if (controller.type == "gallery" || controller.type == "select2" || controller.type == "repeater") {
                ReplaceAll(`data-${controller.name}={${controller.name}}`);
            }
            if (controller.type == "cpt" || controller.type == "product_listing") {
                ReplaceAll(`data-${controller.name}={${controller.name}}`);
                ReplaceAll(`data-${controller.name}_tag={${controller.name}_tag}`);
                ReplaceAll(`data-${controller.name}_cat={${controller.name}_cat}`);
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
            if (controller.type == "url") {
                ReplaceAll(`{{${controller.name}-url}}`);
                ReplaceAll(`{{${controller.name}-is_external}}`);
                ReplaceAll(`{{${controller.name}-nofollow}}`);
            }
            if (controller.type == "headingtags") {
                ReplaceAll(controller.name, `div`);
            }
            ReplaceAll(`{{${controller.name}}}`);
        }

        if (ids.rnp) {
            var controller = old_array[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.rnp];
            Replace_controller(controller);

            if (controller.type == 'repeater' || controller.type == 'popover' || controller.type == "cpt") {
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
    const Activate_controller = (e, cpt_controller) => {
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

                if (cpt_controller) {
                    controller = Object.assign({}, controller, { 'cpt_controller': true })
                }

                if ('preview' !== props.cardData.CardItems.cardData[0][data.dataset.array_type][data.dataset.sec_id].inner_sec[data.dataset.compo_id].fields[data.dataset.rnp].type) {
                    props.addToActiveController(controller);
                }

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
        let main_object = e.target.closest(".wkit-wb-custom-dropDown"),
            drop_down = main_object.querySelector(".wkit-wb-custom-dropDown-content") ? main_object.querySelector(".wkit-wb-custom-dropDown-content") : "";
        if (drop_down) {
            if (Object.values(drop_down.classList).includes("wkit-wb-show")) {
                drop_down.classList.remove("wkit-wb-show");
            } else {
                drop_down.classList.add("wkit-wb-show");
            }
        }
    }

    const Hover_Icon = (props) => {
        return (
            <div className='wb-hover-component'>
                {!props?.hide_edit &&
                    <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 8 8" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.99072 0.195068L7.77844 0.975586C8.07385 1.26831 8.07385 1.7561 7.77844 2.04883L6.99072 2.82922L5.12 0.975586L6.0061 0.195068C6.10461 0.0975342 6.30151 0 6.49841 0C6.69543 0 6.89233 0.0975342 6.99072 0.195068ZM4.3324 1.75623L6.20312 3.60986L6.59705 3.2196L4.7262 1.36597L4.3324 1.75623ZM1.37842 4.7804L1.08313 5.07312C1.08313 5.11548 1.06458 5.1394 1.03552 5.17688C0.997681 5.22583 0.941895 5.29773 0.886108 5.46326L0 7.99988L2.65845 7.02429C2.73352 6.98706 2.79431 6.96411 2.84619 6.94434L2.85242 6.94214C2.93347 6.91138 2.99292 6.88806 3.05225 6.8291C3.07422 6.8291 3.09619 6.82422 3.11804 6.81458C3.1405 6.80469 3.16296 6.78979 3.18542 6.76978C3.2395 6.72144 3.29358 6.64368 3.34766 6.5365L5.8092 3.99988L3.93848 2.14624L1.37842 4.7804ZM2.65845 5.85352C2.62085 5.89075 2.59766 5.9281 2.57776 5.95996C2.54565 6.01147 2.52246 6.04871 2.46155 6.04871C2.46155 6.04871 2.42773 6.04871 2.37988 6.06836C2.34619 6.08215 2.30542 6.10583 2.26465 6.14624L1.67383 6.34131L1.87073 5.75598C1.87073 5.65845 1.96924 5.56091 1.96924 5.56091C1.96924 5.56091 1.96924 5.52722 1.98926 5.49939C2.0033 5.47986 2.0271 5.46326 2.06775 5.46326L3.93848 3.60962L4.43079 4.09741L2.65845 5.85352Z" fill="white" />
                        </svg>
                    </div>
                }
                {!props?.only_edit &&
                    <>
                        <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 8 8" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M1.14286 4.46754H1.55844C1.76623 4.46754 1.97403 4.67533 1.97403 4.98702C1.97403 5.29871 1.76623 5.5065 1.45455 5.5065H1.14286C0.831168 5.5065 0.519481 5.29871 0.311689 5.09091C0.103896 4.88312 0 4.57143 0 4.25975V1.14286C0 0.831168 0.103896 0.519481 0.311689 0.311689C0.519481 0.103896 0.831168 0 1.14286 0H4.25975C4.57143 0 4.88312 0.103896 5.09091 0.311689C5.29871 0.519481 5.4026 0.831168 5.4026 1.14286V1.55844C5.4026 1.87013 5.19481 2.07792 4.88312 2.07792C4.57143 2.07792 4.36364 1.87013 4.36364 1.55844V1.24675V1.14286H4.25975H1.14286H1.03896V1.24675V4.36364V4.46754H1.14286ZM3.63636 2.3896H6.75324C7.37662 2.3896 7.8961 2.90908 8 3.63636V6.75324C8 7.48052 7.37662 8 6.75324 8H3.63636C2.90908 8 2.3896 7.37662 2.3896 6.75324V3.63636C2.3896 2.90908 2.90908 2.3896 3.63636 2.3896ZM6.64935 6.96104C6.75324 6.96104 6.85714 6.85714 6.85714 6.75324V3.63636C6.85714 3.53246 6.75324 3.42856 6.64935 3.42856H3.53246C3.42856 3.42856 3.32467 3.53246 3.32467 3.63636V6.75324C3.32467 6.85714 3.42856 6.96104 3.53246 6.96104H6.64935Z" fill="white" />
                            </svg>
                        </div>
                        <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 8 8" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.8 1.49995H7C7.3 1.49995 7.5 1.69995 7.5 1.99995C7.5 2.29995 7.3 2.49995 7 2.49995H6.8V6.69995C6.8 6.99995 6.7 7.29995 6.4 7.49995C6.2 7.69995 5.9 7.79995 5.6 7.79995H2.3C2 7.79995 1.7 7.69995 1.5 7.49995C1.3 7.29995 1.2 6.99995 1.2 6.69995V2.49995H1C0.7 2.49995 0.5 2.29995 0.5 1.99995C0.5 1.69995 0.7 1.49995 1 1.49995H2.2V1.29995C2.2 0.999949 2.3 0.699951 2.5 0.499951C2.7 0.299951 3 0.199951 3.3 0.199951H4.7C5 0.199951 5.3 0.299951 5.5 0.499951C5.7 0.699951 5.8 0.999949 5.8 1.29995V1.49995ZM5.8 6.79995V6.69995H5.9V2.49995H2.2V6.69995V6.79995H2.3H5.7H5.8ZM3.2 1.19995V1.29995V1.49995H4.7V1.29995V1.19995H4.6H3.3H3.2ZM4.5 5.69995C4.5 5.99995 4.3 6.19995 4 6.19995C3.7 6.19995 3.5 5.89995 3.5 5.69995V3.69995C3.5 3.39995 3.7 3.19995 4 3.19995C4.3 3.19995 4.5 3.39995 4.5 3.69995V5.69995Z" fill="white" />
                            </svg>
                        </div>
                    </>
                }
            </div>
        )
    }

    const Hover_Main_Icon = () => {
        return (
            <div className='wb-hover-main-component'>
                <div className='wb-sec-edit edit-btn' onClick={(e) => { Activate_controller(e) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M2.84783 6.39303L2.83943 6.40176L2.83147 6.41088C2.71961 6.53898 2.66748 6.58457 2.62414 6.61376C2.57897 6.64417 2.51711 6.67461 2.3544 6.73448L2.3544 6.73447L2.35199 6.73537C2.00565 6.86483 1.4661 7.06719 0.962497 7.25607C0.865545 7.29244 0.769926 7.3283 0.677274 7.36304C0.822919 6.94292 0.988498 6.46386 1.12168 6.07851C1.16414 5.95567 1.20331 5.84235 1.23749 5.7435C1.30146 5.56422 1.33054 5.49919 1.35954 5.45249C1.38464 5.41205 1.42235 5.3651 1.54215 5.2532L1.54837 5.24739L1.55439 5.24137L3.85428 2.94148L5.03295 4.12015L4.38715 4.79211C3.84823 5.35281 3.21709 6.00934 2.84783 6.39303Z" stroke="white" />
                        <path d="M6.13563 3.70977L4.25781 1.83195L4.66006 1.42871L6.53887 3.30752L6.13563 3.70977Z" fill="white" />
                        <path d="M7.39225 1.74679L7.39204 1.74701L6.94109 2.19851L5.76983 1.02724L6.22133 0.576302L6.22154 0.576084C6.32299 0.474639 6.48632 0.474639 6.58776 0.576084L6.58798 0.576302L7.39325 1.38058C7.39331 1.38064 7.39337 1.3807 7.39343 1.38076C7.39344 1.38077 7.39346 1.38078 7.39347 1.3808C7.49327 1.48084 7.49405 1.645 7.39225 1.74679Z" stroke="white" />
                    </svg>
                </div>
                <div className='wb-sec-edit duplicate-btn' onClick={(e) => { Duplicate_component(e) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <g clipPath="url(#clip0_3689_41401)">
                            <path d="M6.66667 3H3.66667C3.29848 3 3 3.29848 3 3.66667V6.66667C3 7.03486 3.29848 7.33333 3.66667 7.33333H6.66667C7.03486 7.33333 7.33333 7.03486 7.33333 6.66667V3.66667C7.33333 3.29848 7.03486 3 6.66667 3Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M1.66699 5.00033H1.33366C1.15685 5.00033 0.987279 4.93009 0.862254 4.80506C0.73723 4.68004 0.666992 4.51047 0.666992 4.33366V1.33366C0.666992 1.15685 0.73723 0.987279 0.862254 0.862254C0.987279 0.73723 1.15685 0.666992 1.33366 0.666992H4.33366C4.51047 0.666992 4.68004 0.73723 4.80506 0.862254C4.93009 0.987279 5.00033 1.15685 5.00033 1.33366V1.66699" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3689_41401">
                                <rect width="8" height="8" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div className='wb-sec-edit remove-btn' onClick={(e) => { Delete_component(e) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <g clipPath="url(#clip0_3689_41406)">
                            <path d="M1 2H1.66667H7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.66699 2.00033V1.33366C2.66699 1.15685 2.73723 0.987279 2.86225 0.862254C2.98728 0.73723 3.15685 0.666992 3.33366 0.666992H4.66699C4.8438 0.666992 5.01337 0.73723 5.1384 0.862254C5.26342 0.987279 5.33366 1.15685 5.33366 1.33366V2.00033M6.33366 2.00033V6.66699C6.33366 6.8438 6.26342 7.01337 6.1384 7.1384C6.01337 7.26342 5.8438 7.33366 5.66699 7.33366H2.33366C2.15685 7.33366 1.98728 7.26342 1.86225 7.1384C1.73723 7.01337 1.66699 6.8438 1.66699 6.66699V2.00033H6.33366Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 3.66699V5.66699" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3689_41406">
                                <rect width="8" height="8" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
        )
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
                    data-editable={props?.only_edit}
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
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
                </div>
            </>
        );
    } else if (props.type == "preview") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }} >
                </div>
                <div className={`wb-append-content wb-main-component`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    data-editable={props?.only_edit}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable={false} className='tp-sec-edit' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <div className='wkit-wb-preview-ct'>
                                <p className='wkit-wb-preview-ct-text'>{__('Update changes to page', 'wdesignkit')}</p>
                                <span className='wkit-wb-preview-ct-btn'>{__('Apply', 'wdesignkit')}</span>
                            </div>
                        </div>
                    </div>
                    <Hover_Icon hide_edit={true} />
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
                    data-editable={props?.only_edit}
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
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-textarea-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner' style={{ display: props.lableBlock == true ? "block" : "flex" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <textarea className='wb-textarea-inp' value={props.defaultValue} placeholder={props.placeHolder} onChange={(e) => { Change_value(e, "defaultValue") }}></textarea>
                    </div>
                    {props && props.description.length >= 1 &&
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-textarea-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner' style={{ display: props.lableBlock == true ? "block" : "flex" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <textarea className='wb-textarea-inp' rows={props.rows} value={props.defaultValue} placeholder={props.placeHolder} onChange={(e) => { Change_value(e, "defaultValue") }}></textarea>
                    </div>
                    {props && props.description.length >= 1 &&
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className="wb-alignment-header">
                        <div className='wb-append-inner' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <div className='wb-icons' style={{ justifyContent: props.lableBlock == true ? "flex-start" : "flex-end" }}>
                                {props.align_option && props.align_option.map((icon, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <div className='wkit-wb-alignIcon-content'>
                                                {icon.align_lable &&
                                                    <div className='wkit-wb-align-icon-lable'>{icon.align_lable}<div className='wkit-wb-align-icon-tooltip'></div></div>
                                                }{array.includes(icon.align_icon) ?
                                                    icon.align_value == props.align_defaultValue ?
                                                        <img className='wkit-wb-align-icon wb-icon-selected' src={`${img_path}assets/images/wb-svg/${icon.align_icon}.svg`} onClick={(e) => { Change_value(e, 'align_defaultValue', icon.align_value) }} />
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
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <select className='select-dropdown' >
                            <option>{__('font-1', 'wdesignkit')}</option>
                            <option>{__('font-2', 'wdesignkit')}</option>
                            <option>{__('font-3', 'wdesignkit')}</option>
                        </select>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' className='tp-sec-edit' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className="wb-append-label" value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-right-append' style={{ width: props.lableBlock == true ? "100%" : "50%" }}>
                            <input className='wb-append-inp wb-date-time-w' value={props.defaultValue} type='datetime-local' placeholder={props.placeHolder}
                                onChange={(e) => {
                                    Change_value(e, "defaultValue")
                                }} />
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                                <label>{__('No Images Selected', 'wdesignkit')}</label>
                            </div>
                            <div className="wb-gallery-image-content">
                                <div className='wb-gallery-image-backgorund'>
                                    <img src={img_path + "assets/images/wb-svg/add-section-icon.svg"} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className="wb-border-header">
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-icons'>
                            <img className='wb-border-icon left' src={img_path + 'assets/images/wb-svg/border-1.svg'} />
                            <img className='wb-border-icon' src={img_path + 'assets/images/wb-svg/border-2.svg'} />
                            <img className='wb-border-icon' src={img_path + 'assets/images/wb-svg/border-3.svg'} />
                            <img className='wb-border-icon right' src={img_path + 'assets/images/wb-svg/border-4.svg'} />
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: 'column' }}>
                        <div className='wb-box-shadow-header'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-box-shadow-content'>
                            <div className='content-1'>
                                <span className='content-text'>{__('Color', 'wdesignkit')}</span>
                                <img className='wb-color-icon' src={img_path + 'assets/images/wb-svg/box.svg'} />
                            </div>
                            <div className='content-2'>
                                <span className='content-text'>{__('X', 'wdesignkit')}</span>
                                <input className='shadow-inp' type="number" />
                            </div>
                            <div className='content-3'>
                                <span className='content-text'>{__('Y', 'wdesignkit')}</span>
                                <input className='shadow-inp' type="number" />
                            </div>
                            <div className='content-4'>
                                <span className='content-text'>{__('Blur', 'wdesignkit')}</span>
                                <input className='shadow-inp' type="number" />
                            </div>
                            <div className='content-5'>
                                <span className='content-text'>{__('Spread', 'wdesignkit')}</span>
                                <input className='shadow-inp' type="number" />
                            </div>
                        </div>
                        {/* <div className='wb-shadow-switcher'>
                            <div>
                                <span className={shadow == "Inset" ? "shadow-btn active-shadow" : "shadow-btn"} onClick={() => { setshadow("Inset") }} >Inset</span>
                                <span className={shadow == "Outset" ? "shadow-btn active-shadow" : "shadow-btn"} onClick={() => { setshadow("Outset") }} >Outset</span>
                            </div>
                        </div> */}
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: 'column' }}>
                        <div className='wb-box-shadow-header'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-box-shadow-content'>
                            <div className='content-1'>
                                <span className='content-text'>{__('Color', 'wdesignkit')}</span>
                                <img className='wb-color-icon' src={img_path + 'assets/images/wb-svg/box.svg'} />
                            </div>
                            <div className='content-2'>
                                <span className='content-text'>{__('X', 'wdesignkit')}</span>
                                <input className='shadow-inp' type="number" />
                            </div>
                            <div className='content-3'>
                                <span className='content-text'>{__('Y', 'wdesignkit')}</span>
                                <input className='shadow-inp' type="number" />
                            </div>
                            <div className='content-4'>
                                <span className='content-text'>{__('Blur', 'wdesignkit')}</span>
                                <input className='shadow-inp' type="number" />
                            </div>
                            <div className='content-5'>
                                <span className='content-text'>{__('Spread', 'wdesignkit')}</span>
                                <input className='shadow-inp' type="number" />
                            </div>
                        </div>
                        {/* <div className='wb-shadow-switcher'>
                            <div>
                                <span className={shadow == "Inset" ? "shadow-btn active-shadow" : "shadow-btn"} onClick={() => { setshadow("Inset") }} >Inset</span>
                                <span className={shadow == "Outset" ? "shadow-btn active-shadow" : "shadow-btn"} onClick={() => { setshadow("Outset") }} >Outset</span>
                            </div>
                        </div> */}
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-right-append'>
                            {props.dimension_defaultValue &&
                                <div className='wb-dimension-content'>
                                    <div className='wb-dimension-inp'>
                                        <input className='dimension-inp top-inp' value={props.dimension_defaultValue.top} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `top`) }} type='number' />
                                        <span className='wb-dimension-lable'>{__('TOP', 'wdesignkit')}</span>
                                    </div>
                                    <div className='wb-dimension-inp'>
                                        <input className='dimension-inp right-inp' value={props.dimension_defaultValue.isLinked == true ? props.dimension_defaultValue.top : props.dimension_defaultValue.right} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${props.dimension_defaultValue.isLinked == true ? 'top' : 'right'}`) }} type='number' />
                                        <span className='wb-dimension-lable'>{__('RIGHT', 'wdesignkit')}</span>
                                    </div>
                                    <div className='wb-dimension-inp'>
                                        <input className='dimension-inp bottom-inp' value={props.dimension_defaultValue.isLinked == true ? props.dimension_defaultValue.top : props.dimension_defaultValue.bottom} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${props.dimension_defaultValue.isLinked == true ? 'top' : 'bottom'}`) }} type='number' />
                                        <span className='wb-dimension-lable'>{__('BOTTOM', 'wdesignkit')}</span>
                                    </div>
                                    <div className='wb-dimension-inp'>
                                        <input className='dimension-inp left-inp' value={props.dimension_defaultValue.isLinked == true ? props.dimension_defaultValue.top : props.dimension_defaultValue.left} onChange={(e) => { Change_value(e, 'dimension_defaultValue', `${props.dimension_defaultValue.isLinked == true ? 'top' : 'left'}`) }} type='number' />
                                        <span className='wb-dimension-lable'>{__('LEFT', 'wdesignkit')}</span>
                                    </div>
                                    <div className='wb-dimension-icon' onClick={(e) => { e, Change_value(e, 'dimension_defaultValue', 'isLinked') }}>
                                        <img className={props.dimension_defaultValue.isLinked == true ? 'dimension-icon wkit-wb-dark' : 'dimension-icon'} src={img_path + 'assets/images/wb-svg/link.svg'} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-grediant-color-content wb-append-input-field'>
                        <div className='wb-grediant-color-bar' style={{ background: `${props.defaultValue}` }}></div>
                        <div className='wb-grediant-color-selector'>
                            {props.widgetdata.type != "gutenberg" &&
                                <div className='wb-append-inner'>
                                    <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                                </div>
                            }
                            <select className='gradiant-color-dropDown'>
                                <option>{__('Linear', 'wdesignkit')}</option>
                                <option>{__('radial', 'wdesignkit')}</option>
                                <option>{__('conic', 'wdesignkit')}</option>
                            </select>
                            <input className='grediant-color-inp' value='135' type='text' />
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-header-content'>
                        <div className='wb-append-inner' >
                            {props.widgetdata.type == "bricks" ?
                                <textarea className='wb-textarea-inp wkit-wb-heading-textarea' value={props.lable} rows={3} onChange={(e) => { Change_value(e, "lable") }} />
                                :
                                <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            }
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { !e.target.closest('.wb-repeater-droped') && Activate_controller(e) }}>
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
                                                nha_type={dd.nha_type}
                                                nha_array_lable={dd.nha_array_lable}
                                                alignType={dd.alignType}
                                                alert_type={dd.alert_type}
                                                notice_type={dd.notice_type}
                                                deprecatedValue={dd.deprecatedValue}
                                                dismissible={dd.dismissible}
                                                parent_class={dd.parent_class}
                                            />
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
                                onClick={(e) => { props.addToActiveController({ 'compo_id': props.compo_index, 'sec_id': props.sec_index, 'array_type': props.array_type, 'controller_type': props.type }) }}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.25 0H5.25V5.25H0V6.25H5.25V12H6.25V6.25H12V5.25H6.25V0Z" fill="#888888" />
                                </svg>
                                <span>{__('Add Controller', 'wdesignkit')}</span>
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { !e.target.closest('.wb-popover-droped') && Activate_controller(e) }}>
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
                                                nha_type={dd.nha_type}
                                                nha_array_lable={dd.nha_array_lable}
                                                alignType={dd.alignType}
                                                alert_type={dd.alert_type}
                                                notice_type={dd.notice_type}
                                                deprecatedValue={dd.deprecatedValue}
                                                dismissible={dd.dismissible}
                                                parent_class={dd.parent_class}
                                            />
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
                                onClick={(e) => { props.addToActiveController({ 'compo_id': props.compo_index, 'sec_id': props.sec_index, 'array_type': props.array_type, 'controller_type': props.type }) }}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.25 0H5.25V5.25H0V6.25H5.25V12H6.25V6.25H12V5.25H6.25V0Z" fill="#888888" />
                                </svg>
                                <span>{__('Add Controller', 'wdesignkit')}</span>
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { !e.target.closest('.wb-popover-droped') && Activate_controller(e) }}>
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
                        <div className='wb-popover-options wb-normalHover-options'>
                            <div className='wkit-wb-normalHover'>
                                {props.nha_array.length > 0 && props?.nha_array.filter((element) => element !== null).map((data, index) => {
                                    return (
                                        <div className='wkit-wb-normalHoverList' style={{ backgroundColor: props.nha_type == data ? SelectBuilderColor() : 'white', color: props.nha_type == data ? '#fff' : 'black', width: NhaTabingStyle('width'), border: NhaTabingStyle('border', index) }} onClick={(e) => { Change_value(e, "nha_type", (data ? data : index)) }}>{NhaTabingStyle('label', data)}</div>
                                    );
                                })}
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
                                                    nha_array={props.nha_array}
                                                    nha_type={props.nha_type}
                                                    nha_array_lable={props.nha_array_lable}
                                                    alignType={props.alignType}
                                                    alert_type={dd.alert_type}
                                                    notice_type={dd.notice_type}
                                                    deprecatedValue={dd.deprecatedValue}
                                                    dismissible={dd.dismissible}
                                                    parent_class={dd.parent_class}
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
                                onDrop={(event) => { event.preventDefault(), Nha_Component_drop(event, props.sec_index, props.compo_index, props.array_type, props.nha_type) }}
                                onClick={(e) => { props.addToActiveController({ 'compo_id': props.compo_index, 'sec_id': props.sec_index, 'array_type': props.array_type, 'controller_type': props.type, 'nha_type': props.nha_type }) }}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.25 0H5.25V5.25H0V6.25H5.25V12H6.25V6.25H12V5.25H6.25V0Z" fill="#888888" />
                                </svg>
                                <span>{__('Add Controller', 'wdesignkit')}</span>
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
                <div className={`wb-heading wkit-divider-controller wb-main-component ${Select_controller() == props.name ? 'wkit-wb-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-header-content'>
                        <hr />
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>

                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>

                    <div className='wb-media-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>

                        <div className='wb-append-inner' style={{ display: props.showLable == true ? "block" : "none" }}>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>

                        <img className='wb-media-icon' style={{ width: props.lableBlock == true ? "100%" : "65%" }} src={img_path + "assets/images/jpg/placeholder.png"} draggable="false" />
                    </div>

                    {props && props.description.length >= 1 &&
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
                </div>
            </>
        );
    } else if (props.type == "notice") {

        let borderColor = '',
            color = '';

        if ('warning' == props.notice_type) {
            borderColor = '1px solid #f59e0b';
            color = '#f59e0b';
        }

        if ('info' == props.notice_type) {
            borderColor = '1px solid #2563eb';
            color = '#2563eb';
        }

        if ('success' == props.notice_type) {
            borderColor = '1px solid #0a875a';
            color = '#0a875a';
        }

        if ('danger' == props.notice_type) {
            borderColor = '1px solid #dc2626';
            color = '#dc2626';
        }

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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-note-content' style={{ border: borderColor, padding: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                            <div className='wb-notice-svg'>
                                <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.25 9H3M9 2.25V3M15 9H15.75M4.2 4.2L4.725 4.725M13.8 4.2L13.275 4.725M7.27496 12.75H10.725M6.75 12C6.12035 11.5278 5.65525 10.8694 5.42057 10.1181C5.1859 9.36687 5.19355 8.56082 5.44244 7.81415C5.69133 7.06748 6.16884 6.41804 6.80734 5.95784C7.44583 5.49764 8.21294 5.25 9 5.25C9.78706 5.25 10.5542 5.49764 11.1927 5.95784C11.8312 6.41804 12.3087 7.06748 12.5576 7.81415C12.8065 8.56082 12.8141 9.36687 12.5794 10.1181C12.3448 10.8694 11.8796 11.5278 11.25 12C10.9572 12.2899 10.7367 12.6446 10.6064 13.0355C10.4761 13.4264 10.4397 13.8424 10.5 14.25C10.5 14.6478 10.342 15.0294 10.0607 15.3107C9.77936 15.592 9.39782 15.75 9 15.75C8.60218 15.75 8.22064 15.592 7.93934 15.3107C7.65804 15.0294 7.5 14.6478 7.5 14.25C7.56034 13.8424 7.52389 13.4264 7.3936 13.0355C7.2633 12.6446 7.04282 12.2899 6.75 12Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                            <div className='wb-notice-content'>
                                <div className='wb-append-inner'>
                                    <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} style={{ fontWeight: '600' }} />
                                </div>
                                {props.description !== "" &&
                                    <div>
                                        <textarea className='wb-note-inp' value={props.description} placeholder={__('Write Your Note here....', 'wdesignkit')} onChange={(e) => { Change_value(e, "description") }}></textarea>
                                    </div>
                                }
                            </div>
                        </div>

                        {props.dismissible == true &&
                            <div className='wb-notice-close'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="13" height="13"><path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z" /></svg>
                            </div>
                        }
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-radio-advanced-content'>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-radio-color'>
                            <div className={type == "normal" ? "radio-btn active-ra" : "radio-btn"} onClick={() => { settype("normal") }}>{__('Normal', 'wdesignkit')}</div>
                            <div className={type == "grediant" ? "radio-btn active-ra" : "radio-btn"} onClick={() => { settype("grediant") }}>{__('grediant', 'wdesignkit')}</div>
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-range-content'>
                        <div className='wb-append-input-field' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <div className='wb-append-inner'>
                                <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            </div>
                            <div className='wb-range-bar wb-right-append'>
                                {props && props.size_units && props.slider_defaultValue && props.slider_defaultValue[0] && props.size_units.map((value, index) => {
                                    if (props.slider_defaultValue[0] == value.type) {
                                        return (
                                            <Fragment key={index}>
                                                <input className='wb-range-inp'
                                                    min={value.min} max={value.max} step={value.step}
                                                    type='range'
                                                    value={props.slider_defaultValue[1]}
                                                    onChange={(e) => { Change_value(e, 'defaultValue_slider') }}
                                                    style={{ background: `linear-gradient(to right, ${SelectBuilderColor()} 0%, ${SelectBuilderColor()} ${((props.slider_defaultValue[1] - value.min) * 100) / (value.max - value.min)}%, #e1e1e1 0%, #e1e1e1 0%)` }} />
                                                <input className='range-inp-val' min={value.min} max={value.max} step={value.step} type='number' value={props.slider_defaultValue[1]} onChange={(e) => { Change_value(e, 'defaultValue_slider') }} />
                                            </Fragment>
                                        );
                                    }
                                })
                                }
                            </div>
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                                <option selected="Select Template">{__('Select Template', 'wdesignkit')}</option>
                            </div>
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
                </div>
            </>
        );
    } else if (props.type == "align") {
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className="wb-alignment-header">
                        <div className='wb-append-inner' style={{ flexDirection: "row" }}>
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            <div className='wb-icons'>

                                {props.alignType == "text-align" &&
                                    <Fragment>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Left', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/eicon-text-align-left.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Center', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/eicon-text-align-center.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Right', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/eicon-text-align-right.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Justify', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/eicon-text-align-justify.svg`} />
                                        </div>
                                    </Fragment>
                                }
                                {props.alignType == "justify-content" &&
                                    <Fragment>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Start', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/justify-content-start.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Center', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/justify-content-center.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('End', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/justify-content-end.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Space Between', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/justify-content-space-between.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Space Around', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/justify-content-space-around.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Space Evenly', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/justify-content-space-evenly.svg`} />
                                        </div>
                                    </Fragment>
                                }
                                {props.alignType == "align-items" &&
                                    <Fragment>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Start', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/align-items-start.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Center', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/align-items-center.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('End', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/align-items-end.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Stretch', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/align-items-stretch.svg`} />
                                        </div>
                                    </Fragment>
                                }
                                {props.alignType == "flex-direction" &&
                                    <Fragment>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Vertical', 'wdesignkit')}(Collumn)
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/align-vertical-direction.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Horizontal', 'wdesignkit')}(row)
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/align-horizontal-direction.svg`} />
                                        </div>
                                        <div className='wkit-wb-alignIcon-content'>
                                            <div className='wkit-wb-align-icon-lable'>{__('Row', 'wdesignkit')}
                                                <div className='wkit-wb-align-icon-tooltip'></div>
                                            </div>
                                            <img className='wkit-wb-align-icon' src={`${img_path}assets/images/wb-svg/align-reverse-direction.svg`} />
                                        </div>
                                    </Fragment>
                                }
                            </div>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
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
                                <label>{props.select_defaultValue?.[1]}</label>
                                <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                            </div>
                            <div className='wkit-wb-custom-dropDown-content'>
                                {props?.options?.length > 0 && props?.options.map((val, index) => {
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select2-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wkit-wb-custom-dropDown'>
                            <div className='wkit-wb-custom-dropDown-header wkit-multi-select-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                                {props.select2_defaultValue && props.select2_defaultValue.map((val, index) => {
                                    return (
                                        <div className='wkit-wb-multi-selected' key={index}>
                                            <div className='wkit-wb-remove-value' onClick={(e) => { Change_value(e, "select2_defaultValue", index, 'remove') }}>
                                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                                            </div>
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>

                    <div className='wb-textarea-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner' >
                            <input style={{ display: props.showLable == true ? "" : "none" }} className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <textarea className='wb-textarea-inp' rows={props.rows} value={props.defaultValue} placeholder={props.placeHolder} onChange={(e) => { Change_value(e, "defaultValue") }}></textarea>
                    </div>
                    {props && props.description.length >= 1 &&
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-toggle-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <input className='wb-append-inner wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        <label className="wb-switch">
                            <input type="checkbox" checked={props.defaultValue} onChange={(e) => { Change_value(e, "switcher_defaultValue") }} />
                            <span className="wb-slider"></span>
                        </label>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-append-input-field' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                        <div className='wb-append-inner'>
                            <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                        </div>
                        <div className='wb-right-append'>
                            <div className='wb-url-content'>
                                <input className='wb-url-inp' type='url' placeholder={props.placeHolder} value={props.defaultValue} onChange={(e) => {
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
                                    <label>{__('Open in new window', 'wdesignkit')}</label>
                                </div>
                                <div className='url-opt'>
                                    <input type='checkbox' checked={props.nofollow} onChange={(e) => { Change_value(e, "nofollow") }} />
                                    <label>{__('Add Nofollow', 'wdesignkit')}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {props && props.description.length >= 1 &&
                        <p className='wb-append-dec'>{props.description}</p>
                    }
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
                </div>
            </>
        );
    } else if (props.type == "alert") {

        let borderColor = '',
            bgColor = '';

        if ('warning' == props.alert_type) {
            borderColor = '2px solid #f59e0b';
            bgColor = '#fffbeb';
        }

        if ('info' == props.alert_type) {
            borderColor = '2px solid #2563eb';
            bgColor = '#f0f7ff';
        }

        if ('success' == props.alert_type) {
            borderColor = '2px solid #0a875a';
            bgColor = '#f2fdf5';
        }

        if ('danger' == props.alert_type) {
            borderColor = '2px solid #dc2626';
            bgColor = '#fef1f4';
        }

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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-note-content' style={{ borderLeft: borderColor, background: bgColor, padding: '10px' }}>
                        <div className='wb-append-inner' style={{ flexDirection: 'column' }}>
                            <input className='wb-append-label' value={props.lable} onChange={(e) => { Change_value(e, "lable") }} style={{ background: bgColor }} />
                            <input className='wb-append-label' value={props.description} onChange={(e) => { Change_value(e, "description") }} style={{ background: bgColor }} />
                        </div>
                        <div>
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
                </div>
            </>
        );
    } else if (props.type == "deprecatednotice") {
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
                    data-editable={props?.only_edit}
                    onClick={(e) => { Activate_controller(e) }}>
                    <div className='wb-draggable-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }} >
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-note-content' style={{ borderLeft: '2px solid #f59e0b', background: '#fffbeb', padding: '10px' }}>
                        <div className='wb-append-inner' >
                            <p className='wb-append-label' style={{ background: '#fffbeb', height: '180px' }}>{__(`The <b>${props.deprecatedValue[0].Widget}</b> widget has been deprecated since ${props.deprecatedValue[3].Plugin} ${props.deprecatedValue[1].Since}. It has been replaced by <b>${props.deprecatedValue[4].Replacement}</b>. Note that ${props.deprecatedValue[0].Widget} will be completely removed once ${props.deprecatedValue[3].Plugin} ${props.deprecatedValue[2].Last} is released.`, 'wdesignkit')}</p>
                        </div>
                        <div>
                        </div>
                    </div>
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
                </div>
            </>
        );
    } else if (props.type == "svg") {
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
                </div>
            </>
        );
    } else if (props.type == "query") {
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
                    data-editable={props?.only_edit}
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
                    <Hover_Icon only_edit={props?.only_edit ? true : false} />
                </div>
            </>
        );
    } else if (props.type == "cpt") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-main-component wb-cpt-inner ${Select_controller() == props.name ? 'wkit-wb-main-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    data-editable={props?.only_edit}
                    onClick={(e) => { !e.target.closest('.wb-repeater-droped') && Activate_controller(e, 'cpt_controller') }}>
                    <div className='wb-draggable-main-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select wb-cpt-select'>
                        <div className='wb-select-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <div className='wb-append-inner'>
                                <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            </div>
                            <div className='wkit-wb-custom-dropDown'>
                                <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                    <label>{props?.select_defaultValue?.[1]}</label>
                                    <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                </div>
                                <div className='wkit-wb-custom-dropDown-content'>
                                    {props?.options.map((val, index) => {
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
                    </div>
                    <div className='wb-repeater-content'>
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
                                            nha_type={dd.nha_type}
                                            nha_array_lable={dd.nha_array_lable}
                                            alignType={dd.alignType}
                                            alert_type={dd.alert_type}
                                            notice_type={dd.notice_type}
                                            deprecatedValue={dd.deprecatedValue}
                                            dismissible={dd.dismissible}
                                            parent_class={dd.parent_class}
                                            only_edit={true}
                                        />
                                    </div>
                                );
                            })
                        }
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
    } else if (props.type == "product_listing") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-main-component wb-cpt-inner ${Select_controller() == props.name ? 'wkit-wb-main-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    data-editable={props?.only_edit}
                    onClick={(e) => { !e.target.closest('.wb-repeater-droped') && Activate_controller(e, 'cpt_controller') }}>
                    <div className='wb-draggable-main-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-repeater-content'>
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
                                            nha_type={dd.nha_type}
                                            nha_array_lable={dd.nha_array_lable}
                                            alignType={dd.alignType}
                                            alert_type={dd.alert_type}
                                            notice_type={dd.notice_type}
                                            deprecatedValue={dd.deprecatedValue}
                                            dismissible={dd.dismissible}
                                            parent_class={dd.parent_class}
                                            only_edit={true}
                                        />
                                    </div>
                                );
                            })
                        }
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
    } else if (props.type == "taxonomy") {
        return (
            <>
                <div className='wb-drop'
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragEnter={(e) => { e.target.classList.add("wb_drag-over") }}
                    onDrop={(e) => { e.target.classList.remove("wb_drag-over") }}
                    onDragLeave={(e) => { e.target.classList.remove("wb_drag-over") }}>
                </div>
                <div className={`wb-main-component wb-cpt-inner ${Select_controller() == props.name ? 'wkit-wb-main-selected' : ''}`}
                    draggable={Drag_event}
                    onDragEnd={() => { setDrag_event(false) }}
                    style={{ marginTop: props.separator == "before" ? "15px" : "", marginBottom: props.separator == "after" ? "15px" : "" }}
                    data-compo_id={props.compo_index}
                    data-sec_id={props.sec_index}
                    data-array_type={props.array_type}
                    data-rnp={props.rnp_id}
                    data-rnp2={props.rnp2_id}
                    data-nha={props.nha_type}
                    data-editable={props?.only_edit}
                    onClick={(e) => { !e.target.closest('.wb-repeater-droped') && Activate_controller(e, 'cpt_controller') }}>
                    <div className='wb-draggable-main-icon' onMouseDown={() => { setDrag_event(true) }} onMouseUp={() => { setDrag_event(true) }}>
                        <img draggable='false' src={img_path + 'assets/images/wb-svg/white-drag.svg'} />
                    </div>
                    <div className='wb-select wb-cpt-select'>
                        <div className='wb-select-content' style={{ flexDirection: props.lableBlock == true ? "column" : "row" }}>
                            <div className='wb-append-inner'>
                                <input className='wb-append-label' style={{ display: props.showLable == true ? "" : "none" }} value={props.lable} onChange={(e) => { Change_value(e, "lable") }} />
                            </div>
                            <div className='wkit-wb-custom-dropDown'>
                                <div className='wkit-wb-custom-dropDown-header' onClick={(e) => { Drop_down_toggle(e) }}>
                                    <label>{props?.select_defaultValue?.[1]}</label>
                                    <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                                </div>
                                <div className='wkit-wb-custom-dropDown-content'>
                                    {props?.options.map((val, index) => {
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
                    </div>
                    <div className='wb-repeater-content'>
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
                                            nha_type={dd.nha_type}
                                            nha_array_lable={dd.nha_array_lable}
                                            alignType={dd.alignType}
                                            alert_type={dd.alert_type}
                                            notice_type={dd.notice_type}
                                            deprecatedValue={dd.deprecatedValue}
                                            dismissible={dd.dismissible}
                                            parent_class={dd.parent_class}
                                            only_edit={true}
                                        />
                                    </div>
                                );
                            })
                        }
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
    }
}

export default Component_html;