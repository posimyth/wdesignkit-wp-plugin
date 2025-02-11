import '../style/widget_download.scss'
import axios from 'axios';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Elementor_file_create from '../file-creation/elementor_file';
import { __ } from '@wordpress/i18n';


const Widget_downaload = (props) => {

    const [Downloading, setDownloading] = useState(true)

    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const get_user_login = () => {
        return JSON.parse(localStorage.getItem('wdkit-login'))
    }

    let path_name = window?.location?.pathname ? window.location.pathname : '',
        site_url = window.location.origin + path_name + `?page=theplus_welcome_page#/widgets`;

    const Create_widget = async (data) => {

        let json = JSON.parse(data.json),
            builder = json?.widget_data?.widgetdata?.type,
            html = JSON.stringify(json?.Editor_data?.html),
            js = JSON.stringify(json?.Editor_data?.js),
            css = JSON.stringify(json?.Editor_data?.css),
            image = data?.image,
            pb_type = queryParams.get("type") ? queryParams.get("type") : '',
            icon = '';

        var widget_data = Object.assign({}, json.widget_data.widgetdata, { 'r_id': data.r_id, 'allow_push': false });

        if (pb_type) {
            widget_data = Object.assign({}, json.widget_data.widgetdata, { 'publish_type': pb_type });
        }

        let widget_obj = Object.assign({}, json.widget_data, { 'widgetdata': widget_data });

        var data = {
            "CardItems": {
                "cardData": json.section_data
            },

            "WcardData": widget_obj,

            "Editor_data": json.Editor_Link,

            "Editor_code": {
                "Editor_codes": [json.Editor_data]
            }
        }

        await Elementor_file_create('public_download', data, html, css, js, "", image).then((res) => {
            if (res?.api?.success) {
                setDownloading(false);
                window.parent.postMessage(
                    "closePopup",
                    site_url
                );
                return res;
            }
        })

    }

    useEffect(() => {

        if (props?.wdkit_meta?.success) {

            let login_detail = get_user_login();

            if (login_detail) {

                var api_name = 'widget/download';
                var userinfo = props?.wdkit_meta?.userinfo?.id;
                var id = params?.w_unique;
            } else {
                var api_name = 'import/widget/free';
                var id = params?.w_unique;
            }

            var api_data = {
                "api_type": api_name,
                "w_uniq": id,
                "u_id": userinfo,
            };

            var formData = new FormData();
            formData.append('action', 'get_wdesignkit');
            formData.append('kit_nonce', wdkitData.kit_nonce);
            formData.append('type', 'wkit_public_download_widget');
            formData.append('widget_info', JSON.stringify(api_data));

            if (id && api_name) {
                axios.post(ajaxurl, formData).then((res) => {
                    Create_widget(res.data);
                })
            }
        }

    }, [props?.wdkit_meta?.success])

    return (
        <div className='wkit-downloading-widget'>
            {Downloading ?
                <>
                    <p className='wkit-downloading-text'>{__('Widget Downloading', 'wdesignkit')}</p>
                    <div className='wkit-downloading-widget-outer'>
                        <div className='wkit-downloading-widget-inner'></div>
                    </div>
                </>
                :
                <div className='wkit-tpae-success-container'>
                    <span>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20Z" fill="white" />
                            <path d="M20.1429 3C10.6907 3 3 10.6907 3 20.1429C3 29.5951 10.6907 37.2857 20.1429 37.2857C29.5951 37.2857 37.2857 29.5951 37.2857 20.1429C37.2857 10.6907 29.5951 3 20.1429 3ZM29.724 15.6316L18.768 26.5016C18.1235 27.1461 17.0924 27.189 16.4049 26.5446L10.6047 21.2599C9.91729 20.6155 9.87433 19.5414 10.4758 18.8539C11.1203 18.1665 12.1944 18.1235 12.8818 18.768L17.4791 22.9785L27.275 13.1826C27.9624 12.4952 29.0365 12.4952 29.724 13.1826C30.4114 13.87 30.4114 14.9441 29.724 15.6316Z" fill="#C22076" />
                        </svg>
                    </span>
                    <span className='wkit-widget-downloaded-text'>
                        <p className='wkit-tpae-success-text'>{__('Your widget Downloaded Successfully', 'wdesignkit')}</p>
                    </span>
                </div>
            }
        </div>
    );

}

const mapEditor_codeStateToProps = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const mapEditor_code = dispatch => ({
})

export default connect(mapEditor_codeStateToProps, mapEditor_code)(Widget_downaload)