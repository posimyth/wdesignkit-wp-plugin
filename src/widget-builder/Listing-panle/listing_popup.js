import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Elementor_file_create from "../file-creation/elementor_file";
import CreatFile from "../file-creation/gutenberg_file";
import Bricks_file_create from "../file-creation/bricks_file";
import { get_user_login } from '../../helper/helper-function';
import { component_array } from "../components-data/component_array";
import { __ } from '@wordpress/i18n';

const { Fragment } = wp.element;

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

  const specificLinks = {
    elementor: {
      defaultValue: "eicon-code",
      links: [
        { label: __("E-icons", 'wdesignkit'), href: "https://elementor.github.io/elementor-icons/" },
        { label: __("Font-Awesome 5", 'wdesignkit'), href: "https://fontawesome.com/v5/search" }
      ]
    },
    bricks: {
      defaultValue: "ti-shield",
      links: [
        { label: __("Ionicons 4", 'wdesignkit'), href: "https://ionic.io/ionicons" },
        { label: __("Font-Awesome 6", 'wdesignkit'), href: "https://fontawesome.com/v6/icons/" },
        { label: __("Themify", 'wdesignkit'), href: "https://themify.me/themify-icons" }
      ]
    },
    gutenberg: {
      defaultValue: "fas fa-yin-yang",
      links: [
        { label: __("Font-Awesome 5", 'wdesignkit'), href: "https://fontawesome.com/v5/search" }
      ]
    }
  };

  let convert_array = {
    'elementor': {
      'array': ['gradientcolor', 'align'],
      'info': {
        'gradientcolor': 'color',
        'align': 'choose'
      },
      'selector': {
        '{{PLUS_WRAP}}': '{{WRAPPER}}'
      }
    },
    'gutenberg': {
      'array': ['wysiwyg', 'code', 'divider', 'align', 'preview'],
      'info': {
        'wysiwyg': 'textarea',
        'align': 'choose',
        'code': '',
        'divider': '',
        'preview': '',
      },
      'selector': {
        '{{WRAPPER}}': '{{PLUS_WRAP}}'
      }
    },
    'bricks': {
      'array': ['wysiwyg', 'popover', 'choose', 'normalhover', 'divider', 'dimension', 'preview'],
      'info': {
        'wysiwyg': 'textarea',
        'choose': 'align',
        'popover': '',
        'normalhover': '',
        'divider': '',
        'dimension': '',
        'preview': '',
      },
      'selector': {
        '{{WRAPPER}}': '',
        '{{PLUS_WRAP}}': ''
      }
    }
  }

  const Drop_Down_Value = {
    "text-align": [
      { align_lable: 'left', align_value: 'left', align_icon: 'eicon-text-align-left' },
      { align_lable: 'center', align_value: 'center', align_icon: 'eicon-text-align-center' },
      { align_lable: 'right', align_value: 'right', align_icon: 'eicon-text-align-right' },
      { align_lable: 'justify', align_value: 'justify', align_icon: 'eicon-text-align-justify' }
    ],

    "justify-content": [
      { align_lable: 'start', align_value: 'flex-start', align_icon: 'eicon-text-align-left' },
      { align_lable: 'center', align_value: 'center', align_icon: 'eicon-text-align-center' },
      { align_lable: 'end', align_value: 'flex-end', align_icon: 'eicon-text-align-right' },
      { align_lable: 'space-between', align_value: 'space-between', align_icon: '' },
      { align_lable: 'space-around', align_value: 'space-around', align_icon: '' },
      { align_lable: 'space-evenly', align_value: 'space-evenly', align_icon: '' }
    ],

    "align-items": [
      { align_lable: 'start', align_value: 'flex-start', align_icon: 'eicon-text-align-left' },
      { align_lable: 'center', align_value: 'center', align_icon: 'eicon-text-align-center' },
      { align_lable: 'end', align_value: 'flex-end', align_icon: 'eicon-text-align-right' },
      { align_lable: 'stretch', align_value: 'stretch', align_icon: '' }
    ],

    "flex-direction": [
      { align_lable: 'column', align_value: 'column', align_icon: '' },
      { align_lable: 'row', align_value: 'row', align_icon: '' },
      { align_lable: 'reverse', align_value: 'reverse', align_icon: '' },
    ]
  };

  const generateUniqueID = () => {
    const now = new Date();
    const uniqueID = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    const hashedID = parseInt(uniqueID, 10) % 10000;
    return String(hashedID).padStart(4, '0');
  }

  const [img_path, setimg_path] = useState(wdkitData.WDKIT_URL);
  const [ImagePath, setImagePath] = useState(wdkitData.WDKIT_URL);
  const [widgetName, setwidgetName] = useState("");
  const [widgetDescription, setwidgetDescription] = useState("");
  const [DropFile, setDropFile] = useState("");
  const [widget_image, setwidget_image] = useState("");
  const [widget_icon, setwidget_icon] = useState("eicon-code");
  const [block_icon, setblock_icon] = useState("");
  const [addwidgetRadio, setaddwidgetRadio] = useState(props?.BuilderArray[0] ? props?.BuilderArray[0] : '');
  const [NameValidation, setNameValidation] = useState(true);
  const [Delete_type, setDelete_type] = useState('');
  const [error_msg, seterror_msg] = useState('');
  const [w_version, setw_version] = useState(props?.widgetdata?.WcardData?.widgetdata?.widget_version);
  const [duplicate_w_name, setduplicate_w_name] = useState(props.quickeditName);
  const [version_details, setversion_details] = useState(['']);
  const [loader, setloader] = useState(false);
  const [subpopup, setsubpopup] = useState('duplicate');
  const [selectedBuilder, setSelectedBuilder] = useState('');
  const [cn_new_widget_id, setcn_new_widget_id] = useState('');
  const [LoadjQuery, setLoadjQuery] = useState(false);

  let unique_name = keyUniqueID();

  const inputRef = useRef("");

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


    let form_data = new FormData();
    form_data.append('action', 'get_wdesignkit');
    form_data.append('kit_nonce', wdkitData.kit_nonce);
    form_data.append('type', 'wkit_delete_widget');
    form_data.append('info', JSON.stringify(remove_info));

    axios.post(ajaxurl, form_data).then((response) => {
      if (response?.data?.success == true) {
        props.wdkit_set_toast([response?.data?.message, response?.data?.description, '', 'success']);
      } else {
        props.wdkit_set_toast([response?.data?.message, response?.data?.description, '', 'danger']);
      }
    }).catch(error => console.log(error));

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
      let php = JSON.stringify("");

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
            "w_icon": widget_icon,
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
          "Editor_codes": [{ "html": '', "css": '', "js": '', "php": '' }]
        }
      }

      if (addwidgetRadio == "elementor") {
        await Elementor_file_create('add', data, html, css, js, "", widget_image).then(async (res) => {
          if (res?.api?.success) {
            await props.UpdateData();
            await props.wdkit_set_toast([__('Widget Added Successfully', 'wdesignkit'), __('Widget Added Successfully', 'wdesignkit'), '', 'success']);
            navigation(`/widget-listing/builder/${widgetName.trim()}_${unique_name}`)
          } else {
            props.wdkit_set_toast([__('Widget Creation Fail !', 'wdesignkit'), __('Widget is not created.', 'wdesignkit'), '', 'danger']);
          }
        });
      } else if (addwidgetRadio == "gutenberg") {
        await CreatFile('add', data, html, css, js, "", widget_image).then(async (res) => {
          if (res?.api?.success) {
            await props.UpdateData();
            await props.wdkit_set_toast([__('Widget Added Successfully', 'wdesignkit'), __('Widget Added Successfully', 'wdesignkit'), '', 'success']);
            navigation(`/widget-listing/builder/${widgetName.trim()}_${unique_name}`)
          } else {
            props.wdkit_set_toast([__('Widget Creation Fail !', 'wdesignkit'), __('Widget is not created.', 'wdesignkit'), '', 'danger']);
          }
        });
      } else if (addwidgetRadio == "bricks") {
        await Bricks_file_create('add', data, html, css, js, "", widget_image).then(async (res) => {
          if (res?.api?.success) {
            await props.UpdateData();
            await props.wdkit_set_toast([__('Widget Added Successfully', 'wdesignkit'), __('Widget Added Successfully', 'wdesignkit'), '', 'success']);
            navigation(`/widget-listing/builder/${widgetName.trim()}_${unique_name}`)
          } else {
            props.wdkit_set_toast([__('Widget Creation Fail !', 'wdesignkit'), __('Widget is not created.', 'wdesignkit'), '', 'danger']);
          }
        });
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
    }
  }

  /**
   * Import Widget 
   * 
   * @since 1.0.0
   * @version 1.0.8
   * 
   * @param {Event} e 
   * @returns 
   */
  const Import_Widget = async (e) => {

    if (!DropFile) {
      document.querySelector(".dropFileErrorMessage").style.display = "block";
      document.querySelector(".dropFileErrorMessage").style.color = "red";

      return;
    }

    setloader(true);
    props.StartLoading();

    var IsFileDrop = document.querySelector(".wb-editWidget-popup") ? document.querySelector(".wb-editWidget-popup") : "";
    if (document.querySelector(".dropFileErrorMessage").style.display = "block") {
      document.querySelector(".dropFileErrorMessage").style.display = "none";
    }

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

        var response = '';
        if (json_data.widget_data.widgetdata.type == "elementor") {
          response = await Elementor_file_create('import', data, html, css, js, oldFolder, "").then(async (res) => { return res })
        } else if (json_data.widget_data.widgetdata.type == "gutenberg") {
          response = CreatFile('import', data, html, css, js, "", "").then(async (res) => { return res })
        } else if (json_data.widget_data.widgetdata.type == "bricks") {
          response = Bricks_file_create('import', data, html, css, js, "", "").then(async (res) => { return res })
        }

        if (response && response?.api?.success) {
          props.wdkit_set_toast([__('Successfully Imported.', 'wdesignkit'), __('Yay! Your Widget has been successfully imported.', 'wdesignkit'), '', 'success']);
          await setTimeout(() => {
            props.UpdateData();
          }, 1000);
        } else {
          props.UpdateData();
        }

      } else {
        props.endLoading();
        props.wdkit_set_toast([__('Widget import fail', 'wdesignkit'), __('Widget import fail! data not get ', 'wdesignkit'), '', 'danger']);
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
      }).then((response) => {
        if (response?.data?.success) {
          File_creation(response?.data?.json);
          props.ClosePopup();

          if (document.querySelector('.wb-function-call')) {
            document.querySelector('.wb-function-call').click();
          }

          props.wdkit_set_toast([__('Widget imported', 'wdesignkit'), __('Widget imported Succesfully', 'wdesignkit'), '', 'success']);
        } else {
          props.wdkit_set_toast([response?.data?.message, response?.data?.description, '', 'danger']);
          props.ClosePopup();
          props.endLoading();
        }
      }).catch(error => console.log(error));
    }

    setloader(false);
  }

  const DropImportFile = (e) => {
    e.preventDefault();
    setDropFile(e.dataTransfer.files[0]);
    e.stopImmediatePropagation();
  }


  const handleImage = (e, type) => {
    if (type == 'upload') {
      if (!e.target.closest('.wkit-remove-widget-img')) {
        document.querySelector("#wb-addwidget-img").click()
      }
    } else if (type == 'remove') {
      let background_div = e.target.closest('.wb-drop-file');
      background_div.style.backgroundImage = ''
      setwidget_image('');
    }
  }

  const Upload_image = (e, file) => {
    if (file) {
      if (file?.size && ((Number(file?.size) / 1000000) > 1)) {
        e.preventDefault();

        props.wdkit_set_toast([__('Insert valid Image', 'wdesignkit'), __('Image size must be less tahn 2 mb.', 'wdesignkit'), '', 'danger']);
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
          props.wdkit_set_toast([__('Insert valid Image', 'wdesignkit'), __('only ".png", ".jpg", ".jpeg" images are allowed.', 'wdesignkit'), '', 'danger']);
        }
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
      // let old_folder = json_data.widget_data.widgetdata.name + '_' + json_data.widget_data.widgetdata.widget_id;

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

      if (widget_type == 'elementor') {
        var creat_api = await Elementor_file_create('sync', data, html, css, js, undefined, "")
          .then((response) => { return response });
      } else if (widget_type == 'gutenberg') {
        var creat_api = await CreatFile('sync', data, html, css, js, undefined, "")
          .then((response) => { return response });
      } else if (widget_type == 'bricks') {
        var creat_api = await Bricks_file_create('sync', data, html, css, js, undefined, "")
          .then((response) => { return response });
      }

      if (creat_api?.ajax?.data?.success == true) {
        props.wdkit_set_toast([__('Widget synced', 'wdesignkit'), __('Widget synced', 'wdesignkit'), '', 'success']);
        props.ClosePopup();
      } else {
        props.wdkit_set_toast([__('Operation fail', 'wdesignkit'), __('Something went wrong', 'wdesignkit'), '', 'danger']);
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
    var pattern = /^[a-zA-Z][a-zA-Z0-9\s]{0,23}$/;

    if (e.target.value == "") {
      e.target.style.border = "1px solid red";
      setNameValidation(true)
      return true;
    } else {
      if (pattern.test(e.target.value) && e.target.value.length <= 25 && isNaN(e.target.value.charAt(0))) {
        e.target.style.border = "";
        setNameValidation(true)
        return true;
      } else {
        document.querySelector('.wb-wkit-widgetName-toolTip').style.display = 'flex';

        setTimeout(() => {
          document.querySelector('.wb-wkit-widgetName-toolTip').style.display = '';
        }, 2000);
        setNameValidation(false)
        return false;
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
    let new_unique_id = keyUniqueID();
    setcn_new_widget_id(new_unique_id);


    let w_JSON_url = `${wdkitData.WDKIT_SERVER_PATH}/${w_builder}/${folder_name}/${file_name}.json?v=${generateUniqueID()}`;

    let w_json_data = await fetch(w_JSON_url)
      .then((response) => response.json())
      .then((json) => { return json })

    if (w_json_data) {
      let html = w_json_data?.Editor_data?.html ? JSON.stringify(w_json_data.Editor_data.html) : JSON.stringify('');
      let js = w_json_data?.Editor_data?.js ? JSON.stringify(w_json_data.Editor_data.js) : JSON.stringify('');
      let css = w_json_data?.Editor_data?.css ? JSON.stringify(w_json_data.Editor_data.css) : JSON.stringify('');

      let new_obj = Object.assign({}, w_json_data.widget_data.widgetdata, {
        "name": duplicate_w_name,
        "r_id": 0,
        "widget_id": new_unique_id,
        "widget_version": "",
        "version_detail": [''],
        "allow_push": true
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

      if (w_json_data.widget_data.widgetdata.type == "elementor") {
        await Elementor_file_create('import', data, html, css, js, "", "", w_json_data?.widget_data?.widgetdata?.w_image).then(async (res) => {
          if (res?.api?.success) {
            props.wdkit_set_toast([__('Widget Duplicated', 'wdesignkit'), __('Widget Duplicated successfully.', 'wdesignkit'), '', 'success']);
            await props.UpdateData()
            setloader(false);
          } else {
            setloader(false);
          }
        })
      } else if (w_json_data.widget_data.widgetdata.type == "gutenberg") {
        await CreatFile('import', data, html, css, js, "", "", w_json_data?.widget_data?.widgetdata?.w_image).then(async (res) => {
          if (res?.api?.success) {
            props.wdkit_set_toast([__('Widget Duplicated', 'wdesignkit'), __('Widget Duplicated successfully.', 'wdesignkit'), '', 'success']);
            await props.UpdateData()
            setloader(false);
          } else {
            setloader(false);
          }
        })
      } else if (w_json_data.widget_data.widgetdata.type == "bricks") {
        await Bricks_file_create('import', data, html, css, js, "", "", w_json_data?.widget_data?.widgetdata?.w_image).then(async (res) => {
          if (res?.api?.success) {
            props.wdkit_set_toast([__('Widget Duplicated', 'wdesignkit'), __('Widget Duplicated successfully.', 'wdesignkit'), '', 'success']);
            await props.UpdateData()
            setloader(false);
          } else {
            setloader(false);
          }
        })
      }
    }
  }

  const Widget_Convert = async (w_type) => {
    props.StartLoading(true);
    setloader(true);

    let w_name = props.quickeditName;
    let w_builder = props.quickediteditType;
    let u_id = props.widget_id;

    let folder_name = w_name.replaceAll(' ', '-') + '_' + u_id;
    let file_name = w_name.replaceAll(' ', '_') + '_' + u_id;

    let w_JSON_url = `${wdkitData.WDKIT_SERVER_PATH}/${w_builder}/${folder_name}/${file_name}.json?v=${generateUniqueID()}`;
    let current_builder = props?.quickediteditType;

    let w_json_data = await fetch(w_JSON_url)
      .then((response) => response.json())
      .then((json) => { return json })

    const Change_controller = (controller_array, switcherArray) => {
      let new_inner_sec = [];

      if (controller_array?.length > 0) {
        controller_array.map((controller, c_index) => {

          if ('bricks' === w_type) {
            if (controller?.selectors !== undefined && controller?.selectors?.search('{{WRAPPER}}') > -1) {
              controller.selectors = controller.selectors.replaceAll('{{WRAPPER}}', '')
            } else if (controller?.selector !== undefined && controller?.selector?.search('{{WRAPPER}}') > -1) {
              controller.selector = controller.selector.replaceAll('{{WRAPPER}}', '')
            }
          }

          if ((controller.type == 'repeater' || controller.type == 'popover' || controller.type == 'normalhover') && (w_type != 'bricks')) {
            if (controller.fields.length > 0) {

              let new_field = Change_controller(controller.fields, switcherArray);
              let new_obj = Object.assign({}, controller, { 'fields': new_field })

              new_inner_sec.push(new_obj);

            }
          } else if (w_type == 'bricks' && controller.type == 'popover') {
            new_inner_sec.push(Add_divider());

            let heading_controller = component_array?.heading ? component_array.heading : '';
            heading_controller = Object.assign({}, heading_controller, { 'lable': controller.lable, 'name': heading_controller.name + keyUniqueID() })
            new_inner_sec.push(heading_controller);

            if (controller?.fields?.length > 0) {
              controller?.fields.map((P_controller) => {

                if (P_controller?.selectors && P_controller?.selectors.includes('{{WRAPPER}}')) {
                  P_controller.selectors = P_controller.selectors.replaceAll('{{WRAPPER}}', '').trim();
                }
                if (P_controller?.selectors && P_controller?.selectors.includes('{{WRAPPER}}')) {
                  P_controller.selectors = P_controller.selectors.replaceAll('{{WRAPPER}}', '').trim();
                }
                new_inner_sec.push(P_controller);
              })
            }

            new_inner_sec.push(Add_divider());

          } else if (w_type == 'bricks' && controller.type == 'normalhover') {
            var nha_array = {};
            if (controller?.nha_array?.length > 0) {
              controller?.nha_array.map((sub_controller) => {
                nha_array = Object.assign({}, nha_array, { [sub_controller]: [] })
              })
            }

            if (controller?.fields?.length > 0) {
              controller?.fields.map((P_controller) => {

                if (P_controller?.selectors && P_controller?.selectors.includes('{{WRAPPER}}')) {
                  P_controller.selectors = P_controller.selectors.replaceAll('{{WRAPPER}}', '').trim();
                }
                if (P_controller?.selectors && P_controller?.selectors.includes('{{WRAPPER}}')) {
                  P_controller.selectors = P_controller.selectors.replaceAll('{{WRAPPER}}', '').trim();
                }

                if (nha_array?.[P_controller.key]) {
                  nha_array[P_controller.key].push(P_controller);
                }
              })
            }

            new_inner_sec.push(Add_divider());

            Object.values(nha_array).map((sub_array, index) => {

              let heading_controller = component_array?.heading ? component_array.heading : '';
              if (controller?.nha_array_lable?.[index]) {
                var nha_label = controller.nha_array_lable[index];
              } else {
                let nha_val = controller.nha_array[index];
                var nha_label = nha_val?.charAt(0).toUpperCase() + nha_val?.slice(1);
              }
              heading_controller = Object.assign({}, heading_controller, { 'lable': nha_label, 'name': heading_controller.name + keyUniqueID() })
              new_inner_sec.push(heading_controller);

              sub_array?.length > 0 && sub_array.map((inner_controller) => {
                new_inner_sec.push(inner_controller);
              })

              new_inner_sec.push(Add_divider());

            })


          } else if (w_type == 'bricks' && controller.type == 'choose') {
            let replace_con = convert_array?.[w_type]?.info?.[controller.type] ? convert_array[w_type].info[controller.type] : '';
            var new_controller = component_array?.[replace_con] ? component_array[replace_con] : '';

            if (new_controller) {
              let con_array = Object.keys(new_controller);
              if (con_array.length > 0) {
                con_array.map((id) => {
                  if (controller[id] != undefined && id != 'type') {
                    new_controller = Object.assign({}, new_controller, { [id]: controller[id] })
                  } else {
                    if (id == 'alignType') {
                      new_controller = Object.assign({}, new_controller, { 'alignType': controller.selector_value.toLowerCase() })
                    }
                  }
                })
              }
              new_inner_sec.push(new_controller);
            }

          } else if (w_type == 'bricks' && controller.type == 'dimension') {
            if (controller.selector_value === 'border-radius') {
              let replace_con = 'heading';
              var new_controller = component_array?.[replace_con] ? component_array[replace_con] : '';

              if (new_controller) {
                new_controller = Object.assign({}, new_controller, { lable: 'Border-radius is now available in the border controller, so we removed it from the dimension controller.' })
              }
              new_inner_sec.push(new_controller);
            } else {
              new_inner_sec.push(controller);
            }

          } else if (('elementor' === w_type || 'gutenberg' === w_type) && 'border' === controller.type && 'bricks' === current_builder) {
            var new_controller = component_array?.dimension ? component_array.dimension : '';

            if (new_controller) {
              new_inner_sec.push(controller);
              new_controller = Object.assign({}, new_controller, { 'lable': controller.lable + ' (Radius)', 'selector_value': 'border-radius', 'selectors': controller.selector })
              new_inner_sec.push(new_controller);
            }
          } else if (('elementor' === w_type || 'gutenberg' === w_type) && 'align' === controller.type) {
            let replace_con = convert_array?.[w_type]?.info?.[controller.type] ? convert_array[w_type].info[controller.type] : '';
            var new_controller = component_array?.[replace_con] ? component_array[replace_con] : '';

            if (new_controller) {
              let con_array = Object.keys(new_controller);
              if (con_array.length > 0) {

                con_array.map((id) => {
                  if (controller[id] != undefined && id != 'type') {
                    new_controller = Object.assign({}, new_controller, { [id]: controller[id] })
                  } else {
                    if ('selector_value' === id) {
                      new_controller = Object.assign({}, new_controller, { 'selector_value': controller.alignType.toLowerCase() })
                    }
                    if ('align_option' === id) {
                      new_controller = Object.assign({}, new_controller, { 'align_option': Drop_Down_Value[controller.alignType] })
                    }
                  }

                })
              }

              new_inner_sec.push(new_controller);
            }
          } else if (convert_array?.[w_type]?.array?.length > 0 && convert_array?.[w_type]?.array.includes(controller.type)) {
            let replace_con = convert_array?.[w_type]?.info?.[controller.type] ? convert_array[w_type].info[controller.type] : '';
            var new_controller = component_array?.[replace_con] ? component_array[replace_con] : '';

            if (new_controller) {
              let con_array = Object.keys(new_controller);
              if (con_array.length > 0) {
                con_array.map((id) => {
                  if (controller[id] != undefined && id != 'type') {
                    new_controller = Object.assign({}, new_controller, { [id]: controller[id] })
                  }
                })
              }
              new_inner_sec.push(new_controller);
            }
          } else if (w_type == 'bricks' && controller.type == 'repeater') {
            var new_controller = Object.assign({}, controller);
            let new_feild = [];
            if (new_controller?.fields?.length > 0) {
              new_controller?.fields.map((R_con) => {
                if (R_con?.selectors && R_con?.selectors.includes('{{WRAPPER}}')) {
                  R_con.selectors = R_con.selectors.replaceAll('{{WRAPPER}}', '').trim();
                }
                if (R_con?.selectors && R_con?.selectors.includes('{{WRAPPER}}')) {
                  R_con.selectors = R_con.selectors.replaceAll('{{WRAPPER}}', '').trim();
                }
                if (R_con?.selector && R_con?.selector.includes('{{CURRENT_ITEM}}')) {
                  R_con.selector = R_con.selector.replaceAll('{{CURRENT_ITEM}}', '').trim();
                }
                if (R_con?.selectors && R_con?.selectors.includes('{{CURRENT_ITEM}}')) {
                  R_con.selectors = R_con.selectors.replaceAll('{{CURRENT_ITEM}}', '').trim();
                }
                if (R_con?.selector && R_con?.selector.includes('{{TP_REPEAT_ID}}')) {
                  R_con.selector = R_con.selector.replaceAll('{{TP_REPEAT_ID}}', '').trim();
                }
                if (R_con?.selectors && R_con?.selectors.includes('{{TP_REPEAT_ID}}')) {
                  R_con.selectors = R_con.selectors.replaceAll('{{TP_REPEAT_ID}}', '').trim();
                }
                new_feild.push(R_con)
              })
            }
            new_controller = Object.assign({}, new_controller, { 'fields': new_feild });
            new_inner_sec.push(new_controller)
          } else {
            new_inner_sec.push(controller)
          }

          if (w_type == 'bricks') {
            var new_controller = Object.assign({}, controller);
            if (controller?.condition_value?.values.length > 0) {
              controller?.condition_value?.values.map((value) => {
                if (switcherArray.includes(value.name) && value.value != null) {
                  value.value = true;
                }
              })
            }
            if (controller.type == 'repeater' && controller?.fields.length > 0) {
              controller?.fields.map((R_con) => {
                if (R_con?.condition_value?.values.length > 0) {
                  R_con?.condition_value?.values.map((value) => {
                    if (switcherArray.includes(value.name) && value.value != null) {
                      value.value = true;
                    }
                  })
                }
              })
            }
          }
        })
      }
      return new_inner_sec;
    }

    const Add_divider = () => {
      let divider_controller = component_array?.divider ? component_array.divider : '';
      divider_controller = Object.assign({}, divider_controller, { 'lable': '', 'name': divider_controller.name + keyUniqueID() })

      return divider_controller;
    }

    const Convert_controller = (json) => {

      var layout_cons = json?.section_data[0].layout;
      let style_cons = json?.section_data[0].style;

      let new_layout = [];
      let new_style = [];

      let switcherArray = [];
      if (layout_cons.length > 0) {
        layout_cons.map((section) => {
          if (section?.inner_sec?.length > 0) {
            section.inner_sec.map((controller) => {
              if (controller.type == 'switcher') {
                switcherArray.push(controller.name);
              }
              if (controller.type == 'repeater' || controller.type == 'normalhover' || controller.type == 'popover') {
                controller.fields.map((fields) => {
                  if (fields.type == 'switcher') {
                    switcherArray.push(fields.name);
                  }
                })
              }
            })
          }
        })
      }

      if (style_cons.length > 0) {
        style_cons.map((section) => {
          if (section?.inner_sec?.length > 0) {
            section.inner_sec.map((controller) => {
              if (controller.type == 'switcher') {
                switcherArray.push(controller.name);
              }
              if (controller.type == 'repeater' || controller.type == 'normalhover' || controller.type == 'popover') {
                controller.fields.map((fields) => {
                  if (fields.type == 'switcher') {
                    switcherArray.push(fields.name);
                  }
                })
              }
            })
          }
        })
      }

      if (layout_cons?.length > 0) {
        layout_cons.map((section, s_index) => {
          var section_data = section;
          let inner_section = Change_controller(section.inner_sec, switcherArray) ? Change_controller(section.inner_sec, switcherArray) : [];

          section_data = Object.assign({}, section_data, { 'inner_sec': inner_section })
          new_layout.push(section_data);
        })
      }

      if (style_cons?.length > 0) {
        style_cons.map((section, s_index) => {
          var section_data = section;
          let inner_section = Change_controller(section.inner_sec, switcherArray) ? Change_controller(section.inner_sec, switcherArray) : [];

          section_data = Object.assign({}, section_data, { 'inner_sec': inner_section })
          new_style.push(section_data);
        })
      }

      let convert_json = [{ 'layout': new_layout, 'style': new_style }];

      return convert_json;
    }


    if (w_json_data) {

      let new_json = Convert_controller(w_json_data);

      let html = w_json_data?.Editor_data?.html ? JSON.stringify(w_json_data.Editor_data.html) : JSON.stringify('');
      let js = w_json_data?.Editor_data?.js ? JSON.stringify(w_json_data.Editor_data.js) : JSON.stringify('');
      let css = w_json_data?.Editor_data?.css ? JSON.stringify(w_json_data.Editor_data.css) : JSON.stringify('');
      let new_unique_id = keyUniqueID();
      setcn_new_widget_id(new_unique_id);


      let new_obj = Object.assign({}, w_json_data.widget_data.widgetdata, {
        "name": duplicate_w_name,
        "r_id": 0,
        "widget_id": new_unique_id,
        "w_icon": widget_icon,
        "type": w_type,
        "widget_version": "",
        "version_detail": [''],
        "allow_push": true
      })

      let new_WcardData = Object.assign({}, w_json_data.widget_data, { "widgetdata": new_obj })
      var external_cdn = w_json_data.Editor_Link?.links?.[0]?.external_cdn ? [...w_json_data.Editor_Link.links[0].external_cdn] : []

      if (LoadjQuery) {
        if (!external_cdn.includes('jQuery')) {
          external_cdn.push('jQuery')
        }
      }

      let new_exLink = Object.assign({}, w_json_data.Editor_Link.links[0], { "external_cdn": external_cdn })

      let links = Object.assign({}, w_json_data.Editor_data, { 'links': [new_exLink] });


      var data = {
        "CardItems": {
          "cardData": new_json
        },

        "WcardData": new_WcardData,

        "Editor_data": links,

        "Editor_code": {
          "Editor_codes": [w_json_data.Editor_data]
        }
      }

      if (w_type == "elementor") {
        if (widget_image) {
          var response = await Elementor_file_create('import', data, html, css, js, "", "", widget_image).then(async (res) => { return res })
        } else {
          var response = await Elementor_file_create('import', data, html, css, js, "", "", w_json_data?.widget_data?.widgetdata?.w_image).then(async (res) => { return res })
        }
      } else if (w_type == "gutenberg") {
        if (widget_image) {
          var response = await CreatFile('import', data, html, css, js, "", widget_image, "", LoadjQuery).then(async (res) => { return res })
        } else {
          var response = await CreatFile('import', data, html, css, js, "", "", w_json_data?.widget_data?.widgetdata?.w_image, LoadjQuery).then(async (res) => { return res })
        }
      } else if (w_type == "bricks") {
        if (widget_image) {
          var response = await Bricks_file_create('import', data, html, css, js, "", widget_image, "", LoadjQuery).then(async (res) => { return res })
        } else {
          var response = await Bricks_file_create('import', data, html, css, js, "", "", w_json_data?.widget_data?.widgetdata?.w_image, LoadjQuery).then(async (res) => { return res })
        }
      }

      if (response?.api?.success) {
        setloader(false);
        props.wdkit_set_toast([__('Widget Converted', 'wdesignkit'), __('Widget Converted successfully.', 'wdesignkit'), '', 'success']);
        await props.UpdateData()
      } else {
        setloader(false);
        props.wdkit_set_toast([__('Widget Conversion Fail!', 'wdesignkit'), __('Widget not Converted successfully.', 'wdesignkit'), '', 'danger']);
      }

    }
  }

  const Drop_down_toggle = (e) => {
    let main_object = e.target.closest(".wkit-custom-dropDown")
    let drop_down = main_object.querySelector(".wkit-custom-dropDown-content") ? main_object.querySelector(".wkit-custom-dropDown-content") : "";
    if (drop_down) {
      if (Object.values(drop_down.classList).includes("wkit-show")) {
        drop_down.classList.remove("wkit-show");
      } else {
        drop_down.classList.add("wkit-show");
      }
    }
  }

  const CapitalizedText = (widgetType) => {
    let CapText = widgetType.charAt(0).toUpperCase() + widgetType.slice(1);
    return CapText;
  }

  const handleVersionInputChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9.]*$/;

    if (value == '') {
      seterror_msg('');
    } else if (!regex.test(value)) {
      seterror_msg(`You can enter only number here`);
      return;
    }

    setw_version(props?.w_version ? e.target.value : '1.0.0');
    if (props?.w_version >= value) {
      seterror_msg(`version ${value} is already available`);
    } else {
      seterror_msg('');
    }
  };

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
            <div className="wkit-popup-header">{__('Are you sure you want to delete?', 'wdesignkit')}</div>
            <div className="wkit-member-popup">
              <h3 className='wkit-heading-delete'>{__('Please select an option from below:', 'wdesignkit')}</h3>
              {get_user_login() && props.quickediteditMeta != 'plugin' &&
                <label className='wkit-custom-radio-wrap'>
                  <span className='wkit-server-heading' id='wkit-radio1' >
                    <input type="radio" name="server-1" id='wkit-radio1' checked={Delete_type == 'plugin_server'} onChange={(e) => { setDelete_type('plugin_server') }} />{__('Permanently Delete', 'wdesignkit')} </span>
                  <span className='wkit-radio-desc'>{__('This will remove your widget from cloud and local system both. Make sure you download it as a ZIP as then you will not be able to get access of it.', 'wdesignkit')}</span>
                </label>
              }
              {props.quickediteditMeta != 'server' &&
                <label className='wkit-custom-radio-wrap'>
                  <span className='wkit-server-heading' id='wkit-radio2'>
                    <input type="radio" name="server-1" id='wkit-radio2' checked={Delete_type == 'plugin'} onChange={(e) => { setDelete_type('plugin') }} />{__('Local Delete', 'wdesignkit')}</span>
                  <span className='wkit-radio-desc'>{__('This will remove your Widget from your current website. If you need to use it in the future, you can simply download it again from the server.', 'wdesignkit')}</span>
                </label>
              }
              <div className='wkit-widget-delete-btn-position'>
                {loader == true &&
                  <button className="wkit-template-delete wkit-btn-class">
                    <div className="wkit-publish-loader">
                      <div className="wb-loader-circle"></div>
                    </div>
                  </button>
                }
                {loader == false &&
                  <button className="wkit-template-delete wkit-btn-class" onClick={(e) => { Delete_widget(e) }} >
                    <span>{__('Yes, Delete it!', 'wdesignkit')}</span>
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
            <div className="wb-version-detail">
              <div className="wkit-add-widget-header-container">
                <div className="popup-header">{__('Add Sync Details', 'wdesignkit')}</div>
              </div>
              <div className="wb-version-body wb-add-widget">
                <div className='wb-version-wrap wb-version-current'>
                  <div className="wb-version-number">
                    <span className='wb-version-label'>{__('Current Version', 'wdesignkit')}</span>
                    <input className="wb-version-input"
                      type="text"
                      defaultValue={props?.w_version ? props?.w_version : '1.0.0'}
                      disabled
                      style={{ cursor: "not-allowed" }} />
                  </div>
                  <div className="wb-version-details">
                    <span className='wb-version-label'>{__('Latest Version', 'wdesignkit')}</span>
                    <input className="wb-version-input"
                      value={props?.w_version ? w_version : '1.0.0'}
                      type="text"
                      onChange={(e) => { handleVersionInputChange(e) }}
                      disabled={props?.w_version ? false : true} />
                    <div className="wb-error-message">{error_msg}</div>
                  </div>
                </div>
                <span className='wb-version-label'>{__('Changelog', 'wdesignkit')}</span>
                <div className="wb-version-changes">
                  {version_details.map((val, index) => {
                    return (
                      <div className='wb-version-wrap'>
                        <textarea className="wb-version-detail-input" value={val} placeholder={__('Please enter description', 'wdesignkit')} rows="2" onChange={(e) => { Update_changelog(e, index) }} />
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
                  <label>{__('Add more', 'wdesignkit')}</label>
                </button>
                <div className="wb-add-widget-footer">
                  <div className="wb-add-widget-cancelBtn">
                    <button onClick={(e) => { props.ClosePopup(); }} > {__('Cancel', 'wdesignkit')} </button>
                  </div>
                  {loader == true &&
                    <button className={`wb-version-popup-btn wb-addss-widget-updateBtn wkit-btn-class`}>
                      <div className="wkit-publish-loader">
                        <div className="wb-loader-circle"></div>
                      </div>
                    </button>
                  }
                  {loader == false &&
                    <button className={(props?.w_version < w_version || !props?.w_version) ? `wb-add-widget-link wkit-btn-class` : `wb-addss-widget-updateBtn wkit-btn-class`}
                      style={{ cursor: (props?.w_version < w_version || !props?.w_version) ? '' : "no-drop" }}
                      disabled={props?.w_version < w_version || !props?.w_version ? false : true}
                      onClick={(e) => { Update_version() }}>
                      <span>{__('Update', 'wdesignkit')}</span>
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
                  <label>{__('Duplicate Widget', 'wdesignkit')}</label>
                </div>
              </div>
              {subpopup == 'duplicate' &&
                <div className="wb-version-body">
                  <div className='wb-version-wrap'>
                    <div className="wb-version-number">
                      <div className="wb-add-widget-name-title">
                        <span className='wb-version-label'>{__('Enter New Widget Name', 'wdesignkit')}</span>
                        <div className='wkit-wb-toolTip wkit-popup-first-toolTip'>
                          <img className="wkit-wb-toolTip-icon" src={ImagePath + 'assets/images/wb-svg/info.svg'} width="13" style={{ marginBottom: '-8px' }} />
                          <span className='wkit-wb-toolTip-text wb-wkit-widgetName-toolTip wkit-wb-name-Tooltip' >
                            {__('Only numbers and alphabet are allowed for this field,Widget name must be smaller then 25 charaters and first letter can\'t be digit.', 'wdesignkit')}</span>
                        </div>
                      </div>
                      <input className="wb-version-input"
                        type="text"
                        placeholder={__("Enter Widget Name", 'wdesignkit')}
                        value={duplicate_w_name}
                        onChange={(e) => { Get_widget_name(e) ? setduplicate_w_name(e.target.value) : '' }}
                        onBlur={() => { setduplicate_w_name(duplicate_w_name.trim()) }}
                      />
                    </div>
                  </div>
                  <div className="wb-quickedit-footer">
                    {loader == true &&
                      <button className='wb-version-popup-btn wkit-btn-class'>
                        <div className="wkit-publish-loader">
                          <div className="wb-loader-circle"></div>
                        </div>
                      </button>
                    }
                    {loader == false &&
                      <Fragment>
                        <div className="wkit-quickedit-note">
                          <span>
                            <b>{__('Note :', 'wdesignkit')}</b> {__('This new widget will have unique class, So It will work independently from previous widget.', 'wdesignkit')}
                          </span>
                        </div>
                        <button className='wb-version-popup-btn wkit-btn-class'
                          disabled={duplicate_w_name ? false : true}
                          onClick={() => { Widget_Duplicate(); setsubpopup('success_duplicate') }}>
                          <span>{__('Duplicate', 'wdesignkit')}</span>
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
                            <span>{__('In Progress', 'wdesignkit')}</span>
                          </div>
                          <div className="wkit-duplicate-widget-name">
                            <div className="wkit-duplicate-widget-oldName">{props.quickeditName}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="6" viewBox="0 0 40 6" fill="none">
                              <path d="M40 3L35 0.113249V5.88675L40 3ZM0 3.5H35.5V2.5H0V3.5Z" fill="#040483" />
                            </svg>
                            <div className="wkit-duplicate-widget-NewName">{duplicate_w_name}</div>
                          </div>
                          <div className="wkit-duplicate-widget-details">{__('Transferring all your HTML,CSS and JS to New one', 'wdesignkit')}</div>
                        </Fragment>
                      }
                      {loader == false &&
                        <Fragment>
                          <span className="wkit-duplicate-congratularions">{__('Congratulations!', 'wdesignkit')}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                          <span className="wkit-duplicate-success-msg">{__('Congratulations! New Widget', 'wdesignkit')} <b>{duplicate_w_name}</b> {__('created from Widget', 'wdesignkit')} <b>{props.quickeditName}</b> {__('Successfully!', 'wdesignkit')}</span>
                          <Link to={`/widget-listing/builder/${duplicate_w_name + "_" + cn_new_widget_id}`} target='_blank' rel="noopener noreferrer">
                            <button className="wb-convert-popup-btn wkit-btn-class">
                              <span>{__('Edit', 'wdesignkit')} {duplicate_w_name}</span>
                            </button>
                          </Link>
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

      {/**Convert Widget */}
      {props.popup == "convert-widget" && (
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
                  <label>{__('Convert Widget', 'wdesignkit')}</label>
                </div>
              </div>
              {subpopup == 'duplicate' &&
                <div className="wb-version-body">
                  <span className='wb-convert-title'>{duplicate_w_name}</span>
                  <div className='wb-version-wrap'>
                    <div className="wb-convert-main">
                      <div className="wb-convert-widget-group">
                        <span className='wb-convert-label'>{__('Current Widget', 'wdesignkit')}</span>
                        <span className="wkit-select-builder-wrap">
                          <img style={{ width: '24px' }} src={img_path + `/assets/images/wb-svg/${props?.quickediteditType}.svg`} />
                          <label>{CapitalizedText(props?.quickediteditType)}</label>
                        </span>
                      </div>
                      <div className="wb-convert-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                          <path d="M2.56465 10.5233C2.43348 10.2066 2.50598 9.84216 2.74828 9.59981L6.60371 5.74438C6.93477 5.41333 7.47121 5.41333 7.80223 5.74438C8.13316 6.07524 8.13316 6.61188 7.80223 6.94274L5.39344 9.35153H21.6525C22.1205 9.35153 22.5 9.73091 22.5 10.199C22.5 10.6671 22.1205 11.0465 21.6525 11.0465H3.34754C3.00477 11.0465 2.69582 10.8399 2.56465 10.5233ZM21.6525 12.9533H3.34746C2.87945 12.9533 2.5 13.3326 2.5 13.8007C2.5 14.2688 2.87945 14.6482 3.34746 14.6482H19.6066L17.1977 17.057C16.8668 17.3878 16.8668 17.9245 17.1977 18.2553C17.3632 18.4208 17.58 18.5036 17.797 18.5036C18.0138 18.5036 18.2307 18.4208 18.3962 18.2553L22.2517 14.3999C22.494 14.1576 22.5665 13.7931 22.4354 13.4765C22.3042 13.1598 21.9952 12.9533 21.6525 12.9533Z" fill="black" />
                        </svg>
                      </div>
                      <div className="wb-convert-widget-group">
                        <span className='wb-convert-label'>{__('Convert to', 'wdesignkit')}</span>

                        <div className='wkit-select-builder-inner-wrap wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                          <div className="wkit-custom-dropDown-header">
                            <div className="wkit-selected-builder">
                              {selectedBuilder &&
                                <img style={{ width: '24px' }} src={img_path + `/assets/images/wb-svg/${selectedBuilder}.svg`} />
                              }
                              <span>{selectedBuilder || __('Select Builder', 'wdesignkit')}</span>
                            </div>
                            <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} alt="Controller Open" />
                          </div>
                          <div className="wkit-custom-dropDown-content">
                            {props.BuilderArray.map((builder, index) => (
                              <Fragment key={index}>
                                {builder != props?.quickediteditType && builder != selectedBuilder &&
                                  <div key={builder} className="wkit-custom-dropDown-options" onClick={() => { setSelectedBuilder(builder); setwidget_icon(specificLinks[builder].defaultValue); }}>
                                    <img style={{ width: '24px' }} src={img_path + `/assets/images/wb-svg/${builder}.svg`} />
                                    <span>{CapitalizedText(builder)}</span>
                                  </div>
                                }
                              </Fragment>
                            ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="wb-quickedit-footer">
                    {loader == true &&
                      <button className='wb-version-popup-btn wkit-btn-class'>
                        <div className="wkit-publish-loader">
                          <div className="wb-loader-circle"></div>
                        </div>
                      </button>
                    }
                    {loader == false &&
                      <Fragment>
                        <div className="wkit-quickedit-note">
                          <span>
                            <b>{__('Note :', 'wdesignkit')}</b> {__('This new widget will have have unique class, So It will work independently from previous widget.', 'wdesignkit')}
                          </span>
                        </div>
                        <button className='wb-version-popup-btn wkit-btn-class'
                          disabled={selectedBuilder == '' ? true : false}
                          onClick={() => { setsubpopup('widget_infomation') }}>
                          <span>{__('Next', 'wdesignkit')}</span>
                        </button>
                      </Fragment>
                    }
                  </div>
                </div>
              }
              {subpopup == 'widget_infomation' &&
                <div className="wb-version-body">
                  <div className="wkit-success-duplicate-content">

                    <div className="wb-convert-widget-group">
                      <div className="wb-add-widget-name-title">
                        <span className='wb-version-label'>{__('Widget Name', 'wdesignkit')}</span>
                        <div className='wkit-wb-toolTip wkit-popup-first-toolTip'>
                          <img className="wkit-wb-toolTip-icon" src={ImagePath + 'assets/images/wb-svg/info.svg'} width="13" style={{ marginBottom: '-9px' }} />
                          <span className='wkit-wb-toolTip-text wb-wkit-widgetName-toolTip wkit-wb-name-Tooltip'>
                            {__('Only numbers and alphabet are allowed for this field,Widget name must be smaller then 25 charaters and first letter can\'t be digit.', 'wdesignkit')}</span>
                        </div>
                      </div>
                      <input className="wb-convert-input-text"
                        type="text"
                        placeholder={`${props.quickeditName} - Copy`}
                        value={duplicate_w_name}
                        onBlur={() => { setduplicate_w_name(duplicate_w_name.trim()) }}
                        // onChange={(e) => { setduplicate_w_name(e.target.value) }}
                        onChange={(e) => { Get_widget_name(e) ? setduplicate_w_name(e.target.value) : '' }}
                      />
                    </div>
                    <div className="wb-convert-widget-main">
                      <div className="wb-add-widget-image-content">
                        <label className="wb-version-label">{__('Featured Image', 'wdesignkit')}</label>
                        <div className="wb-drop-file"
                          onDragOver={(e) => { e.preventDefault(); }}
                          onDrop={(e) => { Upload_image(e, e.dataTransfer.files[0]) }}
                          onClick={() => { document.querySelector("#wb-addwidget-img").click() }}
                          style={{ backgroundImage: `url('${props.widget_image}')` }}
                        >
                          <input className="wb-dropinput-file" type="file" id="wb-addwidget-img" name="wbdropfile" onChange={(event) => {
                            Upload_image(event, event.target.files[0])
                          }} accept="image/*" />
                        </div>
                      </div>
                      <div className="wb-icon-convert-select">
                        <label className="wb-version-label">{__('Widget Icon', 'wdesignkit')}</label>
                        <div className="wb-eicons-content">
                          <div className="wb-eicons-val">
                            <input className="wb-eicons-inp" value={widget_icon} type="text" placeholder="Enter Icon code from below links (e.g. eicon-code)" onChange={(e) => { Icon_validation(e) }} />
                          </div>
                          <div className="wb-eicons-links">
                            <div className="wb-eicons-links-heading">
                              <span>{__('Copy Icon Name From Below Libraries and Paste Above.', 'wdesignkit')}</span>
                            </div>
                            <div className="wb-eicons-links-content">
                              {specificLinks[selectedBuilder].links.map((links, index) => {

                                return (
                                  <Fragment key={index}>

                                    <a className="wb-eicons-lable" target="blank" rel="noopener noreferrer" href={links.href} style={{ color: '#040483' }}>{links.label}</a>
                                    {index < specificLinks[selectedBuilder].links.length - 1 && (
                                      <hr className="wb-eicons-hr" style={{ borderColor: '#040483' }} />
                                    )}
                                  </Fragment>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {'elementor' !== selectedBuilder &&

                    <div className='wkit-switch-convert-wrap'>
                      <input id="wkit-convert-load-jquery" type="checkbox" className="wkit-convert-input" checked={LoadjQuery} onChange={(e) => { setLoadjQuery(e.target.checked) }} />
                      <label htmlFor="wkit-convert-load-jquery">{__('Do you want to load jQuery ?', 'wdesignkit')}</label>
                    </div>
                  }
                  <div className="wb-quickedit-footer">
                    {loader == false &&
                      <Fragment>
                        <div className="wkit-quickedit-note">
                          <span>
                            <b>{__('Note :', 'wdesignkit')}</b> {__('This new widget will have have unique class, So It will work independently from previous widget.', 'wdesignkit')}
                          </span>
                        </div>
                        <button className='wb-version-popup-btn wkit-btn-class' disabled={duplicate_w_name ? false : true}
                          onClick={() => { Widget_Convert(selectedBuilder); setsubpopup('success_duplicate') }}>
                          <span>Convert</span>
                        </button>
                      </Fragment>
                    }
                  </div>
                </div>
              }
              {subpopup == 'success_duplicate' &&
                <div className="wb-version-body">
                  <div className="wkit-success-duplicate-content">
                    <span className='wb-convert-title'>{duplicate_w_name}</span>
                    <div className="wkit-duplicate-success-content">
                      {loader == true &&
                        <Fragment>
                          <div className="wkit-duplicate-widget-image">
                            <img src={widget_image ? window.URL.createObjectURL(widget_image) : props.widget_image} />
                          </div>
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
                            <span> {__('Converting', 'wdesignkit')} </span>
                          </div>
                          <div className="wb-convert-main">
                            <div className="wb-convert-widget-group">
                              <span className="wkit-select-builder-wrap">
                                <img style={{ width: '24px' }} src={img_path + `/assets/images/wb-svg/${props?.quickediteditType}.svg`} />
                                <span className="wkit-convert-from-label">{CapitalizedText(props?.quickediteditType)}</span>
                              </span>
                            </div>
                            <div className="wb-convert-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <path d="M2.56465 10.5233C2.43348 10.2066 2.50598 9.84216 2.74828 9.59981L6.60371 5.74438C6.93477 5.41333 7.47121 5.41333 7.80223 5.74438C8.13316 6.07524 8.13316 6.61188 7.80223 6.94274L5.39344 9.35153H21.6525C22.1205 9.35153 22.5 9.73091 22.5 10.199C22.5 10.6671 22.1205 11.0465 21.6525 11.0465H3.34754C3.00477 11.0465 2.69582 10.8399 2.56465 10.5233ZM21.6525 12.9533H3.34746C2.87945 12.9533 2.5 13.3326 2.5 13.8007C2.5 14.2688 2.87945 14.6482 3.34746 14.6482H19.6066L17.1977 17.057C16.8668 17.3878 16.8668 17.9245 17.1977 18.2553C17.3632 18.4208 17.58 18.5036 17.797 18.5036C18.0138 18.5036 18.2307 18.4208 18.3962 18.2553L22.2517 14.3999C22.494 14.1576 22.5665 13.7931 22.4354 13.4765C22.3042 13.1598 21.9952 12.9533 21.6525 12.9533Z" fill="black" />
                              </svg>
                            </div>
                            <div className="wb-convert-widget-group">
                              <div className="wkit-select-builder-wrap">
                                <img style={{ width: '24px' }} src={img_path + `/assets/images/wb-svg/${selectedBuilder}.svg`} />
                                <span className="wkit-convert-to-label">{CapitalizedText(selectedBuilder)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="wkit-duplicate-widget-details">{__('Converting your widget', 'wdesignkit')} {CapitalizedText(props?.quickediteditType)} {__('to', 'wdesignkit')} {CapitalizedText(selectedBuilder)} </div>

                        </Fragment>
                      }

                      {loader == false &&
                        <Fragment>
                          <div className="wb-convert-widget-img-border">
                            <img src={widget_image ? window.URL.createObjectURL(widget_image) : props.widget_image} />
                          </div>

                          <span className="wkit-duplicate-congratularions">{__('Successfully  converted', 'wdesignkit')}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none"><rect y="0.640625" width="24" height="24" rx="12" fill="#00A31B" /><path fillRule="evenodd" clipRule="evenodd" d="M8.25533 18.4895L3.86655 13.7922C3.2657 13.1491 3.30018 12.1316 3.94327 11.5308C4.58636 10.9299 5.60381 10.9645 6.20466 11.6075L9.58998 15.2308L14.9485 10.2241C14.9967 10.179 15.047 10.1378 15.0991 10.0998L17.619 7.74541C18.2621 7.14456 19.2796 7.17914 19.8804 7.82223C20.4813 8.46522 20.4467 9.48276 19.8037 10.0836L12.1072 17.2746L12.099 17.2658L9.43672 19.7533L8.25533 18.4895Z" fill="white" /></svg>
                          </span>

                          <span className="wkit-duplicate-success-msg">
                            {__('Your', 'wdesignkit')} {duplicate_w_name} {__('widget has been successfully converted to', 'wdesignkit')} {CapitalizedText(selectedBuilder)} {__('Builder', 'wdesignkit')}
                          </span>

                          <Link to={`/widget-listing/builder/${duplicate_w_name + "_" + cn_new_widget_id}`} target='_blank' rel="noopener noreferrer">
                            <button className="wb-convert-popup-btn wkit-btn-class">
                              <span>{__('Edit', 'wdesignkit')} {duplicate_w_name}</span>
                            </button>
                          </Link>
                        </Fragment>
                      }

                    </div>
                  </div>
                </div>
              }

            </div>
          </div>
        </div >
      )}

      {/* Add Widget */}
      {props.popup == "add-widget" && (
        <div id="popup" className="wb-add-widget addWidget">
          <div className="wkit-add-widget-header-container">
            <div className="popup-header">{__('Create Widget', 'wdesignkit')}</div>
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
                    <span className="wb-add-widget-headings">{__('Widget Name', 'wdesignkit')}</span>
                    <div className='wkit-wb-toolTip wkit-popup-first-toolTip'>
                      <img className="wkit-wb-toolTip-icon" src={ImagePath + 'assets/images/wb-svg/info.svg'} width="13" style={{ marginBottom: '-5px' }} />
                      <span className='wkit-wb-toolTip-text wb-wkit-widgetName-toolTip wkit-wb-name-Tooltip'>
                        {__('Only numbers and alphabet are allowed for this field, Widget name must be smaller than 25 characters and first letter can\'t be digit.', 'wdesignkit')}</span>
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
                    onChange={(e) => { Get_widget_name(e) ? setwidgetName(e.target.value) : '' }}
                  />
                  <div className="wkit-name-Validation" style={{ display: NameValidation == false ? "flex" : "none", color: 'red' }}>First character of name must be an alphabet</div>
                </div>
              </div>
              <div className="wb-add-widget-image">
                <div className="wb-add-widget-image-content">
                  <span className="wb-add-widget-imageinput wb-add-widget-headings">{__('Featured Image', 'wdesignkit')}</span>
                  <div className="wb-drop-file"
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={(e) => { Upload_image(e, e.dataTransfer.files[0]) }}
                    onClick={(e) => { handleImage(e, 'upload') }}>
                    <input className="wb-dropinput-file" type="file" id="wb-addwidget-img" name="wbdropfile" onChange={(event) => {
                      Upload_image(event, event.target.files[0])
                    }} accept="image/*" />
                    {
                      !widget_image ?
                        <>
                          <img src={ImagePath + "/assets/images/wb-svg/file-upload.svg"} />
                          <span> {__('Drag & Drop or Upload Image File Here', 'wdesignkit')} <br />{__('(Only .JPG and .PNG Allowed)', 'wdesignkit')}</span>
                        </>
                        :
                        <span className='wkit-remove-widget-img' onClick={(e) => { handleImage(e, 'remove') }}>
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="white"></path>
                          </svg>
                        </span>
                    }
                  </div>
                </div>
                <div className="wb-add-widget-image-content">
                  <div className="wb-add-widget-name-title">
                    <span className="wb-add-widget-headings">{__('Widget Icon', 'wdesignkit')}</span>
                  </div>
                  <div className="wb-eicons-content">
                    <div className="wb-eicons-val">
                      <input className="wb-eicons-inp" value={widget_icon} type="text" defaultValue={specificLinks[addwidgetRadio].defaultValue} placeholder="Enter Icon code from below links (e.g. eicon-code)" onChange={(e) => { Icon_validation(e) }} />
                    </div>

                    <div className="wb-eicons-links">
                      <div className="wb-eicons-links-heading">
                        <span>{__('Copy Icon Name From Below Libraries and Paste Above.', 'wdesignkit')}</span>
                      </div>
                      <div className="wb-eicons-links-content">
                        {
                          specificLinks?.[addwidgetRadio]?.links?.length > 0 &&
                          specificLinks[addwidgetRadio].links.map((links, index) => {

                            return (
                              <Fragment key={index}>

                                <a className="wb-eicons-lable" target="blank" rel="noopener noreferrer" href={links.href} >{links.label}</a>
                                {index < specificLinks[addwidgetRadio].links.length - 1 && (
                                  <hr className="wb-eicons-hr" />
                                )}
                              </Fragment>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {props.BuilderArray.length > 0 &&
                <>
                  <div className="wb-select-radio-label">
                    <span className="wb-add-widget-headings">{__('Choose Page Builder', 'wdesignkit')}</span>
                  </div>
                  <div className='wb-add-widget-radio-main'>
                    {props.BuilderArray.map((data, index) => {
                      return (
                        <label htmlFor={`wb-add-${data}-radio`} key={index} className={`wb-add-widget-radio ${props.BuilderArray.length === 1 ? 'wkit-wb-create-widget-radio' : ''}  ${addwidgetRadio == data ? 'radio-border' : ''}`}>
                          <input
                            type="radio"
                            name={"wbaddradio"}
                            id={`wb-add-${data}-radio`}
                            className='wb-add-widget-radioinput'
                            value={data}
                            onChange={(e) => { setaddwidgetRadio(e.target.value); setwidget_icon(specificLinks[e.target.value].defaultValue); }}
                            checked={addwidgetRadio == data ? true : false}
                          />
                          <img src={ImagePath + `/assets/images/wb-svg/${data}.svg`} />
                          <span className={addwidgetRadio == data ? 'radio-color' : ''}>{data}</span>
                        </label>
                      )
                    })}
                  </div>
                </>
              }
            </div>
            <div className="wb-add-widget-footer">
              <div className="wb-add-widget-cancelBtn">
                <button onClick={(e) => { props.ClosePopup(); }} > {__('Cancel', 'wdesignkit')} </button>
              </div>
              {widgetName && widgetName.trim() ?
                <>
                  {loader == true ?
                    <div className="wb-add-widget-link wkit-btn-class">
                      <button className="wb-add-widget-updateBtn">
                        <div className="wkit-publish-loader">
                          <div className="wb-loader-circle"></div>
                        </div>
                      </button>
                    </div>
                    :
                    <div className="wb-add-widget-link wkit-btn-class" onClick={(e) => { handleSubmit(e) }}>
                      <button className="wb-add-widget-updateBtn">
                        <span>{__('Create Widget', 'wdesignkit')}</span>
                      </button>
                    </div>
                  }
                </>
                :
                <button className="wb-addss-widget-updateBtn wkit-disable-btn"
                  onClick={() => { inputRef.current.focus(); inputRef.current.style.border = '1px solid red' }}>{__('Create Widget', 'wdesignkit')}</button>
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
              <div className="popup-header">{__('Import Widget', 'wdesignkit')}</div>
              <div className="wkit-popup-close-icon" onClick={(e) => { props.ClosePopup(); }} >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" />
                </svg>
              </div>
            </div>
            <div className="wb-popup-content" style={{ height: "max-content" }}>
              <div className="wb-import-widget-inputs">
                <label>{__('Select or Drop Your File Here (.ZIP Only)', 'wdesignkit')}</label>
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
                    <span>{__('Drag & Drop or Upload Widget ZIP File Here', 'wdesignkit')}</span>
                    :
                    <span>{DropFile?.name}</span>
                  }
                </div>
                <div className="dropFileErrorMessage">{__('Zip file invalid or Missing. Upload Again!', 'wdesignkit')}</div>
              </div>
              <div className="wb-add-widget-footer">
                <div className="wb-add-widget-cancelBtn">
                  <button onClick={(e) => { props.ClosePopup(); }} >{__('Close', 'wdesignkit')}</button>
                </div>
                {DropFile &&
                  <>
                    {loader == true ?
                      <button className="wb-import-widget-updateBtn wkit-btn-class" >
                        <div className="wkit-publish-loader">
                          <div className="wb-loader-circle"></div>
                        </div>
                      </button>
                      :
                      <button className="wb-import-widget-updateBtn wkit-btn-class" onClick={(e) => { Import_Widget(e) }}>
                        <span>{__('Import', 'wdesignkit')}</span>
                      </button>
                    }
                  </>
                }
                {!DropFile &&
                  <button className="wkit-imports-widget-updateBtn wkit-disable-btn">{__('Import', 'wdesignkit')}</button>
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