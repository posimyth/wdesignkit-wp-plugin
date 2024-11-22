import { connect } from 'react-redux';
import { Change_wdkit_meta, SetPanelSettings, ChangeLoginRoute, ShowToast } from '../redux_data/store_action';
import Manage_Workspace from '../../manage_workspace/manage_workspace'

const manage_Workspace = state => ({
    setting_data: state.wkit_SettingPanel.settingdata,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptomanage_Workspace = dispatch => ({
    wdkit_GetSettings_redux: data => dispatch(SetPanelSettings(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(manage_Workspace, maptomanage_Workspace)(Manage_Workspace)