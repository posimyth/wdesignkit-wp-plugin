import './activate.scss';
import { useState, useEffect, useRef } from 'react';
import { Form, Navigate, useNavigate } from 'react-router-dom';
import { Get_user_info_data, Page_header, PopupContent, WkitLoader, get_user_login } from '../../helper/helper-function';

const { Fragment } = wp.element;
var img_path = wdkitData.WDKIT_URL;

const {
    __,
} = wp.i18n;

const {
    wkit_get_user_login,
    form_data,
} = wp.wkit_Helper;

const Activate = (props) => {
    const [OpenPopup, setOpenPopup] = useState(false);

    const [arraydata, setArrayData] = useState([]);
    const UpdatingData = useRef(arraydata);
    const [userData, setUserData] = useState();
    const [licenseKey, setLicenseKey] = useState('');
    const [isInputEmpty, setInputEmpty] = useState(false);

    const [loader, setloader] = useState(true);
    const [ActivateLoader, setActivateLoader] = useState(false);
    const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);
    const [deleteItem, setdeleteItem] = useState();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('wdkit');
    const [SelectfigmaOpt, setSelectfigmaOpt] = useState('266965');
    const [selectedOptionImage, setSelectedOptionImage] = useState('assets/images/jpg/wdkit-logo.png');

    const options = [
        {
            text: 'WDesignKit',
            imageSrc: 'assets/images/jpg/wdkit-logo.png',
            alt: 'WDesignKit',
            value: 'wdkit'
        },
        {
            text: 'WDesignKit Extra Credits',
            imageSrc: 'assets/images/jpg/wdkit-logo.png',
            alt: 'WDesignKit_extra',
            value: 'wdkit_extra'
        },
        {
            text: 'The Plus Addons For Elementor',
            imageSrc: 'assets/images/jpg/tpae-logo.png',
            alt: 'Tpae',
            value: 'tpae'
        },
        {
            text: 'The Plus Addons For Gutenberg',
            imageSrc: 'assets/images/jpg/tpag-logo.png',
            alt: 'Tpag',
            value: 'tpag'
        },
        {
            text: 'UiChemy',
            imageSrc: 'assets/images/jpg/uichemy-logo.png',
            alt: 'uichemy',
            value: 'uichemy'
        },
    ];

    const figma_options = [
        { value: '266965', text: 'All Access' },
        { value: '266943', text: 'Figma to Bricks' },
        { value: '266948', text: 'Figma to Gutenberg' },
        { value: '226276', text: 'Figma to Elementor' },
    ];

    useEffect(() => {
        if (userData?.credits != undefined) {
            setloader(false);
        }
    }, [userData?.credits])

    const TableApi = () => {
        var initialdata = []

        if (props.wdkit_meta.credits?.tpae_licence && props.wdkit_meta?.credits?.tpae_licence?.ApiKey != undefined) {
            initialdata.push(
                {
                    Img: 'assets/images/jpg/tpae-logo.png',
                    Plugin: 'The Plus Addons for Elementor',
                    value: 'tpae',
                    Key: props.wdkit_meta.credits?.tpae_licence?.ApiKey,
                    Credits: props.wdkit_meta.credits?.tpae_credits,
                    Status: (props.wdkit_meta.credits?.tpae_licence?.license == 'valid' ? 'Active' : 'Expired'),
                    Loader: false
                },
            )
        }

        if (props.wdkit_meta.credits?.tpag_licence && props.wdkit_meta?.credits?.tpag_licence?.ApiKey != undefined) {
            initialdata.push(
                {
                    Img: 'assets/images/jpg/tpag-logo.png',
                    Plugin: 'The Plus Addons for Gutenberg',
                    value: 'tpag',
                    Key: props.wdkit_meta.credits?.tpag_licence?.ApiKey,
                    Credits: props.wdkit_meta.credits?.tpag_credits,
                    Status: (props.wdkit_meta.credits?.tpag_licence?.license == 'valid' ? 'Active' : 'Expired'),
                    Loader: false
                },
            )
        }

        if (props.wdkit_meta.credits?.uichemy_licence && props.wdkit_meta?.credits?.uichemy_licence?.ApiKey != undefined) {
            initialdata.push(
                {
                    Img: 'assets/images/jpg/uichemy-logo.png',
                    Plugin: 'UiChemy',
                    value: 'uichemy',
                    Key: props.wdkit_meta.credits?.uichemy_licence?.ApiKey,
                    Credits: props.wdkit_meta.credits?.uichemy_credits,
                    Status: (props.wdkit_meta.credits?.uichemy_licence?.license == 'valid' ? 'Active' : 'Expired'),
                    Loader: false
                },
            )
        }

        if (props.wdkit_meta.credits?.wdkit_licence && props.wdkit_meta?.credits?.wdkit_licence?.ApiKey != undefined) {
            initialdata.push(
                {
                    Img: 'assets/images/jpg/wdkit-logo.png',
                    Plugin: 'WDesignKit',
                    value: 'wdkit',
                    Key: props.wdkit_meta.credits?.wdkit_licence?.ApiKey,
                    Credits: props.wdkit_meta.credits?.wdkit_credits,
                    Status: (props.wdkit_meta.credits?.wdkit_licence?.license == 'valid' ? 'Active' : 'Expired'),
                    Loader: false
                },
            )
        }

        if (props.wdkit_meta.credits?.wdkit_licence_extra?.length > 0) {
            let licence = props.wdkit_meta.credits?.wdkit_licence_extra;
            licence.map((licence_data, index) => {
                if (licence_data?.ApiKey != undefined) {
                    initialdata.push(
                        {
                            Img: 'assets/images/jpg/wdkit-logo.png',
                            Plugin: 'WDesignKit Extra Credits',
                            value: 'wdkit_extra',
                            Key: licence_data?.ApiKey,
                            Credits: props.wdkit_meta.credits?.wdkit_credits_extra[index],
                            Status: (licence_data?.license == 'valid' ? 'Active' : 'Expired'),
                            Loader: false
                        },
                    )
                }
            })
        }

        UpdatingData.current = initialdata;
        setArrayData(initialdata)
    }

    useEffect(() => {
        setUserData(props?.wdkit_meta);
        TableApi();
    }, [props?.wdkit_meta?.credits])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectOption = (option) => {
        const selected = options.find((data) => data.value == option);
        if (selected) {
            setSelectedOption(option);
            setSelectedOptionImage(selected.imageSrc);
        }
        setIsOpen(false);
    };

    const LoaderSVG = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1.5s linear infinite' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.76054 12.0855C3.58507 12.0855 4.25349 11.4171 4.25349 10.5926C4.25349 9.76803 3.58507 9.09961 2.76054 9.09961C1.936 9.09961 1.26758 9.76803 1.26758 10.5926C1.26758 11.4171 1.936 12.0855 2.76054 12.0855Z" fill="#909BA6" />
                <path d="M12.3661 10.7615C13.0817 10.7615 13.6619 10.1813 13.6619 9.4657C13.6619 8.75006 13.0817 8.16992 12.3661 8.16992C11.6505 8.16992 11.0703 8.75006 11.0703 9.4657C11.0703 10.1813 11.6505 10.7615 12.3661 10.7615Z" fill="#C8D2DC" />
                <path d="M11.1837 4.22581C11.7749 4.22581 12.2541 3.74656 12.2541 3.15538C12.2541 2.56421 11.7749 2.08496 11.1837 2.08496C10.5925 2.08496 10.1133 2.56421 10.1133 3.15538C10.1133 3.74656 10.5925 4.22581 11.1837 4.22581Z" fill="#E9EDF1" />
                <path d="M1.58437 8.4411C2.45939 8.4411 3.16873 7.74905 3.16873 6.89536C3.16873 6.04166 2.45939 5.34961 1.58437 5.34961C0.709345 5.34961 0 6.04166 0 6.89536C0 7.74905 0.709345 8.4411 1.58437 8.4411Z" fill="#7E8B96" />
                <path d="M6.13565 14.0004C6.93113 14.0004 7.57599 13.372 7.57599 12.5969C7.57599 11.8217 6.93113 11.1934 6.13565 11.1934C5.34017 11.1934 4.69531 11.8217 4.69531 12.5969C4.69531 13.372 5.34017 14.0004 6.13565 14.0004Z" fill="#A2ABB8" />
                <path d="M9.83706 13.3863C10.5928 13.3863 11.2054 12.7898 11.2054 12.054C11.2054 11.3182 10.5928 10.7217 9.83706 10.7217C9.08136 10.7217 8.46875 11.3182 8.46875 12.054C8.46875 12.7898 9.08136 13.3863 9.83706 13.3863Z" fill="#B9C3CD" />
                <path d="M3.29894 4.8518C4.21373 4.8518 4.95531 4.12792 4.95531 3.23498C4.95531 2.34204 4.21373 1.61816 3.29894 1.61816C2.38416 1.61816 1.64258 2.34204 1.64258 3.23498C1.64258 4.12792 2.38416 4.8518 3.29894 4.8518Z" fill="#5F6C75" />
                <path d="M12.7751 7.30062C13.4512 7.30062 13.9993 6.76265 13.9993 6.09904C13.9993 5.43543 13.4512 4.89746 12.7751 4.89746C12.0989 4.89746 11.5508 5.43543 11.5508 6.09904C11.5508 6.76265 12.0989 7.30062 12.7751 7.30062Z" fill="#DCE6EB" />
                <path d="M7.40859 3.49393C8.37314 3.49393 9.15507 2.71201 9.15507 1.74746C9.15507 0.782902 8.37314 0.000976562 7.40859 0.000976562C6.44403 0.000976562 5.66211 0.782902 5.66211 1.74746C5.66211 2.71201 6.44403 3.49393 7.40859 3.49393Z" fill="#4E5A61" />
            </svg>
        );
    }

    const DeleteApiKey = (value, key) => {
        setDeleteBtnLoader(true);
        let token = get_user_login();
        const apiData = {
            'type': 'delete_licence',
            'token': token.token,
            'licencename': value,
            'apikey': key
        }

        form_data(apiData).then(async (result) => {
            if (result.success) {
                let updatedArray = await Get_user_info_data();
                setDeleteBtnLoader(false);
                props.wdkit_set_toast([result?.message, result?.description, '', 'success']);

                if (updatedArray?.data) {
                    props.wdkit_set_meta(updatedArray?.data)
                }
            } else {
                setDeleteBtnLoader(false);
                props.wdkit_set_toast([result?.message, result?.description, '', 'danger']);
            }
            setOpenPopup(false);
            setdeleteItem();
        });
    }

    const handleChange = (event) => {
        setLicenseKey(event.target.value);
        setInputEmpty(false);
    }

    const AddApiKey = async () => {
        setIsOpen(false);
        if (!licenseKey.trim()) {
            setInputEmpty(true);
            props.wdkit_set_toast(['Invalid key entered', 'Key error, check and fix', '', 'danger']);
            return;
        } else {
            setActivateLoader(true);
            let token = get_user_login();
            const apiData = {
                'type': 'active_licence',
                'token': token.token,
                'licencekey': licenseKey,
                'licencename': selectedOption,
                'uichemyid': selectedOption == 'uichemy' ? SelectfigmaOpt : '',
            }
            await form_data(apiData).then(async (result) => {

                if (result.success) {
                    let updatedArray = await Get_user_info_data();

                    if (updatedArray?.data) {
                        props.wdkit_set_meta(updatedArray?.data)
                    }
                    props.wdkit_set_toast([result?.message, result?.description, '', 'success']);
                    setActivateLoader(false);
                } else {
                    props.wdkit_set_toast([result?.message, result?.description, '', 'danger']);
                    setActivateLoader(false);
                }
            });
        }
        setLicenseKey('');
    };

    const SyncApiKey = (value, index) => {
        let updatedArray = [...UpdatingData.current];
        updatedArray[index] = Object.assign({}, UpdatingData.current[index], { 'Loader': true });
        UpdatingData.current[index] = updatedArray[index];
        setArrayData(updatedArray);


        let token = get_user_login();
        const apiData = {
            'type': 'sync_licence',
            'token': token.token,
            'licencename': value
        }

        form_data(apiData).then((result) => {
            if (result.success) {
                let newArr = [...UpdatingData.current];
                newArr[index] = Object.assign({}, UpdatingData.current[index], { 'Loader': false });
                UpdatingData.current[index] = newArr[index];
                setArrayData(newArr);
                props.wdkit_set_toast([result?.message, result?.description, '', 'success']);
            } else {
                let newArr = [...UpdatingData.current];
                newArr[index] = Object.assign({}, UpdatingData.current[index], { 'Loader': false });
                UpdatingData.current[index] = newArr[index];
                setArrayData(newArr);
                props.wdkit_set_toast([result?.message, result?.description, '', 'danger']);
            }
        });
    }

    var array = Array.from({ length: 100 })

    let data = wkit_get_user_login()
    if (!data) {
        props.wdkit_Login_Route('/activate');

        return <Navigate to='/login' />
    }

    const DeletePopup = () => {

        return (
            <div className="popup-body">
                <div className="wkit-popup-content-title">
                    {__("Are you sure you want to deactivate the")} {deleteItem?.Plugin ? deleteItem.Plugin : ''} {__("Pro License Key ?")}
                </div>
                <div className="wkit-popup-buttons">
                    <button className="wkit-popup-confirm wkit-outer-btn-class" onClick={() => setOpenPopup(false)}>
                        {__("No")}
                    </button>
                    <button className="wkit-popup-cancel wkit-btn-class" onClick={() => DeleteApiKey(deleteItem.value, deleteItem.Key)}>
                        {deleteBtnLoader == true ?
                            <WkitLoader />
                            :
                            <span>{__("Yes")}</span>
                        }
                    </button>
                </div>
            </div >
        );
    }

    return (
        <div className={`wkit-activate-key-wrapper ${loader ? 'wkit-skeleton' : ''}`}>
            <Page_header
                title={'Manage Licence'}
                svg={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 8.5C12.646 8.5 13.2347 8.25502 13.6784 7.85289C13.7324 7.79071 13.7907 7.73238 13.8529 7.67836C14.255 7.23469 14.5 6.64595 14.5 6C14.5 4.61929 13.3807 3.5 12 3.5C10.6193 3.5 9.5 4.61929 9.5 6C9.5 6.64595 9.74498 7.23469 10.1471 7.67836C10.2093 7.73238 10.2676 7.79071 10.3216 7.85289C10.7653 8.25502 11.354 8.5 12 8.5ZM12 10C12.4365 10 12.8567 9.93007 13.25 9.80081V11.5394L12.2304 11.2845C12.0791 11.2467 11.9209 11.2467 11.7696 11.2845L10.75 11.5394V9.80081C11.1433 9.93007 11.5635 10 12 10ZM9.21332 8.86957C9.18529 8.84235 9.15765 8.81471 9.13043 8.78668C9.09246 8.76341 9.04779 8.75 9 8.75H4C3.86193 8.75 3.75 8.86193 3.75 9V20C3.75 20.1381 3.86193 20.25 4 20.25H20C20.1381 20.25 20.25 20.1381 20.25 20V9C20.25 8.86193 20.1381 8.75 20 8.75H15C14.9522 8.75 14.9075 8.76341 14.8696 8.78668C14.8423 8.81471 14.8147 8.84235 14.7867 8.86957C14.7634 8.90754 14.75 8.95221 14.75 9V12.2438C14.75 12.8619 14.1692 13.3154 13.5696 13.1655L12 12.7731L10.4304 13.1655C9.83082 13.3154 9.25 12.8619 9.25 12.2438V9C9.25 8.95221 9.23659 8.90754 9.21332 8.86957ZM8 6C8 6.43653 8.06993 6.85673 8.19919 7.25H4C3.0335 7.25 2.25 8.0335 2.25 9V20C2.25 20.9665 3.0335 21.75 4 21.75H20C20.9665 21.75 21.75 20.9665 21.75 20V9C21.75 8.0335 20.9665 7.25 20 7.25H15.8008C15.9301 6.85673 16 6.43653 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6ZM7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44771 18 7 18H17C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16H7Z" fill="#040483" />
                </svg>
                }
            />
            <div className='wkit-active-content'>
                <div className='wkit-credit-detail'>
                    <div className='wkit-credit-chart'>
                        {array.map((dt, index) => {
                            if ((index + 1) <= ((props.wdkit_meta?.credits?.count_template * 2) / (props.wdkit_meta?.credits?.credits_total / 100))) {
                                var BGcolor = '#7939eb';
                            } else if (((props.wdkit_meta?.credits?.count_template * 2) / (props.wdkit_meta?.credits?.credits_total / 100)) < (index + 1) && (index + 1) <= (((props.wdkit_meta?.credits?.count_template * 2) / (props.wdkit_meta?.credits?.credits_total / 100)) + ((props.wdkit_meta?.credits?.count_widget * 5) / (props.wdkit_meta?.credits?.credits_total / 100)))) {
                                var BGcolor = '#fe5231';
                            } else if ((((props.wdkit_meta?.credits?.count_template * 2) / (props.wdkit_meta?.credits?.credits_total / 100)) + ((props.wdkit_meta?.credits?.count_widget * 5) / (props.wdkit_meta?.credits?.credits_total / 100))) < (index + 1) && (index + 1) < (((props.wdkit_meta?.credits?.count_template * 2) / (props.wdkit_meta?.credits?.credits_total / 100)) + ((props.wdkit_meta?.credits?.count_widget * 5) / (props.wdkit_meta?.credits?.credits_total / 100)) + ((props.wdkit_meta?.credits?.count_workspace * 10) / (props.wdkit_meta?.credits?.credits_total / 100)))) {
                                var BGcolor = '#00ff66';
                            } else {
                                var BGcolor = '#F9E9F1';
                            }
                            return (
                                <div className='wkit-chart' style={{ transform: `rotate(${index * 3.6}deg)` }} key={index}>
                                    <span className='wkit-chart-show' style={{ backgroundColor: BGcolor, zIndex: index }}>
                                        {/* <ChartToolTip index={index} /> */}
                                    </span>
                                    <span className='wkit-chart-hiden'></span>
                                </div>
                            );
                        })}
                        <div className='wkit-center-chart'>
                            <div className='wkit-center-chart-credits'>
                                {(props.wdkit_meta?.credits?.count_template * 2) + (props.wdkit_meta?.credits?.count_widget * 5) + (props.wdkit_meta?.credits?.count_workspace * 10)}/{props.wdkit_meta?.credits?.credits_total}
                            </div>
                            {props.wdkit_meta?.credits?.type == "free" ?
                                <div className='wkit-center-chart-tag'>
                                    {__("Free")}
                                </div>
                                :
                                <div className='wkit-center-chart-pro-tag'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                        <path d="M1.39994 2.59894L3.49994 3.99894L5.59294 1.06895C5.63919 1.00413 5.70024 0.951295 5.77104 0.914845C5.84184 0.878395 5.92029 0.859375 5.99994 0.859375C6.07959 0.859375 6.15804 0.878395 6.22884 0.914845C6.29964 0.951295 6.36069 1.00413 6.40694 1.06895L8.49994 3.99894L10.5999 2.59894C10.6794 2.54606 10.7724 2.51705 10.8678 2.51531C10.9632 2.51358 11.0572 2.5392 11.1385 2.58915C11.2199 2.6391 11.2852 2.71131 11.3268 2.79721C11.3685 2.88312 11.3846 2.97915 11.3734 3.07395L10.5519 10.0574C10.5376 10.1791 10.4791 10.2912 10.3876 10.3726C10.2961 10.4539 10.1779 10.4989 10.0554 10.4989H1.94444C1.82198 10.4989 1.70377 10.4539 1.61226 10.3726C1.52074 10.2912 1.46227 10.1791 1.44794 10.0574L0.626442 3.07345C0.615342 2.97869 0.631587 2.88273 0.673252 2.7969C0.714922 2.71108 0.780272 2.63896 0.861597 2.58908C0.942923 2.53919 1.03682 2.51361 1.13221 2.51536C1.2276 2.51711 1.3205 2.54611 1.39994 2.59894ZM5.99994 7.49894C6.26514 7.49894 6.51949 7.39359 6.70704 7.20604C6.89459 7.01849 6.99994 6.76414 6.99994 6.49894C6.99994 6.23374 6.89459 5.97939 6.70704 5.79184C6.51949 5.60429 6.26514 5.49894 5.99994 5.49894C5.73474 5.49894 5.48039 5.60429 5.29284 5.79184C5.10529 5.97939 4.99994 6.23374 4.99994 6.49894C4.99994 6.76414 5.10529 7.01849 5.29284 7.20604C5.48039 7.39359 5.73474 7.49894 5.99994 7.49894Z" fill="white" />
                                    </svg>
                                    <span>{__("Pro")}</span>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='wkit-credit-meta'>
                        <div className='wkit-credit-meta-header'>
                            {__("Credits")}
                        </div>
                        <div className='wkit-credit-meta-body'>
                            <div className='wkit-credit-meta-content'>
                                <div className='wkit-credit-meta-content-top'>
                                    <div className='wkit-active-dot wkit-cl-template'>
                                    </div>
                                    <div>{__("Templates")}</div>
                                </div>
                                <div className='wkit-credit-meta-content-bottom'>
                                    {props.wdkit_meta?.credits?.template_limit?.meta_value == "unlimited" ? (
                                        <span>
                                            {props.wdkit_meta?.credits?.count_template}/<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                <path d="M18.6311 7.18922C16.8058 5.36402 13.8359 5.3641 12.0107 7.18922L6.68978 12.5101C6.13544 13.0644 5.40732 13.3416 4.67911 13.3416C3.95094 13.3416 3.22281 13.0644 2.66844 12.5101C1.55976 11.4014 1.55976 9.59745 2.66844 8.48873C3.77719 7.38001 5.58118 7.38013 6.68978 8.48873L7.87164 9.67059L9.17119 8.37105L7.98933 7.18919C6.16408 5.36406 3.19421 5.36398 1.36893 7.18919C-0.456311 9.01447 -0.456311 11.9843 1.36893 13.8096C3.19425 15.6348 6.16408 15.6348 7.98933 13.8096L13.3102 8.48869C14.4189 7.38013 16.2228 7.37997 17.3316 8.48869C18.4402 9.59741 18.4402 11.4014 17.3316 12.51C16.7773 13.0643 16.0489 13.3415 15.3209 13.3415C14.5926 13.3415 13.8646 13.0644 13.3102 12.51L12.1284 11.3282L10.8288 12.6277L12.0107 13.8096C13.836 15.6348 16.8058 15.6348 18.6311 13.8096C20.4563 11.9843 20.4563 9.01451 18.6311 7.18922Z" fill="#040483" />
                                            </svg>
                                        </span>
                                    ) : (
                                        `${props.wdkit_meta?.credits?.count_template || '00'}/${props.wdkit_meta?.credits?.template_limit?.meta_value || '00'}`)}
                                </div>
                            </div>
                            <div className='wkit-credit-meta-content'>
                                <div className='wkit-credit-meta-content-top'>
                                    <div className='wkit-active-dot wkit-cl-widget'>
                                    </div>
                                    <div>{__("Widgets")}</div>
                                </div>
                                <div className='wkit-credit-meta-content-bottom'>
                                    {props.wdkit_meta?.credits?.widget_limit?.meta_value === "unlimited" ? (
                                        <span>
                                            {props.wdkit_meta?.credits?.count_widget}/<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                <path d="M18.6311 7.18922C16.8058 5.36402 13.8359 5.3641 12.0107 7.18922L6.68978 12.5101C6.13544 13.0644 5.40732 13.3416 4.67911 13.3416C3.95094 13.3416 3.22281 13.0644 2.66844 12.5101C1.55976 11.4014 1.55976 9.59745 2.66844 8.48873C3.77719 7.38001 5.58118 7.38013 6.68978 8.48873L7.87164 9.67059L9.17119 8.37105L7.98933 7.18919C6.16408 5.36406 3.19421 5.36398 1.36893 7.18919C-0.456311 9.01447 -0.456311 11.9843 1.36893 13.8096C3.19425 15.6348 6.16408 15.6348 7.98933 13.8096L13.3102 8.48869C14.4189 7.38013 16.2228 7.37997 17.3316 8.48869C18.4402 9.59741 18.4402 11.4014 17.3316 12.51C16.7773 13.0643 16.0489 13.3415 15.3209 13.3415C14.5926 13.3415 13.8646 13.0644 13.3102 12.51L12.1284 11.3282L10.8288 12.6277L12.0107 13.8096C13.836 15.6348 16.8058 15.6348 18.6311 13.8096C20.4563 11.9843 20.4563 9.01451 18.6311 7.18922Z" fill="#040483" />
                                            </svg>
                                        </span>
                                    ) : (
                                        `${props.wdkit_meta?.credits?.count_widget || '00'}/${props.wdkit_meta?.credits?.widget_limit?.meta_value || '00'}`
                                    )}
                                </div>
                            </div>
                            <div className='wkit-credit-meta-content'>
                                <div className='wkit-credit-meta-content-top'>
                                    <div className='wkit-active-dot wkit-cl-workspace'>
                                    </div>
                                    <div>{__("Workspace")}</div>
                                </div>
                                <div className='wkit-credit-meta-content-bottom'>
                                    {props.wdkit_meta?.credits?.workspace_limit?.meta_value === "unlimited" ? (
                                        <span>
                                            {props.wdkit_meta?.credits?.count_workspace}/<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                <path d="M18.6311 7.18922C16.8058 5.36402 13.8359 5.3641 12.0107 7.18922L6.68978 12.5101C6.13544 13.0644 5.40732 13.3416 4.67911 13.3416C3.95094 13.3416 3.22281 13.0644 2.66844 12.5101C1.55976 11.4014 1.55976 9.59745 2.66844 8.48873C3.77719 7.38001 5.58118 7.38013 6.68978 8.48873L7.87164 9.67059L9.17119 8.37105L7.98933 7.18919C6.16408 5.36406 3.19421 5.36398 1.36893 7.18919C-0.456311 9.01447 -0.456311 11.9843 1.36893 13.8096C3.19425 15.6348 6.16408 15.6348 7.98933 13.8096L13.3102 8.48869C14.4189 7.38013 16.2228 7.37997 17.3316 8.48869C18.4402 9.59741 18.4402 11.4014 17.3316 12.51C16.7773 13.0643 16.0489 13.3415 15.3209 13.3415C14.5926 13.3415 13.8646 13.0644 13.3102 12.51L12.1284 11.3282L10.8288 12.6277L12.0107 13.8096C13.836 15.6348 16.8058 15.6348 18.6311 13.8096C20.4563 11.9843 20.4563 9.01451 18.6311 7.18922Z" fill="#040483" />
                                            </svg>
                                        </span>
                                    ) : (
                                        `${props.wdkit_meta?.credits?.count_workspace || '00'}/${props.wdkit_meta?.credits?.workspace_limit?.meta_value || '00'}`
                                    )}
                                </div>
                            </div>
                        </div>
                        <a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
                            {props.wdkit_meta?.credits?.type == "free" &&
                                <button className='wkit-credit-meta-btn wkit-goPro-btn wkit-pink-btn-class'>
                                    <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.79989 4.2018L5.99989 7.0018L10.1859 1.1418C10.2784 1.01217 10.4005 0.906496 10.5421 0.833596C10.6837 0.760696 10.8406 0.722656 10.9999 0.722656C11.1592 0.722656 11.3161 0.760696 11.4577 0.833596C11.5993 0.906496 11.7214 1.01217 11.8139 1.1418L15.9999 7.0018L20.1999 4.2018C20.3589 4.09604 20.5448 4.038 20.7356 4.03453C20.9265 4.03106 21.1144 4.08231 21.2771 4.18222C21.4398 4.28212 21.5705 4.42652 21.6537 4.59833C21.737 4.77014 21.7693 4.9622 21.7469 5.1518L20.1039 19.1188C20.0752 19.3621 19.9583 19.5863 19.7753 19.7491C19.5922 19.9118 19.3558 20.0018 19.1109 20.0018H2.88889C2.64396 20.0018 2.40755 19.9118 2.22452 19.7491C2.04148 19.5863 1.92455 19.3621 1.89589 19.1188L0.252885 5.1508C0.230685 4.96128 0.263175 4.76937 0.346505 4.59771C0.429845 4.42606 0.560545 4.28183 0.723195 4.18206C0.885845 4.08228 1.07365 4.03112 1.26443 4.03462C1.45521 4.03812 1.64101 4.09613 1.79989 4.2018V4.2018ZM10.9999 14.0018C11.5303 14.0018 12.039 13.7911 12.4141 13.416C12.7892 13.0409 12.9999 12.5322 12.9999 12.0018C12.9999 11.4714 12.7892 10.9627 12.4141 10.5876C12.039 10.2125 11.5303 10.0018 10.9999 10.0018C10.4695 10.0018 9.96079 10.2125 9.58569 10.5876C9.21059 10.9627 8.99989 11.4714 8.99989 12.0018C8.99989 12.5322 9.21059 13.0409 9.58569 13.416C9.96079 13.7911 10.4695 14.0018 10.9999 14.0018Z" fill="white" />
                                    </svg>
                                    {__("Go Pro")}
                                </button>
                            }
                            {props.wdkit_meta?.credits?.type != "free" && ((props.wdkit_meta?.credits?.count_template * 2) + (props.wdkit_meta?.credits?.count_widget * 5) + (props.wdkit_meta?.credits?.count_workspace * 10) >= props.wdkit_meta?.credits?.total_credits?.meta_value) &&

                                <button className='wkit-credit-meta-btn wkit-goPro-btn wkit-pink-btn-class'>{__("Buy Extra Credits")}</button>
                            }
                        </a>
                    </div>
                </div>
                <div className='wkit-apiKey-content'>
                    <div className='wkit-apiKey-add-content'>
                        <div className='wkit-addKey-header'>
                            {__("Add Licence Key")}
                        </div>
                        <div className='wkit-addKey-content'>
                            <span>{__("Enter Licence Key")}</span>
                            <div className='wkit-addKey-body'>
                                <div className={`wkit-addkey-dropdown-field ${isInputEmpty ? 'wkit-empty-key' : ''}`}>
                                    <div className='wkit-addkey-dropdown-parent'>
                                        {selectedOptionImage && (
                                            <img src={img_path + selectedOptionImage} alt='Selected Option Image' onClick={() => { toggleDropdown() }} draggable={false} />
                                        )}
                                        <input
                                            className={'wkit-addKey-input'}
                                            placeholder='XXXXXXXXX6788'
                                            type='text'
                                            value={licenseKey}
                                            onFocus={() => setIsOpen(true)}
                                            onChange={(e) => { handleChange(e) }}
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" onClick={() => { toggleDropdown() }}
                                            className={`wkit-addkey-dropdown-toggle ${isOpen ? 'wdkit-dropdown-open' : ''}`}>
                                            <path d="M6 9.5L12 15.5L18 9.5" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {isOpen && (
                                        <div className='wkit-addkey-dropdown-child'>
                                            <ul className="dropdown-options">
                                                {options.map((option) => (
                                                    <li className={option.value == selectedOption ? "wkit-selected-key" : ''} key={option.text} onClick={() => selectOption(option.value)}>
                                                        <div className='wkit-activate-key-opt'>
                                                            <img src={img_path + option.imageSrc} alt={option.alt} />
                                                            {option.text}
                                                        </div>
                                                        {option.value == selectedOption &&
                                                            < svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="none">
                                                                <path d="M26.6663 8L11.9997 22.6667L5.33301 16" stroke="#040483" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        }
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {selectedOption == 'uichemy' &&
                                    <div>
                                        <select className='wkit-uichemy-dropDown' onChange={(e) => setSelectfigmaOpt(e.target.value)}>
                                            {
                                                figma_options.map((opt) => {
                                                    return <option value={opt.value}>{opt.text}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                }
                                <div className='wkit-credit-meta-btn wkit-activte-btn wkit-pink-btn-class' onClick={() => AddApiKey()} >
                                    {ActivateLoader == true ?
                                        <WkitLoader />
                                        :
                                        <span>{__("Activate")}</span>
                                    }
                                </div>
                                <a className='wkit-link-hover-effect' href={wdkitData.WDKIT_DOC_URL + 'documents/how-to-get-key-for-wdesignkit-activation/'} target='_blank' rel="noopener noreferrer">How to get key?</a>
                            </div>
                        </div>
                    </div>
                    {arraydata.length > 0 ?
                        <div className='wkit-apiKey-table-content'>
                            <div className='wkit-apiKey-table-header'>
                                <span>{__("Existing Licence Keys")}</span>
                                <p>{__("To utilize the credits associated with this license key, it must be in an 'Active' status. If it has expired, access will be restricted, and you won't be able to use it.")}</p>
                            </div>
                            <div className='wkit-apiKey-table-body'>
                                <table>
                                    <thead>
                                        <tr className='wkit-table-hraders'>
                                            <th className='wkit-apikey-plugin'>{__("Name")}</th>
                                            <th>{__("Licence Key")}</th>
                                            <th>{__("Credits")}</th>
                                            <th>{__("Status")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            arraydata.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className='wkit-apikey-plugin'>
                                                            <img src={img_path + item.Img} alt='TPAE image' />
                                                            <span>
                                                                {item.Plugin}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>{item.Key}</td>
                                                    <td>
                                                        <div className='wkit-active-table-credits'>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.39844 10.9336C2.39844 16.2669 6.66511 20.5336 11.9984 20.5336C17.2651 20.5336 21.5984 16.2669 21.5984 10.9336V13.0669C21.5984 18.4003 17.3317 22.6669 11.9984 22.6669C6.73177 22.6669 2.39844 18.4003 2.39844 13.0669V10.9336Z" fill="#FFB961" />
                                                                <path d="M2.39844 10.9336C2.39844 16.2669 6.66511 20.5336 11.9984 20.5336C17.2651 20.5336 21.5984 16.2669 21.5984 10.9336V13.0669C21.5984 18.4003 17.3317 22.6669 11.9984 22.6669C6.73177 22.6669 2.39844 18.4003 2.39844 13.0669V10.9336Z" fill="#F3A250" />
                                                                <path d="M12.001 20.5336C10.0677 20.5336 8.20104 19.9336 6.73438 18.9336V21.0669C8.2677 22.0669 10.0677 22.6669 12.001 22.6669C17.2677 22.6669 21.601 18.4003 21.601 13.0669V10.9336C21.601 16.2003 17.2677 20.5336 12.001 20.5336Z" fill="#F18B54" />
                                                                <path d="M13.668 20.3339V22.4672C18.1346 21.6672 21.6013 17.7339 21.6013 13.0005V10.8672C21.6013 15.6672 18.2013 19.5339 13.668 20.3339Z" fill="#F3A250" />
                                                                <path d="M19.0664 17.4003V19.5336C20.6664 17.8003 21.5997 15.5336 21.5997 13.0669V10.9336C21.5997 13.4003 20.5997 15.6669 19.0664 17.4003Z" fill="#F18B54" />
                                                                <path d="M21.602 10.934C21.602 16.2673 17.3353 20.534 12.002 20.534C7.20194 20.534 3.26861 17.0673 2.53528 12.4673C1.60194 6.73398 6.00194 1.33398 12.002 1.33398C16.0687 1.33398 19.602 3.86732 20.9353 7.53398C21.402 8.53398 21.602 9.73398 21.602 10.934Z" fill="#F9CF6B" />
                                                                <path d="M4.73438 15.801C6.66771 18.1344 9.33437 19.3344 12.001 19.3344C14.6677 19.3344 17.3344 18.1344 19.2677 15.7344C17.9344 18.1344 15.2677 19.8677 12.001 19.9344C8.80104 19.9344 6.06771 18.1344 4.73438 15.801Z" fill="white" />
                                                                <path d="M20.1339 7.40104C18.4672 4.20104 15.3339 2.33437 12.0005 2.33437C8.66719 2.33437 5.53385 4.20103 3.86719 7.33436C4.93385 4.2677 8.13385 1.80104 12.0005 1.73438C15.8672 1.80104 19.0005 4.26771 20.1339 7.40104Z" fill="white" />
                                                                <path d="M4.73438 15.801C6.66771 18.1344 9.33437 19.3344 12.001 19.3344C14.6677 19.3344 17.3344 18.1344 19.2677 15.7344C17.9344 18.1344 15.2677 19.8677 12.001 19.9344C8.80104 19.9344 6.06771 18.1344 4.73438 15.801Z" fill="#FDEECA" />
                                                                <path d="M19.2677 10.9346C19.2677 14.9346 16.001 18.2013 12.001 18.2013C8.00104 18.2013 4.73438 14.9346 4.73438 10.9346C4.73438 6.93464 8.00104 3.66797 12.001 3.66797C16.001 3.66797 19.2677 6.93464 19.2677 10.9346Z" fill="#F3A250" />
                                                                <path d="M14.3986 12L14.7986 14.5333C14.8653 14.9333 14.4653 15.2 14.1319 15.0667L11.8653 13.8667C11.7319 13.8 11.5319 13.8 11.3986 13.8667L9.13197 15.0667C8.79863 15.2667 8.39863 14.9333 8.4653 14.5333L8.8653 12C8.8653 11.8667 8.8653 11.6667 8.73197 11.6L6.8653 9.8C6.59863 9.53333 6.73197 9.06667 7.13197 9L9.6653 8.6C9.79863 8.6 9.93197 8.46667 9.99865 8.33333L11.1986 6C11.3986 5.66667 11.8653 5.66667 12.0653 6L13.1986 8.33333C13.2653 8.46667 13.3986 8.6 13.5319 8.6L16.0653 9C16.4653 9.06667 16.5986 9.53333 16.3319 9.8L14.4653 11.6C14.3986 11.6667 14.3319 11.8667 14.3986 12Z" fill="#EF7B56" />
                                                                <path d="M18.5314 14.068C20.4647 9.46797 17.0647 4.26797 11.998 4.26797C6.99808 4.26797 3.53141 9.33464 5.39808 14.0013C3.19808 9.2013 6.66475 3.66797 11.998 3.66797C17.398 3.66797 20.8647 9.33464 18.5314 14.068Z" fill="#EF7B56" />
                                                                <path d="M14.801 12.4004L15.201 14.9337C15.2676 15.3337 14.8676 15.6004 14.5343 15.4671L12.2676 14.2671C12.1343 14.2004 11.9343 14.2004 11.801 14.2671L9.53431 15.4671C9.20098 15.6671 8.80098 15.3337 8.86764 14.9337L9.26764 12.4004C9.26764 12.2671 9.26764 12.0671 9.13431 12.0004L7.26764 10.2004C7.00098 9.93372 7.13431 9.46706 7.53431 9.40039L10.0676 9.00039C10.201 9.00039 10.3343 8.86706 10.401 8.73372L11.5343 6.40039C11.7343 6.06706 12.201 6.06706 12.401 6.40039L13.5343 8.73372C13.601 8.86706 13.7343 9.00039 13.8676 9.00039L16.401 9.40039C16.801 9.46706 16.9343 9.93372 16.6676 10.2004L14.9343 12.0004C14.801 12.0671 14.7343 12.2671 14.801 12.4004Z" fill="#F9CF6B" />
                                                                <path d="M7.73639 10.2669C7.46972 10.0003 7.60306 9.60026 8.00306 9.53359L10.2698 9.20026C10.4031 9.20026 10.5364 9.06693 10.6031 9.00026L11.6031 6.93359C11.7364 6.60026 12.2031 6.60026 12.3364 6.93359L13.3364 9.00026C13.4031 9.13359 13.5364 9.20026 13.6698 9.20026L15.9364 9.53359C16.2698 9.60026 16.4031 10.0003 16.2031 10.2669C16.2031 10.2669 14.7364 11.8669 11.8698 11.8669C9.66972 11.8669 7.73639 10.2669 7.73639 10.2669Z" fill="#FCE7B5" />
                                                                <path d="M8.3362 6.20026C8.1362 6.20026 8.00286 6.26693 7.86953 6.33359C7.9362 6.40026 8.46953 6.93359 8.40286 7.00026C8.3362 7.06693 7.80286 6.53359 7.7362 6.46693C7.66953 6.60026 7.60286 6.73359 7.60286 6.93359C7.60286 7.66693 7.5362 8.13359 7.40286 8.13359C7.3362 8.13359 7.26953 7.66693 7.20286 6.93359C7.20286 6.73359 7.1362 6.60026 7.06953 6.46693C7.00286 6.53359 6.46953 7.06693 6.40286 7.00026C6.3362 6.93359 6.86953 6.40026 6.93619 6.33359C6.80286 6.26693 6.66953 6.20026 6.46953 6.20026C4.86953 6.13359 4.86953 5.93359 6.46953 5.86693C6.60286 5.86693 6.80286 5.80026 6.93619 5.73359C6.86953 5.66693 6.3362 5.13359 6.40286 5.06693C6.46953 5.00026 7.00286 5.53359 7.06953 5.60026C7.1362 5.46693 7.20286 5.33359 7.20286 5.13359C7.26953 3.53359 7.46953 3.53359 7.5362 5.13359C7.5362 5.26693 7.60286 5.46693 7.66953 5.60026C7.7362 5.53359 8.26953 5.00026 8.3362 5.06693C8.40286 5.13359 8.20286 5.40026 7.86953 5.73359V5.80026C8.00286 5.86693 8.1362 5.93359 8.3362 5.93359C9.06953 5.93359 9.5362 6.00026 9.5362 6.13359C9.5362 6.13359 9.06953 6.20026 8.3362 6.20026Z" fill="white" />
                                                                <path d="M20.1339 7.40104C18.4672 4.20104 15.3339 2.33437 12.0005 2.33437C8.66719 2.33437 5.53385 4.20103 3.86719 7.33436C4.93385 4.2677 8.13385 1.80104 12.0005 1.73438C15.8672 1.80104 19.0005 4.26771 20.1339 7.40104Z" fill="#FBE1A0" />
                                                            </svg>
                                                            <span>{item.Credits}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='wkit-active-table-status-tab'>
                                                            <span className={`wkit-key-status ${item.Status == 'Expired' ? 'wdkit-expired-class' : 'wdkit-active-class'}`}>{item.Status}</span>
                                                            {item.Loader ?
                                                                <span className='wkit-cloud-icon'>
                                                                    <LoaderSVG />
                                                                </span>
                                                                :
                                                                <span className='wkit-cloud-icon' onClick={() => {
                                                                    SyncApiKey(item.value, index);
                                                                }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                        <path d="M15.6075 7.68C15.38 4.78562 12.9519 2.5 10 2.5C7.475 2.5 5.3075 4.14 4.6075 6.53188C2.61313 7.22438 1.25 9.11438 1.25 11.25C1.25 14.0069 3.49313 16.25 6.25 16.25H14.375C16.7869 16.25 18.75 14.2869 18.75 11.875C18.75 9.90688 17.4562 8.2175 15.6075 7.68ZM12.6831 12.3169L11.4331 11.0669C11.2544 10.8881 11.2006 10.6194 11.2975 10.3856C11.3938 10.1525 11.6225 10 11.875 10H12.4113C12.1319 8.925 11.1619 8.125 10 8.125C9.65125 8.125 9.31437 8.195 8.99875 8.33313C8.68125 8.47062 8.31375 8.32687 8.17563 8.01125C8.03688 7.695 8.18125 7.32625 8.4975 7.18813C8.97187 6.98063 9.47812 6.875 10 6.875C11.8544 6.875 13.3944 8.22937 13.6938 10H14.375C14.6275 10 14.8562 10.1525 14.9525 10.3856C15.0494 10.6194 14.9956 10.8881 14.8169 11.0669L13.5669 12.3169C13.445 12.4388 13.285 12.5 13.125 12.5C12.965 12.5 12.805 12.4388 12.6831 12.3169ZM5.18313 10.1831L6.43313 8.93313C6.6775 8.68875 7.0725 8.68875 7.31687 8.93313L8.56687 10.1831C8.74563 10.3619 8.79938 10.6306 8.7025 10.8644C8.60625 11.0981 8.3775 11.25 8.125 11.25H7.58875C7.86812 12.3256 8.83813 13.125 10 13.125C10.3475 13.125 10.6838 13.055 10.9994 12.9175C11.315 12.7775 11.6838 12.9244 11.8219 13.24C11.9606 13.5562 11.8156 13.925 11.4994 14.0625C11.0256 14.27 10.5206 14.375 10 14.375C8.14563 14.375 6.60563 13.0206 6.30625 11.25H5.625C5.3725 11.25 5.14375 11.0981 5.0475 10.8644C4.95063 10.6306 5.00438 10.3619 5.18313 10.1831Z" fill="#00A31B" />
                                                                    </svg>
                                                                </span>
                                                            }
                                                            <span className='wkit-delete-key-btn' onClick={() => { setOpenPopup(true), setdeleteItem(item) }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                    <path d="M2.5 5H4.16667H17.5" stroke="#B1B1D9" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M15.8327 5.0013V16.668C15.8327 17.11 15.6571 17.5339 15.3445 17.8465C15.032 18.159 14.608 18.3346 14.166 18.3346H5.83268C5.39065 18.3346 4.96673 18.159 4.65417 17.8465C4.34161 17.5339 4.16602 17.11 4.16602 16.668V5.0013M6.66602 5.0013V3.33464C6.66602 2.89261 6.84161 2.46868 7.15417 2.15612C7.46673 1.84356 7.89065 1.66797 8.33268 1.66797H11.666C12.108 1.66797 12.532 1.84356 12.8445 2.15612C13.1571 2.46868 13.3327 2.89261 13.3327 3.33464V5.0013" stroke="#B1B1D9" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M8.33398 9.16797V14.168" stroke="#B1B1D9" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M11.666 9.16797V14.168" stroke="#B1B1D9" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        :
                        <div className='wkit-apiKey-nokey'>
                            <img src={img_path + "assets/images/jpg/noKey.png"} alt='nokey image' draggable={false} />
                            <span>{__("No licence keys found. Add your WDesignKit, The Plus Addons, UiChemy or other keys to activate and get benefits of pro version.")} <a className='wkit-link-hover-effect' href={wdkitData.WDKIT_DOC_URL + 'documents/how-to-get-key-for-wdesignkit-activation/'} target='_blank' rel="noopener noreferrer">{__("How to get a key?")}</a></span>
                        </div>
                    }
                </div>
            </div>
            <PopupContent
                OpenPopup={OpenPopup}
                heading={'Please Confirm'}
                closePopup={() => setOpenPopup(false)}
                body={() => DeletePopup()}
            />
        </div >
    )
}

export default Activate;