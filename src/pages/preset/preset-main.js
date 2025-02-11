import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { wdKit_Form_data, Wkit_availble_not } from '../../helper/helper-function';
import ReactPaginate from 'react-paginate';
import '../preset/preset.scss';

import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import { ShowToast } from '../redux/redux_data/store_action';

let controller = new AbortController();

const { Fragment } = wp.element;

const PresetMain = (props) => {

    /**DropDown data for Preset Name */
    const widget_list = [
        {
            name: 'All',
        },
        {
            name: 'Advance Text Block',
            tag: 'pro'
        },
        {
            name: 'Advance Charts',
            tag: 'freemium'
        },
        {
            name: 'Countdown',
            id: '12337',
        },
        {
            name: 'Coupon Code',
        },
        {
            name: 'Log in/Signup',
            tag: 'pro'
        },
        {
            name: 'Message Box',
        },
        {
            name: 'Navigation Menu',
            tag: 'freemium'
        },
        {
            name: 'Pie Chart',
        },
        {
            name: 'Number Counter',
            tag: 'pro',
            id: '12570'
        },
        {
            name: 'Preloader',
        },
        {
            name: 'Pricing List',
        },
        {
            name: 'Pricing Table',
            tag: 'pro',
            id: '12387',
        },
        {
            name: 'Progress Bar',
        },
        {
            name: 'Social Icons',
            tag: 'freemium'
        },
        {
            name: 'Social Sharing',
            tag: 'pro'
        },
        {
            name: 'Stylist List',
        },
        {
            name: 'Table',
        },
        {
            name: 'Table of Content',
            tag: 'freemium'
        },
        {
            name: 'Video',
        },
        {
            name: 'Advance Typography',
        },
        {
            name: 'Before After',
        },
        {
            name: 'Creative Images',
            tag: 'freemium'
        },
        {
            name: 'Accordion',
        },
        {
            name: 'Draw SVG',
            tag: 'pro'
        },
        {
            name: 'Hover Card',
        },
        {
            name: 'Smooth Scroll',
        },
        {
            name: 'Process Steps',
            tag: 'pro'
        },
        {
            name: 'Offcanvas',
        },
        {
            name: 'Timeline',
            tag: 'freemium'
        },
        {
            name: 'Unfold',
        },
        {
            name: 'Gallery Background',
        },
        {
            name: 'Video Background',
        },
        {
            name: 'Special Background',
            tag: 'pro'
        },
        {
            name: 'Switcher',
        },
        {
            name: 'Tabs Tour',
            tag: 'freemium'
        },
        {
            name: 'Facebook Badge',
        },
        {
            name: 'Facebook Feed',
            tag: 'pro'
        },
        {
            name: 'Facebook Reviews',
        },
        {
            name: 'Google Badge',
        }

    ];

    const params = useParams();
    const navigate = useNavigate();
    var img_path = wdkitData.WDKIT_URL;

    const [loader, setLoader] = useState(true);
    const [filterItem, setFilterItem] = useState(['all', 'free', 'pro']);
    const [totalpage, setTotalPage] = useState(1);
    const [IsLoading, setIsLoading] = useState(-1);
    const [presetField, setPresetField] = useState({
        'type': 'wkit_preset_template',
        'builder': '',
        'buildertype': window.wdkit_editor,
        'perpage': 8,
        'page': 1,
        'free_pro': 'all',
        'template_id': params?.preset_id,
    });

    const [presetData, setPresetData] = useState(null);
    const [manage_licence, setmanage_licence] = useState([]);
    const [filterLoader, setFilterLoader] = useState(true);
    const [nameMenuToggle, setNameMenuToggle] = useState(false);
    const [presetNameValue, setPresetNameValue] = useState('');
    const [searchValue, setSearchValue] = useState("");

    /** Function which handles Preset Name on Loading comp first time */
    useEffect(() => {
        let id = params?.preset_id;
        let name = widget_list.find((item) => { return item?.id == id })?.name;

        if (name) {
            setPresetNameValue(name);
        }
    }, [])

    /**Function for handling View Demo */
    const handleViewRedirect = (id, type, title) => {
        const transformedTitle = title.toLowerCase().replace(/\s+/g, '--');
        const redirectURL = `${wdkitData.wdkit_server_url}templates/${type}/${transformedTitle}/${id}`;
        window.open(redirectURL, '_blank');
    }

    /**Function for calling Preset API */
    const handlePresetAPI = async () => {

        if (controller) {
            controller.abort();
        }

        controller = new AbortController();

        let form = new FormData();
        form.append('action', 'get_wdesignkit');
        form.append('kit_nonce', wdkitData.kit_nonce);

        Object.entries(presetField).forEach(([key, value]) => {
            if (key === 'free_pro' && value === 'all') {
                form.append(key, "");
            } else {
                form.append(key, value);
            }
        })

        await axios.post(wdkitData.ajax_url, form, { signal: controller.signal }).then((result) => {

            if (result?.data) {
                let resultData = result?.data?.data;
                setmanage_licence(result?.data?.manage_licence);
                setTotalPage(result?.data?.totalpage);
                setPresetData(resultData);
                setLoader(false);
                setFilterLoader(false);
            } else {
                setPresetData(null);
            }
        });

    }

    useEffect(() => {
        handlePresetAPI()
    }, [presetField]);

    /**function for Setting Image URL */
    const SetImageUrl = (url) => {
        if (url) {
            var imageUrl = url.replace(/\s/g, "%20");

            return imageUrl;
        } else {
            return img_path + 'assets/images/placeholder.jpg';
        }
    }


    /** Function for Preset Skeleton */
    const PresetSkeleton = (number) => {

        /** get array of required length */
        const getArray = (length) => Array.from({ length });
        if (number) {

            return (
                <>
                    {getArray(number).map((data, index) => (
                        <div className="wkit-preset-card" key={index}>
                            <div className="wkit-card-inner">
                                <div className="wkit-pr-card-top">
                                    <div className="wkit-preset-feature-img">
                                        <img className="wkit-widget-placeholder-img" src={img_path + 'assets/images/wkit-dummy-bg.png'} draggable="false" />
                                    </div>
                                </div>
                                <div className="wkit-preset-card-bottom">
                                    <div className="wkit-pr-card-title">Growth Metrics</div>
                                    <div className="wkit-preset-download-btn">
                                        <div className="preset-download-temp">
                                            <img className="wkit-preset-download-icon" src={img_path + "assets/images/svg/popup-download.svg"} alt="view-kit" draggable="false" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>

            )

        }

    }

    const Download_preset_btn = (preset, key) => {
        var pro_temp = true;
        var elementor_lcs = false;
        var gutenberg_lcs = false;

        if (window.wdkit_editor == 'elementor' && manage_licence?.tpae?.success && manage_licence?.tpae?.license == 'valid') {
            elementor_lcs = true;
        }

        if (window.wdkit_editor == 'gutenberg' && manage_licence?.tpag?.active_plan && manage_licence?.tpag?.status == 'valid') {
            gutenberg_lcs = true;
        }

        if (preset?.free_pro == 'free') {
            pro_temp = false;
        } else if (gutenberg_lcs || elementor_lcs) {
            pro_temp = false;
        } else {
            pro_temp = true;
        }

        if (pro_temp) {
            return (
                <div className='wkit-preset-download-btn wkit-lock-btn'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M10.0625 5.25V3.81063C10.0613 3.0324 9.75168 2.28639 9.2014 1.7361C8.65111 1.18582 7.9051 0.876157 7.12688 0.875H6.87313C6.0949 0.876157 5.34889 1.18582 4.7986 1.7361C4.24832 2.28639 3.93866 3.0324 3.9375 3.81063V5.25C3.5894 5.25 3.25556 5.38828 3.00942 5.63442C2.76328 5.88056 2.625 6.2144 2.625 6.5625V10.6312C2.62616 11.2923 2.88926 11.9259 3.35668 12.3933C3.8241 12.8607 4.45772 13.1238 5.11875 13.125H8.88125C9.54228 13.1238 10.1759 12.8607 10.6433 12.3933C11.1107 11.9259 11.3738 11.2923 11.375 10.6312V6.5625C11.375 6.2144 11.2367 5.88056 10.9906 5.63442C10.7444 5.38828 10.4106 5.25 10.0625 5.25ZM4.8125 3.81063C4.8125 3.26411 5.0296 2.73999 5.41604 2.35354C5.80249 1.9671 6.32661 1.75 6.87313 1.75H7.12688C7.67339 1.75 8.19752 1.9671 8.58396 2.35354C8.9704 2.73999 9.1875 3.26411 9.1875 3.81063V5.25H4.8125V3.81063Z" fill="#727272" />
                        <path d="M7.4375 9.0649V10.4999C7.4375 10.6159 7.39141 10.7272 7.30936 10.8093C7.22731 10.8913 7.11603 10.9374 7 10.9374C6.88397 10.9374 6.77269 10.8913 6.69064 10.8093C6.60859 10.7272 6.5625 10.6159 6.5625 10.4999V9.0649C6.39569 8.96859 6.26532 8.81993 6.19161 8.64198C6.11789 8.46402 6.10496 8.26672 6.15482 8.08066C6.20467 7.89461 6.31452 7.7302 6.46733 7.61294C6.62015 7.49569 6.80738 7.43213 7 7.43213C7.19262 7.43213 7.37985 7.49569 7.53267 7.61294C7.68548 7.7302 7.79533 7.89461 7.84519 8.08066C7.89504 8.26672 7.88211 8.46402 7.8084 8.64198C7.73468 8.81993 7.60431 8.96859 7.4375 9.0649Z" fill="#D1D1D6" />
                    </svg>
                </div>
            );
        }

        if (IsLoading == key) {
            return (
                <div className='wkit-preset-download-btn wkit-loading-preset'>
                    <div className="wkit-publish-loader">
                        <div className="wb-loader-circle"></div>
                    </div>
                </div>
            );
        } else if (IsLoading !== -1) {
            return (
                <div className='wkit-preset-download-btn wkit-disable-btn'>
                    <img className='wkit-preset-download-icon' src={img_path + "assets/images/svg/popup-download.svg"} alt="view-kit" draggable={false} />
                </div>
            );
        } else {
            return (
                <div className='wkit-preset-download-btn' onClick={() => handlePresetDownload(preset, key)}>
                    <img className='wkit-preset-download-icon' src={img_path + "assets/images/svg/popup-download.svg"} alt="view-kit" draggable={false} />
                </div>
            );
        }
    }

    const handlePresetDownload = async (preset, key) => {
        setIsLoading(key);

        if (controller) {
            controller.abort();
        }

        controller = new AbortController();

        let form = new FormData();
        form.append('action', 'get_wdesignkit');
        form.append('kit_nonce', wdkitData.kit_nonce);
        form.append('type', 'wdkit_preset_dwnld_template');
        form.append('id', preset?.id);
        form.append('builder', window.wdkit_editor);
        form.append('free_pro', preset?.free_pro);
        form.append('product_name', '');

        let rseponse = await axios.post(wdkitData.ajax_url, form, { signal: controller.signal }).then((res) => res.data);

        if (rseponse?.success) {
            let tempContent = JSON.parse(rseponse.content);

            if (tempContent && tempContent.content && wdkitData.use_editor == 'gutenberg') {
                let blocks = wp.blocks.parse(tempContent.content)

                //Media Import 
                let blocks_str = JSON.stringify(blocks);
                if (/\.(jpg|png|jpeg|gif|svg|webp)/gi.test(blocks_str)) {
                    let form_arr = { 'type': 'media_import', 'email': '', 'content': blocks_str, 'editor': wdkitData.use_editor }
                    let media_res = await wdKit_Form_data(form_arr);
                    if (media_res.data && media_res.success) {
                        blocks = media_res.data
                        wp.data.dispatch('core/block-editor').insertBlocks(blocks);
                    }
                } else {
                    wp.data.dispatch('core/block-editor').insertBlocks(blocks);
                }

                props.wdkit_set_toast([rseponse.message, rseponse.description, '', 'success']);
                setIsLoading(-1);

                return () => {
                    clearTimeout(timeId)
                }
            } else if (tempContent && tempContent.content && tempContent.file_type == 'elementor' && wdkitData.use_editor == 'elementor') {
                let content_str = JSON.stringify(tempContent.content);
                if (/\.(jpg|png|jpeg|gif|svg|webp)/gi.test(content_str)) {
                    let form_arr = { 'type': 'media_import', 'email': '', 'content': content_str, 'editor': wdkitData.use_editor }
                    let media_res = await wdKit_Form_data(form_arr);
                    if (media_res.data && media_res.success) {
                        tempContent.content = media_res.data
                    }
                }

                var win_ele = window.elementor,
                    win_el = $e;
                if (win_ele) {
                    if (undefined !== win_el) {
                        function ele_uniqueID(a) {
                            return (
                                a.forEach(function (a) {
                                    (a.id = elementorCommon.helpers.getUniqueId()), 0 < a.elements.length && ele_uniqueID(a.elements);
                                }),
                                a
                            );
                        }
                        for (var i = 0; i < tempContent.content.length; i++) {
                            var sec = { elType: tempContent.content[i].elType, settings: tempContent.content[i].settings };
                            sec.elements = ele_uniqueID(tempContent.content[i].elements)
                            win_el.run("document/elements/create", {
                                container: win_ele.getPreviewContainer(),
                                model: sec,
                                options: {
                                    index: 0
                                }
                            });
                        }
                    } else {
                        var model = new Backbone.Model({
                            getTitle: function () {
                                return "Wdesignkit Import"
                            }
                        });
                        win_el.channels.data.trigger("template:before:insert", model);
                        for (var i = 0; i < tempContent.content.length; i++) win_el.getPreviewView().addChildElement(tempContent.content[i], {
                            index: 0
                        });
                        win_el.channels.data.trigger("template:after:insert", {})
                    }

                    props.wdkit_set_toast([rseponse.message, rseponse.description, '', 'success']);

                    setTimeout(() => {
                        var event = window?.WdkitPopup?.getElements("content");
                        
                        if (event) {
                            window.WdkitPopupToggle.close(event.get(0)), window.WdkitPopup.destroy()
                        }
                    }, 1500);
                    setIsLoading(-1);

                    return () => {
                        clearTimeout(timeId)
                    }
                }
            } else {
                setIsLoading(-1);
            }
        } else {
            props.wdkit_set_toast([rseponse.message, rseponse.description, '', 'danger']);
            setIsLoading(-1);
        }
    }

    /** Function for Preset Cards */
    const PresetCard = (key, preset) => {

        return (
            <div className='wkit-preset-card' key={key}>
                <div className='wkit-card-inner'>
                    <div className='wkit-pr-card-top' onClick={() => handleViewRedirect(preset?.id, preset?.type, preset?.title)} >
                        <div className='wkit-preset-card-tag'>
                            <span>{preset?.free_pro}</span>
                        </div>
                        <div className='wkit-preset-feature-img'>
                            <img className="wkit-widget-placeholder-img" src={img_path + 'assets/images/wkit-dummy-bg.png'} draggable="false" />
                            <picture>
                                {preset?.responsive_image?.length > 0 && preset?.responsive_image.map((image_data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <source media={`(min-width: ${image_data?.size}px)`} srcSet={SetImageUrl(image_data?.url)} />
                                        </Fragment>
                                    );
                                })
                                }
                                <img className='wkit-temp-image-content' src={preset?.post_image} alt={"featured-img"} draggable={false} />
                            </picture>
                            <div className='wkit-preset-preview'>
                                <div className='wkit-preset-demo-inner'>
                                    <div className='wkit-preview-items'>
                                        <svg width="17" height="17" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.51293 6.58874C8.51293 7.60786 7.6894 8.43139 6.67028 8.43139C5.65117 8.43139 4.82764 7.60786 4.82764 6.58874C4.82764 5.56962 5.65117 4.74609 6.67028 4.74609C7.6894 4.74609 8.51293 5.56962 8.51293 6.58874Z" stroke="#FFFFFF" strokeWidth="1.23529" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.67019 10.8455C8.4871 10.8455 10.1805 9.77494 11.3592 7.922C11.8224 7.19627 11.8224 5.97641 11.3592 5.25068C10.1805 3.39774 8.4871 2.32715 6.67019 2.32715C4.85328 2.32715 3.15989 3.39774 1.98122 5.25068C1.51798 5.97641 1.51798 7.19627 1.98122 7.922C3.15989 9.77494 4.85328 10.8455 6.67019 10.8455Z" stroke="#FFFFFF" strokeWidth="1.23529" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <label>View Demo</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='wkit-preset-card-bottom'>
                        <div className='wkit-pr-card-title'>{preset?.title}</div>
                        {Download_preset_btn(preset, key)}
                    </div>
                </div>
            </div>
        );
    }

    /** Function which runs  when we select or filter anything */
    const handlePresetFilterSelection = (selected, value) => {
        setLoader(true);

        if (selected == 'search') {
            var updated_object = Object.assign({}, presetField, { 'search': value, 'page': 1 });
        }

        if (value != '' && selected == 'filterItem') {
            const selectedFilterItem = value.toLowerCase();
            var updated_object = Object.assign({}, presetField, { 'free_pro': selectedFilterItem, 'page': 1 });
        }

        if (selected == 'filterName') {
            var updated_object = Object.assign({}, presetField, { 'template_id': value.id, 'page': 1 });
            setPresetNameValue(value.presetName);
            nameMenuToggle == true ? setNameMenuToggle(false) : setNameMenuToggle(true);
        }

        setPresetField(updated_object);
    }

    /**Preset Pagination */
    const Pagaination = () => {
        if (presetData?.length > 0 && totalpage > 1) {
            return (

                <div className='wkit-pagination-main'>
                    <ReactPaginate
                        breakLabel={"..."}
                        nextLabel={<svg xmlns="http://www.w3.org/2000/svg" width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M0.412598 9.52417L4.48371 5.44417L0.412598 1.36417L1.66593 0.11084L6.99926 5.44417L1.66593 10.7775L0.412598 9.52417Z" fill="#8991A4" /></svg>}
                        pageRangeDisplayed={2}
                        pageCount={totalpage}
                        marginPagesDisplayed={1}
                        previousLabel={<svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none"><path d="M7.47754 1.36352L3.40643 5.44352L7.47754 9.52352L6.22421 10.7769L0.890873 5.44352L6.22421 0.110189L7.47754 1.36352Z" fill="#8991A4" /></svg>}
                        pageClassName={"wkit-page-item"}
                        pageLinkClassName={"wkit-pagination-item"}
                        previousClassName={"wkit-next-prev wkit-prev-pagination"}
                        previousLinkClassName={"wkit-pagination-item"}
                        nextClassName={"wkit-next-prev wkit-next-pagination"}
                        nextLinkClassName={"wkit-pagination-item"}
                        breakClassName={"wkit-page-item"}
                        breakLinkClassName={"page-link"}
                        containerClassName={"wkit-pagination"}
                        activeClassName={"active"}
                        onClick={(clickEvent) => {
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: 'smooth'
                            });
                            if (clickEvent.nextSelectedPage != undefined) {
                                presetField['page'] = (clickEvent.nextSelectedPage + 1);
                                setPresetField({ ...presetField });
                                setLoader(true);
                            }
                        }}
                        forcePage={presetField.page - 1}
                        onPageActive={() => { }}
                    />
                </div>
            );
        }
    }

    /** Filter for All , Free and Pro Display*/
    const FreePro_filter = () => {
        return (
            filterItem.map((item, index) => {
                return (
                    <div key={index} className={`wkit-preset-filter-list ${presetField.free_pro === item ? 'wdkit-active-filter' : ''}`} onClick={(e) => handlePresetFilterSelection('filterItem', item)}>
                        <p>{item}</p>
                    </div>
                )
            })
        )
    }


    /**Filter for Preset Name Sub Menu */
    const PresetNameSubMenu = () => {
        const handleMenuClick = (id, name) => {
            navigate('/preset/' + id);
            handlePresetFilterSelection('filterName', { id: id, presetName: name });
        }

        return (
            <div className='wkit-widgets-list'>
                <div className={`wkit-submenu ${nameMenuToggle == true ? 'menu-active' : ''}`}>
                    <div className="wkit-submenu-inner-content">
                        {widget_list?.map((w_data, index) => {
                            return (
                                <div className={`wkit-submenu-link  ${!w_data?.id ? 'link-active' : ''}`} onClick={() => handleMenuClick(w_data?.id, w_data.name)} key={index}>
                                    <span>{w_data.name}</span>
                                    {w_data?.tag &&
                                        <span className='wkit-pr-widget-tag'>
                                            <span className={`wkit-preset-dropdown-text ${w_data.tag === 'pro' ? 'pro-color' : 'free-color'}`}>{w_data.tag}</span>
                                        </span>
                                    }
                                </div>
                            );
                        })
                        }
                    </div>
                </div>
            </div>
        )
    }

    const ClosePopup = (e) => {

        if (!e.target.closest('.wkit-submenu ')) {
            if (e.target.closest('.wkit-dropdown-container')) {
                setNameMenuToggle(!nameMenuToggle);
            } else {
                if (nameMenuToggle) {
                    setNameMenuToggle(false);
                }
            }
        }

    }

    /** Filter for Preset Name */
    const PresetNameFilter = () => {

        return (
            <div className='wkit-search-filter wkit-dropdown-container'>
                <div className='wkit-browse-search-inner' onClick={(e) => { ClosePopup(e) }}>
                    <span className='wkit-browse-search' style={{ cursor: 'pointer' }} >{presetNameValue}</span>
                    <div className={`wkit-dropdown-svg ${nameMenuToggle ? 'wb-rotate-icon' : ''}`}>
                        <svg className='wkit-megamenu-dropdown' xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 11 10" fill="none">
                            <path d="M8.96621 3.73047L6.24954 6.44714C5.92871 6.76797 5.40371 6.76797 5.08288 6.44714L2.36621 3.73047" stroke="grey" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                </div>

                <PresetNameSubMenu />
            </div>
        )
    }

    /**Filter for Search Menu */
    const PresetSearchfilter = () => {

        const handleKeyPress = (e) => {
            if ('Enter' === e.key) {
                handlePresetFilterSelection('search', searchValue);
            }
        };

        return (
            <div className='wkit-preset-search-template'>
                <div className='wkit-search-filter'>
                    <div className='wkit-browse-search-inner'>
                        <input
                            className='wkit-browse-search'
                            placeholder={__('Search Templates')}
                            type="text"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value)
                            }}
                            onKeyDown={handleKeyPress}
                        />
                        <span className="wkit-search-button wkit-btn-class" onClick={(e) => { handlePresetFilterSelection('search', searchValue) }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M14.4299 5.92969L20.4999 11.9997L14.4299 18.0697" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    const PresetFilterPanel = () => {

        return (
            <>
                <div className="wkit-free-dropdown-mixed">
                    <div className='wkit-preset-filter-content'>
                        <div className='wkit-free-pro-filter'>
                            {FreePro_filter()}
                        </div>
                        <div className='wkit-search-filter-content'>
                            {PresetNameFilter()}
                            {PresetSearchfilter()}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className={`wkit-preset-container ${loader ? 'wkit-skeleton' : ''} ${filterLoader ? 'wkit-filter-skeleton' : ''}`} onClick={(e) => { ClosePopup(e) }}>
            {PresetFilterPanel()}
            <div className='wkit-preset-main'>
                <div className="wdkit-preset-inner-content">
                    {loader === false && presetData?.length <= 0 ?
                        <Wkit_availble_not />
                        :
                        <div className="wkit-preset-grid">
                            {loader === true ?
                                PresetSkeleton(presetField.perpage)
                                :
                                presetData?.map((data, index) => { return PresetCard(index, data) })
                            }
                        </div>
                    }
                </div>
                {Pagaination()}
            </div>
        </div>
    )

}


const activae_page = state => ({
})

const mapDispatchToProps = dispatch => ({
    wdkit_set_toast: data => dispatch(ShowToast(data)),
});

export default connect(activae_page, mapDispatchToProps)(PresetMain);