import { connect } from 'react-redux';
import Wdkit_Login_Api from '../../login/login-api';
import { Change_wdkit_meta, ShowToast } from '../redux_data/store_action';

const wdkit_Login_api = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptowdkit_Login_api = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(wdkit_Login_api, maptowdkit_Login_api)(Wdkit_Login_Api)