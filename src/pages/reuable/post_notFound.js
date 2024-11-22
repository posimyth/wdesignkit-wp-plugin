const { __ } = wp.i18n;

import { useState } from 'react';

const Post_notFound = () => {

    const [img_path, setimg_path] = useState(wdkitData.WDKIT_URL);

    return (
        <div className='wkit-post-notFound'>
            <div className='wkit-post-notFound-content'>
                <img src={img_path + 'assets/images/jpg/empty-dog.png'} />
                <span>{__('It seems to be empty!')}</span>
            </div>
        </div>
    );
}

export default Post_notFound;