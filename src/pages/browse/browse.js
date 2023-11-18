import { useState, useEffect, useMemo } from 'react';
import '../browse/browse.scss'
const { Fragment } = wp.element;
import { DebounceInput } from 'react-debounce-input'
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Wkit_template_Skeleton, Wkit_browse_template_Skeleton, Wkit_availble_not } from '../../helper/helper-function';
import { Wkit_Filter_Template } from './mobile-filter-template';

const { __ } = wp.i18n;
const {
    Template_loop,
    Plugin_missing,
    Success_import_template,
    wkit_getCategoryList,
    form_data,
    wkit_get_user_login,
    wkitGetBuilder,
    checkBuilder,
} = wp.wkit_Helper;

const Browse = (props) => {

    const history = useNavigate();
    var img_path = wdkitData.WDKIT_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [browseData, setBrowseData] = useState("loading");
    const [categoryData, setCategoryData] = useState([]);
    const [filterToggle, setFilterToggle] = useState(true);
    const [accordionToggle, setAccordionToggle] = useState(['plugins', 'category-0', 'tags']);
    const [pluginCheck, setPluginCheck] = useState([]);
    const [tagCheck, setTagCheck] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryCheck, setCategoryCheck] = useState([]);
    const [freeProCheck, setFreeProCheck] = useState('all');
    const [selectBuilder, setSelectBuilder] = useState('all');
    const [downTempId, setDownloadTempId] = useState('');
    const [successImport, setSuccessImport] = useState(false);
    const [customMetaImport, setCustomMetaImport] = useState(false);
    const [searchTag, setSearchTag] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [filterArgs, setFilterArgs] = useState({ 'type': 'browse_page', 'builder': '', 'buildertype': window.wdkit_editor, 'perpage': perPage, 'page': activePage });
    const [searchTagList, setSearchTagList] = useState({})

    /** Set browse in path of url if not */
    useEffect(() => {
        if (window.location && window.location.hash != '#/browse') {
            window.location.hash = '#/browse';
        }
    }, [])

    useEffect(() => {
        if (document.querySelector('.wkit-filter-humber-menu')) {
            let filter_icon = document.querySelector('.wkit-filter-humber-menu');
            filter_icon.addEventListener('click', (e) => {
                e.preventDefault();
                if (document.querySelector(".wkit-mobile-filter-main")) {
                    document.querySelector(".wkit-mobile-filter-main").classList.add("wkit-filter-menu-show");
                }
            })
        }
    })

    const location = useLocation();
    var yourStateData = location.state;

    /** main filter function for templates */
    const BrowseFilter = async () => {
        setIsLoading(true)

        var res = await form_data(filterArgs).then(result => { setBrowseData(result); return result; });
        if (categoryData == '' && res?.category) {
            setCategoryData(wkit_getCategoryList(res?.category))
            if (Object.keys(searchTagList).length === 0) {
                setSearchTagList(res.tags)
            }
        }
        setIsLoading(false)
    }

    useMemo(() => {
        if (yourStateData) {
            filterArgs['page'] = (yourStateData);
            setFilterArgs({ ...filterArgs })
            setActivePage(yourStateData);
            BrowseFilter();
        }
    }, [yourStateData]);

    /** call BrowseFilter function on change of filter panel  */
    useMemo(() => {
        if (yourStateData == null) {
            BrowseFilter()
        }
    }, [filterArgs]);

    /** search tag from Tag-list for filter  */
    const browseTagList = (val) => {
        setSearchTag(val);
        if (val) {
            setSearchTagList(browseData?.tags?.filter(
                data => data.tag_name.toLowerCase().includes(val.toLowerCase())
            ))
        } else {
            setSearchTagList(browseData?.tags)
        }
    }

    /** for toggel event of filter sections */
    const AccordionFun = (type) => {
        if (accordionToggle?.includes(type)) {
            var arr = accordionToggle.filter(item => item !== type)
            setAccordionToggle(arr)
        } else {
            setAccordionToggle([...accordionToggle, type])
        }
    }

    /** filter function for set new filter value in filterArgs */
    const handleFilterChecked = async (e, filter = 'plugins') => {
        const { value, checked } = e.target;
        if (filter == 'builder') {
            if (checked) {
                let newdata = Object.assign({}, filterArgs, { 'builder': value }, { 'page': 1 });
                setActivePage(1);
                setFilterArgs(newdata)
            } else {
                let newdata = Object.assign({}, filterArgs, { 'builder': '' }, { 'page': 1 })
                setActivePage(1);
                setFilterArgs(newdata)
            }
        }
        if (filter == 'plugins') {
            if (checked) {
                let pluginList = [...pluginCheck, Number(value)]
                setPluginCheck(pluginList);
                setFilterArgs(Object.assign({}, filterArgs, { 'plugin': JSON.stringify(pluginList) }, { 'page': 1 }))
                setActivePage(1);
            } else {
                let pluginList = pluginCheck?.filter((e) => e !== Number(value));
                setPluginCheck(pluginList)
                setActivePage(1);
                setFilterArgs(Object.assign({}, filterArgs, { 'plugin': JSON.stringify(pluginList) }, { 'page': 1 }))
            }
        }
        if (filter == 'tags') {
            if (checked) {
                let tagList = [...tagCheck, Number(value)];
                await setTagCheck(tagList)
                await setFilterArgs(Object.assign({}, filterArgs, { 'tag': JSON.stringify(tagList) }, { 'page': 1 }))
                setActivePage(1);
            } else {
                let tagList = tagCheck.filter((e) => e !== Number(value));
                await setTagCheck(tagList)
                await setFilterArgs(Object.assign({}, filterArgs, { 'tag': JSON.stringify(tagList) }, { 'page': 1 }))
                setActivePage(1);
            }
        }
        if (filter == 'category') {
            if (checked) {
                let catList = [...categoryCheck, Number(value)];
                setCategoryCheck(catList)
                setFilterArgs(Object.assign({}, filterArgs, { 'category': JSON.stringify(catList) }, { 'page': 1 }))
                setActivePage(1);
            } else {
                let catList = categoryCheck?.filter((e) => e !== Number(value))
                setCategoryCheck(catList)
                setFilterArgs(Object.assign({}, filterArgs, { 'category': JSON.stringify(catList) }, { 'page': 1 }))
                setActivePage(1);
            }
        }
        if (filter == 'search') {
            let newdata = Object.assign({}, filterArgs, { 'search': searchQuery }, { 'page': 1 });
            setActivePage(1);
            setFilterArgs(newdata)
        }
    }

    /** Arrow up icon function */
    const arrowUp = () => {
        return (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L5.72241 7.71186L9.44482 4" stroke="#9C9CD1" strokeWidth="1.11356" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }

    /** Arrow down icon function */
    const arrowDown = () => {
        return (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.44482 7.71191L5.72241 4.00005L2 7.71191" stroke="#9C9CD1" strokeWidth="1.11356" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }

    /** for close download template popup */
    const Wkit_popup_remove = (e) => {
        if (e) {
            e.currentTarget.closest('.wkit-model-transp.wkit-popup-show').innerHTML = '';
            setDownloadTempId('')
        }
    }

    const FilterPanel = () => {
        if (filterToggle) {
            return (
                <div className="wkit-browse-inner-column">
                    <div className='wkit-expand-filter'>
                        <div className="wkit-left-main-title">{__('Filters')}</div>
                        <div style={{ cursor: 'pointer' }} onClick={() => { setFilterToggle(!filterToggle) }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.64182 7.47781L6.76141 4.58998L9.64924 1.70215C9.93877 1.41262 9.93877 0.944928 9.64924 0.655403C9.35972 0.365878 8.89202 0.365878 8.6025 0.655403L5.195 4.06289C4.90548 4.35242 4.90548 4.82011 5.195 5.10964L8.6025 8.51713C8.89202 8.80666 9.35972 8.80666 9.64924 8.51713C9.93134 8.23503 9.93134 7.75991 9.64182 7.47781ZM1.69843 0.135742C2.10673 0.135742 2.4408 0.46981 2.4408 0.878115V8.30184C2.4408 8.71015 2.10673 9.04422 1.69843 9.04422C1.29012 9.04422 0.956055 8.71015 0.956055 8.30184V0.878115C0.956055 0.46981 1.29012 0.135742 1.69843 0.135742Z" fill="#19191B" />
                            </svg>
                        </div>
                    </div>

                    {SearchFilter()}
                    {BuilderFilter()}
                    <div className="filter-wrapper">
                        {PluginFilter()}
                        <hr />
                        {CategoryFilter()}
                        {TagFilter()}
                    </div>
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

    /**search filter html part */
    const SearchFilter = () => {
        return (
            <Fragment>
                <div className='wkit-wb-filterTitle'>{__('Search')}</div>
                <div className='wkit-search-filter'>
                    <div className='wkit-browse-search-inner'>
                        <input
                            className='wkit-browse-search'
                            placeholder={__('Search Templates...')}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value) }}
                        />
                        <span className="wkit_search_button" onClick={(e) => { handleFilterChecked(e, 'search') }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M14.7 15.75L9.975 11.025C9.6 11.325 9.16875 11.5625 8.68125 11.7375C8.19375 11.9125 7.675 12 7.125 12C5.7625 12 4.6095 11.528 3.666 10.584C2.7225 9.64 2.2505 8.487 2.25 7.125C2.25 5.7625 2.722 4.6095 3.666 3.666C4.61 2.7225 5.763 2.2505 7.125 2.25C8.4875 2.25 9.6405 2.722 10.584 3.666C11.5275 4.61 11.9995 5.763 12 7.125C12 7.675 11.9125 8.19375 11.7375 8.68125C11.5625 9.16875 11.325 9.6 11.025 9.975L15.75 14.7L14.7 15.75ZM7.125 10.5C8.0625 10.5 8.8595 10.1718 9.516 9.51525C10.1725 8.85875 10.5005 8.062 10.5 7.125C10.5 6.1875 10.1718 5.3905 9.51525 4.734C8.85875 4.0775 8.062 3.7495 7.125 3.75C6.1875 3.75 5.3905 4.07825 4.734 4.73475C4.0775 5.39125 3.7495 6.188 3.75 7.125C3.75 8.0625 4.07825 8.8595 4.73475 9.516C5.39125 10.1725 6.188 10.5005 7.125 10.5Z" fill="white" />
                            </svg>
                        </span>
                    </div>
                </div>
            </Fragment>
        )
    }

    /** builder filter html part */
    const BuilderFilter = (e) => {
        if (wdkitData.use_editor != 'wdkit') {
            return false;
        }
        return (
            <Fragment>
                <div className='wkit-wb-filterTitle'>{__('Page Builder')}</div>
                <div className='wkit-choose-builder-wrap wkit-mt-15 wkit-justify-left'>
                    {(browseData?.builder.length > 0) &&
                        Object.values(browseData?.builder)?.map((data, index) => {
                            return (
                                <div className='wkit-wb-widgetType' key={index}>
                                    <div className='wkit-select-builder-list'>
                                        <input
                                            type="checkbox"
                                            className='wkit-builder-radio'
                                            id={"select_builder_" + data.original_slug}
                                            value={data.p_id}
                                            onChange={(e) => { handleFilterChecked(e, 'builder') }}
                                            checked={filterArgs.builder == data.p_id ? true : false}
                                        />
                                        <label className="wkit-builder-label" htmlFor={"select_builder_" + data.original_slug}>
                                            {data.plugin_icon != '' &&
                                                <img className={`wkit-browse-filter-builder ${filterArgs.builder == data.p_id ? 'wkit-select-builder' : ''}`} src={data.plugin_icon} />
                                            }
                                        </label>
                                        <span>{data.original_slug}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Fragment>
        );
    }

    /** plugin filter html part */
    const PluginFilter = () => {
        return (
            <Fragment>
                <div className='wkit-filter-accordion' onClick={() => AccordionFun('plugins')}>
                    <div className="wkit-filter-heading">{__('Plugins')}</div>
                    <div className="wkit-arrow-down">
                        {(accordionToggle?.includes('plugins')) ? arrowDown() : arrowUp()}
                    </div>
                </div>
                {accordionToggle?.includes('plugins') &&
                    <div className='wkit-accordion-content'>
                        <div className='wkit-plugin-wrap'>
                            {Object.values(browseData?.plugin)?.map((data, index) => {
                                if (window.wdkit_editor != 'wdkit') {
                                    if (window.wdkit_editor == 'elementor') {
                                        var builder_id = '1001';
                                    } else if (window.wdkit_editor == 'gutenberg') {
                                        var builder_id = '1002';
                                    } else {
                                        var builder_id = '0';
                                    }

                                    if (builder_id == data.plugin_builder || data.plugin_builder == 0) {
                                        return (
                                            <div className='wkit-plugin-name' key={index}>
                                                <input type="checkbox" value={data.p_id} className='wkit-check-box wkit-styled-checkbox' id={"plugin_" + data.p_id} name={"selectPlugin"} onChange={(e) => handleFilterChecked(e, 'plugins')} checked={pluginCheck.includes(Number(data.p_id)) ? true : false} />
                                                <label htmlFor={"plugin_" + data.p_id}>
                                                    <img src={data.plugin_icon ? data.plugin_icon : wdkitData.WDKIT_URL + "assets/images/placeholder.jpg"} alt="tpae-logo" />
                                                    <span>{data.plugin_name}</span>
                                                </label>
                                            </div>
                                        )
                                    }
                                } else {
                                    return (
                                        <div className='wkit-plugin-name' key={index}>
                                            <input type="checkbox" value={data.p_id} className='wkit-check-box wkit-styled-checkbox' id={"plugin_" + data.p_id} name={"selectPlugin"} onChange={(e) => handleFilterChecked(e, 'plugins')} checked={pluginCheck.includes(Number(data.p_id)) ? 'checked' : ''} />
                                            <label htmlFor={"plugin_" + data.p_id}>
                                                <img src={data.plugin_icon ? data.plugin_icon : wdkitData.WDKIT_URL + "assets/images/placeholder.jpg"} alt="tpae-logo" />
                                                <span>{data.plugin_name}</span>
                                            </label>
                                        </div>
                                    )
                                }
                            })
                            }
                        </div>
                    </div>
                }
            </Fragment>
        );
    }

    /** Category filter html part */
    const CategoryFilter = () => {
        if (Object.values(categoryData).length <= 0) {
            return false;
        }

        return (
            <Fragment>
                {Object.entries(categoryData)?.map(([key, val], index) => {
                    return (
                        <Fragment key={index} >
                            <div className='wkit-filter-accordion' onClick={() => AccordionFun('category-' + index)}>
                                <div className="wkit-filter-heading">{key}</div>
                                <div className="wkit-arrow-down">
                                    {(accordionToggle?.includes('category-' + index)) ? arrowDown() : arrowUp()}
                                </div>
                            </div>
                            {(accordionToggle?.includes('category-' + index)) &&
                                <div className='wkit-accordion-content'>
                                    <div className='wkit-plugin-wrap'>
                                        {Object.entries(val)?.map(([keyChild, valChild], index) => {
                                            return (
                                                <div className='wkit-plugin-name' key={index}>
                                                    <input type="checkbox" value={keyChild} className='wkit-check-box wkit-styled-checkbox' id={"category_" + keyChild} name={"selectPlugin"} onChange={(e) => handleFilterChecked(e, 'category')} checked={categoryCheck.includes(Number(keyChild)) ? 'checked' : ''} />
                                                    <label htmlFor={"category_" + keyChild}>{valChild.term_name}</label>
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                            }
                            <hr />
                        </Fragment>
                    );
                })}
            </Fragment>
        );
    }

    /** Tag filter html part */
    const TagFilter = () => {
        return (
            <Fragment>
                <div className='wkit-filter-accordion' onClick={() => AccordionFun('tags')}>
                    <div className="wkit-filter-heading">{__('Tags')}</div>
                    <div className="wkit-arrow-down">
                        {(accordionToggle?.includes('tags')) ? arrowDown() : arrowUp()}
                    </div>
                </div>
                {(accordionToggle?.includes('tags')) &&
                    <div className='wkit-accordion-content'>
                        <div className='wkit-browse-search-inner'>
                            <DebounceInput
                                className='wkit-browse-search'
                                placeholder={__('Search Tags...')}
                                name="wkit-search"
                                type="text"
                                minLength={0}
                                debounceTimeout={500}
                                onChange={(e) => { browseTagList(e.target.value) }}
                                value={searchTag}
                            />
                            <button type="submit" className="wkit_search_button">
                                <img className="wkit-search-icon" src={img_path + "assets/images/svg/east.svg"} alt="search-img" />
                            </button>
                        </div>
                        <div className='wkit-browse-tag'>
                            {Object.values(searchTagList)?.map((data, index) => {
                                if (index < 5) {
                                    return (
                                        <div className='wkit-tag-filter-list' key={index}>
                                            <input type="checkbox" value={data.tag_id} className='wkit-tag-checkbox' id={"tag_" + data.tag_id} name={"selectTags"} onChange={(e) => handleFilterChecked(e, 'tags')} checked={tagCheck.includes(Number(data.tag_id)) ? 'checked' : ''} />
                                            <label className="wkit-browse-tag-name" htmlFor={"tag_" + data.tag_id}>{data.tag_name}</label>
                                        </div>
                                    )
                                }
                            })
                            }
                        </div>
                    </div>
                }
            </Fragment>
        );
    }

    const TemplateList = () => {
        return (
            <Fragment>
                {(isLoading == false && browseData?.template.length > 0) &&
                    <div className="wdesign-kit-main">
                        {Object.values(browseData.template).map((data, index) => {
                            return (
                                <Fragment key={index}>
                                    {(data.is_activated == 'active' && wdkitData.use_editor == 'wdkit' && checkBuilder(data.post_builder, selectBuilder, browseData?.builder) || wdkitData.use_editor != 'wdkit') &&
                                        <Template_loop
                                            data={data}
                                            builder={browseData.builder}
                                            currentPage={activePage}
                                            handlerTempID={(val) => {
                                                if (wdkitData.use_editor == 'wdkit') {
                                                    wdkitBuilderType(val, data.wp_post_type, data.type, Number(data.post_builder), browseData.builder)
                                                } else {
                                                    setDownloadTempId(val)
                                                }
                                            }}
                                            type={data.type == 'websitekit' ? data.type + '-view' : data.type}
                                            filter={'browse'}
                                            width={'24%'}
                                            wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                        />
                                    }
                                </Fragment>
                            );
                        })}
                    </div>
                }
            </Fragment>
        );
    }

    const wdkitBuilderType = (id, post_type, type, temp_builder, builderList) => {
        if (id && post_type && temp_builder) {
            let download = [{ 'id': id, 'type': post_type }]
            if (builderList && temp_builder) {
                temp_builder = wkitGetBuilder(temp_builder, builderList);
            } else {
                temp_builder = ''
            }
            if (type == 'section') {
                setDownloadTempId({ 'pages': [], 'sections': download, 'builder': temp_builder })
            } else {
                setDownloadTempId({ 'pages': download, 'sections': [], 'builder': temp_builder })
            }
        } else {
            setDownloadTempId(id)
        }
    }

    const Pagination = () => {
        if (browseData?.template.length > 0 && browseData?.totalpage > 1) {
            return (
                <div className='wkit-pagination-main'>
                    <ReactPaginate
                        breakLabel={"..."}
                        nextLabel={">"}
                        pageRangeDisplayed={2}
                        pageCount={browseData.totalpage}
                        marginPagesDisplayed={1}
                        previousLabel={"<"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"wkit-pagination-item"}
                        previousClassName={"page-item kit-next-prev"}
                        previousLinkClassName={"wkit-pagination-item"}
                        nextClassName={"page-item kit-next-prev"}
                        nextLinkClassName={"wkit-pagination-item"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        containerClassName={"wkit-pagination"}
                        activeClassName={"active"}
                        onClick={(clickEvent) => {
                            window.scrollTo(0, 0);
                            if (clickEvent.nextSelectedPage != undefined) {
                                filterArgs['page'] = (clickEvent.nextSelectedPage + 1);
                                setFilterArgs({ ...filterArgs })
                                setActivePage(clickEvent.nextSelectedPage + 1)
                            }
                        }}
                        forcePage={activePage - 1}
                        onPageActive={() => { }}
                    />
                    {/* <div className='wkit-action'>
                        <select value={perPage} onChange={(e) => { setPerPage(e.target.value); setActivePage(1); filterArgs['perpage'] = e.target.value; filterArgs['page'] = 1; setFilterArgs({ ...filterArgs }); }} className='wkit-select wkit-pagination-select'>
                            <option value={10}>{10}</option>
                            <option value={15}>{15}</option>
                            <option value={20}>{20}</option>
                        </select>
                    </div> */}
                </div>
            );
        }
    }

    const FilterArray = () => {
        const Remove_filter = (id, type) => {
            if (type == 'plugin') {
                let array = [...pluginCheck];
                array = array.filter((e) => e !== Number(id))
                setPluginCheck(array)
                setFilterArgs(Object.assign({}, filterArgs, { 'plugin': JSON.stringify(array) }))
            } else if (type == 'category') {
                let array = [...categoryCheck];
                array = array.filter((e) => e !== Number(id))
                setCategoryCheck(array)
                setFilterArgs(Object.assign({}, filterArgs, { 'category': JSON.stringify(array) }))
            } else if (type == 'tag') {
                let array = [...tagCheck];
                array = array.filter((e) => e !== Number(id))
                setTagCheck(array)
                setFilterArgs(Object.assign({}, filterArgs, { 'tag': JSON.stringify(array) }))
            }
        }

        return (
            <div className='wkit-free-dropdown-mixed'>
                {/* Applied Filter*/}
                {(freeProCheck != 'all' || pluginCheck.length > 0 || categoryCheck.length > 0 || tagCheck.length > 0) &&
                    <div className={"wkit-browse-applied-filter"}>
                        <Fragment>
                            <label className={"applied-filter-text"}>{__('Applied Filter :')}</label>
                            {freeProCheck != 'all' &&
                                <div className={"wkit-applied-list"}>
                                    <label>
                                        <span>{freeProCheck}</span>
                                    </label>
                                    <button onClick={() => setFreeProCheck('all')}>&times;</button>
                                </div>
                            }
                            {pluginCheck.length > 0 &&
                                Object.values(browseData?.plugin)?.map((data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {pluginCheck?.includes(data.p_id) &&
                                                <div className={"wkit-applied-list"}>
                                                    <label>
                                                        <img src={data.plugin_icon ? data.plugin_icon : wdkitData.WDKIT_URL + "assets/images/placeholder.jpg"} alt="tpae-logo" />
                                                        <span>{data.plugin_name}</span>
                                                    </label>
                                                    <button onClick={() => { Remove_filter(data.p_id, 'plugin') }}>x</button>
                                                </div>
                                            }
                                        </Fragment>)
                                })
                            }
                            {categoryCheck.length > 0 &&
                                Object.values(browseData?.category)?.map((data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {categoryCheck.includes(data.term_id) &&
                                                <div className={"wkit-applied-list"}>
                                                    <label>
                                                        <span>{data.term_name}</span>
                                                    </label>
                                                    <button onClick={() => { Remove_filter(data.term_id, 'category') }}>x</button>
                                                </div>
                                            }
                                        </Fragment>)
                                })
                            }
                            {tagCheck.length > 0 &&
                                Object.values(browseData?.tags)?.map((data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {tagCheck.includes(data?.tag_id) &&
                                                <div className={"wkit-applied-list"}>
                                                    <label>
                                                        <span>{data.tag_name}</span>
                                                    </label>
                                                    <button onClick={() => { Remove_filter(data.tag_id, 'tag') }}>&times;</button>
                                                </div>
                                            }
                                        </Fragment>)
                                })
                            }
                            <button className={"wdkit-reset-all-filters"} onClick={() => { setPluginCheck([]), setTagCheck([]), setCategoryCheck([]), setFreeProCheck('all'), delete filterArgs.plugin; delete filterArgs.tag; delete filterArgs.category; delete filterArgs.free_pro; setFilterArgs(Object.assign({}, filterArgs)) }}>
                                Clear All
                            </button>
                        </Fragment>
                    </div>
                }
            </div>
        );
    }

    return (
        <div className="wkit-browse-main">
            {(browseData?.template) ?
                <Fragment>
                    <div className={"wkit-browse-column " + (!filterToggle ? "wkit-browse-column-collapse" : '')}>
                        {FilterPanel()}
                    </div>
                    <Wkit_Filter_Template
                        filter_type={'template'}
                        filter_data={filterArgs}
                        setfilter_data={(new_data) => { setFilterArgs(new_data) }}
                        setcategory_check={(cat_data) => { setCategoryCheck(cat_data) }}
                        settag_check={(cat_data) => { setTagCheck(cat_data) }}
                        setplugin_check={(plugin_data) => { setPluginCheck(plugin_data) }}
                        category_list={categoryData}
                        builder_list={browseData?.builder}
                        plugin_list={browseData?.plugin}
                        tag_list={browseData?.tags}
                    />
                    <div className="wkit-browse-right-column">
                        {FilterArray()}
                        <div className="wdkit-loop">
                            {TemplateList()}
                            {isLoading == true && <Wkit_template_Skeleton style={{ width: '100%' }} />}
                            {isLoading == false && browseData?.template.length <= 0 && <Wkit_availble_not page={'template'} />}
                            {Pagination()}
                        </div>
                    </div>
                    {downTempId &&
                        <div className={"wkit-myupload-main wkit-model-transp wkit-popup-show"} >
                            <div className={"wkit-plugin-model-content wkit-import-template"}>
                                <a className={"wkit-plugin-popup-close"} onClick={(e) => { Wkit_popup_remove(e); setSuccessImport(false), setDownloadTempId(""); }}>
                                    <span>&times;</span>
                                </a>
                                {!successImport ?
                                    <Plugin_missing
                                        template_id={downTempId}
                                        handlerSuccessImport={(val, customMeta) => { setSuccessImport(val), setCustomMetaImport(customMeta) }}
                                        type={wdkitData?.use_editor}
                                        templateData={browseData?.template}
                                        pluginData={browseData?.plugin}
                                        pageNow={'browse'}
                                        navigation={history} />
                                    :
                                    <Success_import_template
                                        template_id={downTempId}
                                        custom_meta_import={customMetaImport}
                                        template_list={browseData?.template}
                                        handlerAfterSuccessImported={() => { setSuccessImport(false), setDownloadTempId('') }}
                                        wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                    />
                                }
                            </div>
                        </div>
                    }
                </Fragment>
                :
                <Wkit_browse_template_Skeleton />
            }
        </div>

    );
}
export default Browse;