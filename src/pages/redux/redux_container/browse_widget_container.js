import { connect } from 'react-redux';
import Widget_browse from '../../widget_brows/widget_brows'
import { Change_wdkit_meta, ChangeLoginRoute, ShowToast } from '../redux_data/store_action';

const widget_browse = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptowidget_browse = dispatch => ({
    wdkit_set_toast: data => dispatch(ShowToast(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
})

export default connect(widget_browse, maptowidget_browse)(Widget_browse)