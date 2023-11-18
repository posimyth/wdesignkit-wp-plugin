import '../widget_brows/widget_brows.scss';
import { useState, useEffect } from 'react';
import { Wkit_browse_template_Skeleton, Wkit_availble_not, get_user_login, wdKit_Form_data, loadingIcon, Wkit_template_Skeleton, Show_toast, Widget_card } from '../../helper/helper-function';
import { Wkit_Filter_widget } from './mobile-filter-widget';
import ReactPaginate from 'react-paginate';

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    form_data,
} = wp.wkit_Helper;


const Widget_brows = (props) => {

    var img_path = wdkitData.WDKIT_URL;

    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [browseData, setBrowseData] = useState('loading');
    const [filterToggle, setFilterToggle] = useState(true);
    const [selectBuilder, setselectBuilder] = useState('');
    const [userData, setUserData] = useState();
    const [categoryCheck, setcategoryCheck] = useState([]);
    const [accordionToggle, setaccordionToggle] = useState(['category']);
    const [totalpage, settotalpage] = useState(0);
    const [skeleton, setskeleton] = useState(true);
    const [card_loading, setcard_loading] = useState(true);
    const [existingwidget, setexistingwidget] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterArgs, setFilterArgs] = useState({ 'type': 'widget_browse_page', 'buildertype': '', 'perpage': perPage, 'page': activePage });

    /** get builder and category list from redux */
    const builder = props?.wdkit_meta?.widgetbuilder ? [...props?.wdkit_meta?.widgetbuilder] : [];
    const category = props?.wdkit_meta?.widgetscategory ? [...props?.wdkit_meta?.widgetscategory] : [];

    /** get redux */
    useEffect(() => {
        setUserData(props.wdkit_meta);
    }, [props.wdkit_meta])

    /** start skeleton onload */
    useEffect(() => {
        setskeleton(true)
    }, [])

    /** call api function to get filterd data */
    useEffect(() => {
        BrowseFilter()
        setcard_loading(true)
    }, [filterArgs, perPage, activePage, userData]);

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
                    <span className="wkit_search_button" onClick={(e) => { handleFilterChecked(e, 'search') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M14.7 15.75L9.975 11.025C9.6 11.325 9.16875 11.5625 8.68125 11.7375C8.19375 11.9125 7.675 12 7.125 12C5.7625 12 4.6095 11.528 3.666 10.584C2.7225 9.64 2.2505 8.487 2.25 7.125C2.25 5.7625 2.722 4.6095 3.666 3.666C4.61 2.7225 5.763 2.2505 7.125 2.25C8.4875 2.25 9.6405 2.722 10.584 3.666C11.5275 4.61 11.9995 5.763 12 7.125C12 7.675 11.9125 8.19375 11.7375 8.68125C11.5625 9.16875 11.325 9.6 11.025 9.975L15.75 14.7L14.7 15.75ZM7.125 10.5C8.0625 10.5 8.8595 10.1718 9.516 9.51525C10.1725 8.85875 10.5005 8.062 10.5 7.125C10.5 6.1875 10.1718 5.3905 9.51525 4.734C8.85875 4.0775 8.062 3.7495 7.125 3.75C6.1875 3.75 5.3905 4.07825 4.734 4.73475C4.0775 5.39125 3.7495 6.188 3.75 7.125C3.75 8.0625 4.07825 8.8595 4.73475 9.516C5.39125 10.1725 6.188 10.5005 7.125 10.5Z" fill="white" />
                        </svg>
                    </span>
                </div>
            </Fragment>
        )
    }

    /** category filter */
    const handleFilterChecked = (e, type) => {
        if (type == 'category') {
            let category = [...categoryCheck];

            if (category.includes(Number(e.target.value))) {
                let id = category.indexOf(Number(e.target.value));
                category.splice(id, 1);
                setcategoryCheck(category);
                setFilterArgs(Object.assign({}, filterArgs, { 'category': JSON.stringify(category), 'page': 1 }))
                setActivePage(1);
            } else {
                category.push(Number(e.target.value));
                setcategoryCheck(category);
                setFilterArgs(Object.assign({}, filterArgs, { 'category': JSON.stringify(category), 'page': 1 }))
                setActivePage(1);
            }
        } else if (type == 'builder') {
            var builder_type = ''
            if (e.target.checked) {
                builder_type = e.target.value;
            }

            setselectBuilder(builder_type);
            let filter_data = Object.assign({}, filterArgs, { 'buildertype': builder_type, 'page': 1 })
            setActivePage(1);
            setFilterArgs(filter_data);
        } else if (type == 'search') {
            let filter_data = Object.assign({}, filterArgs, { 'search': searchQuery, 'page': 1 });
            setActivePage(1);
            setFilterArgs(filter_data)
        }
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

            let form_arr = { 'type': 'wkit_get_widget_list' }
            await wdKit_Form_data(form_arr)
                .then((response) => {
                    const data = response;
                    data.map(async (data) => {
                        let index = browse_data?.data?.widgets && browse_data?.data?.widgets.findIndex((id) => id.w_unique == data.widgetdata.widget_id);
                        if (index > -1) {
                            array.push(data.widgetdata.widget_id);
                        }
                    })
                })
            setexistingwidget(array);
        }

        if (userData?.widgetbuilder?.length > 0) {

            await form_data(filterArgs).then(async (result) => {
                if (result?.data?.widgets) {
                    let widgetList = [...result?.data?.widgets];
                    let new_list = [];
                    await widgetList.map(async (data) => {
                        if (userData?.Setting[`${Buidler_name(data.builder)}_builder`]) {
                            new_list.push(data);
                        }
                    })
                    let new_array = Object.assign({}, result.data, { 'widgets': new_list })
                    let new_data = Object.assign({}, result, { 'data': new_array })
                    await setBrowseData(new_data);

                    await settotalpage(Math.ceil(result?.data?.widgetscount / perPage));
                    await WidgetListdata(result);
                }
                setskeleton(false)
                setcard_loading(false)
            });
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
                {(builder.length > 0) &&
                    Object.values(builder)?.map((data, index) => {
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
                                                    src={data.builder_icon} />
                                            }
                                        </label>
                                        <span>{data.builder_name}</span>
                                    </div>
                                </div>
                            </Fragment>
                        )
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
                    <div className="wkit-filter-heading">Categories</div>
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
                                        <div className='wkit-plugin-name'>
                                            <input type="checkbox" value={Number(data.term_id)} className='wkit-check-box wkit-styled-checkbox' id={"category_" + data.term_id} name={"selectPlugin"} onChange={(e) => handleFilterChecked(e, 'category')} checked={Catergory_check(data.term_id)} />
                                            <label htmlFor={"category_" + data.term_id}>{data.term_name}</label>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
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
                    <div className='wkit-wb-filterTitle'>{__('Page Builder')}</div>
                    {wdkitData.use_editor == 'wdkit' &&
                        <div className='wkit-filter-wrap-panel wkit-mt-15 wkit-justify-left'>
                            {Builder_filter()}
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

    return (
        <div className='wkit-browse-widget-wrap'>
            <Wkit_Filter_widget
                filter_type={'widget'}
                filter_data={filterArgs}
                setfilter_data={(new_data) => { setFilterArgs(new_data) }}
                setcategory_check={(cat_data) => { setcategoryCheck(cat_data) }}
                setselect_builder={(builder_data) => { setselectBuilder(builder_data) }}
                category_list={category}
                builder_list={builder}
            />
            <div className="wkit-browse-widget-main">
                {skeleton == false && browseData?.data?.widgets &&
                    <>
                        <div className={"wkit-browse-widget-column wkit-browse-widget-mobile-hide " + (!filterToggle ? "wkit-browse-column-collapse" : '')}>
                            {Filter_panel()}
                        </div>
                        {card_loading == false && browseData?.data?.widgets.length > 0 &&
                            <div className='wkit-browse-widget-right-column'>
                                {/* {Widget_card()} */}
                                <div className='wkit-skeleton-row'>
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
                                                        type={'widget-browse'}
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
                                                nextLabel={">"}
                                                pageRangeDisplayed={2}
                                                pageCount={totalpage}
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
                                <Wkit_availble_not page={'widget'} />
                            </div>
                        }
                        {card_loading == true &&
                            <Wkit_template_Skeleton />
                        }
                    </>
                }
            </div>
            {skeleton == true &&
                <Wkit_browse_template_Skeleton />
            }
        </div>
    );
}

export default Widget_brows;