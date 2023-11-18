import { connect } from 'react-redux';
import Widget_browse from '../../widget_brows/widget_brows'
import { ShowToast } from '../redux_data/store_action';

const widget_browse = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptowidget_browse = dispatch => ({
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(widget_browse, maptowidget_browse)(Widget_browse)