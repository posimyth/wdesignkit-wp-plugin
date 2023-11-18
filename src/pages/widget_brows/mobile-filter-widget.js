import { useState, useEffect } from 'react';
import { loadingIcon } from '../../helper/helper-function';
const { Fragment } = wp.element;
const { __ } = wp.i18n;

export const Wkit_Filter_widget = (props) => {
    const [filter, setfilter] = useState(props.filterArgs);
    const [categoryCheck, setcategoryCheck] = useState([]);
    const [selectBuilder, setselectBuilder] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (props?.filter_data?.buildertype) {
            setselectBuilder(props?.filter_data?.buildertype)
        } else {
            setselectBuilder('')
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
            let filter_data = Object.assign({}, filter, { 'buildertype': builder_type })
            setfilter(filter_data);
        } else if (type == 'search') {
            let filter_data = Object.assign({}, filter, { 'search': searchQuery, 'page': 1 });
            setfilter(filter_data)
        }
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
                                    checked={data.builder_name.toLowerCase() == selectBuilder}
                                    value={data.builder_name.toLowerCase()}
                                    className="wkit-custom-cateogry"
                                    id={data.builder_name}
                                    onChange={(e) => { handleFilterChecked(e, 'builder') }}
                                />
                                <label name="check1" className="wkit-check-wrapper" htmlFor={data.builder_name}>
                                    <img className="wkit-pin-img-temp" src={data.builder_icon} alt="section" />
                                    {data.builder_name}
                                </label>
                            </div>
                        </Fragment>
                    );
                })
                }
            </div>
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
            <div className="wkit-filter-by-categorties">
                <div className="wkit-browse-filter-heading">Categories :</div>
                {CategoryFilter()}
            </div>
            <div className="wkit-common-btn" onClick={(e) => {
                props.setfilter_data(filter);
                props.setselect_builder(selectBuilder);
                props.setcategory_check(categoryCheck);
                handleFilterChecked(e, 'search')
                Filter_mobile_close()
            }}>
                <span>Visit Site</span>
            </div>
        </div>

    );
}
