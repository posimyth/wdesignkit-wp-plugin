import { connect } from 'react-redux';
import Save_template from '../../save_template/main_save_template'
import { Change_wdkit_meta, ChangeLoginRoute, ShowToast } from '../redux_data/store_action';

const save_template_page = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptosave_template_page = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(save_template_page, maptosave_template_page)(Save_template)