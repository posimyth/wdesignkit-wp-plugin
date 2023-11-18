import { connect } from 'react-redux';
import { ChangePanelSettings, Change_wdkit_meta } from '../redux_data/store_action';
import Side_menu from '../../side_menu/main_side_menu'

const sideMenu = state => ({
    setting_data: state.wkit_SettingPanel,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptosideMenu = dispatch => ({
    wdkit_GetSettings_redux: data => dispatch(ChangePanelSettings(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
})

export default connect(sideMenu, maptosideMenu)(Side_menu)