import '../widget_brows/widget_brows.scss';
import { useEffect } from 'react';


const Browse_template_skeleton = (props) => {
    var img_path = wdkitData.WDKIT_URL;

    /** get array of required length */
    const getArray = (length) => Array.from({ length });

    const CardSkeleton = (index) => {
        return (
            <div className="wkit-widgetlist-grid-content" key={index}>
                <div className="wkit-widget-card">
                    <div className="wkit-widget-card-top-part">
                        <div>
                            <img className="wkit-widget-placeholder-img" src={img_path + 'assets/images/wkit-dummy-bg.png'} draggable="false" />
                        </div>
                    </div>
                    <div className="wkit-widget-card-bottom-part">
                        <div className="wkit-widget-title-content">
                            <p className="wkit-widget-title-heading">
                                <span>Modern Hover Post</span>
                            </p>
                            <div className="wkit-widget-download-activity">
                                <div className="plugin-download-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 13 12" fill="none">
                                        <path d="M6.79116 0.0356951C6.73488 0.0567989 6.64344 0.117764 6.58951 0.171695C6.40192 0.359281 6.41364 0.117764 6.41364 3.55762V6.61995L5.93999 6.1463C5.43351 5.64216 5.34441 5.57885 5.14979 5.57651C4.97862 5.57651 4.86372 5.62575 4.73241 5.75237C4.53779 5.9423 4.49558 6.16271 4.60814 6.40892C4.63627 6.47223 4.92 6.77236 5.50151 7.35154C6.26592 8.11126 6.37144 8.20739 6.50744 8.2707C6.8193 8.41608 7.16164 8.41843 7.48054 8.28008C7.60481 8.22381 7.71736 8.12298 8.48646 7.36091C9.11956 6.7325 9.36342 6.47457 9.39625 6.39954C9.45487 6.27292 9.45722 6.06657 9.40329 5.93995C9.31887 5.73361 9.08205 5.57651 8.86398 5.57651C8.65295 5.57885 8.57322 5.63513 8.06205 6.1463L7.58605 6.61995V3.55762C7.58605 0.117764 7.59778 0.359281 7.41019 0.171695C7.2484 0.00755787 7.01392 -0.0416832 6.79116 0.0356951Z" fill="#19191B"></path>
                                        <path d="M1.37381 5.45235C1.22843 5.50394 1.08305 5.65635 1.03147 5.81111C0.996296 5.91897 0.991606 5.98463 1.00568 6.266C1.05726 7.38214 1.3996 8.42558 2.00926 9.33302C2.46181 10.0107 3.15118 10.6743 3.83353 11.0987C5.46083 12.1069 7.44924 12.2781 9.24302 11.5676C10.0074 11.2652 10.6827 10.8056 11.3018 10.1701C12.3405 9.10323 12.9267 7.75027 12.9947 6.26131C13.0111 5.86738 12.9807 5.74311 12.8259 5.58835C12.5961 5.35856 12.235 5.35856 12.0052 5.58835C11.8763 5.71732 11.8364 5.84628 11.82 6.20973C11.8012 6.5849 11.7543 6.90145 11.6629 7.24145C11.2103 8.93909 9.84564 10.2756 8.14096 10.6883C5.57104 11.312 2.98001 9.75275 2.32112 7.18517C2.23905 6.86159 2.16871 6.35745 2.16871 6.07842C2.16871 5.86035 2.11477 5.71028 1.99284 5.58835C1.83105 5.42421 1.59657 5.37497 1.37381 5.45235Z" fill="#19191B"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="wdkit-star-rating">
                            <span>1 Review</span>
                        </div>
                        <div className="wkit-widget-info-content">
                            <div className="wkit-widget-info-icons-content">
                                <div className="wkit-widget-info-icons">
                                    <img src={img_path + "assets/images/svg/eye.svg"} alt="wb-view-icon" />
                                    <label>800</label>
                                </div>
                                <hr className="wkit-icon-divider-hr" />
                                <div className="wkit-widget-info-icons">
                                    <img src={img_path + "assets/images/svg/download-template.svg"} alt="wb-view-icon" />
                                    <label>800</label>
                                </div>
                            </div>
                            <div className="wkit-widget-builder-icon">
                                <img src="https://wdesignkit.com/images/uploads/wpdk-admin/widgets-builder/builder-63a02503.svg" draggable="false" />
                                <span className="wkit-widget-builder-tooltip">Elementor</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const URL_data = (data) => {
        let AppliedFilters = Object.fromEntries(Object.entries(data).filter(([key, value]) => value.length > 1 && value !== "[]" && key !== 'type' && key !== 'page' && key !== 'perpage' && key !== 'buildertype'));
        return Object.values(AppliedFilters);
    }

    return (
        <>
            {props?.filter &&
                <div className="wkit-browse-column">
                    <div className="wkit-browse-inner-column">
                        <div className="wkit-expand-filter">
                            <div className="wkit-left-main-title">Filters</div>
                        </div>
                        <div className="wkit-filter-accordion">
                            <div className="wkit-filter-heading">Search</div>
                        </div>
                        <div className="wkit-search-filter">
                            <div className="wkit-browse-search-inner">
                                <input className="wkit-browse-search" placeholder="Search Templates" type="text" />
                                <span className="wkit_search_button wkit-btn-class">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.4299 5.92969L20.4999 11.9997L14.4299 18.0697" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="wkit-filter-accordion">
                            <div className="wkit-filter-heading">Page Builder</div>
                        </div>
                        <div className="wkit-choose-builder-wrap wkit-mt-15 wkit-justify-left">
                            {getArray(2).map((data, index) => (
                                <div className="wkit-wb-widgetType" key={index}>
                                    <div className="wkit-select-builder-list">
                                        <input type="checkbox" className="wkit-builder-radio" />
                                        <label className="wkit-builder-label">
                                            <img className="wkit-browse-filter-builder" src="https://wdesignkit.com/images/uploads/wpdk-admin/builder-list/builder-elementor.svg" draggable="false" />
                                            <span className="wkit-builder-toolTip">elementor</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="filter-wrapper">
                            <div className="wkit-filter-accordion">
                                <div className="wkit-filter-heading">Free / Pro</div>
                            </div>
                            <div className="wkit-freePro-wrap wkit-accordion-content">
                                {getArray(2).map((data, index) => (
                                    <label key={index} className="wkit-select-freePro-type">
                                        <input type="checkbox" className="wkit-check-box wkit-freePro-radio-inp" />
                                        <span className="wkit-freePro-label">Free</span>
                                    </label>
                                ))}
                            </div>
                            <hr />
                            <div className="wkit-filter-accordion">
                                <div className="wkit-filter-heading">Type</div>
                            </div>
                            <div className="wkit-accordion-content">
                                {getArray(3).map((data, index) => (
                                    <div className="wkit-pageType-wrap" key={index}>
                                        <label htmlFor="wkit_paget_type_pagetemplate" className="wkit-pageType-list">
                                            <input type="radio" className="wkit-styled-type-radio" />
                                            <span className="wkit-type-selection">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 12 14" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.08325 1.60382C2.35838 1.60382 1.77075 2.19145 1.77075 2.91632V11.083C1.77075 11.8079 2.35838 12.3955 3.08325 12.3955H8.91659C9.64146 12.3955 10.2291 11.8079 10.2291 11.083V4.52049H8.91659C8.03063 4.52049 7.31242 3.80228 7.31242 2.91632V1.60382H3.08325ZM8.18742 2.22254L9.61037 3.64549H8.91659C8.51388 3.64549 8.18742 3.31903 8.18742 2.91632V2.22254ZM0.895752 2.91632C0.895752 1.7082 1.87513 0.728821 3.08325 0.728821H7.74992H7.93114L8.05928 0.856962L10.9759 3.77363L11.1041 3.90177V4.08299V11.083C11.1041 12.2911 10.1247 13.2705 8.91659 13.2705H3.08325C1.87513 13.2705 0.895752 12.2911 0.895752 11.083V2.91632Z" fill="#19191B"></path>
                                                </svg>
                                            </span>
                                            Page Template
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            <div className="wkit-filter-accordion">
                                <div className="wkit-filter-heading">
                                    Plugins
                                </div>
                            </div>
                            <div className="wkit-accordion-content">
                                <div className="wkit-plugin-wrap">
                                    {getArray(7).map((data, index) => (
                                        <label className="wkit-plugin-name" key={index}>
                                            <input type="checkbox" className="wkit-check-box wkit-styled-checkbox" />
                                            <span className="wkit-plugin-selection-temp">
                                                <img src="https://wdesignkit.com/images/uploads/wpdk-admin/plugin-list/plugin-elementor.svg" alt="tpae-logo" draggable="false" />
                                                <span>
                                                    Elementor
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            < hr />
                            <div className="wkit-filter-accordion">
                                <div className="wkit-filter-heading">
                                    Page Kits
                                </div>
                            </div>
                            <div className="wkit-accordion-content">
                                <div className="wkit-plugin-wrap">
                                    {getArray(7).map((data, index) => (
                                        <label className="wkit-plugin-name" key={index}>
                                            <input type="checkbox" className="wkit-check-box wkit-styled-checkbox" />
                                            <span>
                                                WooCommerce
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            < hr />
                            <div className="wkit-filter-accordion">
                                <div className="wkit-filter-heading">
                                    Tags
                                </div>
                            </div>
                            <div className="wkit-accordion-content">
                                <div className="wkit-browse-search-inner">
                                    <input className="wkit-browse-search" />
                                </div>
                                <div className="wkit-browse-tag">
                                    {getArray(5).map((data, index) => (
                                        <div className="wkit-tag-filter-list" key={index}>
                                            <label className="wkit-browse-tag-name">
                                                Elementor
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }

            {
                props?.cards &&
                <div className="wkit-browse-right-column">
                    {props?.filterArgs &&
                        <div className="wkit-free-dropdown-mixed">
                            <div className="wkit-browse-applied-filter">
                                <label className="applied-filter-text">Applied Filter :</label>
                                {props.filterArgs && URL_data(props.filterArgs).map((data, index) => (
                                    <div className="wkit-applied-list" key={index}>
                                        <label>
                                            <span>{data}</span>
                                        </label>
                                        <button>
                                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z"
                                                    fill="black"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button className="wdkit-reset-all-filters wkit-btn-class">Clear All</button>
                            </div>
                        </div>

                    }
                    <div className='wdkit-loop'>
                        <div className='wdesign-kit-main'>
                            {getArray(12).map((data, index) => (
                                CardSkeleton(index)
                            ))}
                        </div>
                    </div>
                </div>
            }
        </>
    )

}

export default Browse_template_skeleton;