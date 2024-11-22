import '../widget_brows/widget_brows.scss';
import { useState, useEffect, useRef } from 'react';
import { Wkit_browse_template_Skeleton, Wkit_availble_not, get_user_login, wdKit_Form_data, loadingIcon, Wkit_template_Skeleton, Widget_card } from '../../helper/helper-function';
import { Wkit_Filter_widget } from './mobile-filter-widget';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import Widget_browse_skeleton from './widget-browse-skeleton';

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    form_data,
    wkit_get_user_login,
} = wp.wkit_Helper;

let controller = new AbortController();

const Widget_brows = (props) => {
    const navigation = useNavigate();
    const location = useLocation();

    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [browseData, setBrowseData] = useState('loading');
    const [filterToggle, setFilterToggle] = useState(true);
    const [selectBuilder, setselectBuilder] = useState('');
    const [userData, setUserData] = useState();
    const [categoryCheck, setcategoryCheck] = useState([]);
    const [accordionToggle, setaccordionToggle] = useState(['category', 'free_pro']);
    const [totalpage, settotalpage] = useState(0);
    const [skeleton, setskeleton] = useState(true);
    const [card_loading, setcard_loading] = useState(true);
    const [existingwidget, setexistingwidget] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchValue, setsearchValue] = useState('');
    const [filterArgs, setFilterArgs] = useState({ 'free_pro': '', 'type': 'widget_browse_page', 'buildertype': '', 'perpage': perPage, 'page': activePage });
    const inputRef = useRef(null);
    const [BuilderArray, setBuilderArray] = useState([]);

    /** get builder and category list from redux */
    const builder = props?.wdkit_meta?.widgetbuilder ? [...props?.wdkit_meta?.widgetbuilder] : [];
    const category = props?.wdkit_meta?.widgetscategory ? [...props?.wdkit_meta?.widgetscategory] : [];
    const [freeProCheck, setFreeProCheck] = useState('');

    let data = wkit_get_user_login();
    if (!data) {
        props.wdkit_Login_Route('/widget-browse');
    }

    /** get redux */
    useEffect(() => {
        setUserData(props.wdkit_meta);
    }, [props.wdkit_meta])

    /** start skeleton onload and set filter args after refresh */
    useEffect(() => {
        setskeleton(true);

        if (location?.search) {

            const queryParams = new URLSearchParams(location.search);
            const newFilterArgs = {};

            Array.from(queryParams?.entries()).map(([key, value]) => {
                newFilterArgs[key] = value;
            });

            setFilterArgs(prevFilterArgs => ({ ...prevFilterArgs, ...newFilterArgs }));

            if (newFilterArgs.category) {
                setcategoryCheck(JSON.parse(newFilterArgs.category));
            }
            if (newFilterArgs.buildertype) {
                setselectBuilder(newFilterArgs.buildertype);
            }
            if (newFilterArgs.free_pro) {
                setFreeProCheck(newFilterArgs.free_pro);
            }
            if (newFilterArgs.search) {
                setsearchValue(newFilterArgs.search);
                setSearchQuery(newFilterArgs.search);
            }
        }

    }, [])

    /** call api function to get filterd data */
    useEffect(() => {
        BrowseFilter()
        setcard_loading(true)
    }, [filterArgs, perPage, activePage, userData]);

    const Mobile_filter = () => {
        if (document.querySelector(".wkit-mobile-filter-main")) {
            document.querySelector(".wkit-mobile-filter-main").classList.add("wkit-filter-menu-show");
        }
    }

    useEffect(() => {
        let builders = [];
        if (props?.wdkit_meta?.Setting?.elementor_builder) {
            builders.push(1);
        }
        if (props?.wdkit_meta?.Setting?.gutenberg_builder) {
            builders.push(2);
        }
        if (props?.wdkit_meta?.Setting?.bricks_builder) {
            builders.push(3);
        }
        setBuilderArray(builders)
    }, [props?.wdkit_meta?.Setting])

    const checkWidgetActivation = (array) => {

        let builder_array = [];
        if (builder?.length > 0) {
            array.map((id) => {
                let index = builder.findIndex((data) => data.w_id == id);
                let slug = builder[index]?.builder_name
                builder_array.push(slug);
            })

        }

        return builder_array;
    }

    /**
     * Search Filter Html Part 
     * 
     * @since 1.0.2
    */
    const handleKeyPress = (e) => {
        if ('Enter' === e.key) {
            handleFilterChecked(e, 'search');
            inputRef.current.blur()
        }
    };

    const SearchFilter = () => {
        return (
            <Fragment>
                <div className='wkit-browse-search-inner'>
                    <input
                        className='wkit-browse-search'
                        placeholder={__('Search Widgets')}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value) }}
                        onKeyDown={handleKeyPress}
                        ref={inputRef}
                    />
                    <span className="wkit_search_button wkit-btn-class" onClick={(e) => { handleFilterChecked(e, 'search') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none">
                            <path d="M14.4299 5.92969L20.4999 11.9997L14.4299 18.0697" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            </Fragment>
        )
    }

    /**
     * Filter Function for remove unneccesory before send in url
     * 
     * @data original data in Object format 
     * @version 1.0.39
    */
    const URL_data = (data) => {
        return Object.fromEntries(Object.entries(data).filter(([key, value]) => value.length > 1 && value !== "[]" && key !== 'type' && key !== 'page' && key !== 'perpage'));
    }


    /**
     * Filter Function
     * 
     * @since 1.0.0
     * @version 1.0.6
    */
    const handleFilterChecked = (e, type) => {

        if ('category' === type) {
            let category = [...categoryCheck];

            if (category.includes(Number(e.target.value))) {
                let id = category.indexOf(Number(e.target.value));
                category.splice(id, 1);
                setcategoryCheck(category);
                var filter_data = Object.assign({}, filterArgs, { 'category': JSON.stringify(category), 'page': 1 });
                setActivePage(1);
            } else {
                category.push(Number(e.target.value));
                setcategoryCheck(category);
                var filter_data = Object.assign({}, filterArgs, { 'category': JSON.stringify(category), 'page': 1 });
                setActivePage(1);
            }
        } else if ('builder' === type) {
            var builder_type = ''
            if (e.target.checked) {
                builder_type = e.target.value;
            }

            setselectBuilder(builder_type);
            var filter_data = Object.assign({}, filterArgs, { 'buildertype': builder_type, 'page': 1 })
            setActivePage(1);
        } else if ('search' === type) {
            var filter_data = Object.assign({}, filterArgs, { 'page': 1 });
            setActivePage(1);
        } else if ('free_pro' === type) {
            var freePro_type = ''
            if (e.target.checked) {
                freePro_type = e.target.value;
            }

            setFreeProCheck(freePro_type);
            var filter_data = Object.assign({}, filterArgs, { 'free_pro': freePro_type, 'page': 1 })
            setActivePage(1);
        }
        filter_data = Object.assign({}, filter_data, { 'search': searchQuery });
        setFilterArgs(filter_data)
        setsearchValue(searchQuery);

        const queryString = new URLSearchParams(URL_data(filter_data)).toString();
        navigation(`/widget-browse?${queryString}`);
    }

    /** category check and uncheck event */
    const Catergory_check = (id) => {

        if (categoryCheck.includes(id)) {
            return true;
        } else {
            false;
        }
    }

    /** brows filter function */
    const BrowseFilter = async () => {

        const WidgetListdata = async (browse_data) => {
            let array = [];

            const data = props?.wdkit_meta?.widget_list ? props.wdkit_meta.widget_list : [];
            data.map(async (data) => {
                if (data?.type == 'plugin' || data?.type == 'done') {

                    let index = browse_data?.data?.widgets && browse_data?.data?.widgets.findIndex((id) => id.w_unique == data.w_unique);
                    if (index > -1) {
                        array.push(data.w_unique);
                    }
                }
            })
            setexistingwidget(array);
        }

        if (selectBuilder) {
            var api_data = Object.assign({}, filterArgs, { 'buildertype': JSON.stringify([selectBuilder]) });
        } else {
            var api_data = Object.assign({}, filterArgs, { 'buildertype': JSON.stringify(checkWidgetActivation(BuilderArray)) });
        }

        if (userData?.widgetbuilder?.length > 0) {

            if (controller) {
                controller.abort();
            }

            controller = new AbortController();

            let form = new FormData();
            form.append('action', 'wdkit_widget_ajax');
            form.append('kit_nonce', wdkitData.kit_nonce);

            Object.entries(api_data).forEach(([key, val]) => {
                form.append(key, val);
            });

            await axios.post(ajaxurl, form, { signal: controller.signal }).then(async (result) => {
                if (result?.data?.data?.widgets) {
                    setBrowseData(result?.data);

                    settotalpage(Math.ceil(result?.data?.data?.widgetscount / perPage));
                    await WidgetListdata(result?.data);
                }
                setskeleton(false)
                setcard_loading(false)
            })
        }

    }

    /** get builder name usign id */
    const Buidler_name = (id) => {
        if (userData?.widgetbuilder) {
            let dataBase = userData?.widgetbuilder;
            let index = dataBase.findIndex((data) => data.w_id == id);
            if (index > -1) {
                return dataBase[index].builder_name.toLowerCase();
            }
        }
    }

    /** acordian function of filter */
    const Add_accordion = (type) => {
        let data = [...accordionToggle]
        if (data.includes(type)) {
            let index = data.indexOf(type);
            data.splice(index, 1)
        } else {
            data.push(type)
        }
        setaccordionToggle(data)
    }

    /** Builder filter html part */
    const Builder_filter = () => {
        return (
            <div className='wkit-filter-builder'>
                {(builder.length > 0) && (BuilderArray.length > 1) &&
                    Object.values(builder)?.map((data, index) => {
                        if (BuilderArray.includes(data.w_id)) {
                            return (
                                <Fragment key={index}>
                                    <div className='wkit-wb-widgetType'>
                                        <div className='wkit-select-builder-list'>
                                            <input type="checkbox"
                                                id={"select_builder_" + data.builder_name}
                                                className='wkit-builder-radio'
                                                value={data.builder_name.toLowerCase()}
                                                name="selectBuilder"
                                                onChange={(e) => { handleFilterChecked(e, 'builder') }}
                                                checked={selectBuilder.includes(data.builder_name.toLowerCase())}
                                            />
                                            <label className="wkit-builder-label" htmlFor={"select_builder_" + data.builder_name}>
                                                {data.builder_icon != '' &&
                                                    <img
                                                        className={`wkit-browse-filter-builder ${selectBuilder == data.builder_name.toLowerCase() ? 'wkit-select-builder' : ''}`}
                                                        src={data.builder_icon}
                                                        draggable={false}
                                                    />
                                                }
                                            </label>
                                            <span className='wkit-builder-toolTip'>{data.builder_name}</span>
                                        </div>
                                    </div>
                                </Fragment>
                            );
                        }
                    })
                }
            </div>
        );
    }

    /** category filter html part */
    const Category_filter = () => {
        return (
            <div className="wkit-filter-category">
                <div className='wkit-filter-accordion' onClick={() => { Add_accordion('category') }}>
                    <div className="wkit-filter-heading">{__('Categories')}</div>
                    <svg width="10" height="5" style={{ transform: accordionToggle.includes('category') ? "rotate(180deg)" : "" }} viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.21338 0.637695L4.93579 4.34956L8.6582 0.637695" stroke="#9C9CD1" strokeWidth="1.11356" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {category && accordionToggle.includes('category') &&
                    category.map((data, index) => {
                        return (
                            <Fragment key={index}>
                                <div className='wkit-accordion-content' key={index}>
                                    <div className='wkit-plugin-wrap'>
                                        <label htmlFor={"category_" + data.term_id} className='wkit-plugin-name'>
                                            <input type="checkbox" value={Number(data.term_id)} className='wkit-check-box wkit-styled-checkbox' id={"category_" + data.term_id} name={"selectPlugin"} onChange={(e) => handleFilterChecked(e, 'category')} checked={Catergory_check(data.term_id)} />
                                            <span className='wkit-widget-category-select'>{data.term_name}</span>
                                        </label>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
        );
    }

    /**
     * Free pro filter html part
     * 
     * @since 1.0.0
     * @version 1.0.6
     * 
    */
    const FreeProFilter = (e) => {
        return (
            <Fragment>
                <div className='wkit-filter-accordion' onClick={() => Add_accordion('free_pro')}>
                    <div className="wkit-filter-heading">{__('Free / Pro')}</div>
                    <svg width="10" height="5" style={{ transform: accordionToggle.includes('free_pro') ? "rotate(180deg)" : "" }} viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.21338 0.637695L4.93579 4.34956L8.6582 0.637695" stroke="#9C9CD1" strokeWidth="1.11356" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {accordionToggle?.includes('free_pro') &&
                    <div className='wkit-freePro-wrap wkit-accordion-content'>
                        <label htmlFor='wkit-free-btn-label' className='wkit-select-freePro-type'>
                            <input
                                type="checkbox"
                                className='wkit-check-box wkit-freePro-radio-inp'
                                id='wkit-free-btn-label'
                                value={'free'}
                                onChange={(e) => { handleFilterChecked(e, 'free_pro') }}
                                checked={filterArgs.free_pro == 'free' ? true : false}
                            />
                            <span className='wkit-freePro-label'>{__('Free')}</span>
                        </label>
                        <label htmlFor='wkit-pro-btn-label' className='wkit-select-freePro-type'>
                            <input
                                type="checkbox"
                                className='wkit-check-box wkit-freePro-radio-inp'
                                id='wkit-pro-btn-label'
                                value={'pro'}
                                onChange={(e) => { handleFilterChecked(e, 'free_pro') }}
                                checked={filterArgs.free_pro == 'pro' ? true : false}
                            />
                            <span className='wkit-freePro-label'>{__('Pro')}</span>
                        </label>
                    </div>
                }
            </Fragment>
        );
    }

    /** filter panel */
    const Filter_panel = () => {
        if (filterToggle) {
            return (
                <div className="wkit-browse-widget-inner-column">
                    <div className='wkit-expand-filter'>
                        <div className="wkit-left-main-title">{__('Filters')}</div>
                        <div style={{ cursor: 'pointer' }} onClick={() => { setFilterToggle(!filterToggle) }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.64182 7.47781L6.76141 4.58998L9.64924 1.70215C9.93877 1.41262 9.93877 0.944928 9.64924 0.655403C9.35972 0.365878 8.89202 0.365878 8.6025 0.655403L5.195 4.06289C4.90548 4.35242 4.90548 4.82011 5.195 5.10964L8.6025 8.51713C8.89202 8.80666 9.35972 8.80666 9.64924 8.51713C9.93134 8.23503 9.93134 7.75991 9.64182 7.47781ZM1.69843 0.135742C2.10673 0.135742 2.4408 0.46981 2.4408 0.878115V8.30184C2.4408 8.71015 2.10673 9.04422 1.69843 9.04422C1.29012 9.04422 0.956055 8.71015 0.956055 8.30184V0.878115C0.956055 0.46981 1.29012 0.135742 1.69843 0.135742Z" fill="#19191B" /></svg>
                        </div>
                    </div>
                    <div className='wkit-wb-filterTitle'>{__('Search')}</div>
                    <div className='wkit-search-filter'>
                        {SearchFilter()}
                    </div>
                    {BuilderArray.length > 1 &&
                        <div className='wkit-wb-filterTitle'>{__('Page Builder')}</div>
                    }
                    {wdkitData.use_editor == 'wdkit' &&
                        <div className='wkit-filter-wrap-panel wkit-mt-15 wkit-justify-left'>
                            {Builder_filter()}
                            <hr style={{ width: "100%" }} />
                            {FreeProFilter()}
                            <hr style={{ width: "100%" }} />
                            {Category_filter()}
                        </div>
                    }
                </div>
            );
        } else {
            return (
                <div className='filter-abosulte' onClick={() => { setFilterToggle(!filterToggle) }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.724998 7.9175L3.635 5L0.7175 2.0825C0.425 1.79 0.425 1.3175 0.7175 1.025C1.01 0.7325 1.4825 0.7325 1.775 1.025L5.2175 4.4675C5.51 4.76 5.51 5.2325 5.2175 5.525L1.775 8.9675C1.4825 9.26 1.01 9.26 0.7175 8.9675C0.4325 8.6825 0.432499 8.2025 0.724998 7.9175ZM8.75 0.5C8.3375 0.5 8 0.8375 8 1.25V8.75C8 9.1625 8.3375 9.5 8.75 9.5C9.1625 9.5 9.5 9.1625 9.5 8.75V1.25C9.5 0.8375 9.1625 0.5 8.75 0.5Z" fill="white" />
                    </svg>
                    {__('Filters')}
                </div>
            );
        }
    }

    /**
     * Filter array
     * 
     * @since 1.0.0
     * @version 1.0.6
     * 
    */
    const FilterArray = () => {
        const Remove_filter = (id, type) => {
            let url_arr;
            if (type == 'builder') {
                setselectBuilder('')
                url_arr = Object.assign({}, filterArgs, { 'buildertype': '' });
                setFilterArgs(url_arr)
            } else if (type == 'category') {
                let array = [...categoryCheck];
                array = array.filter((e) => e !== Number(id))
                setcategoryCheck(array)
                url_arr = Object.assign({}, filterArgs, { 'category': JSON.stringify(array) })
                setFilterArgs(url_arr)
            } else if (type == 'free_pro') {
                setFreeProCheck('')
                url_arr = Object.assign({}, filterArgs, { 'free_pro': '' })
                setFilterArgs(url_arr)
            } else if (type == 'search') {
                setsearchValue('')
                setSearchQuery('')
                url_arr = Object.assign({}, filterArgs, { 'search': '' })
                setFilterArgs(url_arr)
            }

            const queryString = new URLSearchParams(URL_data(url_arr)).toString();
            navigation(`/widget-browse?${queryString}`);
        }

        const ResetFilter = () => {
            setcategoryCheck([]);
            setFreeProCheck('');
            setselectBuilder('');
            setsearchValue('');
            setSearchQuery('');
            setFilterArgs(Object.assign({}, filterArgs, { 'free_pro': '', 'category': JSON.stringify([]), 'buildertype': '', 'search': '', 'perpage': perPage, 'page': 1 }))
            navigation(`/widget-browse`);
        }

        return (
            <div className='wkit-free-dropdown-mixed'>
                {/* Applied Filter*/}
                {(freeProCheck != '' || categoryCheck.length > 0 || selectBuilder != '' || searchValue != '') &&
                    <div className={"wkit-browse-applied-filter"}>
                        <Fragment>
                            <label className={"applied-filter-text"}>{__('Applied Filter :')}</label>
                            {selectBuilder != '' &&
                                <div className={"wkit-applied-list"}>
                                    <label>
                                        <span>{selectBuilder}</span>
                                    </label>
                                    <button onClick={(e) => Remove_filter(e, 'builder')}>
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>                                    </button>
                                </div>
                            }
                            {searchValue != '' &&
                                <div className={"wkit-applied-list"}>
                                    <label>
                                        <span>{searchValue}</span>
                                    </label>
                                    <button onClick={(e) => Remove_filter(e, 'search')}>
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                    </button>
                                </div>
                            }
                            {freeProCheck != '' &&
                                <div className={"wkit-applied-list"}>
                                    <label>
                                        <span>{freeProCheck}</span>
                                    </label>
                                    <button onClick={(e) => Remove_filter(e, 'free_pro')}>
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>                                    </button>
                                </div>
                            }
                            {categoryCheck.length > 0 &&
                                Object.values(category)?.map((data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {categoryCheck.includes(data.term_id) &&
                                                <div className={"wkit-applied-list"}>
                                                    <label>
                                                        <span>{data.term_name}</span>
                                                    </label>
                                                    <button onClick={() => { Remove_filter(data.term_id, 'category') }}>
                                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                                    </button>
                                                </div>
                                            }
                                        </Fragment>)
                                })
                            }
                            <button className={"wdkit-reset-all-filters wkit-btn-class"} onClick={() => { ResetFilter() }}>
                                Clear All
                            </button>
                        </Fragment>
                    </div>
                }
            </div>
        );
    }

    return (
        <div className={`wkit-browse-widget-wrap ${skeleton ? 'wkit-skeleton' : ''} ${card_loading ? 'wkit-widget-skeleton' : ''}`}>
            <Wkit_Filter_widget
                filter_type={'widget'}
                filter_data={filterArgs}
                setfilter_data={(new_data) => { setFilterArgs(new_data) }}
                setcategory_check={(cat_data) => { setcategoryCheck(cat_data) }}
                setselect_builder={(builder_data) => { setselectBuilder(builder_data) }}
                setfree_pro={(freePro_type) => { setFreeProCheck(freePro_type) }}
                setsearch_check={(search_val) => { setsearchValue(search_val) }}
                category_list={category}
                builder_list={builder}
                BuilderArray={BuilderArray}
            />
            <div className="wkit-browse-widget-main">
                {skeleton == false && browseData?.data?.widgets &&
                    <>
                        <div className={"wkit-browse-widget-column wkit-browse-widget-mobile-hide " + (!filterToggle ? "wkit-browse-column-collapse" : '')}>
                            {Filter_panel()}
                        </div>
                        <div className='filter-abosulte wkit-browse-mobile-filter' onClick={() => { Mobile_filter() }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.724998 7.9175L3.635 5L0.7175 2.0825C0.425 1.79 0.425 1.3175 0.7175 1.025C1.01 0.7325 1.4825 0.7325 1.775 1.025L5.2175 4.4675C5.51 4.76 5.51 5.2325 5.2175 5.525L1.775 8.9675C1.4825 9.26 1.01 9.26 0.7175 8.9675C0.4325 8.6825 0.432499 8.2025 0.724998 7.9175ZM8.75 0.5C8.3375 0.5 8 0.8375 8 1.25V8.75C8 9.1625 8.3375 9.5 8.75 9.5C9.1625 9.5 9.5 9.1625 9.5 8.75V1.25C9.5 0.8375 9.1625 0.5 8.75 0.5Z" fill="white" />
                            </svg>
                            {__('Filters')}
                        </div>
                        <div className='wkit-browse-widget-right-column'>
                            {FilterArray()}
                            {card_loading == false && browseData?.data?.widgets.length > 0 &&
                                <div className='wkit-browse-widget-right-column'>
                                    <div className={!filterToggle ? "wkit-widget-browse-filter-close wkit-skeleton-row" : 'wkit-skeleton-row'}>
                                        {browseData?.data?.widgets.map((data, index) => {
                                            if (data.is_activated == "active") {
                                                return (
                                                    <Fragment key={index}>
                                                        <Widget_card
                                                            widgetData={data}
                                                            existingwidget={existingwidget}
                                                            setexistingwidget={(new_array) => { setexistingwidget(new_array) }}
                                                            widgetbuilder={props.wdkit_meta.widgetbuilder}
                                                            index={index}
                                                            userinfo={props?.wdkit_meta?.userinfo}
                                                            credits={props?.wdkit_meta?.credits}
                                                            type={'widget-browse'}
                                                            wdkit_set_meta={(data) => { props.wdkit_set_meta(data) }}
                                                            wdkit_meta={props?.wdkit_meta}
                                                            wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                                        />
                                                    </Fragment>
                                                );
                                            }
                                        })}
                                    </div>
                                    <div className='wkit-wb-paginatelist'>
                                        {totalpage > 1 &&
                                            <div className='wkit-pagination-main'>
                                                <ReactPaginate
                                                    breakLabel={"..."}
                                                    nextLabel={<svg xmlns="http://www.w3.org/2000/svg" width="7" height="11" viewBox="0 0 7 11" fill="none">
                                                        <path d="M0.412598 9.52417L4.48371 5.44417L0.412598 1.36417L1.66593 0.11084L6.99926 5.44417L1.66593 10.7775L0.412598 9.52417Z" fill="#8991A4" />
                                                    </svg>}
                                                    pageRangeDisplayed={2}
                                                    pageCount={totalpage}
                                                    marginPagesDisplayed={1}
                                                    previousLabel={<svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none">
                                                        <path d="M7.47754 1.36352L3.40643 5.44352L7.47754 9.52352L6.22421 10.7769L0.890873 5.44352L6.22421 0.110189L7.47754 1.36352Z" fill="#8991A4" />
                                                    </svg>}
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
                                                            setActivePage(clickEvent.nextSelectedPage + 1)
                                                            filterArgs['page'] = clickEvent.nextSelectedPage + 1;
                                                        }
                                                    }}
                                                    forcePage={activePage - 1}
                                                    onPageActive={() => { }}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                            {card_loading == false && browseData?.data?.widgets.length <= 0 &&
                                <div className='wkit-post-not-found'>
                                    <Wkit_availble_not page={'widget'} link={wdkitData.WDKIT_DOC_URL + 'documents/manage-versions-of-a-widget/'} />
                                </div>
                            }
                            {card_loading == true &&
                                <Widget_browse_skeleton cards={true} />
                            }
                        </div>
                    </>
                }
                {skeleton === true &&
                    <Widget_browse_skeleton filter={true} cards={true} filterArgs={filterArgs} />
                }
            </div>
        </div>
    );
}

export default Widget_brows;