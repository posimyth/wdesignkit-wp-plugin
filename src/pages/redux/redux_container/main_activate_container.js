import { connect } from 'react-redux';
import main_activate from '../../activate/main_activate';
import { Change_wdkit_meta, Change_wdkit_mainData, ChangePanelSettings, ChangeLoginRoute } from '../redux_data/store_action';

const activae_page = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta,
    // setting_data: state.wkit_SettingPanel,
})

const maptoactivae_page = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    // wdkit_GetSettings_redux: data => dispatch(ChangePanelSettings(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
})

export default connect(activae_page, maptoactivae_page)(main_activate)