import { Elementor, Gutenberg, Bricks } from '../components_json';
import { component_array } from '../components-data/component_array';
import { useState } from 'react'
import '../style/block_elements.scss';
const { Fragment } = wp.element;

const Block_Element = (props) => {

    const [searchdata, setsearchdata] = useState("");
    const [toggelControl, settoggelControl] = useState("Data Controls");

    var img_path = wdkitData.WDKIT_URL,
        Components_data = "";

    if (props.widgetdata.type == "elementor") {
        Components_data = Elementor;
    } else if (props.widgetdata.type == "gutenberg") {
        Components_data = Gutenberg;
    } else if (props.widgetdata.type == "bricks") {
        Components_data = Bricks;
    }

    const ElementorCategoryList = (e, name) => {
        if (toggelControl == name) {
            settoggelControl("")
        } else {
            settoggelControl(name)
        }
    }

    const GetSearchData = (e) => {
        if (e.target.value == "") {
            document.querySelectorAll(".wkit-wb-all-widgets.wkit-wb-blockshow").forEach((ele, index) => {
                ele.classList.remove("wkit-wb-blockshow");
            });
            document.querySelector(".wkit-wb-all-widgets").classList.add("wkit-wb-blockshow");
        } else {
            document.querySelectorAll(".wkit-wb-all-widgets").forEach((ele, index) => {
                ele.classList.add("wkit-wb-blockshow");
            });
        }
    }

    /** Function to get unique id of 8 digit */
    const keyUniqueID = () => {
        let year = new Date().getFullYear().toString().slice(-2),
            uid = Math.random().toString(36).substr(2, 6);
        return uid + year;
    }

    var builder_name = `builder-${props.cardData[0][props.array_type].length}`,
        section_name = `Section-${props.cardData[0][props.array_type].length}`,
        add_struct = {
            "name": builder_name,
            "section": section_name,
            "compo_index": props.cardData[0][props.array_type].length,
            "inner_sec": []
        }

    /** component drag and drop from elements side */
    const Component_drop = (value, index) => {

        var getController = props.controller.controller;

        if (getController?.controller_type) {

            if ("repeater" == value || "popover" == value || "normalhover" == value || "cpt" == value || "product_listing" == value || "taxonomy" == value) {

                props.wdkit_set_toast(['Not Valid', 'You Can Not put this controller here', '', 'danger']);

            } else {
                var val = component_array[value.toLowerCase()],
                    add_val = Object.assign({}, val, { "name": value.toLowerCase() + "_" + keyUniqueID() }),
                    old_array = [...props.cardData],
                    nha_fields = old_array[0][props.array_type][index].inner_sec[getController.compo_id]?.fields;

                if (getController?.nha_type) {
                    let nha_type = Object.assign({}, add_val, { "key": getController?.nha_type });
                    nha_fields.push(nha_type);

                    props.addToCarthandler(old_array)
                } else {

                    nha_fields.push(add_val);
                    props.addToCarthandler(old_array)

                }
            }

        } else {
            let uniqe_id = keyUniqueID();

            const val = component_array[value.toLowerCase()];
            let new_array = [];
            if (value.toLowerCase() == 'cpt' || value.toLowerCase() == 'product_listing' || value.toLowerCase() == 'taxonomy') {
                if (val?.fields.length > 0) {
                    val.fields.map((f_con) => {
                        let new_obj = Object.assign({}, f_con, { 'name': f_con.name + "_" + uniqe_id })
                        new_array.push(new_obj);
                    })
                }
            }

            const add_val = Object.assign({}, val, { "name": value.toLowerCase() + "_" + uniqe_id, 'unique_id': uniqe_id, 'fields': new_array });
            let old_array = [...props.cardData];
            old_array?.[0]?.[props.array_type]?.[index]?.inner_sec && old_array?.[0]?.[props.array_type]?.[index]?.inner_sec.push(add_val);
            props.addToCarthandler(old_array)
        }

    }

    const handleDoubleClick = (value) => {

        let old_array = [...props.cardData];
        var checkLength = old_array[0][props.array_type];

        if (checkLength.length > 0) {
            if (props.section_id.sec_id > -1) {
                Component_drop(value, props.section_id.sec_id);
            } else {
                Component_drop(value, checkLength.length - 1);
                props.addToActiveSection({ 'sec_id': Number(checkLength.length - 1), 'array_type': props.array_type })
            }
        } else {
            checkLength.push(add_struct);
            Component_drop(value, 0);
            props.addToCarthandler(old_array);
            props.addToActiveSection({ 'sec_id': 0, 'array_type': props.array_type })
        }
    }

    return (
        <div className='wkit-wb-components' >
            <div className='wkit-wb-search-bar'>
                <input className='wkit-wb-search-input' type='text' placeholder='Search' style={{ backgroundImage: `url(${img_path}assets/images/wb-svg/editor-search.svg)` }} onChange={(e) => { setsearchdata(e.target.value), GetSearchData(e) }} />
            </div>

            <div className='wkit-wb-controllers'>
                {Components_data.length > 0 &&
                    Object.values(Components_data[0]).map((data_type, index) => {
                        let name = data_type.Name ? data_type.Name : "";
                        return (
                            <Fragment key={index}>
                                {index != 0 &&
                                    <hr className='wkit-wb-horizontal-line' />
                                }
                                <div className='wkit-wb-widget-heading' onClick={(e) => { ElementorCategoryList(e, data_type.Name) }} >
                                    <img className={`wb-component-btn ${toggelControl == data_type.Name ? 'wkit-wb-rotate-icon' : ""}`} src={img_path + 'assets/images/wb-svg/controller-icon.svg'} onClick={(e) => { e.target.parentElement.click() }} />
                                    <span onClick={(e) => { e.target.parentElement.click() }} >{data_type.Name}</span>
                                </div>
                                <div className={toggelControl == data_type.Name ? "wkit-wb-all-widgets wkit-wb-blockshow" : "wkit-wb-all-widgets"}>
                                    {
                                        data_type.data.filter((data) => {
                                            /**Search bar operation */
                                            if (searchdata == "") {
                                                return data
                                            } else if (data.keyword.toString().includes(searchdata.toLowerCase())) {
                                                return data
                                            }
                                        }).map((data, index) => {
                                            let key = data.label,
                                                value = data.name,
                                                icon = data.icon;

                                            return (
                                                <Fragment key={index}>
                                                    <div className='wkit-wb-widget'
                                                        draggable
                                                        onDragStart={(e) => { e.dataTransfer.setData('controller_id', value.toLowerCase().split(" ").join("")); }}
                                                        onDragEnd={(e) => { setTimeout(() => { e.target.classList.remove("drag") }, 500) }}
                                                        onDoubleClick={(e) => { handleDoubleClick(value) }}
                                                        onTouchEndCapture={(e) => { handleDoubleClick(value) }}
                                                        data-component={value.toLowerCase().split(" ").join("")}>
                                                        {icon}
                                                        {/* <img draggable={false} className='wkit-wb-widget-img' src={img_path + `assets/images/wb-component/${icon}.svg`} /> */}
                                                        <span className='wkit-wb-widget-text'>{key}</span>
                                                    </div>
                                                </Fragment>
                                            );
                                        })
                                    }
                                </div>
                            </Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Block_Element;