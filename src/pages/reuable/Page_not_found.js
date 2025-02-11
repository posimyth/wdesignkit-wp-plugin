import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Page_not_found = () => {

    let img_path = wdkitData.WDKIT_URL;
    const navigation = useNavigate();
    const location = useLocation();

    const [error_type, seterror_type] = useState();

    const getAllRoutes = [
        '/login',
        '/login-api',
        '/browse',
        '/share_with_me',
        '/manage_workspace',
        '/manage_workspace/workspace_template/:id',
        '/my_uploaded',
        '/:kit_parent/kit/:kit_id',
        '/',
        '/theplus_popup',
        '/download/widget/:w_unique',
        '/widget-listing',
        '/widget-listing/builder/:id',
        '/widget-browse',
        '/activate',
        '/settings',
        '/save_template',
        '/save_template/section'
    ];

    useEffect(() => {
        let path_name = location?.pathname

        let index = getAllRoutes.includes(path_name)
        if (index > -1) {
            seterror_type('disable')
        } else {
            seterror_type('error-404')
            navigation('error-404')
        }

    }, [])

    if (error_type == 'disable') {
        return (
            <div className='wkit-post-notFound'>
                <div className='wkit-post-notFound-content'>
                    <img src={img_path + 'assets/images/jpg/empty-dog.png'} draggable={false} />
                    <span>{__('Page Disabled', 'wdesignkit')}</span>
                    <Link className='wkit-pink-btn-class' to='/settings'>{__('Go to Settings', 'wdesignkit')}</Link>
                </div>
            </div>
        );
    } else {
        return (
            <div className='wkit-post-notFound'>
                <div className='wkit-post-notFound-content'>
                    <img src={img_path + 'assets/images/jpg/empty-dog.png'} draggable={false} />
                    <span>{__('Page not Found', 'wdesignkit')}</span>
                    <Link className='wkit-pink-btn-class' to='/'>{__('Back to home', 'wdesignkit')}</Link>
                </div>
            </div>
        );
    }
}

export default Page_not_found;