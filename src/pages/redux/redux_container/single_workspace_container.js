import { connect } from 'react-redux';
import { Change_wdkit_meta, SetPanelSettings, ShowToast } from '../redux_data/store_action';
import Single_workspace from '../../manage_workspace/single_workspace'

const single_workspace = state => ({
    setting_data: state.wkit_SettingPanel.settingdata,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptosingle_workspace = dispatch => ({
    wdkit_GetSettings_redux: data => dispatch(SetPanelSettings(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(single_workspace, maptosingle_workspace)(Single_workspace)