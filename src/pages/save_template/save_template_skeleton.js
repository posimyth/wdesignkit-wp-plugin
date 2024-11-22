import React from 'react'
import './save_template.scss';

const SaveTemplateSkeleton = () => {

    return (
        <div className="wkit-select-main">
            <div className={"wkit-skeleton-heading"}></div>
            <div className={"wkit-sekeleton-template"}>
                <div className={"wkit-skeleton-col"}>
                    <div className='kit-field-wrap1'>
                        <div className={"wkit-input-skeleton"} >
                            <div className="wkit-skeleton-line"></div>
                        </div>
                    </div>
                    <div className='kit-field-wrap1'>
                        <div className={"wkit-input-skeleton"} >
                            <div className="wkit-skeleton-line"></div>
                        </div>
                    </div>
                </div>
                <div className={"wkit-skeleton-col"}>
                    <div className='kit-field-wrap1'>
                        <div className={"wkit-input-skeleton"} >
                            <div className="wkit-skeleton-line"></div>
                        </div>
                    </div>
                    <div className='kit-field-wrap1'>
                        <div className={"wkit-input-skeleton"} >
                            <div className="wkit-skeleton-line"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"wkit-skeleton-addBtn"}></div>

            <div className={"wkit-skeleton-label"}></div>
            <div className='wkit-save-plugin-wrapper'>
                {[1, 2, 3, 4].map((index, id) => (
                    <div className="wkit-plugin-list" key={id}>
                        <div className='kit-field-wrap1'>
                            <div className='wkit-plugin-skeleton'>
                                <div className="wkit-small-check-box"></div>
                                <div className="wkit-small-img-box"></div>
                                <div className="wkit-skeleton-line"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='wkit-btn-right'>
                <button className={"wkit-btn-skeleton"} ></button>
            </div>
        </div>
    )
}


export default SaveTemplateSkeleton;
