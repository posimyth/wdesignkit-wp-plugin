import { Elementor, Gutenberg } from '../components_json';
import { useState } from 'react'
import '../style/block_elements.scss';
const { Fragment } = wp.element;

const Block_Element = (props) => {

    const [searchdata, setsearchdata] = useState("")
    const [toggelControl, settoggelControl] = useState("Data Controls")

    var site_url = wdkitData.WDKIT_SITE_URL;
    var img_path = wdkitData.WDKIT_URL;
    var Components_data = "";

    if (props.widgetdata.type == "elementor") {
        Components_data = Elementor;
    } else if (props.widgetdata.type == "gutenberg") {
        Components_data = Gutenberg;
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

    return (
        <div className='wkit-wb-components'>
            <div className='wkit-wb-search-bar'>
                <input className='wkit-wb-search-input' type='text' placeholder='Search' style={{ backgroundImage: `url(${img_path}assets/images/wb-svg/editor-search.svg)` }} onChange={(e) => { setsearchdata(e.target.value), GetSearchData(e) }} />
            </div>
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
                                        } else if (Object.keys(data)[0].toLowerCase().includes(searchdata.toLowerCase())) {
                                            return data
                                        }
                                    }).map((data, index) => {
                                        let key = Object.keys(data)[0];
                                        let value = Object.values(data)[0];
                                        return (
                                            <Fragment key={index}>
                                                <div className='wkit-wb-widget'
                                                    draggable
                                                    onDragStart={(e) => { e.dataTransfer.setData('controller_id', value.toLowerCase().split(" ").join("")); }}
                                                    onDragEnd={(e) => { setTimeout(() => { e.target.classList.remove("drag") }, 500) }}
                                                    data-component={value.toLowerCase().split(" ").join("")}>
                                                    <img draggable={false} className='wkit-wb-widget-img' src={img_path + `assets/images/wb-component/${value}.svg`} />
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
    );
}

export default Block_Element;
