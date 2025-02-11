import { useState, useEffect, useRef } from 'react';
import './onboarding.scss';
import { WkitLoader, wdKit_Form_data } from '../../helper/helper-function';
import { __ } from '@wordpress/i18n';


const { Fragment } = wp.element;

const Onboarding = (props) => {
    var ImgPath = wdkitData.WDKIT_ASSETS;


    const [popupType, setpopupType] = useState('1');
    const [actplugin, setactplugin] = useState({ 'elementor': 'loading', 'the-plus-addons-for-block-editor': 'loading', 'bricks': 'loading', 'bricks-child': 'loading' });
    const pluginInstaller = useRef([]);
    const pluginStatus = useRef({});
    const [main_loading, setmain_loading] = useState(true);
    const [loader, setLoader] = useState(false);
    const [terms_check, setterms_check] = useState(true);

    const plugin_detail = [
        {
            'name': 'elementor',
            'label': 'Elementor',
            'plugin_slug': 'elementor/elementor.php',
            'freepro': '0',
            'icon': 'images/wb-svg/elementor.svg',
            'type': 'plugin',
            'status': 'elementorplg'
        },
        {
            'name': 'the-plus-addons-for-block-editor',
            'label': 'Nexter Blocks',
            'plugin_slug': 'the-plus-addons-for-block-editor/the-plus-addons-for-block-editor.php',
            'freepro': '0',
            'icon': 'images/jpg/nexter-blocks-logo.png',
            'type': 'plugin',
            'status': 'tpagplg'
        },
        {
            'name': 'bricks',
            'label': 'Bricks Theme',
            'plugin_slug': 'bricks/bricks.php',
            'link': 'https://academy.bricksbuilder.io/article/installation-activation/',
            'freepro': '1',
            'icon': 'images/wb-svg/bricks.svg',
            'type': 'theme',
            'status': 'bricksplg'
        },
        {
            'name': 'bricks-child',
            'label': 'Bricks Child Theme',
            'plugin_slug': 'bricks/bricks.php',
            'link': 'https://academy.bricksbuilder.io/article/installation-activation/',
            'freepro': '1',
            'icon': 'images/wb-svg/bricks.svg',
            'type': 'theme',
            'status': 'brickschildplg'
        }
    ]

    const Check_installed_plugin = () => {
        var new_obj = Object.assign({}, actplugin)

        let form_arr = {
            'type': 'check_plugins_depends',
            'plugins': JSON.stringify(plugin_detail),
            'editor': wdkitData.use_editor
        }

        wdKit_Form_data(form_arr).then(async (res) => {
            if (res.success) {
                let plugin_detail = res?.data?.plugins;

                plugin_detail?.length > 0 && plugin_detail.map((data) => {
                    if (new_obj[data.name]) {
                        new_obj = Object.assign({}, new_obj, { [data.name]: data.status })
                    }
                })

            }
            setactplugin(new_obj);
            pluginStatus.current = new_obj;
        })
    }

    useEffect(() => {
        Check_installed_plugin();
    }, []);

    useEffect(() => {
        const allTrue = Object.values(actplugin).every(value => value !== 'loading');
        if (props.wdkit_meta.success != undefined && allTrue) {
            setmain_loading(false);
        }
    }, [props.wdkit_meta.success, actplugin])

    const Elementor_install = async (data, type) => {
        pluginStatus.current = Object.assign({}, pluginStatus.current, { [data.name]: 'loading' });
        setactplugin(pluginStatus.current);

        let loader_array = pluginInstaller.current.filter((p_data) => p_data.status == 'loading')

        if (loader_array.length > 0) {
            pluginInstaller.current.push({ 'status': 'pending', 'data': data, 'type': type })
        } else {
            pluginInstaller.current.push({ 'status': 'loading', 'data': data, 'type': type })
            await Install_plugin(data, type).then(async (res) => {
                if (undefined != res && pluginInstaller.current.length > 0) {
                    let index = pluginInstaller.current.findIndex((id) => id.status == 'loading');
                    await pluginInstaller.current.splice(index, 1)

                    if (pluginInstaller.current.length > 0) {
                        let next_data = pluginInstaller.current[0].data;
                        let next_type = pluginInstaller.current[0].type;

                        await pluginInstaller.current.splice(0, 1)
                        await Elementor_install(next_data, next_type);
                    }
                }
            })
        }


    }

    const Install_plugin = async (data, type) => {
        let obj = {
            freepro: data.freepro,
            original_slug: data.name,
            plugin_slug: data.plugin_slug,
            status: "inactive",
            type: data.type,
        }

        let form_arr = {
            'type': 'install_plugins_depends',
            'plugins': JSON.stringify(obj),
            'editor': wdkitData.use_editor
        }

        let res = await wdKit_Form_data(form_arr);
        if (res.success === undefined) {
            if (type == undefined) {
                Elementor_install(data, "repeate")
            }
            return false;
        }
        if (res.success) {
            let old_data = Object.assign({}, pluginStatus.current, { [data.name]: res.status })

            pluginStatus.current = old_data;
            setactplugin(pluginStatus.current);
            props.wdkit_set_toast([res?.message, res?.description, '', 'success']);
        } else {
            let old_data = Object.assign({}, pluginStatus.current, { [data.name]: 'unavailable' })

            pluginStatus.current = old_data;
            setactplugin(pluginStatus.current);
            props.wdkit_set_toast([res?.message, res?.description, '', 'danger']);
        }

        return true
    }

    const Both_Activated = () => {
        return (
            <div className='wdkit-onboarding-popup-body' style={main_loading ? { height: '100%' } : {}}>
                <div className='wdkit-onboarding-image'>
                    <img
                        src={ImgPath + "images/onbording/ifboth_activated.png"}
                        alt="onboarding-image"
                        draggable="false"
                    />
                </div>
                {
                    main_loading ?
                        <div className="wkit-loader">
                            <img src={ImgPath + "images/jpg/wdkit_loader.gif"} draggable="false" />
                        </div>
                        :
                        <div className='wdkit-onboarding-box'>
                            <div className='wdkit-onboarding-header'>
                                <span>{__('Welcome to WDesignKit', 'wdesignkit')}</span>
                            </div>
                            <div className="wdkit-onboarding-box-content">
                                <div className="wdkit-select-pageBuilder">
                                    <div className="wdkit-select-pageBuilder-header">
                                        <span>{__('Page Templates', 'wdesignkit')}</span>
                                        <div className='wkit-switch-setting-wrap'>
                                            <label className="wkit-switch">
                                                <input type="checkbox" onChange={(e) => { HandleChange(e, 'template') }} checked={props.wdkit_meta.Setting?.template} />
                                                <span className="wkit-slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='wdkit-select-pageBuilder-body' style={{ opacity: props.wdkit_meta.Setting?.template ? 1 : 0.2 }}>
                                        <div className="wdkit-select-pageBuilder-content">
                                            <div className='wdkit-pageBuilder-meta'>
                                                <img src={ImgPath + "images/wb-svg/elementor.svg"} alt="Elementor" draggable="false" />
                                                <span>{__('Elementor', 'wdesignkit')}</span>
                                            </div>
                                            <label className='wdkit-select-builder-checkbox' htmlFor='wkit-pageTemplate-elementor'>
                                                <input type="checkbox" id='wkit-pageTemplate-elementor' onChange={(e) => HandleChange(e, 'elementor_template', 'template')} checked={props.wdkit_meta.Setting?.elementor_template} />
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 17" fill="#999999">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.99922 16.2992C5.93053 16.2992 3.94657 15.4774 2.48379 14.0147C1.021 12.5519 0.199219 10.5679 0.199219 8.49922C0.199219 6.43053 1.021 4.44657 2.48379 2.98379C3.94657 1.521 5.93053 0.699219 7.99922 0.699219C10.0679 0.699219 12.0519 1.521 13.5147 2.98379C14.9774 4.44657 15.7992 6.43053 15.7992 8.49922C15.7992 10.5679 14.9774 12.5519 13.5147 14.0147C12.0519 15.4774 10.0679 16.2992 7.99922 16.2992ZM11.558 5.71364L6.93647 10.2542L4.44047 7.80307C4.34773 7.71471 4.22395 7.66641 4.09588 7.66859C3.96781 7.67077 3.84575 7.72327 3.75608 7.81473C3.66641 7.9062 3.61634 8.02928 3.61669 8.15736C3.61705 8.28545 3.6678 8.40825 3.75797 8.49922L6.59424 11.2848C6.68537 11.3741 6.80789 11.4241 6.93549 11.4241C7.0631 11.4241 7.18562 11.3741 7.27674 11.2848L12.2405 6.40979C12.2872 6.36523 12.3247 6.31181 12.3506 6.25265C12.3766 6.19348 12.3905 6.12975 12.3916 6.06515C12.3927 6.00056 12.381 5.93639 12.3571 5.87637C12.3331 5.81636 12.2975 5.76169 12.2523 5.71556C12.2071 5.66943 12.1531 5.63274 12.0936 5.60764C12.0341 5.58254 11.9701 5.56952 11.9055 5.56935C11.8409 5.56917 11.7769 5.58183 11.7173 5.6066C11.6576 5.63138 11.6035 5.66776 11.558 5.71364Z" />
                                                </svg>
                                            </label>
                                        </div>
                                        <hr />
                                        <div className="wdkit-select-pageBuilder-content">
                                            <div className='wdkit-pageBuilder-meta'>
                                                <img src={ImgPath + "images/wb-svg/gutenberg.svg"} alt="Gutenberg" draggable="false" />
                                                <span>{__('Gutenberg', 'wdesignkit')}</span>
                                            </div>
                                            <label className='wdkit-select-builder-checkbox' htmlFor='wkit-pageTemplate-gutenberg'>
                                                <input type="checkbox" id='wkit-pageTemplate-gutenberg' onChange={(e) => HandleChange(e, 'gutenberg_template', 'template')} checked={props.wdkit_meta.Setting?.gutenberg_template} />
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 17" fill="#999999">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.99922 16.2992C5.93053 16.2992 3.94657 15.4774 2.48379 14.0147C1.021 12.5519 0.199219 10.5679 0.199219 8.49922C0.199219 6.43053 1.021 4.44657 2.48379 2.98379C3.94657 1.521 5.93053 0.699219 7.99922 0.699219C10.0679 0.699219 12.0519 1.521 13.5147 2.98379C14.9774 4.44657 15.7992 6.43053 15.7992 8.49922C15.7992 10.5679 14.9774 12.5519 13.5147 14.0147C12.0519 15.4774 10.0679 16.2992 7.99922 16.2992ZM11.558 5.71364L6.93647 10.2542L4.44047 7.80307C4.34773 7.71471 4.22395 7.66641 4.09588 7.66859C3.96781 7.67077 3.84575 7.72327 3.75608 7.81473C3.66641 7.9062 3.61634 8.02928 3.61669 8.15736C3.61705 8.28545 3.6678 8.40825 3.75797 8.49922L6.59424 11.2848C6.68537 11.3741 6.80789 11.4241 6.93549 11.4241C7.0631 11.4241 7.18562 11.3741 7.27674 11.2848L12.2405 6.40979C12.2872 6.36523 12.3247 6.31181 12.3506 6.25265C12.3766 6.19348 12.3905 6.12975 12.3916 6.06515C12.3927 6.00056 12.381 5.93639 12.3571 5.87637C12.3331 5.81636 12.2975 5.76169 12.2523 5.71556C12.2071 5.66943 12.1531 5.63274 12.0936 5.60764C12.0341 5.58254 11.9701 5.56952 11.9055 5.56935C11.8409 5.56917 11.7769 5.58183 11.7173 5.6066C11.6576 5.63138 11.6035 5.66776 11.558 5.71364Z" />
                                                </svg>
                                            </label>
                                        </div>
                                        <hr />
                                        <div className="wdkit-select-pageBuilder-content">
                                            <div className='wdkit-pageBuilder-meta'>
                                                <img src={ImgPath + "images/wb-svg/bricks.svg"} alt="Bricks" draggable="false" style={{ height: '30px', width: '30px' }} />
                                                <span>{__('Bricks', 'wdesignkit')}</span>
                                            </div>
                                            <label className='wdkit-select-builder-checkbox' htmlFor='wkit-pageTemplate-bricks'>
                                                <span className='wkit-commign-soon-tag'>{__('Coming Soon', 'wdesignkit')}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="wdkit-select-pageBuilder">
                                    <div className="wdkit-select-pageBuilder-header">
                                        <span>{__('Widget Builder', 'wdesignkit')}</span>
                                        <div className='wkit-switch-setting-wrap'>
                                            <label className="wkit-switch">
                                                <input type="checkbox" onChange={(e) => { HandleChange(e, 'builder') }} checked={props.wdkit_meta.Setting?.builder} />
                                                <span className="wkit-slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='wdkit-select-pageBuilder-body' style={{ opacity: props.wdkit_meta.Setting?.builder ? 1 : 0.2 }}>
                                        <div className="wdkit-select-pageBuilder-content">
                                            <div className='wdkit-pageBuilder-meta'>
                                                <img src={ImgPath + "images/wb-svg/elementor.svg"} alt="Elementor" draggable="false" />
                                                <span>{__('Elementor', 'wdesignkit')}</span>
                                            </div>
                                            <label className='wdkit-select-builder-checkbox' htmlFor='wkit-widgetBuilder-elementor'>
                                                <input type="checkbox" id='wkit-widgetBuilder-elementor' onChange={(e) => { HandleChange(e, 'elementor_builder', 'builder') }} checked={props.wdkit_meta.Setting?.elementor_builder} />
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 17" fill="#999999">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.99922 16.2992C5.93053 16.2992 3.94657 15.4774 2.48379 14.0147C1.021 12.5519 0.199219 10.5679 0.199219 8.49922C0.199219 6.43053 1.021 4.44657 2.48379 2.98379C3.94657 1.521 5.93053 0.699219 7.99922 0.699219C10.0679 0.699219 12.0519 1.521 13.5147 2.98379C14.9774 4.44657 15.7992 6.43053 15.7992 8.49922C15.7992 10.5679 14.9774 12.5519 13.5147 14.0147C12.0519 15.4774 10.0679 16.2992 7.99922 16.2992ZM11.558 5.71364L6.93647 10.2542L4.44047 7.80307C4.34773 7.71471 4.22395 7.66641 4.09588 7.66859C3.96781 7.67077 3.84575 7.72327 3.75608 7.81473C3.66641 7.9062 3.61634 8.02928 3.61669 8.15736C3.61705 8.28545 3.6678 8.40825 3.75797 8.49922L6.59424 11.2848C6.68537 11.3741 6.80789 11.4241 6.93549 11.4241C7.0631 11.4241 7.18562 11.3741 7.27674 11.2848L12.2405 6.40979C12.2872 6.36523 12.3247 6.31181 12.3506 6.25265C12.3766 6.19348 12.3905 6.12975 12.3916 6.06515C12.3927 6.00056 12.381 5.93639 12.3571 5.87637C12.3331 5.81636 12.2975 5.76169 12.2523 5.71556C12.2071 5.66943 12.1531 5.63274 12.0936 5.60764C12.0341 5.58254 11.9701 5.56952 11.9055 5.56935C11.8409 5.56917 11.7769 5.58183 11.7173 5.6066C11.6576 5.63138 11.6035 5.66776 11.558 5.71364Z" />
                                                </svg>
                                            </label>
                                        </div>
                                        <hr />
                                        <div className="wdkit-select-pageBuilder-content">
                                            <div className='wdkit-pageBuilder-meta'>
                                                <img src={ImgPath + "images/wb-svg/gutenberg.svg"} alt="Gutenberg" draggable="false" />
                                                <span>{__('Gutenberg', 'wdesignkit')}</span>
                                            </div>
                                            <label className='wdkit-select-builder-checkbox' htmlFor='wkit-widgetBuilder-gutenberg'>
                                                <input type="checkbox" id='wkit-widgetBuilder-gutenberg' onChange={(e) => { HandleChange(e, 'gutenberg_builder', 'builder') }} checked={props.wdkit_meta.Setting?.gutenberg_builder} />
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 17" fill="#999999">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.99922 16.2992C5.93053 16.2992 3.94657 15.4774 2.48379 14.0147C1.021 12.5519 0.199219 10.5679 0.199219 8.49922C0.199219 6.43053 1.021 4.44657 2.48379 2.98379C3.94657 1.521 5.93053 0.699219 7.99922 0.699219C10.0679 0.699219 12.0519 1.521 13.5147 2.98379C14.9774 4.44657 15.7992 6.43053 15.7992 8.49922C15.7992 10.5679 14.9774 12.5519 13.5147 14.0147C12.0519 15.4774 10.0679 16.2992 7.99922 16.2992ZM11.558 5.71364L6.93647 10.2542L4.44047 7.80307C4.34773 7.71471 4.22395 7.66641 4.09588 7.66859C3.96781 7.67077 3.84575 7.72327 3.75608 7.81473C3.66641 7.9062 3.61634 8.02928 3.61669 8.15736C3.61705 8.28545 3.6678 8.40825 3.75797 8.49922L6.59424 11.2848C6.68537 11.3741 6.80789 11.4241 6.93549 11.4241C7.0631 11.4241 7.18562 11.3741 7.27674 11.2848L12.2405 6.40979C12.2872 6.36523 12.3247 6.31181 12.3506 6.25265C12.3766 6.19348 12.3905 6.12975 12.3916 6.06515C12.3927 6.00056 12.381 5.93639 12.3571 5.87637C12.3331 5.81636 12.2975 5.76169 12.2523 5.71556C12.2071 5.66943 12.1531 5.63274 12.0936 5.60764C12.0341 5.58254 11.9701 5.56952 11.9055 5.56935C11.8409 5.56917 11.7769 5.58183 11.7173 5.6066C11.6576 5.63138 11.6035 5.66776 11.558 5.71364Z" />
                                                </svg>
                                            </label>
                                        </div>
                                        <hr />
                                        <div className="wdkit-select-pageBuilder-content">
                                            <div className='wdkit-pageBuilder-meta'>
                                                <img src={ImgPath + "images/wb-svg/bricks.svg"} alt="Bricks" draggable="false" style={{ height: '30px', width: '30px' }} />
                                                <span>{__('Bricks', 'wdesignkit')}</span>
                                            </div>
                                            <label className='wdkit-select-builder-checkbox' htmlFor='wkit-widgetBuilder-bricks'>
                                                <input type="checkbox" id='wkit-widgetBuilder-bricks' onChange={(e) => { HandleChange(e, 'bricks_builder', 'builder') }} checked={props.wdkit_meta.Setting?.bricks_builder} />
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 17" fill="#999999"><path fillRule="evenodd" clipRule="evenodd" d="M7.99922 16.2992C5.93053 16.2992 3.94657 15.4774 2.48379 14.0147C1.021 12.5519 0.199219 10.5679 0.199219 8.49922C0.199219 6.43053 1.021 4.44657 2.48379 2.98379C3.94657 1.521 5.93053 0.699219 7.99922 0.699219C10.0679 0.699219 12.0519 1.521 13.5147 2.98379C14.9774 4.44657 15.7992 6.43053 15.7992 8.49922C15.7992 10.5679 14.9774 12.5519 13.5147 14.0147C12.0519 15.4774 10.0679 16.2992 7.99922 16.2992ZM11.558 5.71364L6.93647 10.2542L4.44047 7.80307C4.34773 7.71471 4.22395 7.66641 4.09588 7.66859C3.96781 7.67077 3.84575 7.72327 3.75608 7.81473C3.66641 7.9062 3.61634 8.02928 3.61669 8.15736C3.61705 8.28545 3.6678 8.40825 3.75797 8.49922L6.59424 11.2848C6.68537 11.3741 6.80789 11.4241 6.93549 11.4241C7.0631 11.4241 7.18562 11.3741 7.27674 11.2848L12.2405 6.40979C12.2872 6.36523 12.3247 6.31181 12.3506 6.25265C12.3766 6.19348 12.3905 6.12975 12.3916 6.06515C12.3927 6.00056 12.381 5.93639 12.3571 5.87637C12.3331 5.81636 12.2975 5.76169 12.2523 5.71556C12.2071 5.66943 12.1531 5.63274 12.0936 5.60764C12.0341 5.58254 11.9701 5.56952 11.9055 5.56935C11.8409 5.56917 11.7769 5.58183 11.7173 5.6066C11.6576 5.63138 11.6035 5.66776 11.558 5.71364Z" /></svg>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div >
        );
    }

    const Basic_Requirements = () => {
        return (
            <div className='wdkit-onboarding-popup-body'>
                <div className='wdkit-onboarding-image'>
                    <div className='wkit-onboarding-bg-image'>
                        <div className='wdkit-onboarding-image-content'>
                            <img
                                src={ImgPath + "images/onbording/basic_requirements.png"}
                                alt="Onboarding-Image"
                                draggable="false"
                            />
                        </div>
                        {actplugin?.bricks == 'active' && props?.wdkit_meta?.Setting?.bricks_builder &&
                            <div className='wkit-inner-image-content wkit-inner-bricks'>
                                <svg className='wkit-image-content-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.7074 21.4147C16.6209 21.4147 21.4147 16.6209 21.4147 10.7074C21.4147 4.79385 16.6209 0 10.7074 0C4.79385 0 0 4.79385 0 10.7074C0 16.6209 4.79385 21.4147 10.7074 21.4147ZM10.598 8.84798C10.2221 9.04794 9.92616 9.30789 9.7102 9.62783V6.42444H8.03052V15.3027H9.7102V14.3549C9.93415 14.6669 10.2301 14.9228 10.598 15.1228C10.974 15.3147 11.4099 15.4107 11.9058 15.4107C12.4737 15.4107 12.9856 15.2668 13.4415 14.9788C13.9054 14.6909 14.2693 14.2869 14.5333 13.767C14.8052 13.2391 14.9412 12.6353 14.9412 11.9554C14.9412 11.2755 14.8052 10.6796 14.5333 10.1677C14.2693 9.64782 13.9054 9.2479 13.4415 8.96795C12.9856 8.68801 12.4737 8.54803 11.9058 8.54803C11.4179 8.54803 10.982 8.64802 10.598 8.84798ZM12.9736 10.9236C13.1415 11.2115 13.2255 11.5555 13.2255 11.9554C13.2255 12.3633 13.1415 12.7152 12.9736 13.0112C12.8136 13.3071 12.5976 13.5351 12.3257 13.6951C12.0617 13.855 11.7738 13.935 11.4619 13.935C11.1579 13.935 10.87 13.859 10.598 13.7071C10.3341 13.5471 10.1181 13.3191 9.95015 13.0232C9.79018 12.7272 9.7102 12.3793 9.7102 11.9794C9.7102 11.5795 9.79018 11.2315 9.95015 10.9356C10.1181 10.6396 10.3341 10.4157 10.598 10.2637C10.87 10.1037 11.1579 10.0238 11.4619 10.0238C11.7738 10.0238 12.0617 10.0997 12.3257 10.2517C12.5976 10.4037 12.8136 10.6276 12.9736 10.9236Z" fill="black" />
                                </svg>
                                <span>{__('Bricks Elements Builder', 'wdesignkit')}</span>
                            </div>
                        }
                        {actplugin?.elementor == 'active' &&
                            <div className='wkit-inner-image-content wkit-inner-elementor'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                    <path d="M14.0541 0C6.29146 0 0 6.29143 0 14.054C0 21.8141 6.29146 28.1081 14.0541 28.1081C21.8167 28.1081 28.1081 21.8165 28.1081 14.054C28.1057 6.29143 21.8142 0 14.0541 0ZM10.5412 19.9078H8.20013V8.19752H10.5412V19.9078ZM19.908 19.9078H12.8823V17.5669H19.908V19.9078ZM19.908 15.2232H12.8823V12.8822H19.908V15.2232ZM19.908 10.5386H12.8823V8.19752H19.908V10.5386Z" fill="white" />
                                </svg>
                                <span>{__('Elementor Widget Builder', 'wdesignkit')}</span>
                            </div>
                        }
                        {actplugin?.['the-plus-addons-for-block-editor'] == 'active' && props?.wdkit_meta?.Setting?.gutenberg_builder &&
                            <div className='wkit-inner-image-content wkit-inner-gutenberg'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.98499 19.97C15.4996 19.97 19.97 15.4995 19.97 9.98499C19.97 4.47046 15.4996 0 9.98499 0C4.47046 0 0 4.47046 0 9.98499C0 15.4995 4.47046 19.97 9.98499 19.97ZM6.01361 10.0663C5.90125 7.36377 6.47913 5.95776 7.98822 5.30176C9.57758 4.59875 11.7609 5.17676 12.403 6.48889C12.676 7.03564 12.7081 7.23877 12.5635 7.48865C12.2585 8.05103 11.9374 7.86365 11.5843 6.95764C11.1669 5.81726 9.36884 5.39551 8.21295 6.14526C7.26581 6.75452 7.02496 7.45752 7.02496 9.69128C7.02496 11.3784 7.07312 11.722 7.36212 12.1907C7.84375 13.0031 8.61432 13.4404 9.54541 13.4404C11.0706 13.4404 11.7609 12.7062 11.7609 11.0504C11.7609 10.5818 11.7127 10.1755 11.6646 10.113C11.4719 9.92566 10.621 10.3787 10.1715 10.8942C9.85046 11.269 9.60968 11.4253 9.4491 11.3628C9.06384 11.2065 9.1441 10.8473 9.68994 10.238C10.1876 9.69128 10.5087 9.56628 12.2906 9.22266C12.9167 9.09766 13.3984 8.87903 13.7515 8.58215C14.3776 8.05103 14.8111 7.98865 14.8111 8.42603C14.8111 8.8009 13.7836 9.64441 13.1896 9.76941C12.7723 9.86316 12.7562 9.91003 12.692 11.144C12.6439 11.9095 12.5154 12.6282 12.3549 12.9249C11.9695 13.6436 11.1187 14.0966 9.93073 14.1747C8.26111 14.3152 7.12134 13.7528 6.43097 12.4407C6.15808 11.9408 6.07782 11.4409 6.01361 10.0663Z" fill="white" />
                                </svg>
                                <span>{__('Gutenberg Blocks Builder', 'wdesignkit')}</span>
                            </div>
                        }
                    </div>
                </div>
                <div className='wdkit-onboarding-box' >
                    <div className='wdkit-onboarding-header'>
                        <span>{__('Basic Requirements', 'wdesignkit')}</span>
                    </div>
                    <div className="wdkit-onboarding-basic">
                        {plugin_detail.filter((plugin) => {
                            if ('bricks' === plugin.name && props?.wdkit_meta?.Setting?.bricks_builder) {
                                return plugin;
                            } else if ('bricks-child' === plugin.name && props?.wdkit_meta?.Setting?.bricks_builder && actplugin?.[plugin.name] != 'manually') {
                                return plugin;
                            } else if ("the-plus-addons-for-block-editor" === plugin.name && (props?.wdkit_meta?.Setting?.gutenberg_builder || props?.wdkit_meta?.Setting?.gutenberg_template)) {
                                return plugin;
                            } else if ("elementor" === plugin.name && (props?.wdkit_meta?.Setting?.elementor_builder || props?.wdkit_meta?.Setting?.elementor_template)) {
                                return plugin;
                            }
                        }).map((plugin, index) => {
                            return (
                                <div className='wdkit-onboarding-basic-content' key={index}>
                                    <div className={`wdkit-onboarding-basic-content-status wkit-${actplugin?.[plugin.name]}-plugin`}>
                                        {actplugin?.[plugin.name] == 'active' ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <path d="M8.33335 2.5L3.75002 7.08333L1.66669 5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="white" >
                                                <path fillRule="evenodd" clipRule="evenodd" d="M5 1.33337C2.97496 1.33337 1.33334 2.975 1.33334 5.00004C1.33334 7.02508 2.97496 8.66671 5 8.66671C7.02505 8.66671 8.66667 7.02508 8.66667 5.00004C8.66667 2.975 7.02505 1.33337 5 1.33337ZM0.333336 5.00004C0.333336 2.42271 2.42267 0.333374 5 0.333374C7.57733 0.333374 9.66667 2.42271 9.66667 5.00004C9.66667 7.57737 7.57733 9.66671 5 9.66671C2.42267 9.66671 0.333336 7.57737 0.333336 5.00004ZM5 2.83337C5.27614 2.83337 5.5 3.05723 5.5 3.33337V5.00004C5.5 5.27618 5.27614 5.50004 5 5.50004C4.72386 5.50004 4.5 5.27618 4.5 5.00004V3.33337C4.5 3.05723 4.72386 2.83337 5 2.83337ZM5 6.16663C4.72386 6.16663 4.5 6.39048 4.5 6.66663C4.5 6.94277 4.72386 7.16663 5 7.16663H5.00417C5.28031 7.16663 5.50417 6.94277 5.50417 6.66663C5.50417 6.39048 5.28031 6.16663 5.00417 6.16663H5Z" />
                                            </svg>
                                        }
                                        <span>{actplugin?.[plugin.name] == 'manually' ? 'unavailable' : actplugin?.[plugin.name]}</span>
                                    </div>
                                    <div className='wdkit-onboarding-basic-content-body'>
                                        <div className='wdkit-onboarding-basic-content-header'>
                                            <span>{plugin.label}</span>
                                            <img src={ImgPath + plugin.icon} alt="Elementor" draggable="false" />
                                        </div>
                                        {actplugin?.[plugin.name] == 'active' &&
                                            <div className='wdkit-onboarding-basic-content-installed'>
                                                <span>Activated</span>
                                            </div>
                                        }
                                        {(actplugin?.[plugin.name] == 'inactive' || actplugin?.[plugin.name] == 'unavailable' || actplugin?.[plugin.name] == 'loading') &&
                                            <>
                                                {actplugin?.[plugin.name] == 'loading' ?
                                                    <div className='wdkit-onboarding-basic-content-notInstalled'>
                                                        <WkitLoader />
                                                    </div>
                                                    :
                                                    <div className='wdkit-onboarding-basic-content-notInstalled' onClick={() => { Elementor_install(plugin) }}>
                                                        <span>{actplugin?.[plugin.name] == 'inactive' ? __('Activate Now', 'wdesignkit') : __('Install & Activate', 'wdesignkit')}</span>
                                                    </div>
                                                }

                                            </>
                                        }
                                        {actplugin?.[plugin.name] == 'manually' &&
                                            <div className='wdkit-onboarding-install-manually'>
                                                <a href={plugin.link} className='wkit-redirect-link ' target='_blank' rel="noopener noreferrer">
                                                    <span>{__('How to Install ?', 'wdesignkit')}</span>
                                                </a>
                                            </div>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    const Check_All_Features = () => {
        return (
            <div className='wdkit-onboarding-popup-body'>
                <div className='wdkit-onboarding-image'>
                    <img
                        src={ImgPath + "images/onbording/check-our-all-features.png"}
                        alt="Onboarding-Image"
                        draggable="false"
                    />
                </div>
                <div className='wdkit-onboarding-box'>
                    <div className='wdkit-onboarding-header'>
                        <span>{__('Packed with Everything You Need for Exceptional Websites', 'wdesignkit')}</span>
                    </div>
                    <div className="wdkit-onboarding-allfeatures">
                        <a href='https://wdesignkit.com/browse/template' target='_blank' rel="noopener noreferrer" className="wdkit-onboarding-boxallfeatures">
                            <div className="wdkit-onboarding-allfeatures-svg">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9 11.0385C9 9.8512 9.96253 8.88867 11.1499 8.88867H21.0723C22.2597 8.88867 23.2222 9.8512 23.2222 11.0385V13.1057V20.961C23.2222 22.1483 22.2597 23.1108 21.0723 23.1108H11.1499C9.96253 23.1108 9 22.1483 9 20.961V13.1057V11.0385ZM11.1499 9.88091C10.5105 9.88091 9.99225 10.3992 9.99225 11.0385V12.6096H22.23V11.0385C22.23 10.3992 21.7117 9.88091 21.0723 9.88091H11.1499ZM22.23 13.6018H9.99225V20.961C9.99225 21.6003 10.5105 22.1186 11.1499 22.1186H21.0723C21.7117 22.1186 22.23 21.6003 22.23 20.961V13.6018ZM10.6537 15.9997C10.6537 15.7257 10.8759 15.5036 11.1499 15.5036H21.0723C21.3463 15.5036 21.5685 15.7257 21.5685 15.9997C21.5685 16.2737 21.3463 16.4959 21.0723 16.4959H11.1499C10.8759 16.4959 10.6537 16.2737 10.6537 15.9997ZM11.1558 11.4492C11.1558 11.2209 11.3409 11.0358 11.5693 11.0358C11.7976 11.0358 11.9827 11.2209 11.9827 11.4492C11.9827 11.6776 11.7976 11.8627 11.5693 11.8627C11.3409 11.8627 11.1558 11.6776 11.1558 11.4492ZM13.222 11.0358C12.9937 11.0358 12.8086 11.2209 12.8086 11.4492C12.8086 11.6776 12.9937 11.8627 13.222 11.8627C13.4504 11.8627 13.6355 11.6776 13.6355 11.4492C13.6355 11.2209 13.4504 11.0358 13.222 11.0358ZM11.6726 17.8604C11.3872 17.8604 11.1558 18.0918 11.1558 18.3772V19.4108C11.1558 19.6963 11.3872 19.9276 11.6726 19.9276H12.7062C12.9916 19.9276 13.223 19.6963 13.223 19.4108V18.3772C13.223 18.0918 12.9916 17.8604 12.7062 17.8604H11.6726ZM15.5831 17.8604C15.2976 17.8604 15.0663 18.0918 15.0663 18.3772V19.4108C15.0663 19.6963 15.2976 19.9276 15.5831 19.9276H16.6166C16.9021 19.9276 17.1334 19.6963 17.1334 19.4108V18.3772C17.1334 18.0918 16.9021 17.8604 16.6166 17.8604H15.5831ZM19.0111 18.3772C19.0111 18.0918 19.2425 17.8604 19.5279 17.8604H20.5615C20.8469 17.8604 21.0783 18.0918 21.0783 18.3772V19.4108C21.0783 19.6963 20.8469 19.9276 20.5615 19.9276H19.5279C19.2425 19.9276 19.0111 19.6963 19.0111 19.4108V18.3772ZM14.8766 11.0358C14.6482 11.0358 14.4631 11.2209 14.4631 11.4492C14.4631 11.6776 14.6482 11.8627 14.8766 11.8627C15.1049 11.8627 15.29 11.6776 15.29 11.4492C15.29 11.2209 15.1049 11.0358 14.8766 11.0358Z" fill="white" />
                                </svg>
                            </div>
                            <div className='wdkit-onboarding-allfeatures-name'>
                                <span>{__('Browse Our Templates', 'wdesignkit')}</span>
                                <span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.91675 5L12.9167 10L7.91675 15" stroke="#040483" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                        </a>
                        <a href='https://wdesignkit.com/browse/widget' target='_blank' rel="noopener noreferrer" className="wdkit-onboarding-boxallfeatures">
                            <div className="wdkit-onboarding-allfeatures-svg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="#040483">
                                    <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z" fill="#040483" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9 11.6666C9 10.1939 10.1939 9 11.6667 9C13.1394 9 14.3334 10.1939 14.3334 11.6666C14.3334 12.2475 14.1477 12.7849 13.8324 13.2229L14.8048 14.1952C15.0651 14.4556 15.0651 14.8777 14.8048 15.1381C14.5444 15.3984 14.1223 15.3984 13.8619 15.1381L12.8035 14.0796C12.4586 14.2423 12.0733 14.3333 11.6667 14.3333C10.1939 14.3333 9 13.1394 9 11.6666ZM11.6667 13C12.4031 13 13 12.403 13 11.6666C13 10.9303 12.4031 10.3333 11.6667 10.3333C10.9303 10.3333 10.3334 10.9303 10.3334 11.6666C10.3334 12.403 10.9303 13 11.6667 13ZM17 9.66662C17 9.29848 17.2985 9 17.6667 9H21.6667C22.0349 9 22.3334 9.29848 22.3334 9.66662V13.6666C22.3334 14.0348 22.0349 14.3333 21.6667 14.3333H17.6667C17.2985 14.3333 17 14.0348 17 13.6666V9.66662ZM18.3334 10.3333V13H21V10.3333H18.3334ZM9 17.6666C9 17.2985 9.29847 17 9.66668 17H13.6667C14.0349 17 14.3334 17.2985 14.3334 17.6666V21.6666C14.3334 22.0348 14.0349 22.3333 13.6667 22.3333H9.66668C9.29847 22.3333 9 22.0348 9 21.6666V17.6666ZM10.3334 18.3333V21H13V18.3333H10.3334ZM17 17.6666C17 17.2985 17.2985 17 17.6667 17H21.6667C22.0349 17 22.3334 17.2985 22.3334 17.6666V21.6666C22.3334 22.0348 22.0349 22.3333 21.6667 22.3333H17.6667C17.2985 22.3333 17 22.0348 17 21.6666V17.6666ZM18.3334 18.3333V21H21V18.3333H18.3334Z" fill="white" />
                                </svg>
                            </div>
                            <div className='wdkit-onboarding-allfeatures-name'>
                                <span>{__('Widget Library', 'wdesignkit')}</span>
                                <span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.91675 5L12.9167 10L7.91675 15" stroke="#040483" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                        </a>
                        <a href='https://wdesignkit.com/browse/figma' target='_blank' rel="noopener noreferrer" className="wdkit-onboarding-boxallfeatures">
                            <div className="wdkit-onboarding-allfeatures-svg">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.5675 13.9873H15.5088V8H18.5675C20.2182 8 21.5608 9.34267 21.5608 10.9933C21.5608 12.644 20.2182 13.9873 18.5675 13.9873ZM16.4895 13.0067H18.5675C19.6775 13.0067 20.5802 12.1033 20.5802 10.994C20.5802 9.88467 19.6768 8.98133 18.5675 8.98133H16.4895V13.0067ZM16.4895 13.9873H13.4315C11.7808 13.9873 10.4382 12.6447 10.4382 10.994C10.4382 9.34333 11.7808 8 13.4315 8H16.4902L16.4895 13.9873ZM13.4315 8.98067C12.3215 8.98067 11.4188 9.884 11.4188 10.9933C11.4188 12.1027 12.3215 13.0067 13.4315 13.0067H15.5095V8.98067H13.4315ZM16.4895 18.9933H13.4315C11.7808 18.9933 10.4382 17.6507 10.4382 16C10.4382 14.3493 11.7808 13.0067 13.4315 13.0067H16.4895V18.9933ZM13.4315 13.9873C12.3215 13.9873 11.4188 14.8907 11.4188 16C11.4188 17.1093 12.3222 18.0127 13.4315 18.0127H15.5095L15.5088 13.9873H13.4315ZM13.4475 24C11.7882 24 10.4375 22.6573 10.4375 21.0067C10.4375 19.356 11.7809 18.0127 13.4315 18.0127L16.4895 18.0133V20.974C16.4895 22.6427 15.1248 24 13.4475 24ZM13.4315 18.9933C12.8979 18.994 12.3864 19.2063 12.0091 19.5836C11.6318 19.9609 11.4195 20.4724 11.4188 21.006C11.4188 22.116 12.3288 23.0187 13.4482 23.0187C14.5848 23.0187 15.5102 22.1013 15.5102 20.9733V18.9933H13.4315ZM18.5675 18.9933H18.5022C16.8515 18.9933 15.5088 17.6507 15.5088 16C15.5088 14.3493 16.8515 13.0067 18.5022 13.0067H18.5675C20.2182 13.0067 21.5608 14.3493 21.5608 16C21.5608 17.6507 20.2182 18.9933 18.5675 18.9933ZM18.5028 13.9873C17.3928 13.9873 16.4902 14.8907 16.4902 16C16.4902 17.1093 17.3935 18.0127 18.5028 18.0127H18.5682C19.6782 18.0127 20.5808 17.1093 20.5808 16C20.5808 14.8907 19.6768 13.9873 18.5675 13.9873H18.5028Z" fill="white" />
                                </svg>
                            </div>
                            <div className='wdkit-onboarding-allfeatures-name'>
                                <span>{__('Figma Design Templates', 'wdesignkit')}</span>
                                <span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.91675 5L12.9167 10L7.91675 15" stroke="#040483" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                        </a>
                        <a href='https://wdesignkit.com/builder' target='_blank' rel="noopener noreferrer" className="wdkit-onboarding-boxallfeatures">
                            <div className="wdkit-onboarding-allfeatures-svg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z" fill="#040483" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.0669 8.21692C15.4801 7.92769 16.03 7.92769 16.4432 8.21692L21.9982 12.1054C22.6542 12.5646 22.685 13.5253 22.0597 14.0255L21.6444 14.3577L21.9982 14.6054C22.6542 15.0646 22.685 16.0253 22.0597 16.5255L21.6444 16.8577L21.9982 17.1054C22.6542 17.5646 22.685 18.5253 22.0597 19.0255L19.4215 21.136L17.3376 22.8031C16.4124 23.5433 15.0977 23.5433 14.1725 22.8031L12.0885 21.136L9.45038 19.0255C8.82508 18.5253 8.85584 17.5646 9.51186 17.1054L9.86566 16.8577L9.45038 16.5255C8.82508 16.0253 8.85584 15.0646 9.51186 14.6054L9.86566 14.3577L9.45038 14.0255C8.82508 13.5253 8.85584 12.5646 9.51186 12.1054L15.0669 8.21692ZM10.7337 17.5521L10.1236 17.9792C10.0507 18.0302 10.0473 18.137 10.1168 18.1926L12.7549 20.3031L14.8388 21.9702C15.3745 22.3987 16.1356 22.3987 16.6713 21.9702L18.7552 20.3031L21.3933 18.1926C21.4628 18.137 21.4594 18.0302 21.3865 17.9792L20.7764 17.5521L19.4215 18.636L17.3376 20.3031C16.4124 21.0433 15.0977 21.0433 14.1725 20.3031L12.0885 18.636L10.7337 17.5521ZM19.4215 16.136L20.7764 15.0521L21.3865 15.4792C21.4594 15.5302 21.4628 15.637 21.3933 15.6926L18.7552 17.8031L16.6713 19.4702C16.1356 19.8987 15.3745 19.8987 14.8388 19.4702L12.7549 17.8031L10.1168 15.6926C10.0473 15.637 10.0507 15.5302 10.1236 15.4792L10.7337 15.0521L12.0885 16.136L14.1725 17.8031C15.0977 18.5433 16.4124 18.5433 17.3376 17.8031L19.4215 16.136ZM15.8315 9.09077C15.7856 9.05863 15.7245 9.05863 15.6786 9.09077L10.1236 12.9792C10.0507 13.0302 10.0473 13.137 10.1168 13.1926L12.7549 15.3031L14.8388 16.9702C15.3745 17.3987 16.1356 17.3987 16.6713 16.9702L18.7552 15.3031L21.3933 13.1926C21.4628 13.137 21.4594 13.0302 21.3865 12.9792L15.8315 9.09077Z" fill="white" />
                                </svg>
                            </div>
                            <div className='wdkit-onboarding-allfeatures-name'>
                                <span>{__('Widget Builder', 'wdesignkit')}</span>
                                <span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.91675 5L12.9167 10L7.91675 15" stroke="#040483" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                        </a>
                        <a href='https://wdesignkit.com/workspace' target='_blank' rel="noopener noreferrer" className="wdkit-onboarding-boxallfeatures">
                            <div className="wdkit-onboarding-allfeatures-svg">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z" fill="#040483" />
                                    <path d="M11.2 18.3333C12.08 18.3333 12.8 19.0333 12.8 19.8889C12.8 20.7444 12.08 21.4444 11.2 21.4444C10.32 21.4444 9.6 20.7444 9.6 19.8889C9.6 19.0333 10.32 18.3333 11.2 18.3333ZM11.2 16.7778C9.44 16.7778 8 18.1778 8 19.8889C8 21.6 9.44 23 11.2 23C12.96 23 14.4 21.6 14.4 19.8889C14.4 18.1778 12.96 16.7778 11.2 16.7778ZM16 10.5556C16.88 10.5556 17.6 11.2556 17.6 12.1111C17.6 12.9667 16.88 13.6667 16 13.6667C15.12 13.6667 14.4 12.9667 14.4 12.1111C14.4 11.2556 15.12 10.5556 16 10.5556ZM16 9C14.24 9 12.8 10.4 12.8 12.1111C12.8 13.8222 14.24 15.2222 16 15.2222C17.76 15.2222 19.2 13.8222 19.2 12.1111C19.2 10.4 17.76 9 16 9ZM20.8 18.3333C21.68 18.3333 22.4 19.0333 22.4 19.8889C22.4 20.7444 21.68 21.4444 20.8 21.4444C19.92 21.4444 19.2 20.7444 19.2 19.8889C19.2 19.0333 19.92 18.3333 20.8 18.3333ZM20.8 16.7778C19.04 16.7778 17.6 18.1778 17.6 19.8889C17.6 21.6 19.04 23 20.8 23C22.56 23 24 21.6 24 19.8889C24 18.1778 22.56 16.7778 20.8 16.7778Z" fill="white" />
                                </svg>
                            </div>
                            <div className='wdkit-onboarding-allfeatures-name'>
                                <span>{__('Cloud Workspace', 'wdesignkit')}</span>
                                <span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.91675 5L12.9167 10L7.91675 15" stroke="#040483" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                        </a>

                    </div>
                </div>
            </div>
        )
    }

    const Thank_You = () => {
        return (
            <div className='wdkit-onboarding-popup-body'>
                <div className='wdkit-onboarding-image'>
                    <img src={ImgPath + "images/onbording/thank-you.png"} alt="Onboarding-Image" draggable="false" />
                </div>
                <div className='wdkit-onboarding-box'>
                    <div className='wdkit-onboarding-header'>
                        <span>{__('WDesignKit is Ready to Power your WordPress Website', 'wdesignkit')}</span>
                    </div>
                    <div className='wdkit-onboarding-doubt'>
                        <span>{__('Still in Doubt?', 'wdesignkit')}</span>
                        <div className='wdkit-onboarding-links'>
                            <a href='https://www.youtube.com/c/POSIMYTHInnovations' target='_blank' rel="noopener noreferrer" className='wdkit-onbording-link'>{__('Watch Video Tutorials', 'wdesignkit')}</a>
                            <span className='wdkit-onboarding-dot'></span>
                            <a href={wdkitData.WDKIT_DOC_URL + 'docs/'} target='_blank' rel="noopener noreferrer" className='wdkit-onbording-link'>{__('Read Documentation', 'wdesignkit')}</a>
                            <span className='wdkit-onboarding-dot'></span>
                            <a href='https://store.posimyth.com/login/' target='_blank' rel="noopener noreferrer" className='wdkit-onbording-link'>{__('Helpdesk', 'wdesignkit')}</a>
                        </div>
                    </div>
                    <div className='wdkit-onboarding-ourproducts'>
                        <span>{__('Check our other products', 'wdesignkit')}</span>
                        <div className='wdkit-onboarding-ourproducts-logo'>
                            <a href='https://theplusaddons.com/' target='_blank' rel="noopener noreferrer">
                                <div className='wdkit-onboarding-border'>
                                    <img src={ImgPath + 'images/onbording/tpae.png'} alt='tpae' draggable="false" />
                                </div>
                            </a>
                            <a href='https://nexterwp.com/' target='_blank' rel="noopener noreferrer">
                                <div className='wdkit-onboarding-border'>
                                    <img src={ImgPath + 'images/onbording/nexter.png'} alt='nexter' draggable="false" />
                                </div>
                            </a>
                            <a href='https://uichemy.com/' target='_blank' rel="noopener noreferrer">
                                <div className='wdkit-onboarding-border'>
                                    <img src={ImgPath + 'images/onbording/uichemy.png'} alt='uichemy' draggable="false" />
                                </div>
                            </a>
                            <a href='https://theplusblocks.com/' target='_blank' rel="noopener noreferrer">
                                <div className='wdkit-onboarding-border'>
                                    <img src={ImgPath + 'images/onbording/tpag.png'} alt='tpag' draggable="false" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='wkit-confirm-terms-content'>
                    <input className='wkit-confirm-terms-inp' checked={terms_check} type='checkbox' onChange={(e) => setterms_check(e.target.checked)} />
                    <span className='wkit-confirm-terms-text'>{__('By accepting this you agree to our', 'wdesignkit')} <a href={wdkitData.wdkit_server_url + 'terms'} target='_blank' rel="noopener noreferrer" className='wkit-confirm-terms-link-text'>{__('Terms & Conditions', 'wdesignkit')}</a></span>
                </div>
            </div>
        )
    }

    const Popup_content = () => {
        if ('1' == popupType) {
            return Both_Activated();
        } else if ('2' == popupType) {
            return Basic_Requirements();
        }
        //  else if ('3' == popupType) {
        //     return Check_All_Features();
        // } else if ('4' == popupType) {
        //     return Thank_You();
        // }
    }

    const Handle_onboarding = async () => {
        setLoader(true);

        if (terms_check) {
            let page_builder = {
                'widget_builder': true === props?.wdkit_meta?.Setting?.builder ? 1 : 0,
                'elementor': true === props?.wdkit_meta?.Setting?.elementor_builder ? 1 : 0,
                'gutenberg': props?.wdkit_meta?.Setting?.gutenberg_builder === true ? 1 : 0,
                'bricks': props?.wdkit_meta?.Setting?.bricks_builder === true ? 1 : 0
            }

            let page_templates = {
                'page_templates': props?.wdkit_meta?.Setting?.template === true ? 1 : 0,
                'elementor': 1,
                'gutenberg': 1,
                'bricks': 0
            }

            let form_arr = {
                'type': 'onboarding_handler',
                'page_template': JSON.stringify(page_templates),
                'page_builder': JSON.stringify(page_builder),
                'elementor_plugin': 'active' === actplugin?.elementor ? 1 : 0,
                'tpag_plugin': 'active' === actplugin?.['the-plus-addons-for-block-editor'] ? 1 : 0,
                'bricks_theme': 'active' === actplugin?.bricks ? 1 : 0,
            }

            await wdKit_Form_data(form_arr);
        }

        await setTimeout(() => {
            setpopupType(0);
            setLoader(false);
        }, 1000);
    }

    /**
     * Change Event When On Off store in redux
     * 
     * @version 1.0.0
     * */
    const HandleChange = (e, type, parent) => {
        if (parent != undefined && !props.wdkit_meta.Setting?.[parent]) {
            return false;
        }
        let FinalData = Object.assign({}, props.wdkit_meta.Setting, { [type]: e.target.checked });
        let form_arr = { 'type': 'wkit_setting_panel', 'event': 'set', 'data': JSON.stringify(FinalData) }

        props.wdkit_GetSettings_redux(FinalData);
        let new_setting = Object.assign({}, props?.wdkit_meta, { 'Setting': FinalData });

        props.wdkit_set_meta(new_setting);
        wdKit_Form_data(form_arr).then(async (res) => {
            if (res?.success == true && res?.data) {
            }
        })
    }

    return (
        <Fragment>
            {popupType > 0 &&
                <div className="wdkit-onboarding-main">
                    <div className='wdkit-onboarding-popup'>
                        {Popup_content()}
                        {!main_loading &&
                            <div className="wdkit-onboarding-footer">
                                <div className='wdkit-onboarding-footer-left'>
                                    {/* <button className='wdkit-onboarding-skip-button' onClick={() => { setpopupType(4) }} disabled={4 == popupType} style={4 == popupType ? { visibility: 'hidden' } : { visibility: 'visible' }}>{__('Skip')}</button> */}
                                </div>
                                <div className='wdkit-onboarding-pagination'>
                                    <span style={{ color: '#040483' }}>0{popupType}</span>
                                    <span>/02</span>
                                </div>
                                <div className='wdkit-onboarding-footer-right'>
                                    {popupType > 1 &&
                                        <button className='wdkit-onboarding-back-button' onClick={() => { setpopupType(Number(popupType) - 1) }} disabled={loader}>{__('Back', 'wdesignkit')}</button>
                                    }
                                    {2 == popupType ?
                                        <>
                                            {loader ?
                                                <button className="wdkit-onboarding-next-button">
                                                    <WkitLoader />
                                                </button>
                                                :
                                                <button className="wdkit-onboarding-next-button" onClick={() => { Handle_onboarding() }} disabled={pluginInstaller.current.length > 0}>{__('Finish', 'wdesignkit')}</button>
                                            }

                                        </>
                                        :
                                        ((props.wdkit_meta.Setting?.template && (props.wdkit_meta.Setting?.gutenberg_template || props.wdkit_meta.Setting?.elementor_template)) ||
                                            (props.wdkit_meta.Setting?.builder && (props.wdkit_meta.Setting?.bricks_builder || props.wdkit_meta.Setting?.gutenberg_builder || props.wdkit_meta.Setting?.elementor_builder))) ?
                                            <button className="wdkit-onboarding-next-button" onClick={() => { setpopupType(Number(popupType) + 1) }}>{__('Next', 'wdesignkit')}</button>
                                            :
                                            <div className='wkit-tooltip-onboarding'>
                                                <span>{__('Enable any one feature to continue!', 'wdesignkit')}</span>
                                                <button className="wkit-disable-next-btn" disabled>{__('Next', 'wdesignkit')}</button>
                                            </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </Fragment >
    );

}

export default Onboarding;