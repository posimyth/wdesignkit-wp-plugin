import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Widget_builder_container from './redux-container/widget_builder_container';
import { wdKit_Form_data, get_user_login } from '../helper/helper-function';
import { __ } from '@wordpress/i18n';

const Loader = (props) => {

    const [loader, setloader] = useState(true);
    const [redux_data, setredux_data] = useState('');

    var img_path = wdkitData.WDKIT_URL;

    const widget_name = useParams();
    const navigation = useNavigate();

    useEffect(() => {
        let login_data = get_user_login();
        if (!login_data) {
            navigation("/login")
        }
    }, [])

    useEffect(() => {
        if (props.wdkit_meta.success != undefined) {
            Get_data();
        }
    }, [props.wdkit_meta]);

    useEffect(() => {
        if (props?.Editor_code &&
            props?.Editor_data &&
            props?.cardData &&
            props?.widgetdata &&
            redux_data?.Editor_code &&
            redux_data?.carddata &&
            redux_data?.widgetdata &&
            redux_data?.e_links) {

            if (JSON.stringify(props.Editor_code) == JSON.stringify(redux_data.Editor_code) &&
                JSON.stringify(props.Editor_data) == JSON.stringify(redux_data.e_links) &&
                JSON.stringify(props.cardData) == JSON.stringify(redux_data.carddata) &&
                JSON.stringify(props.widgetdata) == JSON.stringify(redux_data.widgetdata)) {

                setloader(false);
            }
        }
    }, [redux_data])

    const generateUniqueID = () => {
        const now = new Date();
        const uniqueID = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
        const hashedID = parseInt(uniqueID, 10) % 10000;
        return String(hashedID).padStart(4, '0');
    }

    const Get_data = async () => {

        let widgetList = props?.wdkit_meta?.widget_list?.length > 0 ? props?.wdkit_meta?.widget_list : [];
        let plugin_data = await widgetList.filter((data) => {
            if (data?.type == 'plugin' || data?.type == 'done') {
                return data;
            }
        })

        let w_name = widget_name?.id,
            full_name = w_name ? w_name.replaceAll(" ", "_") : '',
            index = plugin_data.findIndex((w_data) => w_data.title.replaceAll(" ", "_") + '_' + w_data.w_unique == full_name);
        if (index > -1) {
            let widget_detail = plugin_data[index];
            if (widget_detail?.is_activated != 'deactive') {
                let file = widget_detail?.title ? widget_detail.title.replaceAll(" ", "_") + '_' + widget_detail.w_unique : '',
                    folder = widget_detail?.title ? widget_detail.title.replaceAll(" ", "-") + '_' + widget_detail.w_unique : "";

                let widget_data = {
                    'type': 'wkit_widget_json',
                    'folder_name': folder,
                    'file_name': file,
                    'widget_type': widget_detail.builder
                }

                var json_data = await wdKit_Form_data(widget_data).then((result) => {

                    if (result.success) {
                        return result.data;
                    } else {
                        return [];
                    }
                })

                let old_html = [...props.Editor_code];
                old_html[0] = json_data.Editor_data;


                let editorData = json_data.Editor_data;
                let sectionData = json_data.section_data;
                let widgetData = json_data.widget_data.widgetdata;
                let links = json_data.Editor_Link.links;

                let redux_data = {
                    "Editor_code": [editorData],
                    "carddata": sectionData,
                    "widgetdata": widgetData,
                    "e_links": links,
                };

                props.addToEditor_code(old_html)
                props.addToCarthandler(sectionData)
                props.addTowidgethandler(widgetData)
                props.addTolinkhandler(links)

                setredux_data(redux_data)
            } else {
                props.wdkit_set_toast([__('Widget Deactivated', 'wdesignkit'), __('This Widget is Deactivated ', 'wdesignkit'), '', 'danger']);
                navigation("/widget-listing");
            }
        } else {
            props.wdkit_set_toast([__('Widget Not Found', 'wdesignkit'), __('Widget not found try again later', 'wdesignkit'), '', 'danger']);
            navigation("/widget-listing");
        }
    }

    if (loader) {
        let loader_logo = wdkitData?.wdkit_white_label?.plugin_logo || img_path + "assets/images/jpg/wdkit_loader.gif";

        return (
            <div className="wb-loader" style={{ display: 'flex' }} draggable={false}>
                <img style={{ width: '150px', height: '150px', marginLeft: '-160px' }} src={loader_logo} draggable={false} />
            </div>
        );
    } else {
        return <Widget_builder_container />

    }
}

export default Loader;