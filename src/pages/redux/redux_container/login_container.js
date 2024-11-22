import { connect } from 'react-redux';
import Wdkit_Login from '../../login/login';
import { Change_wdkit_meta, ShowToast } from '../redux_data/store_action';

const wdkit_Login = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta,
    LoginRoutes: state.wkit_Login_route.route_history,
})

const maptowdkit_Login = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(wdkit_Login, maptowdkit_Login)(Wdkit_Login)