import { combineReducers } from 'redux';
import CardItems, { WcardData, Editor_data, Editor_code, Active_controller, Active_section } from "./reducer";
import { wkit_SettingPanel, wdkit_meta_data, wkit_Login_route, wkit_Toast_message } from "../../../pages/redux/redux_data/store_data";

export default combineReducers({
    CardItems,
    WcardData,
    Editor_data,
    Editor_code,
    Active_controller,
    Active_section,

    wkit_SettingPanel,
    wdkit_meta_data,
    wkit_Login_route,
    wkit_Toast_message
});