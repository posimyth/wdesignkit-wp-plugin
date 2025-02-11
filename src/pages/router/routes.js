import Login_container from '../redux/redux_container/login_container';
import Login_api_container from '../redux/redux_container/login_api_container';
import Browse_container from '../redux/redux_container/browse_container';
import Share_with_me_container from '../redux/redux_container/share_with_me_container';
import Single_workspace_container from '../redux/redux_container/single_workspace_container';
import My_uploaded_container from '../redux/redux_container/my_uploaded_container';
import Kit_page_container from '../redux/redux_container/kit_page_container';
import Widget_browse_container from '../redux/redux_container/browse_widget_container';
import Page_not_found from '../reuable/Page_not_found';
import Browse from '../browse/browse';
import Widget_download from '../../widget-builder/widget-downloader/widget_download';
import Loader_container from '../../widget-builder/redux-container/loader_container';
import Activate_container from '../redux/redux_container/activate_container';
import Setting_panel_container from '../redux/redux_container/setting_panel_container';
import Save_template_container from '../redux/redux_container/save_template_container';
import Manage_workspace_container from '../redux/redux_container/manage_workspace_container';
import Theplus_popup from '../theplus_popup/theplus_popup';
import Main_js_container from '../../widget-builder/redux-container/main_js_container';
import PresetMain from '../preset/preset-main';

export const getAllRoutes = [
    {
        element: <Login_container />,
        path: '/login',
        condition: true,
        setting_panel: ['all'],
    },
    {
        element: <Login_api_container />,
        path: '/login-api',
        condition: true,
        setting_panel: ['all'],
    },
    {
        element: <Browse_container />,
        path: '/browse',
        condition: true,
        setting_panel: ['template'],
    },
    {
        element: <Share_with_me_container />,
        path: '/share_with_me',
        condition: true,
        setting_panel: ['template', 'builder'],
    },
    {
        element: <Manage_workspace_container />,
        path: '/manage_workspace',
        condition: true,
        setting_panel: ['template', 'builder'],
    },
    {
        element: <Single_workspace_container />,
        path: '/manage_workspace/workspace_template/:id',
        condition: true,
        setting_panel: ['template', 'builder'],
    },
    {
        element: <My_uploaded_container />,
        path: '/my_uploaded',
        condition: true,
        setting_panel: ['template'],
    },
    {
        element: <Kit_page_container />,
        path: '/:kit_parent/kit/:kit_id',
        condition: true,
        setting_panel: ['template'],
    },
    {
        element: <Page_not_found />,
        path: '*',
        condition: true,
        setting_panel: ['all'],
    },
    {
        element: <Browse />,
        path: '/',
        condition: true,
        setting_panel: ['template'],
    },
    {
        element: <Theplus_popup />,
        path: '/theplus_popup',
        condition: true,
        setting_panel: ['all'],
    },
    {
        element: <Widget_download />,
        path: '/download/widget/:w_unique',
        condition: true,
        setting_panel: ['all'],
    },
    {
        element: <Main_js_container />,
        path: '/widget-listing',
        condition: window.wdkit_editor === 'wdkit',
        setting_panel: ['builder'],
    },
    {
        element: <Loader_container />,
        path: '/widget-listing/builder/:id',
        condition: window.wdkit_editor === 'wdkit',
        setting_panel: ['builder'],
    },
    {
        element: <Widget_browse_container />,
        path: '/widget-browse',
        condition: window.wdkit_editor === 'wdkit',
        setting_panel: ['builder'],
    },
    {
        element: <Activate_container />,
        path: '/activate',
        condition: window.wdkit_editor === 'wdkit' && !(wdkitData?.wdkit_white_label?.licence_tab),
        setting_panel: ['all'],
    },
    {
        element: <Setting_panel_container />,
        path: '/settings',
        condition: window.wdkit_editor === 'wdkit',
        setting_panel: ['all'],
    },
    {
        element: <Save_template_container />,
        path: '/save_template',
        condition: wdkitData.use_editor !== 'wdkit',
        setting_panel: ['template'],
    },
    {
        element: <Save_template_container type={'section'} />,
        path: '/save_template/section',
        condition: wdkitData.use_editor !== 'wdkit',
        setting_panel: ['template'],
    },
    {
        element: <PresetMain />,
        path: '/preset/:preset_id',
        condition: wdkitData.use_editor !== 'wdkit',
        setting_panel: ['all'],
    },
];