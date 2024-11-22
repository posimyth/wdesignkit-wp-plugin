import { connect } from 'react-redux';
import { ChangeLoginRoute, Change_wdkit_meta, SetPanelSettings, ShowToast } from '../redux_data/store_action';
import Onboarding from '../../onboarding/onboarding';

const settingPanel = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta,
})

const maptosettingPanel = dispatch => ({
    wdkit_GetSettings_redux: data => dispatch(SetPanelSettings(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(settingPanel, maptosettingPanel)(Onboarding)