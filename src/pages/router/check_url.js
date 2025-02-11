import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Change_wdkit_meta, ChangePanelSettings, ShowToast } from '../redux/redux_data/store_action';
import { wkit_logout } from '../../helper/helper-function';


const {
    Wkit_user_details,
    wkit_get_user_login,
    form_data,
    get_userinfo,
} = wp.wkit_Helper


const Check_url = (props) => {

    useEffect(() => {
        Set_metaData();
    }, [])

    const Set_metaData = async () => {

        let login = await wkit_get_user_login();

        if (login) {
            let data = await get_userinfo();
            if (data?.data?.success != undefined) {
                if (data.data.login_status != "logout" && data?.data?.success) {
                    props.wdkit_set_meta(data?.data);
                } else {
                    wkit_logout();
                }
            } else {
                if (!navigator.onLine) {
                    wkit_logout();
                }
            }
        } else {
            let form_array = {
                'type': 'wkit_meta_data',
                'meta_type': 'all'
            }

            var res = await form_data(form_array).then((res) => {
                return res;
            });

            if (res?.data?.success == true) {
                props.wdkit_set_meta(res?.data)
            }
        }
    }
}

const getRedux = state => ({
    setting_data: state.wkit_SettingPanel.settingdata,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta,
})

const setRedux = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_GetSettings_redux: data => dispatch(ChangePanelSettings(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(getRedux, setRedux)(Check_url);