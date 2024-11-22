import '../style/popup.scss'
import { useState, useRef, useEffect } from "react";
import { wdKit_Form_data } from '../../helper/helper-function';

const { Fragment } = wp.element;

const Pop_up = (props) => {

    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    const specificLinks = {
        elementor: {
            links: [
                { label: "E-icons", href: "https://elementor.github.io/elementor-icons/" },
                { label: "Font-Awesome 5", href: "https://fontawesome.com/v5/search" }
            ]
        },
        bricks: {
            links: [
                { label: "Ionicons 4", href: "https://ionic.io/ionicons" },
                { label: "Font-Awesome 6", href: "https://fontawesome.com/v6/icons/" },
                { label: "Themify", href: "https://themify.me/themify-icons" }
            ]
        },
        gutenberg: {
            links: [
                { label: "Font-Awesome 5", href: "https://fontawesome.com/v5/search" }
            ]
        }
    };

    const [name, setname] = useState(props.widgetdata.WcardData.widgetdata.name)
    const [category, setcategory] = useState(props.widgetdata.WcardData.widgetdata.category)
    const [w_icon, setw_icon] = useState(props.widgetdata.WcardData.widgetdata.w_icon)
    const [description, setdescription] = useState(props.widgetdata.WcardData.widgetdata.description)
    const [h_link, seth_link] = useState(props.widgetdata.WcardData.widgetdata.helper_link)
    const [key_words, setkey_words] = useState(props.widgetdata.WcardData.widgetdata.key_words)
    const [widget_image, setwidget_image] = useState(props.widgetdata.WcardData.widgetdata.w_image)
    const [widget_image_id, setwidget_image_id] = useState()
    const [Custom_category, setCustom_category] = useState('none');
    const [category_array, setcategory_array] = useState([]);
    const [CategoryLoader, setCategoryLoader] = useState(false);
    const [CategoryLoader_id, setCategoryLoader_id] = useState(false);
    const nameValidation = useRef(name);
    const dropFileRef = useRef(""),
        dropBlockIcon = useRef(""),
        DropZoneGutenberg = useRef(""),
        categoryList = useRef(""),
        closePopup = useRef("");

    const Update_category = async (category_list) => {
        setCategoryLoader(true);
        var myArray = [...category_list];
        let new_Array = myArray.filter(element => element !== "");

        let data = {
            'manage_type': 'update',
            'category_list': new_Array
        }

        let form_array = { 'type': 'wkit_manage_widget_category', 'info': JSON.stringify(data) }
        await wdKit_Form_data(form_array)
            .then((response) => {
                setcategory_array(response)
            })
            .catch(error => console.log(error));
        setCategoryLoader(false);
        setCategoryLoader_id(-1);
    }

    const Category_list = async () => {
        let data = {
            'manage_type': 'get'
        }

        let form_array = { 'type': 'wkit_manage_widget_category', 'info': JSON.stringify(data) }
        await wdKit_Form_data(form_array)
            .then((response) => {
                setcategory_array(response)
            })
    }

    useEffect(() => {
        Category_list();
    }, [])

    useEffect(() => {
        let type_widget_image = typeof widget_image;
        let type_w_icon = typeof w_icon;
        if (type_widget_image == 'string') {
            if (dropFileRef && dropFileRef.current && dropFileRef.current.id == "wkit-wb-widget-icon-drop_zone") {
                dropFileRef.current.style.backgroundImage = `url('${widget_image}')`
            }
        }
        if (typeof widget_image == 'object') {
            const reader = new FileReader();
            reader.readAsDataURL(widget_image);
            reader.onload = () => {
                dropFileRef.current.style.backgroundImage = `url('${reader.result}')`;
            };
        }
    })

    var site_url = wdkitData.WDKIT_SITE_URL;
    var img_path = wdkitData.WDKIT_URL;

    /**Block name validation */
    const Name_Validation = (e) => {
        var pattern = /^[a-zA-Z][a-zA-Z0-9\s]{0,23}$/;

        if (nameValidation?.current?.value == "" ) {
            nameValidation.current.style.border = "1px solid red";
            document.querySelector('.wb-wkit-widgetName-toolTip').style.display = 'flex';

            setTimeout(() => {
                document.querySelector('.wb-wkit-widgetName-toolTip').style.display = 'none';
            }, 2000);
            setname("")
        } else {
            if (nameValidation?.current?.value != "") {
                nameValidation.current.style.border = "";
                if (pattern.test(nameValidation.current.value) ) {
                    setname(nameValidation.current.value)
                } else {
                    document.querySelector('.wb-wkit-widgetName-toolTip').style.display = 'flex';

                    setTimeout(() => {
                        document.querySelector('.wb-wkit-widgetName-toolTip').style.display = 'none';
                    }, 2000);
                }
            }
        }
    }

    const Save_data = () => {

        const isNameValid = name !== "" && isNaN(name.charAt(0));
        const isKeywordValid = /^[a-zA-Z0-9, ]*$/.test(key_words) || key_words === "";
        const isHelperLinkValid = /^(ftp|http|https):\/\/[^ "]+$/.test(h_link) || h_link === "";

        if (!isNameValid) {
            document.querySelector('.wb-wkit-widgetName-toolTip').style.display = 'flex';
            setTimeout(() => {
                document.querySelector('.wb-wkit-widgetName-toolTip').style.display = 'none';
            }, 2000);
            return false;
        }
        if (!isKeywordValid) {
            document.querySelector('.wb-wkit-widgetkeyW-toolTip').style.display = 'flex';
            setTimeout(() => {
                document.querySelector('.wb-wkit-widgetkeyW-toolTip').style.display = 'none';
            }, 2000);
            return false;
        }
        if (!isHelperLinkValid) {
            document.querySelector('.wb-wkit-widgetHelper-toolTip').style.display = 'flex';
            setTimeout(() => {
                document.querySelector('.wb-wkit-widgetHelper-toolTip').style.display = 'none';
            }, 2000);
            return false;
        }

        let value = key_words;
        let final_array = [];
        if (typeof value == 'string') {
            let val_array = value.split(',');
            val_array.forEach((element) => {
                final_array.push(element.trim());
            });
        } else {
            final_array = key_words;
        }

        let wi_data = Object.assign({}, props.widgetdata.WcardData.widgetdata,
            {
                "name": name.trim(),
                "category": category,
                "w_image": widget_image,
                "w_icon": w_icon,
                "description": description,
                "helper_link": h_link,
                "image_id": widget_image_id,
                "key_words": final_array,
            })

        if (isNameValid && isKeywordValid && isHelperLinkValid) {
            props.Close_popup();
        }

        props.addTowidgethandler(wi_data)
    }

    const Widget_dropImage = (e, file) => {
        if (file?.size && ((Number(file?.size) / 1000000) > 2)) {
            e.preventDefault();
        } else {
            e.preventDefault();
            let file_array = file?.type.split("/")
            if (file_array.includes("png") || file_array.includes("jpg") || file_array.includes("jpeg")) {
                setwidget_image_id(keyUniqueID())
                setwidget_image(file);
            } else {
            }
        }
    }

    const Widget_dropIcon = (e, file) => {
        e.preventDefault();
        let file_array = file.type.split("/")
        if (file_array.includes("image")) {
            setw_icon(file);
        }
    }

    const Category_dropDown = () => {
        if (categoryList && categoryList.current && categoryList.current.className == "wkit-wb-select-category-options") {
            categoryList.current.style.display = 'block'
        }
        if (categoryList && categoryList.current && categoryList.current.className != "wkit-wb-select-category-options") {
            categoryList.current.style.display = 'none'
        }
    }

    const Close_popup = (e) => {

        let main_div = e.target.closest('.wkit-wb-info-popup')
        if (!e.target.closest('.wkit-wb-selected-category')) {
            main_div.querySelector('.wkit-wb-select-category-options').style.display = "none";
        }
        if (!e.target.closest('.wkit-wb-custom-category') && !e.target.closest('.wkit-wb-edit-category')) {
            let array = [...category_array];

            do {
                let index = array.indexOf("")
                array.splice(index, 1)
            } while (array.indexOf("") > -1)

            setCustom_category('none');
        }
    }

    const Add_more_category = (e) => {
        let old_data = [...category_array];
        old_data.push("");
        setcategory_array(old_data);
    }

    const Edit_category = (e, index) => {
        let old_data = [...category_array];
        var pattern = /^[a-zA-Z0-9-_ ]+$/;

        if (e.target.value == '' || pattern.test(e.target.value)) {
            old_data[index] = e.target.value;
        } else {
            document.querySelector('.wb-wkit-widgetCategory-toolTip').style.display = 'flex';

            setTimeout(() => {
                document.querySelector('.wb-wkit-widgetCategory-toolTip').style.display = 'none';
            }, 2000);
        }

        setcategory_array(old_data);
    }

    const Remove_category = async (e, index) => {

        let old_data = [...category_array];
        await old_data.splice(index, 1);
        await Update_category(old_data);
        await setcategory_array(old_data);
        await setCategoryLoader_id(-1);
    }

    return (
        <>
            <div className='wkit-wb-info-popup' ref={closePopup} onClick={(e) => { Close_popup(e) }}>
                <div className="wkit-wb-header-popup">
                    <h2 className='wkit-wb-popup-hreader'>Edit Widget Information</h2>
                    <div className="wkit-popup-close-icon" onClick={(e) => { props.Close_popup(); }} >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" />
                        </svg>
                    </div>
                </div>
                <div className="wkit-wb-content wkit-wb-popoupScroll">
                    <div className='wkit-wb-third-part-content show'>
                        <div className='wkit-wb-block-detail' >
                            <div className='wkit-wb-block-wrapper'>
                                <div className='wkit-wb-block-name'>
                                    <div className='wkit-wb-keyWord-title'>
                                        <label className="wkit-wb-block-label">Name</label>
                                        <div className='wkit-wb-toolTip wkit-popup-first-toolTip'>
                                            <img className="wkit-wb-toolTip-icon" src={img_path + 'assets/images/wb-svg/info.svg'} width="13" />
                                            <span className='wkit-wb-toolTip-text wb-wkit-widgetName-toolTip wkit-wb-name-Tooltip'>Only numbers and alphabet are allowed for this field,
                                                Widget name must be smaller then 25 charaters and first letter can't be digit.</span>
                                        </div>
                                    </div>
                                    <input
                                        className='wkit-wb-block-text-inp'
                                        value={name}
                                        type='text'
                                        ref={nameValidation}
                                        placeholder='Enter your Widget Name'
                                        onChange={(e) => { Name_Validation(e) }}
                                    />
                                </div>
                                <div className='wkit-wb-block-category'>
                                    <div className='wkit-wb-keyWord-title'>
                                        <label className="wkit-wb-block-label">Category</label>
                                    </div>
                                    <div className='wkit-wb-category'>
                                        <div className='wkit-wb-selected-category-header'>
                                            <span className='wkit-wb-selected-category' onClick={(e) => { Category_dropDown(e) }}>{category}</span>
                                            <img className='wkit-wb-edit-category' src={img_path + 'assets/images/wb-svg/pencil.svg'} onClick={(e) => { Custom_category == 'none' ? setCustom_category('flex') : setCustom_category('none') }} />
                                        </div>
                                        <div style={{ display: 'none' }} ref={categoryList} className='wkit-wb-select-category-options'>
                                            {category_array && category_array.map((category, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <option value={category} onClick={(e) => { setcategory(e.target.value), Category_dropDown() }}>{category}</option>
                                                    </Fragment>
                                                );
                                            })
                                            }
                                        </div>
                                    </div>
                                    <div className='wkit-wb-custom-category' style={{ display: Custom_category }}>
                                        <div className='wkit-wb-custom-category-header'>
                                            <div className='wkit-wb-keyWord-title'>
                                                <span className='wkit-wb-custom-category-name'>Create New Category</span>
                                                <div className='wkit-wb-toolTip' style={{ top: '1px' }}>
                                                    <svg className="wkit-wb-toolTip-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="white">
                                                        <path d="M6 0C2.68594 0 0 2.68594 0 6C0 9.31406 2.68594 12 6 12C9.31406 12 12 9.31406 12 6C12 2.68594 9.31406 0 6 0ZM6 11.25C3.10547 11.25 0.75 8.89453 0.75 6C0.75 3.10547 3.10547 0.75 6 0.75C8.89453 0.75 11.25 3.10547 11.25 6C11.25 8.89453 8.89453 11.25 6 11.25ZM6 4.3125C6.31055 4.3125 6.5625 4.06078 6.5625 3.75C6.5625 3.43945 6.31055 3.1875 6 3.1875C5.68945 3.1875 5.4375 3.43828 5.4375 3.75C5.4375 4.06172 5.68828 4.3125 6 4.3125ZM7.125 8.25H6.375V5.625C6.375 5.41875 6.20625 5.25 6 5.25H5.25C5.04375 5.25 4.875 5.41875 4.875 5.625C4.875 5.83125 5.04375 6 5.25 6H5.625V8.25H4.875C4.66875 8.25 4.5 8.41875 4.5 8.625C4.5 8.83125 4.66875 9 4.875 9H7.125C7.33209 9 7.5 8.83209 7.5 8.625C7.5 8.41875 7.33125 8.25 7.125 8.25Z" />
                                                    </svg>
                                                    <span className='wkit-wb-toolTip-text wb-wkit-widgetCategory-toolTip'>Add more categories of Elementor Editor area.</span>
                                                </div>
                                            </div>
                                            <a className='wkit-wb-custom-category-close' onClick={() => { setCustom_category('none') }}>&times;</a>
                                        </div>
                                        <div className='wkit-wb-custom-category-inp_content'>
                                            <div className='wkit-custom-category-content'>
                                                <input className='wkit-wb-custom-category-inp' value={category_array[0]} disabled />
                                            </div>
                                            {category_array && category_array.map((category, index) => {
                                                if (index > 0) {
                                                    return (
                                                        <div className='wkit-wb-caregory-map' key={index}>
                                                            <div className='wkit-custom-category-content'>
                                                                <input className='wkit-wb-custom-category-inp' value={category} onBlur={() => { Update_category(category_array), setCategoryLoader_id(index) }} onChange={(e) => { Edit_category(e, index) }} disabled={CategoryLoader} />
                                                                {CategoryLoader && CategoryLoader_id == index &&
                                                                    <div className="wkit-publish-loader">
                                                                        <div className="wb-loader-circle wkit-category-loader"></div>
                                                                    </div>}
                                                            </div>
                                                            <img className='wkit-wb-plus-icon' src={img_path + 'assets/images/wb-svg/trash-2.svg'} onClick={(e) => { Remove_category(e, index) }} />
                                                        </div>
                                                    );
                                                }
                                            })
                                            }
                                        </div>
                                        <div className='wkit-wb-custom-category-btns' onClick={(e) => { Add_more_category(e); }}>
                                            <img src={img_path + 'assets/images/wb-svg/add-section-icon.svg'} />
                                            <label>Add More</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='wkit-wb-block-feature-img' >
                                <div className='wkit-wb-upload-block-icon'>
                                    <div className='wkit-wb-keyWord-title'>
                                        <label className="wkit-wb-block-label">Featured Image</label>
                                        <div className='wkit-wb-toolTip'>
                                            <img className="wkit-wb-toolTip-icon" src={img_path + 'assets/images/wb-svg/info.svg'} width="13" />
                                            <span className='wkit-wb-toolTip-text'>Only .jpg and .png are allowed</span>
                                        </div>
                                    </div>
                                    <div className="drop-zone"
                                        ref={dropFileRef}
                                        id='wkit-wb-widget-icon-drop_zone'
                                        onDragOver={(e) => { e.preventDefault() }}
                                        onDrop={(e) => { Widget_dropImage(e, e.dataTransfer.files[0]) }}
                                        onClick={() => { document.querySelector("#drop-zone__input").click() }}>
                                        {!widget_image &&
                                            <div className='drop-zone__prompt'>
                                                <img className='wkit-wb-plus-icon' src={img_path + 'assets/images/wb-svg/Union.svg'} />
                                                <div className='wkit-wb-drag-drop-label'>Upload Widget's featured image to show in widget listing. Only .jpg and .png images allowed.</div>
                                            </div>
                                        }
                                        <input type="file" name="myFile" className="wkit-file-text" id="drop-zone__input" accept="image/*" onChange={(e) => { Widget_dropImage(e, e.target.files[0]) }} />
                                    </div>
                                </div>
                                <div className='wkit-wb-upload-block-icon'>
                                    <div className='wkit-wb-keyWord-title'>
                                        <label className="wkit-wb-block-label">Icon</label>
                                        <div className='wkit-wb-toolTip'>
                                            <img className="wkit-wb-toolTip-icon" src={img_path + 'assets/images/wb-svg/info.svg'} width="13" />
                                            <span className='wkit-wb-toolTip-text wb-wkit-widgetIcon-toolTip'>Choose and paste your icon code here to show that with widget.</span>
                                        </div>
                                    </div>
                                    <div className="wb-eicons-content">
                                        <div className="wb-eicons-val">
                                            <input className="wb-eicons-inp" type="text" value={w_icon} placeholder="Copy and Paste Icon code here" onChange={(e) => { setw_icon(e.target.value) }} />
                                        </div>
                                        <div className="wb-eicons-links">
                                            <div className="wb-eicons-links-heading">
                                                <span>Copy and Paste Icons from below libraries</span>
                                            </div>
                                            <div className="wb-eicons-links-content">
                                                {specificLinks[props.widgetdata.WcardData.widgetdata.type].links.map((links, index) => {
                                                    return (
                                                        <Fragment key={index}>

                                                            <a className="wb-eicons-lable" target="blank" rel="noopener noreferrer" href={links.href} >{links.label}</a>
                                                            {index < specificLinks[props.widgetdata.WcardData.widgetdata.type].links.length - 1 && (
                                                                <hr className="wb-eicons-hr" />
                                                            )}
                                                        </Fragment>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='wkit-wb-widget-info'>
                                <div className='wkit-wb-key-words'>
                                    <div className='wkit-wb-keyWord-title'>
                                        <label className="wkit-wb-input-lable">Keywords</label>
                                        <div className='wkit-wb-toolTip'>
                                            <img className="wkit-wb-toolTip-icon" src={img_path + 'assets/images/wb-svg/info.svg'} width="13" />
                                            <span className='wkit-wb-toolTip-text wb-wkit-widgetkeyW-toolTip'>Enter keywords to allow searching in elementor editor. <a href='https://developers.elementor.com/docs/widgets/widget-data/' target='_blank' rel="noopener noreferrer">Read More</a></span>
                                        </div>
                                    </div>
                                    <input className='wkit-wb-input-content' placeholder='e.g. icon box, info box, icon' value={key_words} type='text' onChange={(e) => { setkey_words(e.target.value) }} />
                                </div>
                                <div className='wkit-wb-helper-link'>
                                    <div className='wkit-wb-keyWord-title'>
                                        <label className="wkit-wb-input-lable">Help Link</label>
                                        <div className='wkit-wb-toolTip'>
                                            <img className="wkit-wb-toolTip-icon" src={img_path + 'assets/images/wb-svg/info.svg'} width="13" />
                                            <span className='wkit-wb-toolTip-text wb-wkit-widgetHelper-toolTip'>Enter URL for users to get more information about this widget. <a href='https://developers.elementor.com/docs/widgets/widget-data/' target='_blank' rel="noopener noreferrer">Read More</a></span>
                                        </div>
                                    </div>
                                    <input className='wkit-wb-input-content' placeholder='e.g. https://xyz.com/help/' value={h_link} type='url' onChange={(e) => { seth_link(e.target.value) }} />
                                </div>
                            </div>
                            <div className='wkit-wp-btn-center wb-add-widget-footer'>
                                <div className="wb-add-widget-cancelBtn">
                                    <button onClick={(e) => { props.Close_popup(); }} > Cancel </button>
                                </div>
                                <div
                                    className="wkit-wb-block-btn-save"
                                    onClick={(e) => { setCustom_category('none'); if (name !== "" && isNaN(name.charAt(0))) { Save_data() } }} >
                                    <a className='wkit-wb-save-btn'>SAVE</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Pop_up