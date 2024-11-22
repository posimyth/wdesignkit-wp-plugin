import { useState, useEffect } from 'react';
import { loadingIcon } from '../../helper/helper-function';
import { DebounceInput } from 'react-debounce-input'
import { useNavigate } from 'react-router-dom';
const { Fragment } = wp.element;
const { __ } = wp.i18n;

export const Wkit_Filter_Template = (props) => {
    const [filter, setfilter] = useState(props.filterArgs);
    const [categoryCheck, setcategoryCheck] = useState([]);
    const [pluginCheck, setpluginCheck] = useState([]);
    const [tagCheck, setTagCheck] = useState([]);
    const [selectBuilder, setselectBuilder] = useState([]);
    const [searchTag, setSearchTag] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [freeProCheck, setFreeProCheck] = useState([]);
    const [PageTypeCheck, setPageTypeCheck] = useState([]);
    const [searchTagList, setSearchTagList] = useState(props?.tag_list)
    const history = useNavigate();

    /**
     * Filter function for remove unnecessary items before send in URL 
     * 
     * @data original data in Object format 
     * @version 1.0.39
     * 
    */
    const URL_data = (data) => {
        return Object.fromEntries(Object.entries(data).filter(([key, value]) => value.length > 1 && value !== "[]" && key !== 'type' && key !== 'page' && key !== 'perpage' && key !== 'buildertype'));
    }

    const handleMobileFiler = () => {
        let Search_data = props?.filter_data?.search || '';
        var newdata = Object.assign({}, props?.filter_data, { 'search': Search_data });
        const querystring = new URLSearchParams(URL_data(newdata)).toString();
        history(`/browse?${querystring}`);
    }

    useEffect(() => {
        handleMobileFiler();
        if (props?.filter_data?.builder) {
            setselectBuilder(props?.filter_data?.builder)
        } else {
            setselectBuilder('')
        }

        if (props?.filter_data?.category?.length > 0) {
            setcategoryCheck(JSON.parse(props?.filter_data?.category.replaceAll('"', '')))
        } else {
            setcategoryCheck([]);
        }

        if (props?.filter_data?.plugin) {
            setpluginCheck(JSON.parse(props?.filter_data?.plugin.replaceAll('"', '')))
        } else {
            setpluginCheck([]);
        }

        if (props?.filter_data?.tag) {
            setTagCheck(JSON.parse(props?.filter_data?.tag.replaceAll('"', '')))
        } else {
            setTagCheck([]);
        }

        if (props?.filter_data?.free_pro) {
            setFreeProCheck(props?.filter_data?.free_pro)
        } else {
            setFreeProCheck('');
        }

        if (props?.filter_data?.search) {
            setSearchQuery(props?.filter_data?.search)
        } else {
            setSearchQuery('');
        }

        if (props?.filter_data?.page_type) {
            setPageTypeCheck(JSON.parse(props?.filter_data?.page_type))
        } else {
            setPageTypeCheck([]);
        }

        setfilter(props.filter_data)
    }, [props.filter_data])

    useEffect(() => {
        if (props?.tag_list) {
            setSearchTagList(props?.tag_list);
        } else {
            setSearchTagList([]);
        }
    }, [props?.tag_list])

    const Filter_mobile_close = () => {
        document.querySelector(".wkit-mobile-filter-main").classList.remove("wkit-filter-menu-show");
    }

    /**filter operation */
    const handleFilterChecked = (e, type) => {

        if (type == 'category') {
            let category = [...categoryCheck];

            if (category.includes(Number(e.target.value))) {
                let id = category.indexOf(Number(e.target.value));
                category.splice(id, 1);
                setcategoryCheck(category);
                setfilter(Object.assign({}, filter, { 'category': JSON.stringify(category) }))
            } else {
                category.push(Number(e.target.value));
                setcategoryCheck(category);
                setfilter(Object.assign({}, filter, { 'category': JSON.stringify(category) }))
            }
        } else if (type == 'builder') {
            var builder_type = ''
            if (e.target.checked) {
                builder_type = e.target.value;
            }

            setselectBuilder(builder_type);
            let filter_data = Object.assign({}, filter, { 'builder': builder_type })
            setfilter(filter_data);
        } else if (type == 'plugin') {
            let plugins = [...pluginCheck];

            if (plugins.includes(Number(e.target.value))) {
                let id = plugins.indexOf(Number(e.target.value));
                plugins.splice(id, 1);
                setpluginCheck(plugins);
                setfilter(Object.assign({}, filter, { 'plugin': JSON.stringify(plugins) }))
            } else {
                plugins.push(Number(e.target.value));
                setpluginCheck(plugins);
                setfilter(Object.assign({}, filter, { 'plugin': JSON.stringify(plugins) }))
            }
        } else if (type == 'tags') {
            let tags = [...tagCheck];

            if (tags.includes(Number(e.target.value))) {
                let id = tags.indexOf(Number(e.target.value));
                tags.splice(id, 1);
                setTagCheck(tags);
                setfilter(Object.assign({}, filter, { 'tag': JSON.stringify(tags) }))
            } else {
                tags.push(Number(e.target.value));
                setTagCheck(tags);
                setfilter(Object.assign({}, filter, { 'tag': JSON.stringify(tags) }))
            }
        } else if (type == 'search') {
            let newdata = Object.assign({}, filter, { 'search': e.target.value }, { 'page': 1 });
            setSearchQuery(e.target.value);
            setfilter(newdata)
        } else if ('free_pro' === type) {
            var free_pro = '';
            if (e.target.checked) {
                free_pro = e.target.value;
            }

            setFreeProCheck(free_pro);
            setfilter(Object.assign({}, filter, { 'free_pro': free_pro }))
        } else if ('pageType' === type) {
            setcategoryCheck([]);
            if (e.target.checked) {
                let pageTypeList = [e.target.value]
                setPageTypeCheck(pageTypeList);
                setfilter(Object.assign({}, filter, { 'page_type': JSON.stringify(pageTypeList), 'category': JSON.stringify([]) }))
            } else {
                let pageTypeList = PageTypeCheck?.filter((e) => e !== e.target.value);
                setPageTypeCheck(pageTypeList)
                setfilter(Object.assign({}, filter, { 'page_type': JSON.stringify(pageTypeList), 'category': JSON.stringify([]) }))
            }
        }
    }

    /**
     * Search filter html part
     * 
     * @since 1.0.0
    */
    const SearchFilter = () => {
        return (
            <Fragment>
                <div className='wkit-browse-search-inner'>
                    <input
                        className='wkit-browse-search'
                        placeholder={__('Search Templates')}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { handleFilterChecked(e, 'search') }}
                    />
                </div>
            </Fragment>
        )
    }

    /** Category filter HTML */
    const CategoryFilter = () => {

        var Cateogry_data = Object.entries(props.category_list).map((data, index) => {

            var Check_kit = '';
            if ((wdkitData.use_editor !== 'wdkit' && data[0] == 'Website Kits')) {
                Check_kit = 'Website Kits';
            }

            if (PageTypeCheck == data[0].split(' ').join('').toLowerCase().slice(0, -1)) {

                /**
                 * 
                 * @param {This parameter takes name to return data} key 
                 * @version 1.0.35 
                 */
                const handle_name = (key) => {

                    if ('Website Kits' === key) {
                        return 'Page Kits'
                    } else {
                        return key
                    }
                }
                return (
                    <Fragment key={index}>
                        <div className={Check_kit === 'Website Kits' ? 'wkit-filter-category wkit-filter-container' : 'wkit-filter-category'}>
                            {Check_kit === 'Website Kits' &&
                                <span className='wkit-pageType-mobile-tooltip'>
                                    {__('Our Pagekits can only be imported from the plugin dashboard,')} <a href={'/admin.php?page=wdesign-kit#/browse'} target="_blank" rel="noopener noreferrer">{__('click here')}</a> {__('to open the dashboard.')}
                                </span>
                            }
                            <span className={Check_kit === 'Website Kits' ? 'wkit-filter-accordion-disable' : ''}>{handle_name(data[0])} : </span>
                            {Check_kit === 'Website Kits' ? '' :
                                <div className='wkit-filter-category-list'>
                                    {
                                        Object.values(data[1]).map((data, index_id) => {
                                            return (
                                                <Fragment key={index_id}>
                                                    <div className="wkit-custom-category-wrap">
                                                        <input
                                                            type="checkbox"
                                                            name="check1"
                                                            className="wkit-custom-cateogry"
                                                            checked={categoryCheck.includes(data.term_id)}
                                                            value={data.term_id}
                                                            id={data.term_id}
                                                            onChange={(e) => { handleFilterChecked(e, 'category') }} />
                                                        <label name="check1" className="wkit-check-wrapper" htmlFor={data.term_id}>{data.term_name}</label>
                                                    </div>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </div>
                            }

                        </div>
                    </Fragment>
                );
            }
        })


        return (
            <div className="wkit-category-mobile-filter wkit-template-filter">
                {Cateogry_data}
            </div>
        );
    }

    /** Builder filter HTML */
    const BuilderFilter = () => {
        return (
            <div className="wkit-category-mobile-filter">
                {props.builder_list && props.builder_list.length > 0 && props.builder_list.map((data, index) => {
                    if (props.BuilderArray.includes(data.p_id)) {
                        return (
                            <Fragment key={index}>
                                <div className="wkit-custom-category-wrap">
                                    <input
                                        type="checkbox"
                                        name="check1"
                                        checked={data.p_id == selectBuilder}
                                        value={data.p_id}
                                        className="wkit-custom-cateogry"
                                        id={data.plugin_name}
                                        onChange={(e) => { handleFilterChecked(e, 'builder') }}
                                    />
                                    <label name="check1" className="wkit-check-wrapper" htmlFor={data.plugin_name}>
                                        <img className="wkit-pin-img-temp" src={data.plugin_icon} alt="section" draggable={false} />
                                        {data.plugin_name}
                                    </label>
                                </div>
                            </Fragment>
                        );
                    }
                })
                }
            </div>
        );
    }

    /** Plugin filter HTML */
    const PluginFilter = () => {
        return (
            <div className="wkit-category-mobile-filter">
                {props.plugin_list && props.plugin_list.length > 0 && props.plugin_list.map((data, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="wkit-custom-category-wrap">
                                <input
                                    type="checkbox"
                                    name="check1"
                                    checked={pluginCheck.includes(data.p_id)}
                                    value={data.p_id}
                                    className="wkit-custom-cateogry"
                                    id={`${data.plugin_name}-plugin`}
                                    onChange={(e) => { handleFilterChecked(e, 'plugin') }}
                                />
                                <label name="check1" className="wkit-check-wrapper" htmlFor={`${data.plugin_name}-plugin`}>
                                    <img className="wkit-pin-img-temp" src={data.plugin_icon} alt="section" draggable={false} />
                                    {data.plugin_name}
                                </label>
                            </div>
                        </Fragment>
                    );
                })
                }
            </div>
        );
    }

    /** search tag from Tag-list for filter  */
    const browseTagList = (val) => {
        setSearchTag(val);
        if (val) {
            setSearchTagList(props?.tag_list?.filter(
                data => data.tag_name.toLowerCase().includes(val.toLowerCase())
            ))
        } else {
            setSearchTagList(props?.tag_list)
        }
    }

    /** Tag filter html part */
    const TagFilter = () => {
        return (
            <Fragment>
                <div className='wkit-accordion-content wkit-accordion-mobile-content'>
                    <div className='wkit-browse-search-inner'>
                        <DebounceInput
                            className='wkit-browse-search'
                            placeholder={__('Search Tags')}
                            name="wkit-search"
                            type="text"
                            minLength={0}
                            debounceTimeout={500}
                            onChange={(e) => { browseTagList(e.target.value) }}
                            value={searchTag}
                        />
                    </div>
                    <div className="wkit-browse-tag">
                        {searchTagList && Object.values(searchTagList)?.map((data, index) => {
                            let total_count = tagCheck?.length ? 5 + tagCheck?.length : 5;
                            if ( index < total_count ) {
                                return (
                                    <Fragment key={index}>
                                        <div className="wkit-tag-filter-list">
                                            <input
                                                type="checkbox"
                                                name="check1"
                                                checked={tagCheck.includes(Number(data.tag_id))}
                                                value={data.tag_id}
                                                className="wkit-tag-checkbox"
                                                id={`${data.tag_id}-tag`}
                                                onChange={(e) => handleFilterChecked(e, 'tags')}
                                            />
                                            <label name="check1" className="wkit-browse-tag-name wkit-browse-tag-name-mobile" htmlFor={`${data.tag_id}-tag`}>
                                                {data.tag_name}
                                            </label>
                                        </div>
                                    </Fragment>
                                );
                            }
                        })
                        }
                    </div>
                </div>
            </Fragment>
        );
    }

    /** free pro filter html part */
    const FreeProFilter = (e) => {
        return (
            <Fragment>
                <div className='wkit-category-mobile-filter'>
                    <div className='wkit-custom-category-wrap'>
                        <input
                            type="checkbox"
                            className='wkit-custom-cateogry'
                            id='wkit-free-btn-label-mb'
                            value={'free'}
                            onChange={(e) => { handleFilterChecked(e, 'free_pro') }}
                            checked={freeProCheck == 'free' ? true : false}
                        />
                        <label className='wkit-check-wrapper' htmlFor='wkit-free-btn-label-mb'>Free</label>
                    </div>
                    <div className='wkit-custom-category-wrap'>
                        <input
                            type="checkbox"
                            className='wkit-custom-cateogry'
                            id='wkit-pro-btn-label-mb'
                            value={'pro'}
                            onChange={(e) => { handleFilterChecked(e, 'free_pro') }}
                            checked={freeProCheck == 'pro' ? true : false}
                        />
                        <label className='wkit-check-wrapper' htmlFor='wkit-pro-btn-label-mb'>Pro</label>
                    </div>
                </div>
            </Fragment>
        );
    }

    /** 
     * Page Type filter html part 
     * 
     * @since 1.0.9
     * */
    const PageTypeFilter = () => {
        return (
            <Fragment>
                <div className='wkit-category-mobile-filter'>
                    <div className='wkit-custom-category-wrap'>
                        <input type="radio" value={'pagetemplate'} className='wkit-custom-cateogry' id={'wkit_paget_type_pagetemplate_mb'} name={"selectPageType_mb"} onChange={(e) => handleFilterChecked(e, 'pageType')} checked={PageTypeCheck.includes('pagetemplate') ? true : false} />
                        <label htmlFor={'wkit_paget_type_pagetemplate_mb'} className='wkit-check-wrapper'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 12 14" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.08325 1.60382C2.35838 1.60382 1.77075 2.19145 1.77075 2.91632V11.083C1.77075 11.8079 2.35838 12.3955 3.08325 12.3955H8.91659C9.64146 12.3955 10.2291 11.8079 10.2291 11.083V4.52049H8.91659C8.03063 4.52049 7.31242 3.80228 7.31242 2.91632V1.60382H3.08325ZM8.18742 2.22254L9.61037 3.64549H8.91659C8.51388 3.64549 8.18742 3.31903 8.18742 2.91632V2.22254ZM0.895752 2.91632C0.895752 1.7082 1.87513 0.728821 3.08325 0.728821H7.74992H7.93114L8.05928 0.856962L10.9759 3.77363L11.1041 3.90177V4.08299V11.083C11.1041 12.2911 10.1247 13.2705 8.91659 13.2705H3.08325C1.87513 13.2705 0.895752 12.2911 0.895752 11.083V2.91632ZM3.22909 6.99965C3.22909 6.75803 3.42496 6.56215 3.66659 6.56215H6.58325C6.82488 6.56215 7.02075 6.75803 7.02075 6.99965C7.02075 7.24128 6.82488 7.43715 6.58325 7.43715H3.66659C3.42496 7.43715 3.22909 7.24128 3.22909 6.99965ZM3.66659 9.18715C3.42496 9.18715 3.22909 9.38303 3.22909 9.62465C3.22909 9.86628 3.42496 10.0622 3.66659 10.0622H8.33325C8.57488 10.0622 8.77075 9.86628 8.77075 9.62465C8.77075 9.38303 8.57488 9.18715 8.33325 9.18715H3.66659Z" fill="black" />
                            </svg>
                            <span>{__('Full Pages')}</span>
                        </label>
                    </div>
                    <div className='wkit-custom-category-wrap'>
                        <input type="radio" value={'section'} className='wkit-custom-cateogry' id={'wkit_paget_type_section_mb'} name={"selectPageType_mb"} onChange={(e) => handleFilterChecked(e, 'pageType')} checked={PageTypeCheck.includes('section') ? true : false} />
                        <label htmlFor={"wkit_paget_type_section_mb"} className='wkit-check-wrapper'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 14 14" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M1.45825 1.45868V12.542H5.54159V1.45868H1.45825ZM1.16659 0.583679C0.844419 0.583679 0.583252 0.844846 0.583252 1.16701V12.8337C0.583252 13.1558 0.84442 13.417 1.16659 13.417H5.83325C6.15542 13.417 6.41659 13.1558 6.41659 12.8337V1.16701C6.41659 0.844846 6.15542 0.583679 5.83325 0.583679H1.16659ZM8.45825 1.45868V5.54201H12.5416V1.45868H8.45825ZM8.16659 0.583679C7.84442 0.583679 7.58325 0.844847 7.58325 1.16701V5.83368C7.58325 6.15585 7.84442 6.41701 8.16659 6.41701H12.8333C13.1554 6.41701 13.4166 6.15585 13.4166 5.83368V1.16701C13.4166 0.844846 13.1554 0.583679 12.8333 0.583679H8.16659ZM8.02303 7.72951C7.78141 7.72951 7.58553 7.92539 7.58553 8.16701C7.58553 8.40864 7.78141 8.60451 8.02303 8.60451H12.9791C13.2207 8.60451 13.4166 8.40864 13.4166 8.16701C13.4166 7.92539 13.2207 7.72951 12.9791 7.72951H8.02303ZM7.58553 10.5003C7.58553 10.2587 7.78141 10.0628 8.02303 10.0628H12.9791C13.2207 10.0628 13.4166 10.2587 13.4166 10.5003C13.4166 10.742 13.2207 10.9378 12.9791 10.9378H8.02303C7.78141 10.9378 7.58553 10.742 7.58553 10.5003ZM8.02303 12.3962C7.78141 12.3962 7.58553 12.5921 7.58553 12.8337C7.58553 13.0753 7.78141 13.2712 8.02303 13.2712H12.9791C13.2207 13.2712 13.4166 13.0753 13.4166 12.8337C13.4166 12.5921 13.2207 12.3962 12.9791 12.3962H8.02303Z" fill="black" />
                            </svg>
                            <span>{__('Sections')}</span>
                        </label>
                    </div>
                    <div className={wdkitData.use_editor !== 'wdkit' ? 'wkit-pagetype-disabled wkit-disable-class' : 'wkit-pagetype-disabled'}>
                        {wdkitData.use_editor !== 'wdkit' &&
                            <span className='wkit-pageType-mobile-tooltip'>
                                {__('Our Pagekits can only be imported from the plugin dashboard,')} <a href={'/admin.php?page=wdesign-kit#/browse'} target="_blank" rel="noopener noreferrer">{__('click here')}</a> {__('to open the dashboard.')}
                            </span>
                        }
                        <div className={wdkitData.use_editor !== 'wdkit' ? 'wkit-custom-category-wrap wkit-disabled' : 'wkit-custom-category-wrap'}>
                            <input type="radio" value={'websitekit'} className='wkit-custom-cateogry' id={'wkit_page_type_websitekit_mb'} name={"selectPageType_mb"} onChange={(e) => handleFilterChecked(e, 'pageType')} checked={PageTypeCheck.includes('websitekit') ? true : false} />
                            <label htmlFor={'wkit_page_type_websitekit_mb'} className='wkit-check-wrapper'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 20 20" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.68292 4.61448L9.90514 3.05893C10.1506 2.99757 10.3883 3.18321 10.3883 3.4362V16.5627C10.3883 16.8157 10.1506 17.0013 9.90514 16.94L3.68292 15.3844C3.5098 15.3411 3.38835 15.1856 3.38835 15.0071V4.99176C3.38835 4.81331 3.50979 4.65776 3.68292 4.61448ZM2.22168 4.99176C2.22168 4.27797 2.70748 3.65577 3.39996 3.48265L9.62218 1.92709C10.604 1.68165 11.555 2.4242 11.555 3.4362V3.77592H11.5553H15.8331C16.6922 3.77592 17.3887 4.47236 17.3887 5.33147V14.6648C17.3887 15.5239 16.6922 16.2204 15.8331 16.2204H11.5553H11.555V16.5627C11.555 17.5747 10.604 18.3172 9.62218 18.0718L3.39996 16.5162C2.70748 16.3431 2.22168 15.7209 2.22168 15.0071V4.99176ZM11.5553 4.94258H15.8331C16.0479 4.94258 16.222 5.11669 16.222 5.33147V14.6648C16.222 14.8796 16.0479 15.0537 15.8331 15.0537H11.5553V4.94258Z" fill="black" />
                                </svg>
                                <span>{__('Page Kits')}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    return (
        <div className="wkit-mobile-filter-main">
            <div className='wkit-mobile-filter-main-content'>
                <div className="wkit-filter-main-heading">Filter by</div>
                <div className="close-icon">
                    <a className="close" onClick={() => Filter_mobile_close()}>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                    </a>
                </div>
                <div className="wkit-filter-by-page-builder">
                    <div className="wkit-browse-filter-heading">Search :</div>
                    {SearchFilter()}
                </div>
                {props.BuilderArray.length > 1 &&
                    <div className="wkit-filter-by-page-builder">
                        <div className="wkit-browse-filter-heading">Page Builder :</div>
                        {BuilderFilter()}
                    </div>
                }
                <div className="wkit-filter-by-page-builder">
                    <div className="wkit-browse-filter-heading">Free / Pro :</div>
                    {FreeProFilter()}
                </div>
                <div className="wkit-filter-by-page-builder">
                    <div className="wkit-browse-filter-heading">Type :</div>
                    {PageTypeFilter()}
                </div>
                <div className="wkit-filter-by-page-builder">
                    <div className="wkit-browse-filter-heading">Plugins :</div>
                    {PluginFilter()}
                </div>
                <div className="wkit-filter-by-categorties">
                    {CategoryFilter()}
                </div>
                <div className="wkit-filter-by-categorties">
                    <div className="wkit-browse-filter-heading">Tag :</div>
                    {TagFilter()}
                </div>
            </div>
            <div className="wkit-common-btn wkit-pink-btn-class" onClick={(e) => {
                props.setfilter_data(filter);
                props.setcategory_check(categoryCheck);
                props.setplugin_check(pluginCheck);
                props.setfreePro_check(freeProCheck);
                props.settag_check(tagCheck);
                props.setbuilder_check(selectBuilder);
                props.setpageType_check(PageTypeCheck);
                props.setsearch_check(searchQuery);
                Filter_mobile_close()
            }}>
                <span>Visit Site</span>
            </div>
        </div>

    );
}