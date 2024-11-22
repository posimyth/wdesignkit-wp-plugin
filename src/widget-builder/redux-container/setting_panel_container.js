import { connect } from 'react-redux';
import Widget_header from '../wb-setting-panel/setting_panel';
import { Widget_data  } from '../redux-services/actions/action';
import { ShowToast } from '../../pages/redux/redux_data/store_action';


const widgetStateToProps = state => ({
    widgetdata: state,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const widgetDispatchToProps = dispatch => ({
    addTowidgethandler: data => dispatch(Widget_data(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(widgetStateToProps, widgetDispatchToProps)(Widget_header)