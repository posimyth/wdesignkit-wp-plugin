import Wdkit_Login from './login/login';
import Wdkit_Login_Api from './login/login-api';
import Browse from './browse/browse';
import MyUploaded from './myuploaded/myuploaded';
import Kit_Page from './myuploaded/kit_page';
import Share_with_me from './share_with_me/main_share_with_me';
import Manage_Workspace from './manage_workspace/manage_workspace';
import Workspace_single from './manage_workspace/single_workspace';
import Side_menu from './side_menu/main_side_menu';
import Save_template from './save_template/main_save_template';
import Main_js_container from '../widget-builder/redux-container/main_js_container';
import Loader_container from '../widget-builder/redux-container/loader_container';
import Widget_brows from '../pages/widget_brows/widget_brows'
import Wkit_settings from '../pages/setting_panel/settings'
import Page_not_found from './reuable/Page_not_found'
import './gutenberg-editor.js';
import './elementor-editor.js';

wp.wkit_Pages = {
    Side_menu: Side_menu,
    Wdkit_Login: Wdkit_Login,
    Wdkit_Login_Api: Wdkit_Login_Api,
    Browse: Browse,
    MyUploaded: MyUploaded,
    Kit_Page: Kit_Page,
    Share_with_me: Share_with_me,
    Manage_Workspace: Manage_Workspace,
    Workspace_single: Workspace_single,
    Save_template: Save_template,
    Main_js_container: Main_js_container,
    Loader_container: Loader_container,
    Widget_brows: Widget_brows,
    Wkit_settings: Wkit_settings,
    Page_not_found: Page_not_found,
};