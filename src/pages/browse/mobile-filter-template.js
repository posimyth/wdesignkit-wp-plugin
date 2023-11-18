import { useState, useEffect } from 'react';
import { loadingIcon } from '../../helper/helper-function';
import { DebounceInput } from 'react-debounce-input'
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

    const [searchTagList, setSearchTagList] = useState(props?.tag_list)


    useEffect(() => {
        if (props?.filter_data?.builder) {
            setselectBuilder(props?.filter_data?.builder)
        } else {
            setselectBuilder('')
        }

        if (props?.filter_data?.category) {
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
            let newdata = Object.assign({}, filter, { 'search': searchQuery }, { 'page': 1 });
            setfilter(newdata)
        }
    }

    /**search filter html part */
    const SearchFilter = () => {
        return (
            <Fragment>
                <div className='wkit-browse-search-inner'>
                    <input
                        className='wkit-browse-search'
                        placeholder={__('Search Templates...')}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value) }}
                    />
                    {/* <span className="wkit_search_button" onClick={(e) => { handleFilterChecked(e, 'search') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M14.7 15.75L9.975 11.025C9.6 11.325 9.16875 11.5625 8.68125 11.7375C8.19375 11.9125 7.675 12 7.125 12C5.7625 12 4.6095 11.528 3.666 10.584C2.7225 9.64 2.2505 8.487 2.25 7.125C2.25 5.7625 2.722 4.6095 3.666 3.666C4.61 2.7225 5.763 2.2505 7.125 2.25C8.4875 2.25 9.6405 2.722 10.584 3.666C11.5275 4.61 11.9995 5.763 12 7.125C12 7.675 11.9125 8.19375 11.7375 8.68125C11.5625 9.16875 11.325 9.6 11.025 9.975L15.75 14.7L14.7 15.75ZM7.125 10.5C8.0625 10.5 8.8595 10.1718 9.516 9.51525C10.1725 8.85875 10.5005 8.062 10.5 7.125C10.5 6.1875 10.1718 5.3905 9.51525 4.734C8.85875 4.0775 8.062 3.7495 7.125 3.75C6.1875 3.75 5.3905 4.07825 4.734 4.73475C4.0775 5.39125 3.7495 6.188 3.75 7.125C3.75 8.0625 4.07825 8.8595 4.73475 9.516C5.39125 10.1725 6.188 10.5005 7.125 10.5Z" fill="white" />
                        </svg>
                    </span> */}
                </div>
            </Fragment>
        )
    }

    /** Category filter HTML */
    const CategoryFilter = () => {
        return (
            <div className="wkit-category-mobile-filter wkit-template-filter">
                {
                    Object.entries(props.category_list).map((data, index) => {
                        return (
                            <Fragment key={index}>
                                <div className='wkit-filter-category'>
                                    <span>{data[0]} : </span>
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
                                </div>
                            </Fragment>
                        );
                    })
                }
            </div>
        );
    }

    /** Builder filter HTML */
    const BuilderFilter = () => {
        return (
            <div className="wkit-category-mobile-filter">
                {props.builder_list && props.builder_list.length > 0 && props.builder_list.map((data, index) => {
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
                                    <img className="wkit-pin-img-temp" src={data.plugin_icon} alt="section" />
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
                                    <img className="wkit-pin-img-temp" src={data.plugin_icon} alt="section" />
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
                    <div className="wkit-browse-tag">
                        {searchTagList && Object.values(searchTagList)?.map((data, index) => {
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
                                        <label name="check1" className="wkit-browse-tag-name" htmlFor={`${data.tag_id}-tag`}>
                                            {data.tag_name}
                                        </label>
                                    </div>
                                </Fragment>
                            );
                        })
                        }
                    </div>
                </div>
            </Fragment>
        );
    }

    var img_path = wdkitData.WDKIT_URL;

    return (
        <div className="wkit-mobile-filter-main">
            <div className="wkit-filter-main-heading">Filter by</div>
            <div className="close-icon"><a className="close" onClick={() => Filter_mobile_close()}>×</a></div>
            <div className="wkit-filter-by-page-builder">
                <div className="wkit-browse-filter-heading">Search :</div>
                {SearchFilter()}
            </div>
            <div className="wkit-filter-by-page-builder">
                <div className="wkit-browse-filter-heading">Page Builder :</div>
                {BuilderFilter()}
            </div>
            <div className="wkit-filter-by-page-builder">
                <div className="wkit-browse-filter-heading">Page Builder :</div>
                {PluginFilter()}
            </div>
            <div className="wkit-filter-by-categorties">
                <div className="wkit-browse-filter-heading">Categories :</div>
                {CategoryFilter()}
            </div>
            <div className="wkit-filter-by-categorties">
                <div className="wkit-browse-filter-heading">Tag :</div>
                {TagFilter()}
            </div>
            <div className="wkit-common-btn" onClick={(e) => {
                props.setfilter_data(filter);
                props.setcategory_check(categoryCheck);
                props.setplugin_check(pluginCheck);
                props.settag_check(tagCheck);
                handleFilterChecked(e, 'search')
                Filter_mobile_close()
            }}>
                <span>Visit Site</span>
            </div>
        </div>

    );
}
