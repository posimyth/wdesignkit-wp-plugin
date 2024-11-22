import { connect } from 'react-redux';
import activate from '../../activate/activate';
import { Change_wdkit_meta, ChangeLoginRoute, ShowToast } from '../redux_data/store_action';

const activae_page = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta,
})

const maptoactivae_page = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(activae_page, maptoactivae_page)(activate)