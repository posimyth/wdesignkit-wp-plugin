import { connect } from 'react-redux';
import WDesignKit from '../../wdesignkit';
import { Change_wdkit_meta, ChangePanelSettings, ShowToast } from '../redux_data/store_action';

const wdesignkit = state => ({
    setting_data: state.wkit_SettingPanel.settingdata,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta,
})

const maptowdesignkit = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_GetSettings_redux: data => dispatch(ChangePanelSettings(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(wdesignkit, maptowdesignkit)(WDesignKit)