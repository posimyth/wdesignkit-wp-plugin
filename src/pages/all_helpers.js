import {
    wdKit_fetch_api, wdKit_Form_data, Get_user_info_data, WKit_successfully_import_template, 
    Wkit_plugin_missing, Template_loop, Wpopup_body_data, Wkit_user_details, 
    Kits_loop, Wkit_checkBuilder, loadingIcon, Wkit_add_workspace, Wkit_popupContent, 
    wkit_SelectWorkSpace, wdkit_Manage_WorkSpace_Api, wkit_getCategoryList, 
    wkitGetBuilder, set_user_login, get_user_login, wkit_logout, Letter_image 
} from '../helper/helper-function'

wp.wkit_Helper = {
    fetch_api: wdKit_fetch_api,
    form_data: wdKit_Form_data,
    get_userinfo: Get_user_info_data,
    Template_loop: Template_loop,
    Kits_loop: Kits_loop,
    Letter_image: Letter_image,
    Success_import_template: WKit_successfully_import_template,
    Plugin_missing: Wkit_plugin_missing,
    Popup_body_data: Wpopup_body_data,
    Wkit_user_details: Wkit_user_details,
    checkBuilder: Wkit_checkBuilder,
    loadingIcon: loadingIcon,
    Add_workspace: Wkit_add_workspace,
    Popup_Content: Wkit_popupContent,
    select_WorkSpace: wkit_SelectWorkSpace,
    manage_WorkSpace_Api: wdkit_Manage_WorkSpace_Api,
    wkit_getCategoryList: wkit_getCategoryList,
    wkitGetBuilder: wkitGetBuilder,
    wkit_set_user_login: set_user_login,
    wkit_get_user_login: get_user_login,
    wkit_logout: wkit_logout,
};