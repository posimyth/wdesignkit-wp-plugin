const { __ } = wp.i18n;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Page_not_found = () => {

    const [img_path, setimg_path] = useState(wdkitData.WDKIT_URL);
    const navigation = useNavigate();

    useEffect(() => {
        navigation(`*`)
    })


    return (
        <div className='wkit-post-notFound'>
            <div className='wkit-post-notFound-content'>
                <img src={img_path + 'assets/images/jpg/empty-dog.png'} />
                <span>{__('Page not Found')}</span>
            </div>
        </div>
    );
}

export default Page_not_found;