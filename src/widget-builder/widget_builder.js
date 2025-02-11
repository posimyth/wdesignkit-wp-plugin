import { useState, useEffect } from "react";
import BLock_edit_contaoner from "./redux-container/BLock_edit_container";
import Block_elementor_container from "./redux-container/Block_elementor_container";
import Editor_container from "./redux-container/editor_container";
import Setting_panel_container from "./redux-container/setting_panel_container";
import Wb_layout_container from "./redux-container/wb_layout_container";
import { __ } from '@wordpress/i18n';

const Widget_builder = (props) => {

  useEffect(() => {
    if (!document.body.classList.contains('folded')) {
      document.body.classList.add("folded");
    }
  });

  const [active, setactive] = useState("layout");

  var type_class = '',
    x = 0,
    w = 0;

  if (props && props.widgetdata && props.widgetdata.type && props.widgetdata.type == 'elementor') {
    type_class = 'wkit-elementor-builder';
  } else if (props && props.widgetdata && props.widgetdata.type && props.widgetdata.type == 'gutenberg') {
    type_class = 'wkit-gutenberg-builder';
  } else if (props && props.widgetdata && props.widgetdata.type && props.widgetdata.type == 'bricks') {
    type_class = 'wkit-bricks-builder';
  }

  const Drag_start = (e) => {
    x = e.clientX;
    const styles = window.getComputedStyle(e.target.parentElement);
    w = parseInt(styles.width, 10);
  }

  const Drag_over = (e) => {
    const dx = e.clientX - x;
    let final_width = `${w + dx}px`;
    e.target.parentElement.style.width = final_width;


    if (document.querySelector('.wkit-wb-third.content.wkit-wb-hide')) {
      document.querySelector('.wkit-wb-second.content').style.width = `calc((100% - ${final_width})) `;
    } else {
      document.querySelector('.wkit-wb-second.content').style.width = `calc((100% - ${final_width})/2) `;
      document.querySelector('.wkit-wb-third.content').style.width = `calc((100% - ${final_width})/2) `;
    }
  }

  const Outside_click = (e) => {
    let drop_down = document.querySelectorAll(".wkit-wb-custom-dropDown-content.wkit-wb-show")
    let custom_icon_popup = document.querySelectorAll(".wkit-wb-choose-popup.wkit-wb-flex-show")
    if (!e.target.closest(".wkit-wb-custom-dropDown-header") && drop_down) {
      drop_down.forEach((content) => {
        content.classList.remove("wkit-wb-show");
      })
    }

    if (!e.target.closest(".wkit-wb-choose-popup.wkit-wb-flex-show") && !e.target.closest(".wb-options-inp.wkit-wb-icon-select") && custom_icon_popup) {
      custom_icon_popup.forEach((content) => {
        content.classList.remove("wkit-wb-flex-show");
      })
    }
  }

  return (
    <>
      <div className={`wkit-wb-main-builder-page ${type_class}`} onClick={(e) => { Outside_click(e); }}>
        <Setting_panel_container />
        <div className="wkit-wb-widget-builder">
          <div className="wkit-wb-first-part content">
            <div className="wkit-wb-first-part-content">
              <Editor_container />
            </div>
            <div className="wkit-wb-first-second-drag"
              draggable
              onDragStart={(e) => { Drag_start(e) }}
              onDrag={(e) => { Drag_over(e) }}
              onDragEnd={(e) => { Drag_over(e) }}></div>
          </div>
          <div className="wkit-wb-second content">
            <div className="wb-second-header">
              <div className={active == "layout" ? "wb-second-header-layout active" : "wb-second-header-layout"} onClick={() => setactive("layout")} >
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 6H14.5M6.5 14V6M3.83333 2H13.1667C13.903 2 14.5 2.59695 14.5 3.33333V12.6667C14.5 13.403 13.903 14 13.1667 14H3.83333C3.09695 14 2.5 13.403 2.5 12.6667V3.33333C2.5 2.59695 3.09695 2 3.83333 2Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <span className="wb-layout-text">{__('Layout', 'wdesignkit')}</span>
              </div>
              <div className={active == "style" ? "wb-second-header-style active" : "wb-second-header-style"} onClick={() => setactive("style")} >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3337 6.66732V2.40065C13.3337 2.02728 13.3337 1.8406 13.261 1.69799C13.1971 1.57255 13.0951 1.47056 12.9697 1.40664C12.8271 1.33398 12.6404 1.33398 12.267 1.33398H3.73366C3.36029 1.33398 3.17361 1.33398 3.031 1.40664C2.90556 1.47056 2.80357 1.57255 2.73965 1.69799C2.66699 1.8406 2.66699 2.02728 2.66699 2.40065V6.66732M13.3337 6.66732H2.66699M13.3337 6.66732V6.80065C13.3337 7.92078 13.3337 8.48078 13.1157 8.90865C12.9239 9.28498 12.618 9.59092 12.2417 9.78265C11.8138 10.0007 11.2538 10.0007 10.1337 10.0007H5.86699C4.74689 10.0007 4.18683 10.0007 3.75901 9.78265C3.38269 9.59092 3.07673 9.28498 2.88498 8.90865C2.66699 8.48078 2.66699 7.92078 2.66699 6.80065V6.66732M9.66699 10.0007V13.0007C9.66699 13.9211 8.92079 14.6673 8.00033 14.6673C7.07986 14.6673 6.33366 13.9211 6.33366 13.0007V10.0007" strokeOpacity="0.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <span className="wb-style-text">{__('Style', 'wdesignkit')}</span>
              </div>
            </div>
            {active == "layout" &&
              < Wb_layout_container array_type={"layout"} />
            }
            {active == "style" &&
              < Wb_layout_container array_type={"style"} />
            }
          </div>
          <div className="wkit-wb-third content">
            <div className="wkit-wb-third-header">
              <div className={(props && !props.controller || !props.controller.controller) || (props && props.controller.controller?.controller_type) ? "wkit-wb-third-header-text activate" : "wkit-wb-third-header-text"} onClick={(e) => { props.addToActiveController(""); }} >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6106 9.44683V11.6135M11.6106 11.6135V13.7802M11.6106 11.6135H13.7772M11.6106 11.6135H9.4439M6.55501 9.92831V13.2987C6.55501 13.5646 6.33945 13.7802 6.07353 13.7802H2.70316C2.43725 13.7802 2.22168 13.5646 2.22168 13.2987V9.92831C2.22168 9.6624 2.43725 9.44683 2.70316 9.44683H6.07353C6.33945 9.44683 6.55501 9.6624 6.55501 9.92831ZM6.55501 2.70609V6.07646C6.55501 6.34238 6.33945 6.55794 6.07353 6.55794H2.70316C2.43725 6.55794 2.22168 6.34238 2.22168 6.07646V2.70609C2.22168 2.44018 2.43725 2.22461 2.70316 2.22461H6.07353C6.33945 2.22461 6.55501 2.44018 6.55501 2.70609ZM13.7772 2.70609V6.07646C13.7772 6.34238 13.5617 6.55794 13.2958 6.55794H9.92538C9.65947 6.55794 9.4439 6.34238 9.4439 6.07646V2.70609C9.4439 2.44018 9.65947 2.22461 9.92538 2.22461H13.2958C13.5617 2.22461 13.7772 2.44018 13.7772 2.70609Z" strokeLinecap="round" />
                </svg>
                <span>{__('Controls', 'wdesignkit')}</span>
              </div>
              <div className={(props && props.controller && props.controller.controller && !props.controller.controller?.controller_type) ? "wkit-wb-third-header-text activate" : "wkit-wb-third-header-text-edit"} >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.38444 2.20095H3.05527C2.72722 2.20095 2.41261 2.33127 2.18064 2.56323C1.94868 2.7952 1.81836 3.10981 1.81836 3.43786V12.0962C1.81836 12.4243 1.94868 12.7389 2.18064 12.9708C2.41261 13.2028 2.72722 13.3331 3.05527 13.3331H11.7136C12.0417 13.3331 12.3563 13.2028 12.5882 12.9708C12.8202 12.7389 12.9505 12.4243 12.9505 12.0962V7.76703M12.0228 1.27293C12.2689 1.02689 12.6026 0.888672 12.9505 0.888672C13.2985 0.888672 13.6322 1.02689 13.8782 1.27293C14.1242 1.51897 14.2625 1.85266 14.2625 2.20061C14.2625 2.54856 14.1242 2.88225 13.8782 3.12829L8.00289 9.0036L5.52908 9.62205L6.14753 7.14824L12.0228 1.27293Z" strokeOpacity="0.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <span>{__('Edit', 'wdesignkit')}</span>
              </div>
            </div>

            {props && props.controller && props.controller.controller && !props.controller.controller?.controller_type &&
              <BLock_edit_contaoner />
            }

            <div style={{ display: props && !props.controller || !props.controller.controller || props.controller.controller?.controller_type ? "block" : "none", height: '100%' }} >
              <Block_elementor_container
                array_type={active} />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Widget_builder;