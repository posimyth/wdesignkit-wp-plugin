import { json } from 'react-router-dom';
import { wdKit_Form_data } from '../../../helper/helper-function';

const ChangePanelSettings = (data) => {
    return {
        type: 'ADD_SETTING_ARRAY',
        data: data
    }
}

const ChangeLoginRoute = (data) => {
    return {
        type: 'ADD_LOGIN_ROUTE',
        data: data
    }
}

const Change_wdkit_meta = (data) => {
    return {
        type: 'UPDATE_WDKIT_META',
        data: data
    }
}

const SetPanelSettings = (data) => {

    return {
        type: 'ADD_SETTING_ARRAY',
        data: data
    }
}

const ShowToast = (data) => {

    let message_data = {
        'title': data[0] ? data[0] : '',
        'subTitle': data[1] ? data[1] : '',
        'icon': data[2] ? data[2] : '',
        'type': data[3] ? data[3] : '',
    }

    return {
        type: 'Show_Toast',
        data: message_data
    }
}

export { ChangePanelSettings, SetPanelSettings, Change_wdkit_meta, ChangeLoginRoute, ShowToast }







