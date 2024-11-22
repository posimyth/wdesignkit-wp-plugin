import { connect } from 'react-redux';
import Kit_Page from '../../myuploaded/kit_page'
import { Change_wdkit_meta } from '../redux_data/store_action';

const kit_Page = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptokit_Page = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
})

export default connect(kit_Page, maptokit_Page)(Kit_Page)