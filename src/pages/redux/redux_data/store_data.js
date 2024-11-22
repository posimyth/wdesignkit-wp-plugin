const SettingPanelData = {
    settingdata: {
        'builder': true,
        'template': true,
        'gutenberg_builder': true,
        'elementor_builder': true,
        'debugger_mode': false,
    }
}

const LoginData = {
    'route_history' : '/my_uploaded'
} 

const wdkit_meta = {
    'wdkitmeta': {
        'plugin': [],
        'builder': [],
        'category': [],
        'tags': [],
        'widgetbuilder': [],
        'widgetscategory': [],
        'Setting': {
            'builder': true,
            'debugger_mode': false,
            'elementor_builder': true,
            'gutenberg_builder': true,
            'template': true,
        }
    }
}

/**Toast Message */
const ToastData = {
    'message_content' :{
        'title' : '',
        'subTitle' : '',
        'icon' : '',
        'type' : '',
    }
}

export function wkit_SettingPanel(state = SettingPanelData, action) {
    switch (action.type) {
        case 'ADD_SETTING_ARRAY':
            return {
                ...StaticRange,
                settingdata: action.data
            }
            break;
        default:
            return state
    }
}

export function wkit_Login_route(state = LoginData, action) {
    switch (action.type) {
        case 'ADD_LOGIN_ROUTE':
            return {
                ...StaticRange,
                route_history: action.data
            }
            break;
        default:
            return state
    }
}

export function wdkit_meta_data(state = wdkit_meta, action) {
    switch (action.type) {
        case 'UPDATE_WDKIT_META':
            return {
                ...StaticRange,
                wdkitmeta: action.data
            }
            break;
        default:
            return state
    }
}

export function wkit_Toast_message(state = ToastData, action) {
    switch (action.type) {
        case 'Show_Toast':
            return {
                ...StaticRange,
                message_content: action.data
            }
            break;
        default:
            return state
    }
}