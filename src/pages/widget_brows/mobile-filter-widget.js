import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
const { Fragment } = wp.element;

export const Wkit_Filter_widget = (props) => {
    const [filter, setfilter] = useState(props.filterArgs);
    const [categoryCheck, setcategoryCheck] = useState([]);
    const [selectBuilder, setselectBuilder] = useState([]);
    const [free_pro, setfree_pro] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const history = useNavigate();

    const URL_data = (data) => {
        return Object.fromEntries(Object.entries(data).filter(([key, value]) => value.length > 1 && value !== "[]" && key !== 'type' && key !== 'page' && key !== 'perpage'));
    }

    const handleMobileFiler = () => {
        let Search_data = props?.filter_data?.search || '';
        var newdata = Object.assign({}, props?.filter_data, { 'search': Search_data });
        const querystring = new URLSearchParams(URL_data(newdata)).toString();
        history(`/widget-browse?${querystring}`);
    }


    useEffect(() => {
        handleMobileFiler();
        if (props?.filter_data?.buildertype) {
            setselectBuilder(props?.filter_data?.buildertype)
        } else {
            setselectBuilder('')
        }

        if (props?.filter_data?.free_pro) {
            setfree_pro(props?.filter_data?.free_pro)
        } else {
            setfree_pro('')
        }

        if (props?.filter_data?.search) {
            setSearchQuery(props?.filter_data?.search)
        } else {
            setSearchQuery('')
        }

        if (props?.filter_data?.category) {
            setcategoryCheck(JSON.parse(props?.filter_data?.category.replaceAll('"', '')))
        } else {
            setcategoryCheck([]);
        }
        setfilter(props.filter_data)
    }, [props.filter_data])

    const Filter_mobile_close = () => {
        document.querySelector(".wkit-mobile-filter-main").classList.remove("wkit-filter-menu-show");
    }

    /**
     * filter operation 
     * 
     * @since 1.0.0
    */
    const handleFilterChecked = (e, type) => {
        if ('category' === type) {
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
        } else if ('builder' === type) {
            var builder_type = ''
            if (e.target.checked) {
                builder_type = e.target.value;
            }

            setselectBuilder(builder_type);
            let filter_data = Object.assign({}, filter, { 'buildertype': builder_type })
            setfilter(filter_data);
        } else if ('search' === type) {
            let filter_data = Object.assign({}, filter, { 'search': e.target.value, 'page': 1 });
            setSearchQuery(e.target.value)
            setfilter(filter_data)
        } else if ('free_pro' === type) {
            setfree_pro(e.target.value);
            let filter_data = Object.assign({}, filter, { 'free_pro': e.target.value, 'page': 1 });
            setfilter(filter_data)
        }
    }

    /** 
     * Free-pro filter 
     * 
     * @since 1.0.9
     * */
    const FreeProFilter = (e) => {
        return (
            <Fragment>
                <div className="wkit-category-mobile-filter">
                    <div className='wkit-custom-category-wrap'>
                        <input
                            type="radio"
                            className='wkit-custom-cateogry'
                            id='wkit-free-btn-label'
                            value={'free'}
                            onChange={(e) => { handleFilterChecked(e, 'free_pro') }}
                            checked={free_pro == 'free' ? true : false}
                        />
                        <label className='wkit-check-wrapper' htmlFor='wkit-free-btn-label'>{__('Free', 'wdesignkit')}</label>
                    </div>
                    <div className='wkit-custom-category-wrap'>
                        <input
                            type="radio"
                            className='wkit-custom-cateogry'
                            id='wkit-pro-btn-label'
                            value={'pro'}
                            onChange={(e) => { handleFilterChecked(e, 'free_pro') }}
                            checked={free_pro == 'pro' ? true : false}
                        />
                        <label className='wkit-check-wrapper' htmlFor='wkit-pro-btn-label'>{__('Pro', 'wdesignkit')}</label>
                    </div>
                </div>
            </Fragment>
        );
    }

    /** Category filter HTML */
    const CategoryFilter = () => {
        return (
            <div className="wkit-category-mobile-filter">
                {
                    Object.values(props.category_list).map((data, index) => {
                        return (
                            <Fragment key={index}>
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
        );
    }

    /**Search filter */
    const SearchFilter = () => {
        return (
            <Fragment>
                <div className='wkit-browse-search-inner'>
                    <input
                        className='wkit-browse-search'
                        placeholder={__('Search Widgets', 'wdesignkit')}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { handleFilterChecked(e, 'search') }}
                    />
                </div>
            </Fragment>
        )
    }

    /** Builder filter HTML */
    const BuilderFilter = () => {
        return (
            <div className="wkit-category-mobile-filter">
                {props.builder_list && props.builder_list.length > 0 && props.builder_list.map((data, index) => {
                    if (props.BuilderArray.includes(data.w_id)) {
                        return (
                            <Fragment key={index}>
                                <div className="wkit-custom-category-wrap">
                                    <input
                                        type="checkbox"
                                        name="check1"
                                        checked={data.builder_name.toLowerCase() == selectBuilder}
                                        value={data.builder_name.toLowerCase()}
                                        className="wkit-custom-cateogry"
                                        id={data.builder_name}
                                        onChange={(e) => { handleFilterChecked(e, 'builder') }}
                                    />
                                    <label name="check1" className="wkit-check-wrapper" htmlFor={data.builder_name}>
                                        <img className="wkit-pin-img-temp" src={data.builder_icon} alt="section" draggable={false} />
                                        {data.builder_name}
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

    return (
        <div className="wkit-mobile-filter-main">
            <div className='wkit-mobile-filter-main-content'>
                <div className="wkit-filter-main-heading">{__('Filter by', 'wdesignkit')}</div>
                <div className="close-icon">
                    <a className="close" onClick={() => Filter_mobile_close()}>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                    </a>
                </div>
                <div className="wkit-filter-by-page-builder">
                    <div className="wkit-browse-filter-heading">{__('Search :', 'wdesignkit')}</div>
                    {SearchFilter()}
                </div>
                {props.BuilderArray.length > 1 &&
                    <div className="wkit-filter-by-page-builder">
                        <div className="wkit-browse-filter-heading">{__('Page Builder :', 'wdesignkit')}</div>
                        {BuilderFilter()}
                    </div>
                }
                <div className="wkit-filter-by-categorties">
                    <div className="wkit-browse-filter-heading">{__('Free/Pro :', 'wdesignkit')}</div>
                    {FreeProFilter()}
                </div>
                <div className="wkit-filter-by-categorties">
                    <div className="wkit-browse-filter-heading">{__('Categories :', 'wdesignkit')}</div>
                    {CategoryFilter()}
                </div>
            </div>
            <div className="wkit-common-btn wkit-pink-btn-class" onClick={(e) => {
                props.setfilter_data(filter);
                props.setselect_builder(selectBuilder);
                props.setcategory_check(categoryCheck);
                props.setfree_pro(free_pro);
                props.setsearch_check(searchQuery);
                Filter_mobile_close()
            }}>
                <span>{__('Visit Site', 'wdesignkit')}</span>
            </div>
        </div>
    );
}