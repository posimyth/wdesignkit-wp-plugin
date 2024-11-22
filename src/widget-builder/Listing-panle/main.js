const { __ } = wp.i18n;
const { Fragment } = wp.element;

import LisingPanel_popup_container from "../redux-container/lisingPanel_popup_container";
import axios from 'axios';
import { Link } from "react-router-dom";
import Elementor_file_create from "../file-creation/elementor_file";
import CreatFile from "../file-creation/gutenberg_file";
import {
  Wkit_template_Skeleton,
  wdKit_Form_data,
  get_user_login,
  Get_user_info_data,
  Wkit_availble_not,
  Toast_message,
  CardRatings,
  Page_header
} from '../../helper/helper-function';

import { useState, useEffect, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import "../style/main_page.scss";
import Bricks_file_create from "../file-creation/bricks_file";

const Main_page = (props) => {

  const [img_path, setimg_path] = useState(wdkitData.WDKIT_URL);
  const [editName, seteditName] = useState("");
  const [userData, setUserData] = useState("loading");
  const [w_favourite, setw_favourite] = useState([]);
  const [editDesc, seteditDesc] = useState("");
  const [editType, seteditType] = useState("");
  const [editmeta, seteditmeta] = useState("");
  const [widget_id, setwidget_id] = useState("");
  const [widget_server_id, setwidget_server_id] = useState("");
  const [popupSetup, setpopupSetup] = useState('add-widget');
  const [ClosePopup, setClosePopup] = useState(false);
  const [loading, setloading] = useState(true);
  const [ButtonLoading, setButtonLoading] = useState(true);
  const [perPage, setPerPage] = useState(12);
  const [totalpage, settotalpage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [start_id, setstart_id] = useState();
  const [end_id, setend_id] = useState();
  const [widget_list, setwidget_list] = useState([]);
  const [widget_image, setwidget_image] = useState('');
  const [w_version, setw_version] = useState('1.0.0');
  const [show_favourite, setshow_favourite] = useState(false);
  const [activate_loader, setactivate_loader] = useState(-1);
  const [Search_Widgets, setSearch_Widgets] = useState('');
  const [Searchwidgets, setSearchwidgets] = useState(false);
  const inputRef = useRef(null);
  const [BuilderArray, setBuilderArray] = useState([]);

  useEffect(() => {
    if (props.wdkit_meta) {
      setUserData(props.wdkit_meta);
    }
  }, [props.wdkit_meta]);

  useEffect(() => {
    Widget_array();
  }, [userData])

  useEffect(() => {
    var filterList = userData.widget_list;
    if (show_favourite && w_favourite.length > 0) {

      filterList = filterList.filter((data) => {
        if (w_favourite.length > 0 && w_favourite.includes(data.id)) {
          return data;
        }
      });
    }

    if (Search_Widgets) {

      filterList = filterList.filter((data) =>
        data.title.toLowerCase().includes(Search_Widgets.toLocaleLowerCase())
      );
    }

    setwidget_list(filterList);
    setActivePage(1);

    if (show_favourite) {
      settotalpage(Math.ceil(w_favourite?.length / perPage))
    } else {
      settotalpage(Math.ceil(widget_list?.length / perPage));
    }
  }, [show_favourite, Searchwidgets]);

  useEffect(() => {

    document.addEventListener('click', (e) => {
      if (Object.values(e.target.classList).includes('wkit-wb-3dot-icon') || Object.values(e.target.classList).includes('wkit-wb-3dot-click-img')) {
      } else if (document.querySelector('.wkit-wb-dropdown.wbdropdown-active')) {
        document.querySelector('.wkit-wb-dropdown.wbdropdown-active').classList.remove('wbdropdown-active');
      }
    })
  }, [])

  useEffect(() => {

    let builders = [];
    if (props?.wdkit_meta?.Setting?.elementor_builder) {
      builders.push('elementor');
    }
    if (props?.wdkit_meta?.Setting?.gutenberg_builder) {
      builders.push('gutenberg');
    }
    if (props?.wdkit_meta?.Setting?.bricks_builder) {
      builders.push('bricks');
    }

    setBuilderArray(builders);

  }, [props?.wdkit_meta?.Setting])

  const Update_List = async () => {
    let token = get_user_login();
    if (token) {
      await Get_user_info_data().then(async (result) => {
        if (result.success) {
          props.wdkit_set_meta(result.data)
          await setUserData(result.data)
        } else {
          await setUserData(props.wdkit_meta)

        }
      })
    } else {
      let form_array = {
        'type': 'wkit_meta_data',
        'meta_type': 'all'
      }

      var res = await wdKit_Form_data(form_array).then((res) => { return res });

      if (res?.data?.success == true) {
        props.wdkit_set_meta(res?.data)
      }
    }
    setloading(false);
    setButtonLoading(false);
    setshow_favourite(false);
  }

  const dropDownMenu = (event) => {
    let gg = event.target.parentElement;
    let allDropdown = gg.querySelectorAll('.wkit-wb-dropdown');

    if (allDropdown.length > 0) {
      allDropdown.forEach((ele) => {
        ele.classList.add("wbdropdown-active")
      });
    }
  }

  const importWidget = (e) => {

    setpopupSetup('import-widget')

    let popupHideShow = document.querySelector(".wb-editWidget-popup") ? document.querySelector(".wb-editWidget-popup") : "";
    if (popupHideShow) {
      popupHideShow.classList.add("show");
    }
  }

  const DuplicateWidget = (widget_data) => {
    setpopupSetup('duplicate-widget');
    setClosePopup(true);

    seteditName(widget_data.title);
    seteditType(widget_data.builder);
    setwidget_id(widget_data.w_unique);
    setwidget_image(widget_data?.image ? widget_data.image : '');
  }

  const RemoveWidget = (id) => {
    let index = widget_list?.findIndex((data) => data.w_unique == id);

    setpopupSetup('remove');

    seteditName(widget_list?.[index]?.title);
    seteditType(widget_list?.[index]?.builder);
    seteditmeta(widget_list?.[index]?.type);
    setwidget_id(widget_list?.[index]?.w_unique);
    if (widget_list?.[index]?.id) {
      setwidget_server_id(widget_list?.[index]?.id);
    }

    var popupHideShow = document.querySelector(".wb-editWidget-popup") ? document.querySelector(".wb-editWidget-popup") : "";
    if (popupHideShow) {
      popupHideShow.classList.add("show");
    }
  }

  const AddWidget = () => {

    setpopupSetup('add-widget')

    let popupHideShow = document.querySelector(".wb-editWidget-popup") ? document.querySelector(".wb-editWidget-popup") : "";
    if (popupHideShow) {
      popupHideShow.classList.add("show");
    }
  }

  const ExportWidget = async (e, GetwidgetName, widgetType, widget_id) => {

    let zip_name = GetwidgetName.replaceAll(" ", "_") + "_" + widget_id + ".zip";

    let widget_info = {
      'widget_name': GetwidgetName + "_" + widget_id,
      'widget_type': widgetType
    }

    let form = new FormData();
    form.append('action', 'wdkit_widget_ajax');
    form.append('kit_nonce', wdkitData.kit_nonce);
    form.append('type', 'wkit_export_widget');
    form.append('info', JSON.stringify(widget_info));

    await axios.post(ajaxurl, form).then(async (response) => {
      if (response?.data?.success) {
        await props.wdkit_set_toast([response?.data?.message, response?.data?.description, '', 'success'])
        if (response?.data?.url) {
          location.href = response?.data?.url;
        }
      }

      setTimeout(() => {
        let remove_info = {
          'name': zip_name,
          'builder': widgetType
        }

        let form_data = new FormData();
        form_data.append('action', 'wdkit_widget_ajax');
        form_data.append('kit_nonce', wdkitData.kit_nonce);
        form_data.append('type', 'wkit_delete_widget');
        form_data.append('info', JSON.stringify(remove_info));

        axios.post(ajaxurl, form_data).then((response) => { }).catch(error => console.log(error));
      }, 3000);


    })
  }

  const Popup_close = (e) => {
    if (e && e.target && Object.values(e.target.classList) && Object.values(e.target.classList).includes("wb-editWidget-popup")) {
      setClosePopup(false);
    } else if (e && e.target && Object.values(e.target.classList) && Object.values(e.target.classList).includes("wkit-wb-show")) {
      e.target.classList.remove('wkit-wb-show');
      if (document.querySelector('.wb-dropdown.wbdropdown-active')) {
        document.querySelector('.wb-dropdown.wbdropdown-active').classList.remove('wbdropdown-active');
      }
    }
  }

  const Activate_widget = async (id, index) => {
    setactivate_loader(index);
    if (id) {
      const Create_widget = async (data) => {
        let json = JSON.parse(data.json);
        let builder = json?.widget_data?.widgetdata?.type;
        let html = JSON.stringify(json?.Editor_data?.html);
        let js = JSON.stringify(json?.Editor_data?.js);
        let css = JSON.stringify(json?.Editor_data?.css);
        let image = data.image;
        let icon = '';

        var data = {
          "CardItems": {
            "cardData": json.section_data
          },

          "WcardData": json.widget_data,

          "Editor_data": json.Editor_Link,

          "Editor_code": {
            "Editor_codes": [json.Editor_data]
          }
        }

        var response = '';
        if (builder == "elementor") {
          response = await Elementor_file_create('private_download', data, html, css, js, "", image).then(async (res) => { return res })
        } else if (builder == "gutenberg") {
          response = await CreatFile('private_download', data, html, css, js, "", image).then(async (res) => { return res })
        } else if (builder == "bricks") {
          response = await Bricks_file_create('private_download', data, html, css, js, "", image).then(async (res) => { return res })
        }

        if (response && response.api.success == true) {
          await Update_List();
          await setactivate_loader(-1);
          props.wdkit_set_toast(["Widget Successfully Retrived", 'Widget Successfully Retrived .', '', 'success'])
          return true;
        } else {
          return false;
        }
      }

      let token = get_user_login();
      if (token) {

        let api_data = {
          "type": 'private_download',
          "w_uniq": id,
          "token": token.token,
        };

        let form_arr = { 'type': 'wkit_download_widget', 'widget_info': JSON.stringify(api_data) }
        await wdKit_Form_data(form_arr).then(async (result) => {
          if (result?.json != null) {
            await Create_widget(result);
            if (result) {
              props.wdkit_set_toast([result.message, 'Widget Successfully Retrived .', '', 'success'])
            }
          } else {
            props.wdkit_set_toast([result.message, result.description, '', 'danger'])
            setactivate_loader(-1);
            Update_List();
          }
        })
      }
    }
  }

  const favorite_widget = async (index, id) => {
    if (index) {
      let token = get_user_login();

      if (token) {

        let api_data = {
          "type": 'favourite',
          "w_uniq": index,
          "token": token.token,
        };

        let favoriteList = userData.favoritewidgets;
        if (favoriteList.findIndex((data) => data == id) > -1) {
          let index = favoriteList.findIndex((data) => data == id);
          favoriteList.splice(index, 1);
          setw_favourite([...favoriteList]);
        } else {
          favoriteList.push(id);
          setw_favourite([...favoriteList]);
        }

        let form_arr = { 'type': 'wkit_favourite_widget', 'widget_info': JSON.stringify(api_data) }
        await wdKit_Form_data(form_arr).then((result) => {
          if (result.data.success) {
            props.wdkit_set_toast([result?.data?.message, result?.data?.description, '', 'success'])
          } else {
            props.wdkit_set_toast([result?.data?.message, result?.data?.description, '', 'danger'])
          }
        })
      }
    }
  }

  const Widget_array = async () => {

    let token = get_user_login();
    if (token) {
      setw_favourite(userData.favoritewidgets)
      setwidget_list(userData.widget_list);
    } else {
      setwidget_list(userData.widget_list);
    }
  }

  const Widget_Convert = (widget_data) => {
    setpopupSetup('convert-widget');
    setClosePopup(true);

    seteditName(widget_data.title);
    seteditType(widget_data.builder);
    setwidget_id(widget_data.w_unique);
    setwidget_image(widget_data?.image ? widget_data.image : '');
  }

  useEffect(() => {
    let start_id = (activePage - 1) * perPage;
    let end_id = start_id + perPage;

    setstart_id(start_id);
    setend_id(end_id);


    if (show_favourite) {
      settotalpage(Math.ceil(w_favourite?.length / perPage));
    } else {
      settotalpage(Math.ceil(widget_list?.length / perPage));
    }

    setTimeout(() => {
      if (get_user_login() && props?.wdkit_meta?.success) {
        setloading(false)
        setButtonLoading(false)
      } else if (props?.wdkit_meta?.success) {
        setloading(false)
        setButtonLoading(false)
      }
    }, 800);
  }, [widget_list, activePage, perPage])

  const handleKeyPress = (e) => {
    if ('Enter' === e.key) {
      setSearchwidgets(!Searchwidgets);
      inputRef.current.blur();
    }
  };

  return (
    <>
      <div className="wb-widget-main-container">
        <Page_header
          title={'My Widgets'}
          svg={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20H20M9.5 15.5V9.5H5L12 2.5L19 9.5H14.5V15.5H9.5Z" stroke="#040483" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <div className="wb-creative-widget-main">
          <div className="wb-creative-row">


            <Fragment>
              {ButtonLoading == true ?
                <div className="wkit-widget-search-skeleton"></div>
                :
                <div className='wkit-widget-search-filter'>
                  {userData?.widget_list?.length > 0 &&
                    <div className='wkit-widget-search-inner'>
                      <input
                        className='wkit-widget-search-inp'
                        placeholder='Search Widgets'
                        type="text"
                        // value={searchQuery}
                        onChange={(e) => { setSearch_Widgets(e.target.value) }}
                        onKeyDown={handleKeyPress}
                        ref={inputRef}
                      />
                      <span className="wkit_search_button wkit-btn-class"
                        onClick={() => { setSearchwidgets(!Searchwidgets) }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none">
                          <path d="M14.4299 5.92969L20.4999 11.9997L14.4299 18.0697" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  }
                </div>
              }
            </Fragment>
            <div className={`wb-creative-button ${get_user_login() ? '' : 'wkit-login-disable'}`}>
              <Fragment>
                {false == ButtonLoading &&
                  <div className={get_user_login() ? '' : 'wkit-fav-plugin-link'}>
                    <span className="wkit-creative-button-toolTip wkit-fav-tooltip">{__('Login to use this option.')}</span>
                    <a className="wkit-plugin-link" onClick={() => { get_user_login() && setshow_favourite(!show_favourite); }} >
                      {true == show_favourite ?
                        <svg className="wkit-activate-favourites-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none"><path d="M8.99888 2.24221C10.4655 0.525545 13.1822 -0.174455 15.3822 1.32555C16.5489 2.12555 17.2822 3.47555 17.3322 4.89221C17.4405 8.12555 14.5822 10.7172 10.2072 14.6839L10.1155 14.7672C9.48221 15.3505 8.50721 15.3505 7.87388 14.7755L7.79054 14.7005L7.74021 14.6548C3.39357 10.7056 0.549324 8.12146 0.665542 4.90055C0.715542 3.47555 1.44888 2.12555 2.61554 1.32555C4.81554 -0.182788 7.53221 0.525545 8.99888 2.24221Z" fill="#040483" /></svg>
                        :
                        <svg className="wkit-favourites-icon" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.3822 1.32457C13.1822 -0.175432 10.4655 0.524569 8.99888 2.24124C7.53221 0.524569 4.81554 -0.183765 2.61554 1.32457C1.44888 2.12457 0.715542 3.47457 0.665542 4.89957C0.548876 8.1329 3.41554 10.7246 7.79054 14.6996L7.87388 14.7746C8.50721 15.3496 9.48221 15.3496 10.1155 14.7662L10.2072 14.6829C14.5822 10.7162 17.4405 8.12457 17.3322 4.89124C17.2822 3.47457 16.5489 2.12457 15.3822 1.32457ZM9.08221 13.4579L8.99888 13.5412L8.91554 13.4579C4.94888 9.86624 2.33221 7.49124 2.33221 5.0829C2.33221 3.41624 3.58221 2.16624 5.24888 2.16624C6.53221 2.16624 7.78221 2.99124 8.22388 4.1329H9.78221C10.2155 2.99124 11.4655 2.16624 12.7489 2.16624C14.4155 2.16624 15.6655 3.41624 15.6655 5.0829C15.6655 7.49124 13.0489 9.86624 9.08221 13.4579Z" /></svg>
                      }
                      {__('Favourites')}
                    </a>
                  </div>
                }
              </Fragment>
              <Fragment>
                {true == ButtonLoading &&
                  <Fragment>
                    <button className={"wkit-primary-btn-skeleton"} ></button>
                    <button className={"wkit-primary-btn-skeleton"} ></button>
                  </Fragment>
                }

                {false == ButtonLoading &&
                  <Fragment>
                    <div className={get_user_login() ? '' : 'wkit-primary-button-container'}>
                      <span className="wkit-creative-button-toolTip wkit-primary-button-tooltip">{__('Login to use this option.')}</span>
                      <button className="wkit-button-primary wkit-outer-btn-class" onClick={(e) => { importWidget(e), setClosePopup(true) }} disabled={get_user_login() ? false : true}>{__('Import Widget')}</button>
                    </div>
                    <div className={get_user_login() ? '' : 'wkit-secondary-button-container'}>
                      <span className="wkit-creative-button-toolTip wkit-secondary-button-tooltip">{__('Login to use this option.')}</span>
                      <button className="wkit-button-secondary wkit-btn-class" onClick={(e) => { AddWidget(e), setClosePopup(true) }} disabled={get_user_login() ? false : true}>{__('Create Widget')}</button>
                    </div>
                  </Fragment>
                }
              </Fragment>

            </div>
          </div>
          {loading == true &&
            <div>
              <Wkit_template_Skeleton />
            </div>
          }
          {widget_list?.length <= 0 && loading == false &&
            <Wkit_availble_not page={'widget'} link={wdkitData.WDKIT_DOC_URL + 'documents/create-custom-elementor-widget-using-free-wdesignkit-widget-builder/'} />
          }
          {loading == false &&
            <div className="wkit-skeleton-row">
              {widget_list?.length > 0 &&
                widget_list.map((Widgets, index) => {
                  if (Widgets && start_id <= index && end_id > index) {
                    return (
                      <Fragment key={index}>
                        <div className="wkit-wb-widget-grid-content">
                          {Widgets.is_activated !== 'active' &&
                            <Fragment>
                              <div className='wdkit-inner-boxed-deActivate' style={{ zIndex: '19' }}>
                                <div className='wdkit-inner-boxed-deActivate-h1'>{__('Credit Limit Reached!')}</div>
                                <div className='wdkit-inner-boxed-deActivate-p'>{__('This Widget got disabled until you have more credits to make it active.')}</div>
                                <a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
                                  <button>{__('Buy Credits')}</button>
                                </a>
                              </div>
                              <span className='wdkit-inner-boxed-remove' style={{ zIndex: '29' }}>
                                <svg onClick={(e) => { RemoveWidget(Widgets.w_unique), setClosePopup(true); }} xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M5.66634 1.83203C5.44533 1.83203 5.23337 1.91983 5.07709 2.07611C4.9208 2.23239 4.83301 2.44435 4.83301 2.66536V3.4987H9.16634V2.66536C9.16634 2.44435 9.07854 2.23239 8.92226 2.07611C8.76598 1.91983 8.55402 1.83203 8.33301 1.83203H5.66634ZM10.1663 3.4987V2.66536C10.1663 2.17913 9.97319 1.71282 9.62937 1.369C9.28555 1.02519 8.81924 0.832031 8.33301 0.832031H5.66634C5.18011 0.832031 4.7138 1.02519 4.36998 1.369C4.02616 1.71282 3.83301 2.17913 3.83301 2.66536V3.4987H2.33301C2.32078 3.4987 2.30865 3.49914 2.29664 3.5H1C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5H1.83301V13.332C1.83301 13.8183 2.02616 14.2846 2.36998 14.6284C2.7138 14.9722 3.18011 15.1654 3.66634 15.1654H10.333C10.8192 15.1654 11.2856 14.9722 11.6294 14.6284C11.9732 14.2846 12.1663 13.8183 12.1663 13.332V4.5H13C13.2761 4.5 13.5 4.27614 13.5 4C13.5 3.72386 13.2761 3.5 13 3.5H11.7027C11.6907 3.49914 11.6786 3.4987 11.6663 3.4987H10.1663ZM2.83301 13.332V4.5H11.1663V13.332C11.1663 13.553 11.0785 13.765 10.9223 13.9213C10.766 14.0776 10.554 14.1654 10.333 14.1654H3.66634C3.44533 14.1654 3.23337 14.0776 3.07709 13.9213C2.9208 13.765 2.83301 13.553 2.83301 13.332ZM7.5 7.33203C7.5 7.05589 7.27614 6.83203 7 6.83203C6.72386 6.83203 6.5 7.05589 6.5 7.33203V11.332C6.5 11.6082 6.72386 11.832 7 11.832C7.27614 11.832 7.5 11.6082 7.5 11.332V7.33203Z" fill="#1E1E1E" />
                                </svg>
                              </span>
                            </Fragment>
                          }
                          <div className="wkit-wb-widget-card-main">
                            {(Widgets?.type == 'server') &&
                              <div className="wkit-wb-widget-download">
                                <div className="wkit-wb-download-btn" onClick={(e) => { Activate_widget(Widgets.w_unique, index) }}>
                                  <div className="wkit-wb-download-icon">
                                    <svg width="18" height="17" viewBox="0 0 21 20" fill="white" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M10.6527 0.0594931C10.559 0.0946655 10.4065 0.196274 10.3167 0.286159C10.004 0.598802 10.0236 0.196274 10.0236 5.92936V11.0333L9.23413 10.2438C8.39 9.4036 8.24149 9.29808 7.91713 9.29418C7.63184 9.29418 7.44035 9.37625 7.2215 9.58728C6.89713 9.90383 6.82679 10.2712 7.01437 10.6815C7.06127 10.787 7.53414 11.2873 8.50333 12.2526C9.77735 13.5188 9.95321 13.679 10.1799 13.7845C10.6996 14.0268 11.2702 14.0307 11.8017 13.8001C12.0088 13.7063 12.1964 13.5383 13.4783 12.2682C14.5334 11.2208 14.9399 10.791 14.9946 10.6659C15.0923 10.4549 15.0962 10.111 15.0063 9.89992C14.8656 9.55602 14.4709 9.29418 14.1074 9.29418C13.7557 9.29808 13.6228 9.39188 12.7709 10.2438L11.9776 11.0333V5.92936C11.9776 0.196274 11.9971 0.598802 11.6845 0.286159C11.4148 0.0125961 11.024 -0.0694723 10.6527 0.0594931Z" />
                                      <path d="M1.62294 9.08725C1.38064 9.17323 1.13834 9.42725 1.05237 9.68518C0.993745 9.86495 0.985929 9.97437 1.00938 10.4433C1.09535 12.3036 1.66593 14.0426 2.68201 15.555C3.43626 16.6845 4.58522 17.7904 5.72246 18.4978C8.43464 20.1782 11.7486 20.4635 14.7383 19.2794C16.0123 18.7753 17.1378 18.0093 18.1695 16.9502C19.9008 15.1721 20.8778 12.9171 20.9911 10.4355C21.0185 9.77897 20.9677 9.57185 20.7098 9.31392C20.3268 8.93093 19.7249 8.93093 19.3419 9.31392C19.127 9.52886 19.0606 9.7438 19.0332 10.3495C19.0019 10.9748 18.9238 11.5024 18.7714 12.0691C18.0171 14.8985 15.7427 17.1261 12.9015 17.8139C8.61831 18.8534 4.29994 16.2546 3.20178 11.9753C3.065 11.436 2.94776 10.5958 2.94776 10.1307C2.94776 9.76725 2.85788 9.51714 2.65466 9.31392C2.385 9.04036 1.9942 8.95829 1.62294 9.08725Z" />
                                    </svg>
                                  </div>
                                  {activate_loader == index &&
                                    <div className="wkit-wb-download-loader"></div>
                                  }
                                </div>
                              </div>
                            }
                            <div className="wkit-wb-upper-icons" style={Widgets.type == 'server' || Widgets.is_activated != 'active' ? { zIndex: '1' } : { zIndex: '39' }}>
                              {Widgets.type == 'plugin' &&
                                <div className="wdkit-widget-type">
                                  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 2.25H3.5C2.67157 2.25 2 2.92157 2 3.75V11.25C2 12.0784 2.67157 12.75 3.5 12.75H15.5C16.3284 12.75 17 12.0784 17 11.25V3.75C17 2.92157 16.3284 2.25 15.5 2.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.5 15.75H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.5 12.75V15.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  {__('Local')}
                                </div>
                              }
                              {Widgets.type == 'server' &&
                                <div className="wdkit-widget-type">
                                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_10782_27626)">
                                      <path d="M13.5006 7.5H12.5556C12.275 6.41325 11.6952 5.42699 10.8821 4.6533C10.0689 3.8796 9.05511 3.34949 7.95576 3.12321C6.85642 2.89692 5.71564 2.98353 4.66306 3.37319C3.61048 3.76286 2.6883 4.43995 2.00131 5.32754C1.31432 6.21512 0.890064 7.27761 0.776752 8.39427C0.663439 9.51092 0.865614 10.637 1.3603 11.6445C1.85499 12.652 2.62236 13.5005 3.57521 14.0937C4.52806 14.6868 5.62818 15.0008 6.75057 15H13.5006C14.4951 15 15.449 14.6049 16.1522 13.9017C16.8555 13.1984 17.2506 12.2446 17.2506 11.25C17.2506 10.2554 16.8555 9.30161 16.1522 8.59835C15.449 7.89509 14.4951 7.5 13.5006 7.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_10782_27626">
                                        <rect width="18" height="18" fill="white" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  {__('Remote')}
                                </div>
                              }
                              {(Widgets.type == 'update' || Widgets.type == 'done') &&
                                <div className="wdkit-widget-type">
                                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_10782_27626)">
                                      <path d="M13.5006 7.5H12.5556C12.275 6.41325 11.6952 5.42699 10.8821 4.6533C10.0689 3.8796 9.05511 3.34949 7.95576 3.12321C6.85642 2.89692 5.71564 2.98353 4.66306 3.37319C3.61048 3.76286 2.6883 4.43995 2.00131 5.32754C1.31432 6.21512 0.890064 7.27761 0.776752 8.39427C0.663439 9.51092 0.865614 10.637 1.3603 11.6445C1.85499 12.652 2.62236 13.5005 3.57521 14.0937C4.52806 14.6868 5.62818 15.0008 6.75057 15H13.5006C14.4951 15 15.449 14.6049 16.1522 13.9017C16.8555 13.1984 17.2506 12.2446 17.2506 11.25C17.2506 10.2554 16.8555 9.30161 16.1522 8.59835C15.449 7.89509 14.4951 7.5 13.5006 7.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_10782_27626">
                                        <rect width="18" height="18" fill="white" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 2.25H3.5C2.67157 2.25 2 2.92157 2 3.75V11.25C2 12.0784 2.67157 12.75 3.5 12.75H15.5C16.3284 12.75 17 12.0784 17 11.25V3.75C17 2.92157 16.3284 2.25 15.5 2.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.5 15.75H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.5 12.75V15.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  {__('Local + Remote')}
                                </div>
                              }
                              {Widgets.type != 'plugin' &&
                                <Fragment>
                                  <div className="wkit-wb-fav-icon wkit-wb-select-fav" onClick={(e) => { favorite_widget(Widgets.w_unique, Widgets.id) }}>
                                    {w_favourite?.length > 0 && w_favourite?.includes(Widgets.id) ?
                                      <Fragment>
                                        <img src={img_path + "/assets/images/wb-svg/fav-icon-selected.svg"} />
                                        <span className="wkit-wb-tooltiplist">{__('UnFavourite')}</span>
                                      </Fragment>
                                      :
                                      <Fragment>
                                        <img src={img_path + "/assets/images/wb-svg/fav-icon.svg"} />
                                        <span className="wkit-wb-tooltiplist">{__('Favourite')}</span>
                                      </Fragment>
                                    }
                                  </div>
                                  <div className="wkit-wb-fav-icon">
                                    {Widgets.status == 'private' ?
                                      <Fragment>
                                        <img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/private.svg"} alt="private" />
                                        <span className="wkit-wb-tooltiplist">{__('Private')}</span>
                                      </Fragment>
                                      :
                                      <Fragment>
                                        <img src={img_path + "/assets/images/svg/public.svg"} />
                                        <span className="wkit-wb-tooltiplist">{__('Public')}</span>
                                      </Fragment>
                                    }
                                  </div>
                                </Fragment>
                              }
                            </div>
                            {Widgets?.free_pro == "pro" &&
                              <div className="wdkit-card-tag">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 16.5H5.25C4.9425 16.5 4.6875 16.245 4.6875 15.9375C4.6875 15.63 4.9425 15.375 5.25 15.375H12.75C13.0575 15.375 13.3125 15.63 13.3125 15.9375C13.3125 16.245 13.0575 16.5 12.75 16.5Z" fill="white" /><path d="M15.2622 4.14003L12.2622 6.28503C11.8647 6.57003 11.2947 6.39753 11.1222 5.94003L9.70468 2.16003C9.46468 1.50753 8.54218 1.50753 8.30218 2.16003L6.87718 5.93253C6.70468 6.39753 6.14218 6.57003 5.74468 6.27753L2.74468 4.13253C2.14468 3.71253 1.34968 4.30503 1.59718 5.00253L4.71718 13.74C4.82218 14.04 5.10718 14.235 5.42218 14.235H12.5697C12.8847 14.235 13.1697 14.0325 13.2747 13.74L16.3947 5.00253C16.6497 4.30503 15.8547 3.71253 15.2622 4.14003ZM10.8747 11.0625H7.12468C6.81718 11.0625 6.56218 10.8075 6.56218 10.5C6.56218 10.1925 6.81718 9.93753 7.12468 9.93753H10.8747C11.1822 9.93753 11.4372 10.1925 11.4372 10.5C11.4372 10.8075 11.1822 11.0625 10.8747 11.0625Z" fill="white" /></svg>
                                <span>{__('Pro')}</span>
                              </div>
                            }
                            <div className="wkit-wb-widget-image-content">
                              {get_user_login() ?
                                <Link style={{ color: 'black' }} target='_blank' rel="noopener noreferrer" to={`/widget-listing/builder/${Widgets.title + "_" + Widgets.w_unique}`} >
                                  <div className="wkit-wb-widget-img" style={{ backgroundImage: `url("${Widgets.image}")` }}></div>
                                </Link>
                                :
                                <div className="wkit-wb-widget-img" style={{ backgroundImage: `url("${Widgets.image}")` }}></div>
                              }
                            </div>
                            <div className="wkit-wb-card-detail-content">
                              <div className="wkit-wb-title-content">
                                {get_user_login() ?
                                  <Link style={{ color: 'black' }} target='_blank' rel="noopener noreferrer" to={`/widget-listing/builder/${Widgets.title + "_" + Widgets.w_unique}`} >
                                    <span className="wdkit-widget-title">{Widgets.title}</span>
                                  </Link>
                                  :
                                  <span className="wdkit-widget-title">{Widgets.title}</span>
                                }
                                {Widgets?.type != 'server' &&
                                  <div className="wkit-wb-widget-dropDown">
                                    <span className="wkit-wb-3dot-icon" data-widgetid={index} onClick={dropDownMenu}>
                                      <img className="wkit-wb-3dot-click-img" src={img_path + "assets/images/wb-svg/3-dot.svg"} alt="wb-view-icon" data-widgetid={index} />
                                      <ul className="wkit-wb-dropdown">
                                        {get_user_login() &&
                                          <Link className="wkit-wb-edit-widget-btn" target='_blank' rel="noopener noreferrer" to={`/widget-listing/builder/${Widgets.title + "_" + Widgets.w_unique}`} >
                                            <li>
                                              <span className="wkit-wb-listmenu-svg">
                                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M10.625 2.37324C10.7892 2.20908 10.984 2.07887 11.1985 1.99003C11.413 1.90119 11.6429 1.85547 11.875 1.85547C12.1071 1.85547 12.337 1.90119 12.5515 1.99003C12.766 2.07887 12.9608 2.20908 13.125 2.37324C13.2892 2.53739 13.4194 2.73227 13.5082 2.94674C13.597 3.16122 13.6428 3.39109 13.6428 3.62324C13.6428 3.85538 13.597 4.08526 13.5082 4.29973C13.4194 4.51421 13.2892 4.70908 13.125 4.87324L4.6875 13.3107L1.25 14.2482L2.1875 10.8107L10.625 2.37324Z" stroke="#737373" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                              </span>
                                              <span className="wkit-wb-listmenu-text">{__('Edit in New Tab')}</span>
                                            </li>
                                          </Link>
                                        }
                                        <div className="wkit-wb-mainmenu">
                                          <li onClick={(e) => { RemoveWidget(Widgets.w_unique), setClosePopup(true); }} data-deleteid={index}>
                                            <span className="wkit-wb-listmenu-svg">
                                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.75 5.50006H4.91667M4.91667 5.50006H14.25M4.91667 5.50006L4.91638 13.666C4.91638 13.9754 5.0393 14.2722 5.25809 14.491C5.47688 14.7098 5.77363 14.8327 6.08305 14.8327H11.9164C12.2258 14.8327 12.5225 14.7098 12.7413 14.491C12.9601 14.2722 13.083 13.9754 13.083 13.666V5.49935M6.66638 5.49935V4.33268C6.66638 4.02326 6.7893 3.72652 7.00809 3.50772C7.22688 3.28893 7.52363 3.16602 7.83305 3.16602H10.1664C10.4758 3.16602 10.7725 3.28893 10.9913 3.50772C11.2101 3.72652 11.333 4.02326 11.333 4.33268V5.49935" stroke="#737373" strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round" />
                                              </svg>
                                            </span>
                                            <span className="wkit-wb-listmenu-text">{__('Delete')}</span>
                                          </li>
                                        </div>
                                        <div className="wkit-wb-mainmenu">
                                          <li onClick={() => { DuplicateWidget(Widgets) }}>
                                            <span className="wkit-wb-listmenu-svg">
                                              <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.64328 5.14612H3.2147C2.83582 5.14612 2.47246 5.29663 2.20455 5.56454C1.93664 5.83244 1.78613 6.19581 1.78613 6.57469V12.2868C1.78613 12.6657 1.93664 13.0291 2.20455 13.297C2.47246 13.5649 2.83582 13.7154 3.2147 13.7154H3.21685L8.93113 13.7054C9.30964 13.7048 9.67246 13.5541 9.9399 13.2862C10.2073 13.0184 10.3576 12.6553 10.3576 12.2768V10.8604M8.92899 4.42969V8.7154M11.0718 6.57255H6.78613M13.215 9.42801V3.71373C13.215 3.33485 13.0645 2.97148 12.7966 2.70358C12.5287 2.43567 12.1653 2.28516 11.7864 2.28516H6.07213C5.69325 2.28516 5.32988 2.43567 5.06197 2.70358C4.79406 2.97148 4.64355 3.33485 4.64355 3.71373V9.42801C4.64355 9.8069 4.79406 10.1703 5.06197 10.4382C5.32988 10.7061 5.69325 10.8566 6.07213 10.8566H11.7864C12.1653 10.8566 12.5287 10.7061 12.7966 10.4382C13.0645 10.1703 13.215 9.8069 13.215 9.42801Z" stroke="#737373" strokeLinecap="round" strokeLinejoin="round" />
                                              </svg>
                                            </span>
                                            <span className="wkit-wb-listmenu-text">{__('Duplicate')}</span>
                                          </li>
                                        </div>
                                        {BuilderArray.length > 1 && userData?.credits?.convert_widget?.meta_value == '1' &&
                                          <div className="wkit-wb-mainmenu">
                                            <li onClick={() => { Widget_Convert(Widgets) }}>
                                              <span className="wkit-wb-listmenu-svg">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 25 24" fill="none">
                                                  <path d="M2.56465 10.5233C2.43348 10.2066 2.50598 9.84216 2.74828 9.59981L6.60371 5.74438C6.93477 5.41333 7.47121 5.41333 7.80223 5.74438C8.13316 6.07524 8.13316 6.61188 7.80223 6.94274L5.39344 9.35153H21.6525C22.1205 9.35153 22.5 9.73091 22.5 10.199C22.5 10.6671 22.1205 11.0465 21.6525 11.0465H3.34754C3.00477 11.0465 2.69582 10.8399 2.56465 10.5233ZM21.6525 12.9533H3.34746C2.87945 12.9533 2.5 13.3326 2.5 13.8007C2.5 14.2688 2.87945 14.6482 3.34746 14.6482H19.6066L17.1977 17.057C16.8668 17.3878 16.8668 17.9245 17.1977 18.2553C17.3632 18.4208 17.58 18.5036 17.797 18.5036C18.0138 18.5036 18.2307 18.4208 18.3962 18.2553L22.2517 14.3999C22.494 14.1576 22.5665 13.7931 22.4354 13.4765C22.3042 13.1598 21.9952 12.9533 21.6525 12.9533Z" fill="#737373" />
                                                </svg>
                                              </span>
                                              <span className="wkit-wb-listmenu-text">{__('Convert')}</span>
                                            </li>
                                          </div>
                                        }
                                        <div className="wkit-wb-mainmenu">
                                          <li className="wkit-wb-export-widget-btn" onClick={(e) => { ExportWidget(e, Widgets.title, Widgets.builder, Widgets.w_unique) }}>
                                            <span className="wkit-wb-listmenu-svg">
                                              <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.1875 4.25V2.375H2.8125V4.25H1.875V2.375L1.87875 2.37734C1.87832 2.25431 1.90213 2.1324 1.94883 2.01858C1.99553 1.90475 2.06419 1.80124 2.15091 1.71397C2.23762 1.62669 2.34068 1.55735 2.4542 1.50991C2.56772 1.46247 2.68947 1.43787 2.8125 1.4375H12.1875C12.4361 1.4375 12.6746 1.53627 12.8504 1.71209C13.0262 1.8879 13.125 2.12636 13.125 2.375V4.25H12.1875ZM2.8125 9.875L3.47391 9.21641L7.03125 12.7695V4.25H7.96875V12.7695L11.527 9.21641L12.1875 9.875L7.5 14.5625L2.8125 9.875Z" fill="#737373" />
                                              </svg>
                                            </span>
                                            <span className="wkit-wb-listmenu-text">{__('Download ZIP')} </span>
                                          </li>
                                        </div>
                                        {get_user_login() && (Widgets?.allow_push != undefined && Widgets?.allow_push != false) &&
                                          <div className="wkit-wb-mainmenu">
                                            <li onClick={(e) => {
                                              setpopupSetup('sync'),
                                                setClosePopup(true),
                                                seteditName(Widgets.title),
                                                seteditType(Widgets.builder),
                                                setwidget_id(Widgets.w_unique),
                                                setw_version(Widgets.w_version),
                                                seteditmeta(Widgets.type);
                                            }}>
                                              <span className="wkit-wb-listmenu-svg">
                                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M12.1875 11.75V13.625H2.8125V11.75H1.875V13.625L1.87875 13.6227C1.87832 13.7457 1.90213 13.8676 1.94883 13.9814C1.99553 14.0952 2.06419 14.1988 2.15091 14.286C2.23762 14.3733 2.34068 14.4427 2.4542 14.4901C2.56772 14.5375 2.68947 14.5621 2.8125 14.5625H12.1875C12.4361 14.5625 12.6746 14.4637 12.8504 14.2879C13.0262 14.1121 13.125 13.8736 13.125 13.625V11.75H12.1875ZM2.8125 6.125L3.47391 6.78359L7.03125 3.23047V11.75H7.96875V3.23047L11.527 6.78359L12.1875 6.125L7.5 1.4375L2.8125 6.125Z" fill="#737373" />
                                                </svg>
                                              </span>
                                              <span className="wkit-wb-listmenu-text">{__('Push Widget')}</span>
                                            </li>
                                          </div>
                                        }
                                      </ul>
                                    </span>
                                  </div>
                                }
                              </div>
                              {Widgets?.avg_rating != undefined && Widgets?.total_rating != undefined &&
                                <div>
                                  <CardRatings
                                    avg_rating={Widgets?.avg_rating}
                                    total_rating={Widgets?.total_rating}
                                  />
                                </div>
                              }
                              <div className="wkit-wb-widget-info">
                                <div className="wkit-wb-info-icons-content">
                                  {Widgets?.views != undefined &&
                                    <>
                                      <div className="wkit-wb-info-icons">
                                        <img src={img_path + "/assets/images/svg/eye.svg"} alt="wb-view-icon" draggable={false} />
                                        <span>{Widgets?.views != undefined ? Widgets.views : 0}</span>
                                      </div>
                                      <hr className="wkit-wb-divider-hr" />
                                      <div className="wkit-wb-info-icons">
                                        <img src={img_path + "/assets/images/svg/download-template.svg"} alt="wb-view-icon" draggable={false} />
                                        <span>{Widgets?.download != undefined ? Widgets.download : 0}</span>
                                      </div>
                                    </>
                                  }
                                </div>
                                <div className="wkit-wb-widget-category-icon">
                                  {Widgets?.builder == "elementor" &&
                                    <img src={img_path + "/assets/images/wb-svg/elementor.svg"} draggable={false} />
                                  }
                                  {Widgets?.builder == "gutenberg" &&
                                    <img src={img_path + "/assets/images/wb-svg/gutenberg.svg"} draggable={false} />
                                  }
                                  {Widgets?.builder == "bricks" &&
                                    <img src={img_path + "/assets/images/wb-svg/bricks.svg"} draggable={false} />
                                  }
                                  <span className="wkit-wb-tooltiplist">{Widgets?.builder}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    );
                  } else {
                    return false;
                  }
                })
              }
            </div>
          }
          <div className="wkit-wb-paginatelist">
            {(widget_list?.length > perPage && totalpage > 1) &&
              <div className='wkit-pagination-main'>
                <ReactPaginate
                  breakLabel={"..."}
                  nextLabel={<svg xmlns="http://www.w3.org/2000/svg" width="7" height="11" viewBox="0 0 7 11" fill="none">
                    <path d="M0.412598 9.52417L4.48371 5.44417L0.412598 1.36417L1.66593 0.11084L6.99926 5.44417L1.66593 10.7775L0.412598 9.52417Z" fill="#8991A4" />
                  </svg>}
                  pageRangeDisplayed={2}
                  pageCount={totalpage}
                  marginPagesDisplayed={1}
                  previousLabel={<svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none">
                    <path d="M7.47754 1.36352L3.40643 5.44352L7.47754 9.52352L6.22421 10.7769L0.890873 5.44352L6.22421 0.110189L7.47754 1.36352Z" fill="#8991A4" />
                  </svg>}
                  pageClassName={"wkit-page-item"}
                  pageLinkClassName={"wkit-pagination-item"}
                  previousClassName={"wkit-next-prev wkit-prev-pagination"}
                  previousLinkClassName={"wkit-pagination-item"}
                  nextClassName={"wkit-next-prev wkit-next-pagination"}
                  nextLinkClassName={"wkit-pagination-item"}
                  breakClassName={"wkit-page-item"}
                  breakLinkClassName={"page-link"}
                  containerClassName={"wkit-pagination"}
                  activeClassName={"active"}
                  onClick={(clickEvent) => {
                    window.scrollTo(0, 0);
                    if (clickEvent.nextSelectedPage != undefined) {
                      setloading(true);
                      setButtonLoading(true);
                      setActivePage(clickEvent.nextSelectedPage + 1)
                    }
                  }}
                  forcePage={activePage - 1}
                  onPageActive={() => { }}
                />
              </div>
            }
          </div>
        </div>
      </div >

      {ClosePopup == true ?
        <div className="wb-editWidget-popup" onClick={(e) => Popup_close(e)}>
          <div className={`wb-edit-popup wdkit-${popupSetup}-popup`} >
            <LisingPanel_popup_container
              quickeditName={editName}
              quickediteditDesc={editDesc}
              quickediteditType={editType}
              quickediteditMeta={editmeta}
              w_version={w_version}
              widget_id={widget_id}
              widget_image={widget_image}
              BuilderArray={BuilderArray}
              widget_server_id={widget_server_id}
              UpdateData={() => Update_List()}
              ClosePopup={() => { setClosePopup(false) }}
              StartLoading={() => { setloading(true) }}
              endLoading={() => { setloading(false) }}
              popup={popupSetup && popupSetup}
            />
          </div>
        </div>
        : ""
      }
    </>
  );
}

export default Main_page;