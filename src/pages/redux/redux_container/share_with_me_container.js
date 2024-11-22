import { connect } from 'react-redux';
import { SetPanelSettings, Change_wdkit_meta, ChangeLoginRoute, ShowToast } from '../redux_data/store_action';
import Share_with_me from '../../share_with_me/main_share_with_me'

const shareWithMe = state => ({
    setting_data: state.wkit_SettingPanel.settingdata,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptoshareWithMe = dispatch => ({
    wdkit_GetSettings_redux: data => dispatch(SetPanelSettings(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(shareWithMe, maptoshareWithMe)(Share_with_me)