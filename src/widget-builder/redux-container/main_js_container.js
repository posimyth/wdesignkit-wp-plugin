import { connect } from 'react-redux';
import Main_page from '../Listing-panle/main';
import { ShowToast } from '../../pages/redux/redux_data/store_action';

const mapEditor_codeStateToProps = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const mapEditor_code = dispatch => ({
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(mapEditor_codeStateToProps, mapEditor_code)(Main_page)