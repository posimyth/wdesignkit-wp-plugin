import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import {
    Deactivate_account,
    Maintenance_mode,
    Wkit_mobile_header,
} from '../helper/helper-function';

import './all_helpers'
import '../helper/helper-function.scss'
import './all_renders'
import Side_menu_container from './redux/redux_container/side_menu_container';
import Toast_container from './redux/redux_container/toast_container';
import Onboarding_container from './redux/redux_container/onboarding_container';
import SupportToggle from './support/support';
import { getAllRoutes } from './router/routes';

const WDesignKit = (props) => {

    var location = window.location,
        img_path = wdkitData.WDKIT_URL,
        loader_logo = wdkitData?.wdkit_white_label?.plugin_logo || img_path + "assets/images/jpg/wdkit_loader.gif";

    const [loader, setloader] = useState(true);

    useEffect(() => {
        if (props?.wdkit_meta?.success != undefined) {
            setloader(false);
        }
    }, [props?.wdkit_meta?.success])

    const Check_location = (type) => {
        if ('external_popup' == type) {
            if (!(location?.hash?.includes("#/theplus_popup") || location?.hash?.includes("#/download/widget"))) {
                return true;
            } else {
                return false;
            }
        } else if ('widget_builder' == type) {
            if (!location?.hash?.includes("/builder")) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    const Check_settingPanel = (s_data) => {
        let setting_data = props.wdkit_meta?.Setting;
        var wdk_templates = false;
        var widget_builder = false;

        if (setting_data?.template) {
            if (setting_data?.elementor_template || setting_data?.gutenberg_template) {
                wdk_templates = true;
            }
        }

        if (setting_data?.builder) {
            if (setting_data?.bricks_builder || setting_data?.gutenberg_builder || setting_data?.elementor_builder) {
                widget_builder = true;
            }
        }

        if (s_data) {
            if (s_data?.includes('all')) {
                return true;
            } else if (s_data?.includes('template') && wdk_templates) {
                return true;
            } else if (s_data?.includes('builder') && widget_builder) {
                return true;
            }
        }

        return false;
    }

    return (
        <>
            <div className="wkit-main-menu-dashbord">
                {loader ?
                    <div className="wkit-loading-content" style={{ display: 'flex' }} draggable={false}>
                        <div className='wkit-main-loader'>
                            {!navigator.onLine ?
                                <>
                                    <img style={{ width: '150px', height: '150px' }} src={img_path + "assets/images/jpg/no-internet-connection.png"} draggable={false} />
                                    <span>{__('Unable to connect to the Internet !', 'wdesignkit')}</span>
                                </>
                                :
                                <img style={{ width: '150px', height: '150px' }} src={loader_logo} draggable={false} />
                            }
                        </div>
                    </div>
                    :
                    <>
                        {(1 != wdkitData.WDKIT_onbording_end) && (window.wdkit_editor == 'wdkit') && Check_location('external_popup') &&
                            <Onboarding_container />
                        }

                        <HashRouter>

                            <Side_menu_container />

                            <div className="wkit-right-side">
                                <Wkit_mobile_header props={props} />
                                {props?.wdkit_meta?.login_status == 'disabled' && props?.wdkit_meta?.credits?.type == 'pro' && Check_location('Check_location') &&
                                    <Deactivate_account />
                                }
                                {props?.wdkit_meta?.maintenance_mode?.meta_value == '1' &&
                                    <Maintenance_mode />
                                }
                                {/* <User_detail_container /> */}

                                <Routes>
                                    {getAllRoutes.map((data, index) => {
                                        if (data.condition && Check_settingPanel(data?.setting_panel)) {
                                            return (
                                                <Route path={data.path} element={data.element} key={index} />
                                            )
                                        }
                                    })}
                                </Routes>
                            </div>
                            {wdkitData.use_editor == 'wdkit' && Check_location('widget_builder') && !(wdkitData?.wdkit_white_label?.help_link) &&
                                <SupportToggle />
                            }
                        </HashRouter>
                    </>
                }
                <Toast_container />
            </div>
        </>
    );
}

export default WDesignKit; 