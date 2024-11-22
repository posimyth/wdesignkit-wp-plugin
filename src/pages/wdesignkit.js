import React, { useState, useEffect } from 'react';

import {
    HashRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import {
    Deactivate_account,
    Maintenance_mode,
    Wkit_mobile_header,
    wkit_logout,
} from '../helper/helper-function';

import './all_helpers'
import '../helper/helper-function.scss'
import './all_renders'
import Side_menu_container from './redux/redux_container/side_menu_container';
import Setting_panel_container from './redux/redux_container/setting_panel_container';
import Manage_Workspace_container from './redux/redux_container/manage_workspace_container';
import Share_with_me_container from './redux/redux_container/share_with_me_container';
import Single_workspace_container from './redux/redux_container/single_workspace_container';
import Widget_browse_container from './redux/redux_container/browse_widget_container';
import Browse_container from './redux/redux_container/browse_container';
import Page_not_found from '../pages/reuable/Page_not_found';
import Kit_page_container from './redux/redux_container/kit_page_container';
import User_detail_container from './redux/redux_container/user_detail_container';
import Login_container from './redux/redux_container/login_container';
import Login_api_container from './redux/redux_container/login_api_container';
import My_uploaded_container from './redux/redux_container/my_uploaded_container';
import Save_template_container from './redux/redux_container/save_template_container';
import Toast_container from './redux/redux_container/toast_container';
import Activate_container from './redux/redux_container/activate_container';
import Onboarding_container from './redux/redux_container/onboarding_container';

const { Fragment } = wp.element
const {
    Side_menu,
    MyUploaded,
    Kit_Page,
    Share_with_me,
    Favorite,
    Manage_Workspace,
    Activate,
    Workspace_single,
    Save_template,
    Main_js_container,
    Widget_brows,
    Loader_container,
    Wdkit_Login,
    Wdkit_Login_Api,
    Browse
} = wp.wkit_Pages

const {
    Wkit_user_details,
    wkit_get_user_login,
    form_data,
    get_userinfo,
} = wp.wkit_Helper

const WDesignKit = (props) => {

    useEffect(() => {
        Set_metaData();
    }, [])

    const Set_metaData = async () => {

        let login = await wkit_get_user_login();

        if (login) {
            let data = await get_userinfo();
            if ( data?.data?.success != undefined ) {
                if (data.data.login_status != "logout" && data?.data?.success) {
                    props.wdkit_set_meta(data?.data);
                } else {
                    wkit_logout();
                }
            }
        } else {
            let form_array = {
                'type': 'wkit_meta_data',
                'meta_type': 'all'
            }

            var res = await form_data(form_array).then((res) => { 
                return res 
            });

            if (res?.data?.success == true) {
                props.wdkit_set_meta(res?.data)
            }
        }
    }

    return (
        <div className="wkit-main-menu-dashbord">

            {(1 != wdkitData.WDKIT_onbording_end) && (window.wdkit_editor == 'wdkit') &&
                <Onboarding_container />
            }

            <HashRouter>

                <Side_menu_container />

                <div className="wkit-right-side">
                    <Wkit_mobile_header props={props} />
                    {props?.wdkit_meta?.login_status == 'disabled' && props?.wdkit_meta?.credits?.type == 'pro' &&
                        <Deactivate_account />
                    }
                    {props?.wdkit_meta?.maintenance_mode?.meta_value == '1' &&
                        <Maintenance_mode />
                    }
                    {/* <User_detail_container /> */}

                    <Routes>
                        <Route path='/login' element={<Login_container />} />
                        <Route path='/login-api' element={<Login_api_container />} />
                        <Route path='/browse' element={<Browse_container />} />
                        <Route path='/share_with_me' element={<Share_with_me_container />} />
                        <Route path='/manage_workspace' element={<Manage_Workspace_container />} />
                        <Route path='/manage_workspace/workspace_template/:id' element={<Single_workspace_container />} />
                        <Route path='/my_uploaded' element={<My_uploaded_container />} />
                        <Route path='/:kit_parent/kit/:kit_id' element={<Kit_page_container />} />
                        <Route path='*' element={<Page_not_found />} />
                        <Route path='/' element={<Browse />} />

                        {window.wdkit_editor == 'wdkit' &&
                            <Fragment>
                                <Route path="/widget-listing" element={<Main_js_container />} />
                                <Route path="/widget-listing/builder/:id" element={<Loader_container />} />
                                <Route path="/widget-browse" element={<Widget_browse_container />} />
                                <Route path='/activate' element={<Activate_container />} />
                                <Route path="/settings" element={<Setting_panel_container />} />
                            </Fragment>
                        }

                        {wdkitData.use_editor != 'wdkit' &&
                            <Fragment>
                                <Route path='/save_template' element={<Save_template_container />} />
                                <Route path='/save_template/section' element={<Save_template_container type={'section'} />} />
                            </Fragment>
                        }
                    </Routes>
                </div>
            </HashRouter>

            <Toast_container />
        </div>

    );
}

export default WDesignKit; 