import { useState, useEffect } from "react";
import BLock_edit_contaoner from "./redux-container/BLock_edit_container";
import Block_elementor_container from "./redux-container/Block_elementor_container";
import Editor_container from "./redux-container/editor_container";
import Setting_panel_container from "./redux-container/setting_panel_container";
import Wb_layout_container from "./redux-container/wb_layout_container";

const Widget_builder = (props) => {
  
  useEffect(() => {
    if (!document.body.classList.contains('folded')) {
      document.body.classList.add("folded");
    }
  });

  var img_path = wdkitData.WDKIT_URL;

  const [active, setactive] = useState("layout");

  var type_class = '';
  var x = 0;
  var w = 0;

  if (props && props.widgetdata && props.widgetdata.type && props.widgetdata.type == 'elementor') {
    type_class = 'wkit-elementor-builder';
  } else if (props && props.widgetdata && props.widgetdata.type && props.widgetdata.type == 'gutenberg') {
    type_class = 'wkit-gutenberg-builder';
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
          <div className="wkit-wb-first-part content" style={{ width: '55%' }}>
            <div className="wkit-wb-first-part-content">
              <Editor_container />
            </div>
            <div className="wkit-wb-first-second-drag"
              draggable
              onDragStart={(e) => { Drag_start(e) }}
              onDrag={(e) => { Drag_over(e) }}
              onDragEnd={(e) => { Drag_over(e) }}></div>
          </div>
          <div className="wkit-wb-second content" style={{ width: '20%' }}>
            <div className="wb-second-header">
              <div className={active == "layout" ? "wb-second-header-layout active" : "wb-second-header-layout"} onClick={() => setactive("layout")} >
                <svg className="wb-layout-icon" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path className={active == "layout" ? "wb-layout-path active-path" : "wb-layout-path"}
                    d="M0 6.423H7.932V17H0V6.423ZM0 0H7.932V5.288H0V0ZM9.445 0H18.7V17H9.445V0Z" />
                </svg>
                <span className="wb-layout-text">Layout</span>
              </div>
              <div className={active == "style" ? "wb-second-header-style active" : "wb-second-header-style"} onClick={() => setactive("style")} >
                <svg className="wb-style-icon" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className={active == "style" ? "wb-style-path active-path" : "wb-style-path"} fillRule="evenodd" clipRule="evenodd"
                    d="M3.10195 13.1641C2.45577 12.4338 1.99298 11.56 1.75195 10.6151L8.09095 4.27519L10.152 6.33718L3.20995 13.2791C3.19464 13.2621 3.17856 13.2456 3.16246 13.2291C3.14178 13.2079 3.12108 13.1866 3.10195 13.1641ZM3.72695 13.7931L10.667 6.85218L12.728 8.91318L6.49495 15.1451C5.45755 14.9824 4.4931 14.5113 3.72695 13.7931ZM14.016 0.927189L16.077 2.98919C16.2558 3.17501 16.3892 3.39976 16.4665 3.64579C16.5439 3.89182 16.5632 4.15244 16.523 4.40718C16.4442 4.95658 16.1862 5.46457 15.789 5.85218L14.789 6.85218L10.151 2.21618L11.151 1.21618C11.5034 0.814524 11.9949 0.561368 12.5266 0.507739C13.0582 0.454111 13.5904 0.603996 14.016 0.927189ZM1.20276 11.3255C1.50086 12.1755 1.95837 12.9609 2.55076 13.6395C3.39954 14.6597 4.53699 15.3994 5.81376 15.7615C5.80872 15.7629 5.80452 15.7661 5.80049 15.7693C5.79572 15.773 5.79118 15.7765 5.78576 15.7765L0.448758 16.9905C0.422239 16.9969 0.395055 17.0003 0.367758 17.0005C0.31308 17.0001 0.259169 16.9876 0.209986 16.9637C0.160803 16.9398 0.117598 16.9052 0.0835454 16.8624C0.0494932 16.8196 0.0254591 16.7697 0.0132093 16.7165C0.000959512 16.6632 0.000805241 16.6078 0.0127578 16.5545L1.20276 11.3255ZM13.2788 8.39945L14.3088 7.36845L9.67076 2.73145L8.64076 3.76245L13.2788 8.39945Z"
                  />
                </svg>
                <span className="wb-style-text">Style</span>
              </div>
            </div>
            {/* <div className={active == "layout" ? "" : "wkit-wb-hide"}>
              <Wb_layout_container array_type={active} />
            </div> */}
            {/* <div className={active == "style" ? "" : "wkit-wb-hide"}> */}
            {active == "layout" &&
              < Wb_layout_container array_type={"layout"} />
            }
            {active == "style" &&
              < Wb_layout_container array_type={"style"} />
            }
            {/* </div> */}
          </div>
          <div className="wkit-wb-third content" style={{ width: '20%' }}>
            <div className="wkit-wb-third-header">
              <div className={props && !props.controller || !props.controller.controller ? "wkit-wb-third-header-text activate" : "wkit-wb-third-header-text"} onClick={() => { props.addToActiveController(""); }} >
                <span>Controls</span>
              </div>
              <div className={props && props.controller && props.controller.controller ? "wkit-wb-third-header-text activate" : "wkit-wb-third-header-text"} style={{pointerEvents : 'none'}} >
                <span>Edit</span>
              </div>
            </div>
            <hr className="wkit-wb-component-hr" />
            {props && props.controller && props.controller.controller &&
              <BLock_edit_contaoner />
            }

            <div style={{ display: props && !props.controller || !props.controller.controller ? "block" : "none" }} >
              <Block_elementor_container />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Widget_builder;