import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Elementor_file_create from "../file-creation/elementor_file";
import CreatFile from "../file-creation/gutenberg_file";
import { Wkit_template_Skeleton, wdKit_Form_data, get_user_login, Get_user_info_data, Show_toast, Toast_message } from '../../helper/helper-function';


const Popup = (props) => {

  const navigation = useNavigate();


  const keyUniqueID = () => {
    let date = new Date();
    let year = date.getFullYear().toString().slice(-2);
    let number = Math.random();
    number.toString(36);
    let uid = number.toString(36).substr(2, 6);
    return uid + year;
  }

  const generateUniqueID = () => {
    const now = new Date();
    const uniqueID = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    const hashedID = parseInt(uniqueID, 10) % 10000;
    return String(hashedID).padStart(4, '0');
  }

  const [ImagePath, setImagePath] = useState(wdkitData.WDKIT_URL);
  const [widgetName, setwidgetName] = useState("");
  const [widgetDescription, setwidgetDescription] = useState("");
  const [DropFile, setDropFile] = useState("");
  const [widget_image, setwidget_image] = useState("");
  const [widget_icon, setwidget_icon] = useState("eicon-code");
  const [block_icon, setblock_icon] = useState("");
  const [addwidgetRadio, setaddwidgetRadio] = useState("elementor");
  const [NameValidation, setNameValidation] = useState(true);
  const [Delete_type, setDelete_type] = useState('');
  const [error_msg, seterror_msg] = useState('');
  const [w_version, setw_version] = useState(props?.widgetdata?.WcardData?.widgetdata?.widget_version);
  const [duplicate_w_name, setduplicate_w_name] = useState("");
  const [version_details, setversion_details] = useState(['']);
  const [loader, setloader] = useState(false);
  const [subpopup, setsubpopup] = useState('duplicate');

  let unique_name = keyUniqueID();

  const inputRef = useRef("");
  const nameRef = useRef(null);

  useEffect(() => {
    if (props.quickediteditMeta == 'server') {
      setDelete_type('plugin_server')
    } else {
      setDelete_type('plugin')
    }
  }, [props.quickediteditMeta])


  const Delete_widget = async (e) => {
    setloader(true);
    let getWidgetName_temp = props.quickeditName;
    let widget_id = props.widget_id;
    let widget_server_id = props.widget_server_id;
    let getWidgetName = getWidgetName_temp.replaceAll(" ", "-") + "_" + widget_id;
    let widgetType = props.quickediteditType;

    let token = get_user_login();
    let remove_info = {
      'token': token?.token,
      'type': 'remove',
      'w_unique': widget_id,
      'id': widget_server_id,
      'delete_type': Delete_type,
      'name': getWidgetName,
      'builder': widgetType,
    }

    let form_arr = { 'type': 'wkit_delete_widget', 'info': JSON.stringify(remove_info) }
    await wdKit_Form_data(form_arr)
      .then((response) => {
        if (response?.success == true) {
          props.wdkit_set_toast([response?.message, response?.description, '', 'success']);
        } else {
          props.wdkit_set_toast([response?.message, response?.description, '', 'danger']);
        }
      })
      .catch(error => console.log(error));

    props.ClosePopup();
    props.StartLoading();
    props.UpdateData();
    setloader(false);
  }

  const handleSubmit = async (e) => {
    setloader(true);
    if (!widgetName) {
      inputRef.current.style.border = "1px solid red";
    } else {
      let html = JSON.stringify("");
      let js = JSON.stringify("");
      let css = JSON.stringify("");

      var data = {
        "CardItems": {
          "cardData": [{ "layout": [], "style": [] }]
        },

        "WcardData": {
          "widgetdata": {
            "name": widgetName.trim(),
            "description": widgetDescription,
            "category": "WDesignKit",
            "helper_link": "",
            "type": addwidgetRadio,
            "w_icon": addwidgetRadio == "elementor" ? widget_icon : addwidgetRadio == "gutenberg" ? block_icon : "",
            "w_image": "",
            "publish_type": "Publish",
            "key_words": "",
            "css_parent_node": true,
            "widget_id": unique_name,
            "widget_version": '',
            "version_detail": [],
          }
        },

        "Editor_data": {
          "links": [{ "js": [""], "css": [""] }]
        },

        "Editor_code": {
          "Editor_codes": [{ "html": '', "css": '', "js": '' }]
        }
      }

      if (addwidgetRadio == "elementor") {
        await Elementor_file_create('add', data, html, css, js, "", widget_image);
        navigation(`/widget-listing/builder/${widgetName.trim()}_${unique_name}`)
        props.wdkit_set_toast(['Widget Added Successfully', 'Widget Added Successfully', '', 'success']);
      } else if (addwidgetRadio == "gutenberg") {
        CreatFile('add', data, html, css, js, "", widget_image, "", block_icon)
      }

      inputRef.current = "";
    }
    setloader(false);
  };

  const Get_file = (e) => {

    if (e.target.files[0].type == 'application/x-zip-compressed') {
      var file = e.target.files[0];
      setDropFile(file);
      document.querySelector(".dropFileErrorMessage").style.display = "none";
    } else {
      // Show_toast("Please Enter Valid file", 'danger')
    }
  }

  const Import_Widget = async (e) => {
    setloader(true);
    props.StartLoading();

    if (!DropFile) {
      document.querySelector(".dropFileErrorMessage").style.display = "block";
      document.querySelector(".dropFileErrorMessage").style.color = "red";
    } else {
      var IsFileDrop = document.querySelector(".wb-editWidget-popup") ? document.querySelector(".wb-editWidget-popup") : "";
      if (document.querySelector(".dropFileErrorMessage").style.display = "block") {
        document.querySelector(".dropFileErrorMessage").style.display = "none";
      }

      // const RemoveOldFolder = (remove_info) => {
      //   let form_arr = { 'type': 'wkit_delete_widget', 'info': JSON.stringify(remove_info) }
      //   wdKit_Form_data(form_arr)
      //     .then(async (response) => {
      //       if (response?.success) {
      //         await props.UpdateData();
      //       }
      //     })
      //     .catch(error => console.log(error));
      // }

      const File_creation = async (json_data) => {
        if (json_data) {
          let html = JSON.stringify(json_data.Editor_data.html);
          let js = JSON.stringify(json_data.Editor_data.js);
          let css = JSON.stringify(json_data.Editor_data.css);
          let oldId = json_data.widget_data.widgetdata.widget_id;
          let oldName = json_data.widget_data.widgetdata.name;
          let oldFolder = oldName + '_' + oldId;


          let new_obj = Object.assign({}, json_data.widget_data.widgetdata, { "allow_push": false })
          let new_WcardData = Object.assign({}, json_data.widget_data, { "widgetdata": new_obj })

          var data = {
            "CardItems": {
              "cardData": json_data.section_data
            },

            "WcardData": new_WcardData,

            "Editor_data": json_data.Editor_Link,

            "Editor_code": {
              "Editor_codes": [json_data.Editor_data]
            }
          }

          if (json_data.widget_data.widgetdata.type == "elementor") {
            await Elementor_file_create('import', data, html, css, js, oldFolder, "").then(async (res) => {
              if (res?.api?.success) {
                let folder_name = json_data.widget_data.widgetdata.name.replaceAll(" ", "-") + "_" + json_data.widget_data.widgetdata.widget_id;
                let token = await get_user_login();

                // let remove_info = {
                //   'token': token?.token,
                //   'type': 'remove',
                //   'id': json_data.widget_data.widgetdata.widget_id,
                //   'delete_type': 'plugin',
                //   'name': folder_name,
                //   'builder': json_data.widget_data.widgetdata.type
                // }

                await setTimeout(() => {
                  props.UpdateData();
                }, 1000);
              } else {
                props.UpdateData();
              }
            })
          } else if (json_data.widget_data.widgetdata.type == "gutenberg") {
            CreatFile('import', data, html, css, js, "", "")
          }
        } else {
          props.endLoading();
          props.wdkit_set_toast(['Widget import fail', 'Widget import fail! data not get ', '', 'danger']);
        }
      }

      if (IsFileDrop) {

        var formData = new FormData();
        formData.append('action', 'get_wdesignkit');
        formData.append('kit_nonce', wdkitData.kit_nonce);
        formData.append('type', 'wkit_import_widget');
        formData.append('zipName', DropFile);


        await axios.post(ajaxurl, formData, {
          headers: { 'content-type': 'application/json' }
        })
          .then((response) => {
            if (response?.data?.success) {
              File_creation(response?.data?.json);
              props.ClosePopup();
              document.querySelector('.wb-function-call').click();
              props.wdkit_set_toast(['Widget imported', 'Widget imported Succesfully', '', 'success']);
            }
          })
          .catch(error => console.log(error));
      }
    }
    setloader(false);
  }

  const DropImportFile = (e) => {
    e.preventDefault();
    setDropFile(e.dataTransfer.files[0]);
    e.stopImmediatePropagation();
  }

  const Upload_image = (e, file) => {
    if (file) {
      if (file?.size && ((Number(file?.size) / 1000000) > 1)) {
        e.preventDefault();
        props.wdkit_set_toast(['Insert valid Image', 'Image size must be less tahn 2 mb.', '', 'success']);
        // Show_toast("Image size must be less tahn 2 mb", 'danger')
      } else {
        e.preventDefault();
        let background_div = e.target.closest('.wb-drop-file');
        let file_array = file.type.split("/");
        if (file_array.includes("png") || file_array.includes("jpg") || file_array.includes("jpeg")) {
          if (file && background_div) {
            background_div.style.backgroundImage = 'url(' + window.URL.createObjectURL(file) + ')'
            setwidget_image(file);
          }
        } else {
          props.wdkit_set_toast(['Insert valid Image', 'only ".png", ".jpg", ".jpeg" images are allowed.', '', 'success']);
          // Show_toast('only ".png", ".jpg", ".jpeg" images are allowed', 'danger')
        }
      }
    }
  }

  const Drop_icon = (e) => {
    e.preventDefault();
    let background_div = e.target.closest('.wb-drop-file');
    let file_array = e.dataTransfer.files[0].type.split("/")
    if (file_array.includes("image")) {
      if (e.dataTransfer.files[0] && background_div) {
        background_div.style.backgroundImage = 'url(' + window.URL.createObjectURL(e.dataTransfer.files[0]) + ')'
        setblock_icon(e.dataTransfer.files[0]);
      }
    }
  }

  const Upload_icon = (event) => {
    let background_div = event.target.closest('.wb-drop-file');
    let file_array = event.target.files[0].type.split("/");
    if (file_array.includes("image")) {
      if (event.target.files[0] && background_div) {
        let url = 'url(' + window.URL.createObjectURL(event.target.files[0]) + ')';
        background_div.style.backgroundImage = url;
        setblock_icon(event.target.files[0]);
      }
    }
  }

  const Update_version = async () => {
    setloader(true)

    let old_widget_name = props.quickeditName + "_" + props.widget_id;
    let widget_type = props.quickediteditType;
    let folder_name = old_widget_name.replaceAll(" ", "-");
    let file_name = old_widget_name.replaceAll(" ", "_");
    let widget_version = w_version ? w_version : "1.0.0";

    let Json_URL = `${wdkitData.WDKIT_SERVER_PATH}/${widget_type}/${folder_name}/${file_name}.json`;

    let json_data = await fetch(Json_URL)
      .then((response) => response.json())
      .then((json) => { return json })

    if (widget_version && json_data) {
      var widget_data = Object.assign({}, json_data.widget_data.widgetdata, { 'widget_version': widget_version, 'version_detail': version_details })
      let html = JSON.stringify(json_data.Editor_data.html);
      let js = JSON.stringify(json_data.Editor_data.js);
      let css = JSON.stringify(json_data.Editor_data.css);
      let old_folder = json_data.widget_data.widgetdata.name + '_' + json_data.widget_data.widgetdata.widget_id;

      let data = {
        "CardItems": {
          "cardData": json_data.section_data
        },

        "WcardData": {
          "widgetdata": widget_data
        },

        "Editor_data": {
          "links": json_data.Editor_Link.links
        },

        "Editor_code": {
          "Editor_codes": json_data.Editor_data
        }
      }

      let creat_api = await Elementor_file_create('single_sync', data, html, css, js, old_folder, "")
        .then((response) => { return response });
      if (creat_api?.ajax?.data?.success == true) {
        props.wdkit_set_toast(['Widget synced', 'Widget synced', '', 'success']);
        props.ClosePopup();
      } else {
        props.wdkit_set_toast(['Operation fail', 'Something went wrong', '', 'danger']);
        seterror_msg(creat_api?.ajax?.data?.message)
      }
    } else {
    }

    props.StartLoading();
    props.UpdateData();
    setloader(false)
  }

  const Add_changelog = () => {
    let data = [...version_details];
    data.push("")
    setversion_details(data)
  }

  const Update_changelog = (e, index) => {
    let data = [...version_details];
    data[index] = e.target.value;
    setversion_details(data)
  }

  const Delete_changelog = (index) => {
    let data = [...version_details];
    if (data.length > 1) {
      data.splice(index, 1);
      setversion_details(data)
    } else if (data.length == 1) {
      data[index] = '';
      setversion_details(data)
    }
  }

  const Get_widget_name = (e) => {
    var pattern = /^[a-zA-Z0-9-_ ]+$/;

    if (e.target.value == "") {
      e.target.style.border = "1px solid red";
      setwidgetName("")
      setNameValidation(true)
    } else if (!isNaN(e.target.value.charAt(0))) {
      e.target.style.border = "1px solid red";
      setNameValidation(false)
    } else {
      if (pattern.test(e.target.value)) {
        e.target.style.border = "";
        setwidgetName(e.target.value)
        setNameValidation(true)
      } else {
        document.querySelector('.wb-wkit-widgetName-toolTip').style.display = 'flex';

        setTimeout(() => {
          document.querySelector('.wb-wkit-widgetName-toolTip').style.display = '';
        }, 2000);
      }
    }
  }

  const Icon_validation = (e) => {
    var pattern = /^[a-zA-Z0-9-_ ]+$/;

    if (e.target.value) {
      if (pattern.test(e.target.value)) {
        e.target.style.border = "";
        setwidget_icon(e.target.value)
      } else {
        document.querySelector('.wb-wkit-widgetIcon-toolTip').style.display = 'flex';

        setTimeout(() => {
          document.querySelector('.wb-wkit-widgetIcon-toolTip').style.display = '';
        }, 2000);
      }
    } else {
      setwidget_icon("")
    }
  }

  const Widget_Duplicate = async () => {
    props.StartLoading(true);
    setloader(true);

    let w_name = props.quickeditName;
    let w_builder = props.quickediteditType;
    let u_id = props.widget_id;

    let folder_name = w_name.replaceAll(' ', '-') + '_' + u_id;
    let file_name = w_name.replaceAll(' ', '_') + '_' + u_id;

    let w_JSON_url = `${wdkitData.WDKIT_SERVER_PATH}/${w_builder}/${folder_name}/${file_name}.json?v=${generateUniqueID()}`;

    let w_json_data = await fetch(w_JSON_url)
      .then((response) => response.json())
      .then((json) => { return json })

    if (w_json_data) {
      let html = w_json_data?.Editor_data?.html ? JSON.stringify(w_json_data.Editor_data.html) : JSON.stringify('');
      let js = w_json_data?.Editor_data?.js ? JSON.stringify(w_json_data.Editor_data.js) : JSON.stringify('');
      let css = w_json_data?.Editor_data?.css ? JSON.stringify(w_json_data.Editor_data.css) : JSON.stringify('');

      let new_obj = Object.assign({}, w_json_data.widget_data.widgetdata, {
        "name": duplicate_w_name, "r_id": 0, "widget_id": keyUniqueID(), "widget_version": "", "version_detail": [''], "allow_push": true
      })
      let new_WcardData = Object.assign({}, w_json_data.widget_data, { "widgetdata": new_obj })

      var data = {
        "CardItems": {
          "cardData": w_json_data.section_data
        },

        "WcardData": new_WcardData,

        "Editor_data": w_json_data.Editor_Link,

        "Editor_code": {
          "Editor_codes": [w_json_data.Editor_data]
        }
      }

      await Elementor_file_create('import', data, html, css, js, "", "", w_json_data?.widget_data?.widgetdata?.w_image).then(async (res) => {
        if (res?.api?.success) {
          await props.UpdateData()
          setloader(false);
        } else {
          setloader(false);
        }
      })
    }
  }

  return (
    <>
      {/**remove */}
      {props.popup == "remove" && (
        <div className="wkit-remove-popup" id="open-popup3">
          <div className="wkit-remove-popup-content">
            <div className="wkit-delete-popup-close" >
              <div className="wkit-close-btn" onClick={() => { props.ClosePopup() }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="#19191B" />
                </svg>
              </div>
            </div>
            <div className="wkit-popup-header">Are you sure you want to delete?</div>
            <div className="wkit-member-popup">
              <h3 className='wkit-heading-delete'>Please select an option from below:</h3>
              {get_user_login() && props.quickediteditMeta != 'plugin' &&
                <div className='wkit-custom-radio-wrap'>
                  <label className='wkit-server-heading' id='wkit-radio1' >
                    <input type="radio" name="server-1" id='wkit-radio1' checked={Delete_type == 'plugin_server'} onChange={(e) => { setDelete_type('plugin_server') }} />Permanently Delete </label>
                  <span className='wkit-radio-desc'>This will remove your widget from cloud and local system both. Make sure you download it as a ZIP as then you will not be able to get access of it.</span>
                </div>
              }
              {props.quickediteditMeta != 'server' &&
                <div className='wkit-custom-radio-wrap'>
                  <label className='wkit-server-heading' id='wkit-radio2'>
                    <input type="radio" name="server-1" id='wkit-radio2' checked={Delete_type == 'plugin'} onChange={(e) => { setDelete_type('plugin') }} />Local Delete</label>
                  <span className='wkit-radio-desc'>This will remove your widget from your current website. If you need to use it in the future, you can simply download it again from the server.</span>
                </div>
              }
              <div className='wkit-widget-delete-btn-position'>
                {loader == true &&
                  <button className="wkit-template-delete">
                    <div className="wkit-publish-loader">
                      <div className="wb-loader-circle"></div>
                    </div>
                  </button>
                }
                {loader == false &&
                  <button className="wkit-template-delete" onClick={(e) => { Delete_widget(e) }} >
                    <span>Yes, Delete it!</span>
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/**single sync */}
      {props.popup == "sync" && (
        <div className="wkit-version-popup-outside">
          <div className="wkit-wb-version-popup">
            <div className="wkit-popup-close-icon" onClick={(e) => { props.ClosePopup(); }} >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" />
              </svg>
            </div>
            {/* <a className="close" onClick={(e) => { props.ClosePopup() }}>&times;</a> */}
            <div className="wb-version-detail">
              <div className="wkit-add-widget-header-container">
                <div className="wb-version-header">
                  <label>Add Sync details</label>
                </div>
              </div>
              <div className="wb-version-body">
                <div className='wb-version-wrap'>
                  <div className="wb-version-number">
                    <span className='wb-version-label'>Current Version</span>
                    <input className="wb-version-input" type="text" defaultValue={props?.w_version ? props?.w_version : '1.0.0'} disabled />
                  </div>
                  <div className="wb-version-details">
                    <span className='wb-version-label'>Latest Version</span>
                    <input className="wb-version-input"
                      defaultValue={props?.w_version ? '' : '1.0.0'}
                      type="text"
                      onChange={(e) => {
                        setw_version(props?.w_version ? e.target.value : '1.0.0');
                        if (props?.w_version >= e.target.value) {
                          seterror_msg(`version ${e.target.value} is already available`)
                        } else {
                          seterror_msg('')
                        }
                      }}
                      disabled={props?.w_version ? false : true} />
                    <div className="wb-error-message">{error_msg}</div>
                  </div>
                </div>
                <span className='wb-version-label'>Changelog</span>
                <div className="wb-version-changes">
                  {version_details.map((val, index) => {
                    return (
                      <div className='wb-version-wrap'>
                        <textarea className="wb-version-detail-input" value={val} placeholder='Please enter description' rows="2" onChange={(e) => { Update_changelog(e, index) }} />
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" onClick={() => { Delete_changelog(index) }} fill="black">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8.89978 1.92188C8.57488 1.92188 8.2633 2.05094 8.03359 2.28066L8.03358 2.28067C7.80384 2.51041 7.67478 2.82199 7.67478 3.14687V4.37187H14.3248V3.14687C14.3248 2.82204 14.1957 2.51043 13.966 2.28064C13.7363 2.05095 13.4247 1.92188 13.0998 1.92188H8.89978ZM16.0748 4.37187V3.14687C16.0748 2.3578 15.7613 1.60113 15.2034 1.04326C14.6455 0.485289 13.8887 0.17188 13.0998 0.17188H8.89978C8.11078 0.17188 7.35406 0.485298 6.79613 1.04324C6.23822 1.60115 5.92478 2.35785 5.92478 3.14687V4.37187H3.64978C3.63803 4.37187 3.62634 4.3721 3.61471 4.37256H1.55005C1.0668 4.37256 0.675049 4.76431 0.675049 5.24756C0.675049 5.73081 1.0668 6.12256 1.55005 6.12256H2.77478V19.9469C2.77478 20.7358 3.08821 21.4926 3.64617 22.0505C4.20403 22.6084 4.96072 22.9219 5.74978 22.9219H16.2498C17.0388 22.9219 17.7955 22.6084 18.3534 22.0505C18.9113 21.4926 19.2248 20.7359 19.2248 19.9469V6.12256H20.4501C20.9333 6.12256 21.3251 5.73081 21.3251 5.24756C21.3251 4.76431 20.9333 4.37256 20.4501 4.37256H18.3849C18.3732 4.3721 18.3615 4.37187 18.3498 4.37187H16.0748ZM4.52478 19.9469V6.12256H17.4748V19.9469C17.4748 20.2717 17.3457 20.5834 17.116 20.8131C16.8863 21.0428 16.5746 21.1719 16.2498 21.1719H5.74978C5.42494 21.1719 5.11333 21.0428 4.88356 20.8131L4.26572 21.4309L4.88355 20.8131C4.65385 20.5834 4.52478 20.2718 4.52478 19.9469ZM11.8751 10.4971C11.8751 10.0139 11.4833 9.6221 11.0001 9.6221C10.5169 9.6221 10.1251 10.0139 10.1251 10.4971V16.7971C10.1251 17.2803 10.5169 17.6721 11.0001 17.6721C11.4833 17.6721 11.8751 17.2803 11.8751 16.7971V10.4971Z" />
                        </svg>
                      </div>
                    );
                  })
                  }
                </div>
                <button className="wkit-add-log-btn" onClick={() => { Add_changelog() }}>
                  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.5 0.546875H5.5V6.04688H0V7.04688H5.5V12.5469H6.5V7.04688H12V6.04688H6.5V0.546875Z" fill="#040483" />
                  </svg>
                  <label>Add more</label>
                </button>
                <div className="wb-quickedit-footer">
                  {loader == true &&
                    <button className={`wb-version-popup-btn`}>
                      <div className="wkit-publish-loader">
                        <div className="wb-loader-circle"></div>
                      </div>
                    </button>
                  }
                  {loader == false &&
                    <button className={`wb-version-popup-btn`}
                      style={{ cursor: (props?.w_version < w_version || !props?.w_version) ? '' : "no-drop" }}
                      disabled={props?.w_version < w_version || !props?.w_version ? false : true}
                      onClick={(e) => { Update_version() }}>
                      <span>Update</span>
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/**Duplicate Widget */}
      {props.popup == "duplicate-widget" && (
        <div className="wkit-version-popup-outside">
          <div className="wkit-wb-version-popup">
            <div className="wkit-popup-close-icon" onClick={(e) => { props.ClosePopup(); }} >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" />
              </svg>
            </div>
            <div className="wb-version-detail">
              <div className="wkit-add-widget-header-container">
                <div className="wb-version-header">
                  <label>Duplicate Widget</label>
                </div>
              </div>
              {subpopup == 'duplicate' &&
                <div className="wb-version-body">
                  <div className='wb-version-wrap'>
                    <div className="wb-version-number">
                      <span className='wb-version-label'>Enter New Widget name</span>
                      <input className="wb-version-input" type="text" placeholder="Enter Widget Name" value={duplicate_w_name} onChange={(e) => { setduplicate_w_name(e.target.value) }} />
                    </div>
                  </div>
                  <div className="wb-quickedit-footer">
                    {loader == true &&
                      <button className={`wb-version-popup-btn`}>
                        <div className="wkit-publish-loader">
                          <div className="wb-loader-circle"></div>
                        </div>
                      </button>
                    }
                    {loader == false &&
                      <Fragment>
                        <div className="wkit-quickedit-note">
                          <span>
                            <b>Note :</b> This new widget will have have unique class, So It will work independently from previous widget.
                          </span>
                        </div>
                        <button className={`wb-version-popup-btn`}
                          disabled={duplicate_w_name ? false : true}
                          onClick={() => { Widget_Duplicate(); setsubpopup('success_duplicate') }}>
                          <span>Duplicate</span>
                        </button>
                      </Fragment>
                    }
                  </div>
                </div>
              }
              {subpopup == 'success_duplicate' &&
                <div className="wb-version-body">
                  <div className="wkit-success-duplicate-content">
                    <div className="wkit-duplicate-widget-image">
                      <img src={props.widget_image} />
                    </div>
                    <div className="wkit-duplicate-success-content">
                      {loader == true &&
                        <Fragment>
                          <div className="wkit-duplicate-progress">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1.5s linear infinite' }} width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M4.73318 20.7144C6.14668 20.7144 7.29254 19.5686 7.29254 18.1551C7.29254 16.7416 6.14668 15.5957 4.73318 15.5957C3.31969 15.5957 2.17383 16.7416 2.17383 18.1551C2.17383 19.5686 3.31969 20.7144 4.73318 20.7144Z" fill="#040483" />
                              <path d="M21.1998 18.4446C22.4266 18.4446 23.4212 17.4501 23.4212 16.2233C23.4212 14.9965 22.4266 14.002 21.1998 14.002C19.973 14.002 18.9785 14.9965 18.9785 16.2233C18.9785 17.4501 19.973 18.4446 21.1998 18.4446Z" fill="#B1B1D9" />
                              <path d="M19.1709 7.24619C20.1844 7.24619 21.006 6.42463 21.006 5.41118C21.006 4.39773 20.1844 3.57617 19.1709 3.57617C18.1575 3.57617 17.3359 4.39773 17.3359 5.41118C17.3359 6.42463 18.1575 7.24619 19.1709 7.24619Z" fill="#B1B1D9" />
                              <path d="M2.71606 14.4677C4.21609 14.4677 5.43211 13.2813 5.43211 11.8178C5.43211 10.3543 4.21609 9.16797 2.71606 9.16797C1.21602 9.16797 0 10.3543 0 11.8178C0 13.2813 1.21602 14.4677 2.71606 14.4677Z" fill="#040483" />
                              <path d="M10.518 23.9976C11.8817 23.9976 12.9871 22.9204 12.9871 21.5916C12.9871 20.2628 11.8817 19.1855 10.518 19.1855C9.1543 19.1855 8.04883 20.2628 8.04883 21.5916C8.04883 22.9204 9.1543 23.9976 10.518 23.9976Z" fill="#B1B1D9" />
                              <path d="M16.8652 22.9429C18.1607 22.9429 19.2109 21.9204 19.2109 20.659C19.2109 19.3976 18.1607 18.375 16.8652 18.375C15.5697 18.375 14.5195 19.3976 14.5195 20.659C14.5195 21.9204 15.5697 22.9429 16.8652 22.9429Z" fill="#B1B1D9" />
                              <path d="M5.65394 8.31486C7.22214 8.31486 8.49342 7.07393 8.49342 5.54317C8.49342 4.01241 7.22214 2.77148 5.65394 2.77148C4.08573 2.77148 2.81445 4.01241 2.81445 5.54317C2.81445 7.07393 4.08573 8.31486 5.65394 8.31486Z" fill="#040483" />
                              <path d="M21.9015 12.5103C23.0606 12.5103 24.0003 11.5881 24.0003 10.4505C24.0003 9.31285 23.0606 8.39062 21.9015 8.39062C20.7424 8.39062 19.8027 9.31285 19.8027 10.4505C19.8027 11.5881 20.7424 12.5103 21.9015 12.5103Z" fill="#B1B1D9" />
                              <path d="M12.701 5.98793C14.3545 5.98793 15.695 4.64748 15.695 2.99396C15.695 1.34044 14.3545 0 12.701 0C11.0475 0 9.70703 1.34044 9.70703 2.99396C9.70703 4.64748 11.0475 5.98793 12.701 5.98793Z" fill="#040483" />
                            </svg>
                            <span>In Progress</span>
                          </div>
                          <div className="wkit-duplicate-widget-name">
                            <div className="wkit-duplicate-widget-oldName">{props.quickeditName}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="6" viewBox="0 0 40 6" fill="none">
                              <path d="M40 3L35 0.113249V5.88675L40 3ZM0 3.5H35.5V2.5H0V3.5Z" fill="#040483" />
                            </svg>
                            <div className="wkit-duplicate-widget-NewName">{duplicate_w_name}</div>
                          </div>
                          <div className="wkit-duplicate-widget-details">Transferring all your HTML,CSS and JS to New one</div>
                        </Fragment>
                      }
                      {loader == false &&
                        <Fragment>
                          <span className="wkit-duplicate-congratularions">Congratulations! <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12.0437 18.8299C11.2209 19.1329 10.1762 19.5169 8.85467 20.0067C6.59792 19.6917 4.22642 18.9574 3.20117 17.2722C3.57467 16.2664 3.90017 15.3852 4.18817 14.6074C6.12017 16.8394 9.49592 18.2569 12.0437 18.8299Z" fill="#00A31B" />
                            <path d="M12.6979 11.3027C10.5019 9.10744 7.67437 7.48594 6.52162 8.64094C6.27562 8.88694 6.34987 8.73994 4.64062 13.3787C6.46312 16.0089 11.0681 17.8457 14.2759 18.0069C15.2351 17.6462 15.2126 17.6282 15.3604 17.4797C16.7741 16.0659 14.1109 12.7149 12.6979 11.3027ZM14.5639 16.6832C14.4566 16.7919 13.9579 16.7972 13.0721 16.3599C12.1091 15.8837 11.0104 15.0534 9.97837 14.0214C7.58738 11.6304 7.02862 9.72394 7.31662 9.43594C7.36162 9.39094 7.44562 9.36694 7.56487 9.36694C8.21062 9.36694 9.88388 10.0802 11.9029 12.0984C12.9349 13.1304 13.7659 14.2292 14.2421 15.1922C14.6794 16.0764 14.6719 16.5759 14.5639 16.6832Z" fill="#00A31B" />
                            <path d="M6.79345 20.7708C5.49445 21.2538 3.9967 21.8133 2.25745 22.465C1.8052 22.6315 1.3672 22.192 1.53445 21.742C1.97245 20.569 2.3677 19.5085 2.7277 18.541C3.7162 19.6765 5.2027 20.365 6.79345 20.7708Z" fill="#00A31B" />
                            <path d="M14.7526 2.92042C14.4024 2.98192 14.0641 3.03742 13.8346 3.15292C14.1796 3.68242 14.9004 4.35667 14.4601 5.23717C14.0664 6.02467 13.2481 5.97817 12.5379 6.00292C12.9736 6.59842 13.4776 7.20217 13.0891 7.97992C12.6864 8.78617 11.6304 8.95342 11.0071 9.05467C10.8054 9.08767 10.6179 8.95267 10.5804 8.75242L10.4439 8.01592C10.4056 7.81117 10.5436 7.61392 10.7484 7.57792C11.1031 7.51567 11.4354 7.46167 11.6664 7.34542C11.3199 6.81967 10.6021 6.13867 11.0401 5.26192C11.4331 4.47667 12.2506 4.52092 12.9624 4.49617C12.5259 3.90067 12.0226 3.29692 12.4111 2.51917C12.8139 1.71367 13.8706 1.54567 14.4924 1.44442C14.6941 1.41142 14.8816 1.54642 14.9184 1.74667L15.0549 2.48317C15.0946 2.68792 14.9581 2.88442 14.7526 2.92042Z" fill="#00A31B" />
                            <path d="M21.5159 8.9437L22.2524 9.0802C22.4534 9.1177 22.5877 9.3052 22.5547 9.5062C22.4534 10.128 22.2854 11.1847 21.4799 11.5875C20.7022 11.976 20.0984 11.4727 19.5029 11.0362C19.4782 11.748 19.5224 12.5662 18.7372 12.9585C17.8604 13.3965 17.1794 12.6787 16.6537 12.3322C16.5374 12.5632 16.4834 12.8955 16.4212 13.2502C16.3852 13.4557 16.1879 13.593 15.9832 13.5547L15.2467 13.4182C15.0457 13.3807 14.9114 13.1932 14.9444 12.9915C15.0457 12.369 15.2137 11.313 16.0192 10.9095C16.7962 10.521 17.4007 11.025 17.9962 11.4607C18.0209 10.7505 17.9744 9.93145 18.7619 9.53845C19.6424 9.0982 20.3167 9.81895 20.8462 10.164C20.9617 9.93445 21.0172 9.5962 21.0787 9.24595C21.1139 9.0427 21.3104 8.9062 21.5159 8.9437Z" fill="#00A31B" />
                            <path d="M19.275 15.75H17.85C17.7255 15.75 17.625 15.6495 17.625 15.525V14.85C17.625 14.7255 17.7255 14.625 17.85 14.625H19.275C19.3995 14.625 19.5 14.7255 19.5 14.85V15.525C19.5 15.6495 19.3995 15.75 19.275 15.75Z" fill="#00A31B" />
                            <path d="M20.8415 2.45531L19.8335 3.46331C19.7457 3.55106 19.6032 3.55106 19.5155 3.46331L19.0385 2.98556C18.9507 2.89781 18.9507 2.75531 19.0385 2.66756L20.0465 1.65956C20.1342 1.57181 20.2767 1.57181 20.3645 1.65956L20.8415 2.13656C20.9292 2.22431 20.9292 2.36681 20.8415 2.45531Z" fill="#00A31B" />
                            <path d="M9.15 4.875H8.475C8.3505 4.875 8.25 4.7745 8.25 4.65V3.225C8.25 3.1005 8.3505 3 8.475 3H9.15C9.2745 3 9.375 3.1005 9.375 3.225V4.65C9.375 4.7745 9.2745 4.875 9.15 4.875Z" fill="#00A31B" />
                            <path d="M14.537 9.9415L13.9745 9.5665C13.8688 9.496 13.838 9.3535 13.9108 9.24925C15.4415 7.07125 18.3928 4.801 21.515 4.6915C21.6433 4.68775 21.7498 4.79425 21.7498 4.92175V5.5975C21.7498 5.7175 21.6553 5.81125 21.5353 5.8165C18.923 5.92 16.247 7.88725 14.8393 9.8845C14.7695 9.98425 14.6375 10.009 14.537 9.9415Z" fill="#00A31B" />
                          </svg></span>
                          <span className="wkit-duplicate-success-msg">Congratulations! New Widget {duplicate_w_name} created from Widget {props.quickeditName} Successfully! Start editing or using that further.</span>
                        </Fragment>
                      }
                    </div>
                  </div>
                </div>
              }

            </div>
          </div>
        </div>
      )}

      {/* Add Widget */}
      {props.popup == "add-widget" && (
        <div id="popup" className="wb-add-widget addWidget">
          <div className="wkit-add-widget-header-container">
            <div className="popup-header">Create Widget</div>
            <div className="wkit-popup-close-icon" onClick={(e) => { props.ClosePopup(); }} >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" />
              </svg>
            </div>
          </div>
          <div className="wb-popup-content wkit-wb-popoupScroll">
            <div className="wb-add-widget-body">
              <div className="wb-add-widget-name-warpper">
                <div className="wb-add-widget-name">
                  <div className="wb-add-widget-name-title">
                    <label htmlFor="wb-add-widget-name">Widget Name</label>
                    <div className='wkit-wb-toolTip'>
                      <img className="wkit-wb-toolTip-icon" src={ImagePath + 'assets/images/wb-svg/info.svg'} width="13" style={{ marginBottom: '-5px' }} />
                      <span className='wkit-wb-toolTip-text wb-wkit-widgetName-toolTip wkit-wb-name-Tooltip'>Only numbers and alphabet are allowed for this field</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="wb-add-widget-nameinput"
                    name="wbaddwidgetname"
                    id="wb-add-widget-name"
                    ref={inputRef}
                    value={widgetName}
                    placeholder="Enter Widget Name"
                    onChange={(e) => { Get_widget_name(e) }}
                  />
                  <div className="wkit-name-Validation" style={{ display: NameValidation == false ? "flex" : "none", color: 'red' }}>First character of name must be alphabet</div>
                </div>
              </div>
              <div className="wb-add-widget-image">
                <div className="wb-add-widget-image-content">
                  <label className="wb-add-widget-imageinput">Featured Image</label>
                  <div className="wb-drop-file"
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={(e) => { Upload_image(e, e.dataTransfer.files[0]) }}
                    onClick={() => { document.querySelector("#wb-addwidget-img").click() }}>
                    <input className="wb-dropinput-file" type="file" id="wb-addwidget-img" name="wbdropfile" onChange={(event) => {
                      Upload_image(event, event.target.files[0])
                    }} accept="image/*" />
                    {
                      !widget_image &&
                      <>
                        <img src={ImagePath + "/assets/images/wb-svg/file-upload.svg"} />
                        <span> Drag & Drop or Upload Image File Here <br />(Only .JPG and .PNG Allowed)</span>
                      </>
                    }
                  </div>
                </div>
                <div className="wb-add-widget-image-content">
                  <div className="wb-add-widget-name-title">
                    <label className="wb-add-widget-imageinput">Widget Icon</label>
                    <div className='wkit-wb-toolTip'>
                      <img className="wkit-wb-toolTip-icon" src={ImagePath + 'assets/images/wb-svg/info.svg'} width="13" style={{ marginBottom: '-5px' }} />
                      <span className='wkit-wb-toolTip-text wb-wkit-widgetIcon-toolTip'>Only numbers and alphabet are allowed for this field</span>
                    </div>
                  </div>
                  {addwidgetRadio == "elementor" &&
                    <div className="wb-eicons-content">
                      <div className="wb-eicons-val">
                        <input className="wb-eicons-inp" value={widget_icon} type="text" defaultValue="eicon-code" placeholder="Enter Icon code from below links (e.g. eicon-code)" onChange={(e) => { Icon_validation(e) }} />
                      </div>
                      <div className="wb-eicons-links">
                        <div className="wb-eicons-links-heading">
                          <span>Copy Icon Name From Below Libraries and Paste Above.</span>
                        </div>
                        <div className="wb-eicons-links-content">
                          <a className="wb-eicons-lable" target="blank" rel="noopener noreferrer" href="https://elementor.github.io/elementor-icons/">E-icons</a>
                          <hr className="wb-eicons-hr" />
                          <a className="wb-eicons-lable" target="blank" rel="noopener noreferrer" href="https://fontawesome.com/v4/icons/">Font-Awesome 4</a>
                          <hr className="wb-eicons-hr" />
                          <a className="wb-eicons-lable" target="blank" rel="noopener noreferrer" href="https://fontawesome.com/v5/search">Font-Awesome 5</a>
                        </div>
                      </div>
                    </div>
                  }
                  {/* // <div className="wb-drop-file" style={{ display: addwidgetRadio && addwidgetRadio == "elementor" ? "flex" : "none" }}>
                    //   <input className="wb-widget-icon" type="text" value={widget_icon} onChange={(e) => { setwidget_icon(e.target.value) }} />
                    //   <img src={ImagePath + "/assets/images/wb-svg/file-upload.svg"} />
                    //   <span>Drag & Drop or Upload Image File <br />(Only .SVG Allowed)</span>
                    // </div> */}
                  {addwidgetRadio == "gutenberg" &&
                    <div className="wb-drop-file"
                      style={{ display: addwidgetRadio == "gutenberg" ? "flex" : "none" }}
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={(e) => { Drop_icon(e) }}
                      onClick={() => { document.querySelector("#wb-addwidget-icon").click() }}
                    >
                      <input
                        className="wb-dropinput-file"
                        type="file"
                        id="wb-addwidget-icon"
                        name="wbdropicon"
                        onChange={(event) => { Upload_icon(event) }}
                        accept="image/*" />
                      {!block_icon &&
                        <>
                          <img src={ImagePath + "/assets/images/wb-svg/file-upload.svg"} />
                          <span> Drag and drop to upload your superawesome <br />Image😍 </span>

                        </>
                      }
                    </div>
                  }
                </div>
              </div>
              <div className="wb-select-radio-label">
                <label>Choose Page Builder</label>
              </div>
              <div className='wb-add-widget-radio-main'>
                <div className={`wb-add-widget-radio  ${addwidgetRadio == 'elementor' ? 'radio-border' : ''}`}>
                  <input
                    type="radio"
                    name={"wbaddradio"}
                    id="wb-add-elementor-radio"
                    className='wb-add-widget-radioinput'
                    value="elementor"
                    onChange={(e) => { setaddwidgetRadio(e.target.value); }}
                    checked={addwidgetRadio == "elementor" ? true : false}
                  />
                  <img src={ImagePath + "/assets/images/wb-svg/elementor-icon.svg"} />
                  <label htmlFor="wb-add-elementor-radio" className={addwidgetRadio == 'elementor' ? 'radio-color' : ''}>Elementor</label>
                </div>
                <div className={`wb-add-widget-radio ${addwidgetRadio == 'gutenberg' ? 'radio-border' : ''}`} style={{ opacity: '0.5', pointerEvents: "none" }}>
                  <input
                    type="radio"
                    name="wbaddradio"
                    id="wb-add-gutenberg-radio"
                    className='wb-add-widget-radioinput'
                    value="gutenberg"
                    onChange={(e) => { setaddwidgetRadio(e.target.value); }}
                    checked={addwidgetRadio == "gutenberg" ? true : false}
                  />
                  <img src={ImagePath + "/assets/images/wb-svg/gutenberg-icon.svg"} />
                  <label htmlFor="wb-add-gutenberg-radio" className={addwidgetRadio == 'gutenberg' ? 'radio-color' : ''}>Gutenberg</label>
                </div>
              </div>
            </div>
            <div className="wb-add-widget-footer">
              <button className="wb-add-widget-cancelBtn" onClick={(e) => { props.ClosePopup(); }} > Cancel </button>

              {widgetName && widgetName.trim() ?
                <>
                  {loader == true ?
                    <div className="wb-add-widget-link">
                      <button className="wb-add-widget-updateBtn">
                        <div className="wkit-publish-loader">
                          <div className="wb-loader-circle"></div>
                        </div>
                      </button>
                    </div>
                    :
                    <div className="wb-add-widget-link" onClick={(e) => { handleSubmit(e) }}>
                      <button className="wb-add-widget-updateBtn">
                        <label>Create Widget</label>
                      </button>
                    </div>
                  }
                </>
                :
                <button className="wb-addss-widget-updateBtn"
                  onClick={() => { inputRef.current.focus(); inputRef.current.style.border = '1px solid red' }}>Create Widget</button>
              }
            </div>
          </div>
        </div >
      )}

      {/* Import Widget */}
      {props.popup == "import-widget" && (
        <div>
          <div id="popup" className="wb-add-widget ImportWidget">
            <div className="wkit-add-widget-header-container">
              <div className="popup-header">Import Widget</div>
              <div className="wkit-popup-close-icon" onClick={(e) => { props.ClosePopup(); }} >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" />
                </svg>
              </div>
            </div>
            <div className="wb-popup-content" style={{ height: "max-content" }}>
              <div className="wb-import-widget-inputs">
                <label>Select or Drop Your File Here (.ZIP Only)</label>
                <div className="wb-drop-file-inp" onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => { DropImportFile(e) }} onClick={(e) => { document.querySelector('#wb-import-file').click() }}>
                  {!DropFile ?
                    <img src={ImagePath + "/assets/images/wb-svg/file-upload.svg"} />
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 4L8 32H28V11H25C23.3431 11 22 9.65685 22 8V4H19V6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H19V11V14H20C20.5523 14 21 14.4477 21 15C21 15.5523 20.5523 16 20 16H19V18H20H22V20V22C22 24.2091 20.2091 26 18 26C15.7909 26 14 24.2091 14 22V20V18H16H17V15V12H16C15.4477 12 15 11.5523 15 11C15 10.4477 15.4477 10 16 10H17V7V4H8ZM24 4.82843V8C24 8.55228 24.4477 9 25 9H28V8.82843L25.0858 5.91421L24 4.82843ZM23.1716 2H19H17H8C6.89543 2 6 2.89543 6 4V32C6 33.1046 6.89543 34 8 34H28C29.1046 34 30 33.1046 30 32V8.82843C30 8.29799 29.7893 7.78929 29.4142 7.41421L26.5 4.5L24.5858 2.58579C24.2107 2.21071 23.702 2 23.1716 2ZM20 20V22C20 23.1046 19.1046 24 18 24C16.8954 24 16 23.1046 16 22V20H20Z" fill="black" />
                    </svg>
                  }
                  <input id="wb-import-file" name="myFile" type='file' accept=".zip" onChange={(e) => { Get_file(e) }} />
                  {!DropFile ?
                    <span>Drag & Drop or Upload Widget ZIP File Here</span>
                    :
                    <span>{DropFile?.name}</span>
                  }
                </div>
                <div className="dropFileErrorMessage">Zip file invalid or Missing. Upload Again!</div>
              </div>
              <div className="wb-add-widget-footer">
                <button className="wb-add-widget-cancelBtn" onClick={(e) => { props.ClosePopup(); }} >Close</button>
                {DropFile &&
                  <>
                    {loader == true ?
                      <button className="wb-import-widget-updateBtn" >
                        <div className="wkit-publish-loader">
                          <div className="wb-loader-circle"></div>
                        </div>
                      </button>
                      :
                      <button className="wb-import-widget-updateBtn" onClick={(e) => { Import_Widget(e) }}>
                        <label>Import</label>
                      </button>
                    }
                  </>
                }
                {!DropFile &&
                  <button className="wb-importss-widget-updateBtn" onClick={(e) => { Import_Widget(e) }}>Import</button>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
