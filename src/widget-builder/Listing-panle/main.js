import "../style/main_page.scss";
import LisingPanel_popup_container from "../redux-container/lisingPanel_popup_container";
import axios from 'axios';
import { Link } from "react-router-dom";
import Elementor_file_create from "../file-creation/elementor_file";
import CreatFile from "../file-creation/gutenberg_file";
import { Wkit_template_Skeleton, wdKit_Form_data, get_user_login, Get_user_info_data, Wkit_availble_not, Toast_message, Show_toast, CardRatings } from '../../helper/helper-function';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
const { Fragment } = wp.element;

const Main_page = (props) => {

  const [img_path, setimg_path] = useState(wdkitData.WDKIT_URL);
  const [upload_path, setupload_path] = useState(wdkitData.WDKIT_SERVER_PATH);
  const [editName, seteditName] = useState("");
  const [userData, setUserData] = useState("loading");
  const [w_favourite, setw_favourite] = useState([]);
  const [editDesc, seteditDesc] = useState("");
  const [editType, seteditType] = useState("");
  const [editmeta, seteditmeta] = useState("");
  const [widget_id, setwidget_id] = useState("");
  const [widget_server_id, setwidget_server_id] = useState("");
  const [popupSetup, setpopupSetup] = useState('add-widget');
  const [WidgetListData, setWidgetListData] = useState([]);
  const [ClosePopup, setClosePopup] = useState(false);
  const [loading, setloading] = useState(true);
  const [perPage, setPerPage] = useState(12);
  const [totalpage, settotalpage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [start_id, setstart_id] = useState();
  const [end_id, setend_id] = useState();
  const [widget_list, setwidget_list] = useState([]);
  const [serverArray, setServerArray] = useState([]);
  // const [widget_limit, setwidget_limit] = useState(5);
  const [widget_image, setwidget_image] = useState('');
  const [w_version, setw_version] = useState('1.0.0');
  const [show_favourite, setshow_favourite] = useState(false);
  const [activate_loader, setactivate_loader] = useState(-1);
  const [toast, settoast] = useState(false);

  useEffect(() => {
    if (props.wdkit_meta) {
      setUserData(props.wdkit_meta);
    }
  }, [props.wdkit_meta]);

  useEffect(() => {
    Widget_array();
  }, [WidgetListData, userData, show_favourite])

  useEffect(() => {
    if (show_favourite) {
      settotalpage(Math.ceil(w_favourite?.length / perPage))
    } else {
      settotalpage(Math.ceil(widget_list?.length / perPage));
    }
  }, [show_favourite]);

  useEffect(() => {
    WidgetListdata();
    document.addEventListener('click', (e) => {
      if (Object.values(e.target.classList).includes('wkit-wb-3dot-icon') || Object.values(e.target.classList).includes('wkit-wb-3dot-click-img')) {
      } else if (document.querySelector('.wkit-wb-dropdown.wbdropdown-active')) {
        document.querySelector('.wkit-wb-dropdown.wbdropdown-active').classList.remove('wbdropdown-active');
      }
    })
  }, [])

  const Update_List = async () => {
    await Get_user_info_data().then(async (result) => {
      if (result.success) {
        await setUserData(result.data)
      } else {
        await setUserData(props.wdkit_meta)

      }
    })
    await WidgetListdata();
    setloading(false);
  }

  const WidgetListdata = async () => {
    let form_arr = { 'type': 'wkit_get_widget_list' }
    await wdKit_Form_data(form_arr)
      .then(response => {
        const data = response;
        setWidgetListData(data);
      })
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
    if (widget_list?.[index]?.w_id) {
      setwidget_server_id(widget_list?.[index]?.w_id);
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

  const ExportWidget = (e, GetwidgetName, widgetType, widget_id) => {

    let zip_name = GetwidgetName.replaceAll(" ", "_") + "_" + widget_id + ".zip";

    let widget_info = {
      'widget_name': GetwidgetName + "_" + widget_id,
      'widget_type': widgetType
    }

    let form_array = { 'type': 'wkit_export_widget', 'info': JSON.stringify(widget_info) }
    wdKit_Form_data(form_array)
      .then((response) => {
        if (response.success) {
          props.wdkit_set_toast([response?.message, response?.description, '', 'success'])
          if (response.url) {
            location.href = response.url;
          }
        }

        setTimeout(() => {
          let remove_info = {
            'name': zip_name,
            'builder': widgetType
          }

          let form_arr = { 'type': 'wkit_delete_widget', 'info': JSON.stringify(remove_info) }
          wdKit_Form_data(form_arr)
            .then((response) => { })
            .catch(error => console.log(error));
        }, 3000);
      });
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

        if (builder == "elementor") {
          let result = await Elementor_file_create('add', data, html, css, js, "", image)
            .then(async (res) => {
              if (res?.api?.success && res.api.success == true) {
                await Update_List();
                await setactivate_loader(-1);
                props.wdkit_set_toast(["Widget Successfully Retrived", 'Widget Successfully Retrived .', '', 'success'])
                return true;
              } else {
                return false;
              }
            })
          return result;
        } else if (builder == "gutenberg") {
          CreatFile('add', data, html, css, js, "", image, "", icon)
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
          favoriteList.splice(index, 1)
          let new_data = Object.assign({}, userData, { 'favoritewidgets': favoriteList })
          setUserData(new_data)
        } else {
          favoriteList.push(id)
          let new_data = Object.assign({}, userData, { 'favoritewidgets': favoriteList })
          setUserData(new_data)
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
    let plugin_array = WidgetListData.length > 0 ? WidgetListData : [];
    var server_array = []
    if (userData?.widgettemplate?.length > 0 && props.wdkit_meta?.userinfo?.id) {
      server_array = [...userData?.widgettemplate.filter(obj => obj.user_id == props.wdkit_meta?.userinfo?.id)]
      setServerArray(server_array);
    }
    await setw_favourite(userData?.favoritewidgets);

    let final_array = [];

    const builder_name = (id) => {
      if (userData?.widgetbuilder) {
        let dataBase = userData?.widgetbuilder;
        let index = dataBase.findIndex((data) => data.w_id == id);
        if (index > -1) {
          return dataBase[index].builder_name.toLowerCase();
        }
      }
    }

    const Widget_image = (data) => {
      let image = data.w_image;

      if (image) {
        return image;
      } else {
        return img_path + 'assets/images/placeholder.jpg';
      }
    }

    if (plugin_array.length > 0 && server_array.length > 0) {

      plugin_array.map((data, key) => {
        if (server_array.findIndex((index) => index.w_unique == data.widgetdata.widget_id) <= -1) {
          if (userData?.Setting && userData?.Setting[`${data.widgetdata.type}_builder`]) {

            let obj = {
              'type': 'plugin',
              'title': data.widgetdata.name,
              'image': Widget_image(data.widgetdata),
              'builder': data.widgetdata.type,
              'w_unique': data.widgetdata.widget_id,
              'w_version': data.widgetdata.widget_version,
              'allow_push': data.widgetdata?.allow_push,
              'activate': 'active'
            }
            final_array.push(obj);
          }

        }
      })

      server_array.map((data, key) => {
        if (plugin_array.findIndex((index) => index.widgetdata.widget_id == data.w_unique) > -1) {
          if (plugin_array.findIndex((index) => index.widgetdata.widget_version == data.w_version) > -1) {

            let index = plugin_array.findIndex((index) => index.widgetdata.widget_id == data.w_unique);
            if (userData?.Setting && userData?.Setting[`${plugin_array[index].widgetdata.type}_builder`]) {
              let obj = {
                'type': 'done',
                'title': plugin_array[index].widgetdata.name,
                'image': Widget_image(plugin_array[index].widgetdata),
                'builder': plugin_array[index].widgetdata.type,
                'w_unique': plugin_array[index].widgetdata.widget_id,
                's_condition': data.status,
                'w_version': plugin_array[index].widgetdata.widget_version,
                'allow_push': plugin_array[index]?.widgetdata?.allow_push,
                'activate': data.is_activated,
                'w_id': data.id,
                'avg_rating': data.avg_rating,
                'total_rating': data.total_rating,
                'free_pro': data.free_pro
              }
              final_array.push(obj);
            }


          } else {
            let index = plugin_array.findIndex((index) => index.widgetdata.widget_id == data.w_unique);
            if (userData?.Setting && userData?.Setting[`${plugin_array[index].widgetdata.type}_builder`]) {
              let obj = {
                'type': 'update',
                'title': plugin_array[index].widgetdata.name,
                'image': Widget_image(plugin_array[index].widgetdata),
                'builder': plugin_array[index].widgetdata.type,
                'w_unique': plugin_array[index].widgetdata.widget_id,
                's_condition': data.status,
                'w_version': plugin_array[index].widgetdata.widget_version,
                'allow_push': plugin_array[index]?.widgetdata?.allow_push,
                'activate': data.is_activated,
                'w_id': data.id,
                'avg_rating': data.avg_rating,
                'total_rating': data.total_rating,
                'free_pro': data.free_pro
              }

              final_array.push(obj);
            }
          }
        } else if (plugin_array.findIndex((index) => index.widgetdata.widget_id == data.w_unique) <= -1) {
          if (userData?.Setting && userData?.Setting[`${builder_name(data.builder)}_builder`]) {

            let obj = {
              'type': 'server',
              'title': data.title,
              'image': data.image,
              'builder': builder_name(data.builder),
              'w_unique': data.w_unique,
              'w_version': data.w_version,
              's_condition': data.status,
              'activate': data.is_activated,
              'w_id': data.id,
              'avg_rating': data.avg_rating,
              'total_rating': data.total_rating,
              'free_pro': data.free_pro
            }

            final_array.push(obj);
          }
        }
      })

    } else if (plugin_array.length > 0) {

      plugin_array.map((data, key) => {
        if (userData?.Setting && userData?.Setting && userData?.Setting[`${data.widgetdata.type}_builder`]) {

          let obj = {
            'type': 'plugin',
            'title': data.widgetdata.name,
            'image': Widget_image(data.widgetdata),
            'builder': data.widgetdata.type,
            'w_unique': data.widgetdata.widget_id,
            'w_version': data.w_version,
            'allow_push': data?.allow_push,
            'activate': 'active'
          }

          final_array.push(obj);
        }
      })
    } else if (server_array.length > 0) {
      server_array.map((data, key) => {
        if (userData?.Setting && userData?.Setting[`${builder_name(data.builder)}_builder`]) {

          let obj = {
            'type': 'server',
            'title': data.title,
            'image': data.image,
            'builder': builder_name(data.builder),
            'w_unique': data.w_unique,
            'w_version': data.w_version,
            's_condition': data.status,
            'activate': data.is_activated,
            'w_id': data.id,
            'avg_rating': data.avg_rating,
            'total_rating': data.total_rating,
            'free_pro': data.free_pro
          }

          final_array.push(obj);
        }
      })
    }

    if (show_favourite) {

      let Favourite_list = [];
      if (w_favourite?.length > 0 && widget_list?.length > 0) {
        widget_list?.length > 0 && widget_list?.map((data) => {
          if (w_favourite.includes(data?.w_id)) {
            Favourite_list.push(data);
          }
        })
      }
      setwidget_list(Favourite_list);
    } else {
      setwidget_list(final_array);
    }
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
      if (get_user_login() && props.wdkit_meta?.userinfo?.id) {
        setloading(false)
      } else if (get_user_login() == null) {
        setloading(false)
      }
    }, 4000);
  }, [widget_list, activePage, perPage])

  return (
    <>
      <div className="wb-widget-main-container">
        {/* <button className="wb-function-call" style={{ display: "none" }} onClick={() => { WidgetListdata() }}></button> */}
        <div className="wb-creative-widget-main">
          <div className="wb-creative-row">
            <div className="wb-creative-button">
              {get_user_login() &&

                <a className="wkit-plugin-link" style={{ cursor: 'pointer' }} onClick={() => { setshow_favourite(!show_favourite), setActivePage(1); }}>
                  {show_favourite == true ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
                      <path d="M8.99888 2.24221C10.4655 0.525545 13.1822 -0.174455 15.3822 1.32555C16.5489 2.12555 17.2822 3.47555 17.3322 4.89221C17.4405 8.12555 14.5822 10.7172 10.2072 14.6839L10.1155 14.7672C9.48221 15.3505 8.50721 15.3505 7.87388 14.7755L7.79054 14.7005L7.74021 14.6548C3.39357 10.7056 0.549324 8.12146 0.665542 4.90055C0.715542 3.47555 1.44888 2.12555 2.61554 1.32555C4.81554 -0.182788 7.53221 0.525545 8.99888 2.24221Z" fill="#040483" />
                    </svg>
                    :
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.3822 1.32457C13.1822 -0.175432 10.4655 0.524569 8.99888 2.24124C7.53221 0.524569 4.81554 -0.183765 2.61554 1.32457C1.44888 2.12457 0.715542 3.47457 0.665542 4.89957C0.548876 8.1329 3.41554 10.7246 7.79054 14.6996L7.87388 14.7746C8.50721 15.3496 9.48221 15.3496 10.1155 14.7662L10.2072 14.6829C14.5822 10.7162 17.4405 8.12457 17.3322 4.89124C17.2822 3.47457 16.5489 2.12457 15.3822 1.32457ZM9.08221 13.4579L8.99888 13.5412L8.91554 13.4579C4.94888 9.86624 2.33221 7.49124 2.33221 5.0829C2.33221 3.41624 3.58221 2.16624 5.24888 2.16624C6.53221 2.16624 7.78221 2.99124 8.22388 4.1329H9.78221C10.2155 2.99124 11.4655 2.16624 12.7489 2.16624C14.4155 2.16624 15.6655 3.41624 15.6655 5.0829C15.6655 7.49124 13.0489 9.86624 9.08221 13.4579Z" className="wkit-favourites-icon" />
                    </svg>
                  }
                  Favourite
                </a>
              }
              {get_user_login() &&
                <Fragment>
                  <button className="wkit-button-primary" onClick={(e) => { importWidget(e), setClosePopup(true) }}>Import Widget</button>
                  <button className="wkit-button-secondary" onClick={(e) => { AddWidget(e), setClosePopup(true) }}>Create Widget</button>
                </Fragment>
              }
            </div>
          </div>
          {loading == true &&
            <div>
              <Wkit_template_Skeleton />
            </div>
          }
          {widget_list?.length <= 0 && loading == false &&
            <Wkit_availble_not page={'widget'} />
          }
          {loading == false &&
            <div className="wkit-skeleton-row">
              {WidgetListData &&
                widget_list?.length > 0 && widget_list.map((Widgets, index) => {
                  if (Widgets && start_id <= index && end_id > index) {
                    return (
                      <Fragment key={index}>
                        <div className="wkit-wb-widget-grid-content">
                          {Widgets.activate != 'active' &&
                            <Fragment>
                              <div className='wdkit-inner-boxed-deActivate' style={{ zIndex: '19' }}>
                                <div className='wdkit-inner-boxed-deActivate-h1'>Credit Limit Reached!</div>
                                <div className='wdkit-inner-boxed-deActivate-p'>This Template got disabled until you have more credits to make it active.</div>
                                <a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
                                  <button>Buy Credits</button>
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
                            {Widgets.type != 'plugin' &&
                              <div className="wkit-wb-upper-icons" style={Widgets.type == 'server' || Widgets.activate != 'active' ? { zIndex: '1' } : { zIndex: '39' }}>
                                <div className="wkit-wb-fav-icon" onClick={(e) => { favorite_widget(Widgets.w_unique, Widgets.w_id) }}>
                                  {w_favourite?.length > 0 && w_favourite?.includes(Widgets.w_id) ?
                                    <Fragment>
                                      <img src={img_path + "/assets/images/wb-svg/fav-icon-selected.svg"} />
                                      <span className="wkit-wb-tooltiplist">UnFavourite</span>
                                    </Fragment>
                                    :
                                    <Fragment>
                                      <img src={img_path + "/assets/images/wb-svg/fav-icon.svg"} />
                                      <span className="wkit-wb-tooltiplist">Favourite</span>
                                    </Fragment>
                                  }
                                </div>
                                <div className="wkit-wb-fav-icon">
                                  {Widgets.s_condition == 'private' ?
                                    <Fragment>
                                      <img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/private.svg"} alt="private" />
                                      <span className="wkit-wb-tooltiplist">Private</span>
                                    </Fragment>
                                    :
                                    <Fragment>
                                      <img src={img_path + "/assets/images/svg/public.svg"} />
                                      <span className="wkit-wb-tooltiplist">Public</span>
                                    </Fragment>
                                  }
                                </div>
                              </div>
                            }
                            {Widgets?.free_pro == "pro" &&
                              <div className="wdkit-card-tag">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 16.5H5.25C4.9425 16.5 4.6875 16.245 4.6875 15.9375C4.6875 15.63 4.9425 15.375 5.25 15.375H12.75C13.0575 15.375 13.3125 15.63 13.3125 15.9375C13.3125 16.245 13.0575 16.5 12.75 16.5Z" fill="white" /><path d="M15.2622 4.14003L12.2622 6.28503C11.8647 6.57003 11.2947 6.39753 11.1222 5.94003L9.70468 2.16003C9.46468 1.50753 8.54218 1.50753 8.30218 2.16003L6.87718 5.93253C6.70468 6.39753 6.14218 6.57003 5.74468 6.27753L2.74468 4.13253C2.14468 3.71253 1.34968 4.30503 1.59718 5.00253L4.71718 13.74C4.82218 14.04 5.10718 14.235 5.42218 14.235H12.5697C12.8847 14.235 13.1697 14.0325 13.2747 13.74L16.3947 5.00253C16.6497 4.30503 15.8547 3.71253 15.2622 4.14003ZM10.8747 11.0625H7.12468C6.81718 11.0625 6.56218 10.8075 6.56218 10.5C6.56218 10.1925 6.81718 9.93753 7.12468 9.93753H10.8747C11.1822 9.93753 11.4372 10.1925 11.4372 10.5C11.4372 10.8075 11.1822 11.0625 10.8747 11.0625Z" fill="white" /></svg>
                                <span>Pro</span>
                              </div>
                            }
                            <div className="wkit-wb-widget-image-content">
                              <div className="wkit-wb-widget-img" style={{ backgroundImage: `url("${Widgets.image}")` }}></div>
                            </div>
                            <div className="wkit-wb-card-detail-content">
                              <div className="wkit-wb-title-content">
                                <span>{Widgets.title}</span>
                                {Widgets?.type != 'server' &&
                                  <div className="wkit-wb-widget-dropDown">
                                    <span className="wkit-wb-3dot-icon" data-widgetid={index} onClick={dropDownMenu}>
                                      <img className="wkit-wb-3dot-click-img" src={img_path + "/assets/images/wb-svg/3-dot.svg"} alt="wb-view-icon" data-widgetid={index} />
                                      <ul className="wkit-wb-dropdown">
                                        {get_user_login() &&
                                          <Link className="wkit-wb-edit-widget-btn" target='_blank' rel="noopener noreferrer" to={`/widget-listing/builder/${Widgets.title + "_" + Widgets.w_unique}`} >
                                            <li>
                                              <span className="wkit-wb-listmenu-svg">
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M7.7875 4.6375L8.3625 5.2125L2.7 10.875H2.125V10.3L7.7875 4.6375ZM10.0375 0.875C9.88125 0.875 9.71875 0.9375 9.6 1.05625L8.45625 2.2L10.8 4.54375L11.9437 3.4C12.1875 3.15625 12.1875 2.7625 11.9437 2.51875L10.4813 1.05625C10.3563 0.93125 10.2 0.875 10.0375 0.875ZM7.7875 2.86875L0.875 9.78125V12.125H3.21875L10.1312 5.2125L7.7875 2.86875Z" fill="#19191B" />
                                                </svg>
                                              </span>
                                              <span className="wkit-wb-listmenu-text">Edit in New Tab</span>
                                            </li>
                                          </Link>
                                        }
                                        <div className="wkit-wb-mainmenu">
                                          <li onClick={(e) => { RemoveWidget(Widgets.w_unique), setClosePopup(true); }} data-deleteid={index}>
                                            <span className="wkit-wb-listmenu-svg">
                                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_8320_57700)">
                                                  <path d="M10 5.625V11.875H5V5.625H10ZM9.0625 1.875H5.9375L5.3125 2.5H3.125V3.75H11.875V2.5H9.6875L9.0625 1.875ZM11.25 4.375H3.75V11.875C3.75 12.5625 4.3125 13.125 5 13.125H10C10.6875 13.125 11.25 12.5625 11.25 11.875V4.375Z" fill="#19191B" />
                                                </g>
                                                <defs>
                                                  <clipPath id="clip0_8320_57700">
                                                    <rect width="15" height="15" fill="white" />
                                                  </clipPath>
                                                </defs>
                                              </svg>
                                            </span>
                                            <span className="wkit-wb-listmenu-text">Delete</span>
                                          </li>
                                        </div>
                                        <div className="wkit-wb-mainmenu">
                                          <li onClick={() => { DuplicateWidget(Widgets) }}>
                                            <span className="wkit-wb-listmenu-svg">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none">
                                                <path d="M17.9766 6L18 4.875C17.998 4.17942 17.7208 3.51289 17.229 3.02103C16.7371 2.52918 16.0706 2.25198 15.375 2.25H5.25C4.45507 2.25235 3.69338 2.56917 3.13128 3.13128C2.56917 3.69338 2.25235 4.45507 2.25 5.25V15.375C2.25198 16.0706 2.52918 16.7371 3.02103 17.229C3.51289 17.7208 4.17942 17.998 4.875 18H6M13.875 10.125V17.625M17.625 13.875H10.125M8.67188 6H19.0781C20.5538 6 21.75 7.19624 21.75 8.67188V19.0781C21.75 20.5538 20.5538 21.75 19.0781 21.75H8.67188C7.19624 21.75 6 20.5538 6 19.0781V8.67188C6 7.19624 7.19624 6 8.67188 6Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                              </svg>
                                            </span>
                                            <span className="wkit-wb-listmenu-text">Duplicate</span>
                                          </li>
                                        </div>
                                        <div className="wkit-wb-mainmenu">
                                          <li className="wkit-wb-export-widget-btn" onClick={(e) => { ExportWidget(e, Widgets.title, Widgets.builder, Widgets.w_unique) }}>
                                            <span className="wkit-wb-listmenu-svg">
                                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7359 5.17529H9.49451V6.50526H11.7359C12.4025 6.50526 12.9196 6.84573 12.9196 7.13876V13.0363C12.9196 13.3293 12.4025 13.6698 11.7359 13.6698H3.26363C2.5971 13.6698 2.07996 13.3293 2.07996 13.0363V7.13899C2.07996 6.84595 2.5971 6.50548 3.26363 6.50548H5.50462V5.17551H3.26363C1.85409 5.17551 0.75 6.038 0.75 7.13899V13.0365C0.75 14.1377 1.85409 15 3.26363 15H11.7362C13.1455 15 14.2498 14.1375 14.2498 13.0365V7.13899C14.2496 6.03777 13.1455 5.17529 11.7359 5.17529Z" fill="black" />
                                                <path d="M5.53142 3.31494C5.70165 3.31494 5.87166 3.24999 6.00156 3.1201L6.83411 2.28754V5.17533V6.5053V9.05307C6.83411 9.42036 7.1318 9.71805 7.4991 9.71805C7.86639 9.71805 8.16408 9.42036 8.16408 9.05307V6.5053V5.17533V2.24254L9.04163 3.1201C9.17153 3.24999 9.34176 3.31494 9.51178 3.31494C9.68179 3.31494 9.85203 3.24999 9.98192 3.1201C10.2417 2.86053 10.2417 2.43938 9.98192 2.17981L7.9965 0.194396C7.86661 0.0645033 7.6966 0 7.52658 0C7.52481 0 7.52326 0 7.52148 0C7.51971 0 7.51816 0 7.51639 0C7.34637 0 7.17636 0.0645033 7.04647 0.194396L5.06105 2.17981C4.80126 2.43938 4.80126 2.86053 5.06105 3.1201C5.19117 3.24999 5.36118 3.31494 5.53142 3.31494Z" fill="black" />
                                              </svg>
                                            </span>
                                            <span className="wkit-wb-listmenu-text">Export Widget </span>
                                          </li>
                                        </div>
                                        {get_user_login() && Widgets?.allow_push != false &&
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                  <path d="M14.6875 13.75H10.625V7.75898L12.6832 9.8168C12.8014 9.92906 12.9587 9.99072 13.1217 9.98863C13.2847 9.98655 13.4404 9.92088 13.5556 9.80563C13.6709 9.69038 13.7365 9.53466 13.7386 9.37169C13.7407 9.20871 13.6791 9.05137 13.5668 8.9332L10.4418 5.8082C10.3246 5.69108 10.1657 5.62529 10 5.62529C9.83431 5.62529 9.6754 5.69108 9.5582 5.8082L6.4332 8.9332C6.32094 9.05137 6.25928 9.20871 6.26137 9.37169C6.26345 9.53466 6.32912 9.69038 6.44437 9.80563C6.55962 9.92088 6.71534 9.98655 6.87831 9.98863C7.04129 9.99072 7.19863 9.92906 7.3168 9.8168L9.375 7.75898V13.75H5.3125C4.73253 13.7494 4.17649 13.5187 3.76639 13.1086C3.35629 12.6985 3.12562 12.1425 3.125 11.5625V3.4375C3.12562 2.85753 3.35629 2.30149 3.76639 1.89139C4.17649 1.48129 4.73253 1.25062 5.3125 1.25H14.6875C15.2675 1.25062 15.8235 1.48129 16.2336 1.89139C16.6437 2.30149 16.8744 2.85753 16.875 3.4375V11.5625C16.8744 12.1425 16.6437 12.6985 16.2336 13.1086C15.8235 13.5187 15.2675 13.7494 14.6875 13.75ZM10.625 18.125C10.625 18.2908 10.5592 18.4497 10.4419 18.5669C10.3247 18.6842 10.1658 18.75 10 18.75C9.83424 18.75 9.67527 18.6842 9.55806 18.5669C9.44085 18.4497 9.375 18.2908 9.375 18.125V13.75H10.625V18.125Z" fill="black" />
                                                </svg>
                                              </span>
                                              <span className="wkit-wb-listmenu-text">Push Widget</span>
                                            </li>
                                          </div>
                                        }
                                      </ul>
                                    </span>
                                    {/* :
                                    <div className="wkit-widgetlimit-delete">
                                      <svg onClick={(e) => { RemoveWidget(Widgets.w_unique), setClosePopup(true); }} xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.66634 1.83203C5.44533 1.83203 5.23337 1.91983 5.07709 2.07611C4.9208 2.23239 4.83301 2.44435 4.83301 2.66536V3.4987H9.16634V2.66536C9.16634 2.44435 9.07854 2.23239 8.92226 2.07611C8.76598 1.91983 8.55402 1.83203 8.33301 1.83203H5.66634ZM10.1663 3.4987V2.66536C10.1663 2.17913 9.97319 1.71282 9.62937 1.369C9.28555 1.02519 8.81924 0.832031 8.33301 0.832031H5.66634C5.18011 0.832031 4.7138 1.02519 4.36998 1.369C4.02616 1.71282 3.83301 2.17913 3.83301 2.66536V3.4987H2.33301C2.32078 3.4987 2.30865 3.49914 2.29664 3.5H1C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5H1.83301V13.332C1.83301 13.8183 2.02616 14.2846 2.36998 14.6284C2.7138 14.9722 3.18011 15.1654 3.66634 15.1654H10.333C10.8192 15.1654 11.2856 14.9722 11.6294 14.6284C11.9732 14.2846 12.1663 13.8183 12.1663 13.332V4.5H13C13.2761 4.5 13.5 4.27614 13.5 4C13.5 3.72386 13.2761 3.5 13 3.5H11.7027C11.6907 3.49914 11.6786 3.4987 11.6663 3.4987H10.1663ZM2.83301 13.332V4.5H11.1663V13.332C11.1663 13.553 11.0785 13.765 10.9223 13.9213C10.766 14.0776 10.554 14.1654 10.333 14.1654H3.66634C3.44533 14.1654 3.23337 14.0776 3.07709 13.9213C2.9208 13.765 2.83301 13.553 2.83301 13.332ZM7.5 7.33203C7.5 7.05589 7.27614 6.83203 7 6.83203C6.72386 6.83203 6.5 7.05589 6.5 7.33203V11.332C6.5 11.6082 6.72386 11.832 7 11.832C7.27614 11.832 7.5 11.6082 7.5 11.332V7.33203Z" fill="#1E1E1E" />
                                      </svg>
                                    </div> */}
                                  </div>
                                }
                              </div>
                              {Widgets?.avg_rating != undefined && Widgets?.total_rating != undefined &&
                                <div style={{ padding: '0px 10px' }}>
                                  <CardRatings
                                    avg_rating={Widgets?.avg_rating}
                                    total_rating={Widgets?.total_rating}
                                  />
                                </div>
                              }
                              <div className="wkit-wb-widget-info">
                                <div className="wkit-wb-info-icons-content">
                                  <div className="wkit-wb-info-icons">
                                    <img src={img_path + "/assets/images/wb-svg/view-icon.svg"} alt="wb-view-icon" />
                                    <span>0</span>
                                  </div>
                                  <hr className="wkit-wb-divider-hr" />
                                  <div className="wkit-wb-info-icons">
                                    <img src={img_path + "/assets/images/wb-svg/download-icon.svg"} alt="wb-view-icon" />
                                    <span>0</span>
                                  </div>
                                </div>
                                <div className="wkit-wb-widget-category-icon">
                                  {Widgets?.builder == "elementor" &&
                                    <img src={img_path + "/assets/images/wb-svg/widget-card-elementor.svg"} />
                                  }
                                  {Widgets?.builder == "gutenberg" &&
                                    <img src={img_path + "/assets/images/wb-svg/widget-card-gutenberg.svg"} />
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
            {widget_list?.length > perPage && totalpage > 1 &&
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
                      setloading(true);
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