import { connect } from 'react-redux';
import { ChangeLoginRoute, Change_wdkit_meta, SetPanelSettings, ShowToast } from '../redux_data/store_action';
import Wkit_settings from '../../setting_panel/settings'

const settingPanel = state => ({
    setting_data: state.wkit_SettingPanel.settingdata,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta

})

const maptosettingPanel = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_GetSettings_redux: data => dispatch(SetPanelSettings(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),

})

export default connect(settingPanel, maptosettingPanel)(Wkit_settings)