import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { get_user_login, wkit_logout } from "../../helper/helper-function";
import { __ } from '@wordpress/i18n';

const { Fragment } = wp.element

window.wdkit_editor = wdkitData.use_editor;

const Side_menu = (props) => {

    const [Builder_meta, setBuilder_meta] = useState(false);
    const [Template_meta, setTemplate_meta] = useState(false);

    let location = useLocation();

    const navigation = useNavigate();
    let pathname = location.pathname.split("/");
    var img_path = wdkitData.WDKIT_URL;
    let notify_count = props?.wdkit_meta?.notification?.Unread > 0 ? props.wdkit_meta.notification.Unread : '';


    useEffect(() => {
        let builders = [];
        let templates = [];
        setBuilder_meta(false);
        setTemplate_meta(false);

        if (props?.wdkit_meta?.success) {
            if (props?.wdkit_meta?.Setting?.builder) {
                if (props?.wdkit_meta?.Setting?.elementor_builder) {
                    builders.push('Elementor');
                }
                if (props?.wdkit_meta?.Setting?.gutenberg_builder) {
                    builders.push('Gutenberg');
                }
                if (props?.wdkit_meta?.Setting?.bricks_builder) {
                    builders.push('Bricks');
                }

                if (builders.length > 0) {
                    setBuilder_meta(true);
                }
            }

            if (props?.wdkit_meta?.Setting?.template) {
                if (props?.wdkit_meta?.Setting?.elementor_template) {
                    templates.push('Elementor');
                }
                if (props?.wdkit_meta?.Setting?.gutenberg_template) {
                    templates.push('Gutenberg');
                }

                if (templates.length > 0) {
                    setTemplate_meta(true);
                }
            }
        }

    }, [props?.wdkit_meta?.Setting])

    const mega_menu_array = [
        {
            parent_name: __('Templates', 'wdesignkit'),
            parent_svg: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M19 5H5V8H19V5ZM3 8V9.5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9.5V8V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V8ZM19 19V9.5H5L5 19H19ZM16.3819 12.5H7.61805H6.5C6.22386 12.5 6 12.2761 6 12V11.5C6 11.2239 6.22386 11 6.5 11H7.61805H16.3819H17.5C17.7761 11 18 11.2239 18 11.5V12C18 12.2761 17.7761 12.5 17.5 12.5H16.3819ZM7.86622 15.5C7.7784 15.3482 7.65181 15.2216 7.5 15.1338C7.34819 15.2216 7.2216 15.3482 7.13378 15.5C7.2216 15.6518 7.34819 15.7784 7.5 15.8662C7.65181 15.7784 7.7784 15.6518 7.86622 15.5ZM7 14C6.44772 14 6 14.4477 6 15V16C6 16.5523 6.44772 17 7 17H8C8.55228 17 9 16.5523 9 16V15C9 14.4477 8.55228 14 8 14H7ZM12 15.1338C12.1518 15.2216 12.2784 15.3482 12.3662 15.5C12.2784 15.6518 12.1518 15.7784 12 15.8662C11.8482 15.7784 11.7216 15.6518 11.6338 15.5C11.7216 15.3482 11.8482 15.2216 12 15.1338ZM10.5 15C10.5 14.4477 10.9477 14 11.5 14H12.5C13.0523 14 13.5 14.4477 13.5 15V16C13.5 16.5523 13.0523 17 12.5 17H11.5C10.9477 17 10.5 16.5523 10.5 16V15ZM16.8662 15.5C16.7784 15.3482 16.6518 15.2216 16.5 15.1338C16.3482 15.2216 16.2216 15.3482 16.1338 15.5C16.2216 15.6518 16.3482 15.7784 16.5 15.8662C16.6518 15.7784 16.7784 15.6518 16.8662 15.5ZM16 14C15.4477 14 15 14.4477 15 15V16C15 16.5523 15.4477 17 16 17H17C17.5523 17 18 16.5523 18 16V15C18 14.4477 17.5523 14 17 14H16ZM6.5 7C6.77614 7 7 6.77614 7 6.5C7 6.22386 6.77614 6 6.5 6C6.22386 6 6 6.22386 6 6.5C6 6.77614 6.22386 7 6.5 7ZM9 6.5C9 6.77614 8.77614 7 8.5 7C8.22386 7 8 6.77614 8 6.5C8 6.22386 8.22386 6 8.5 6C8.77614 6 9 6.22386 9 6.5ZM10.5 7C10.7761 7 11 6.77614 11 6.5C11 6.22386 10.7761 6 10.5 6C10.2239 6 10 6.22386 10 6.5C10 6.77614 10.2239 7 10.5 7Z" fill="white"></path>
            </svg>,
            path_includes: ['browse', 'my_uploaded'],
            parent_link: '/browse',
            type: 'all',
            dependency: 'templates',
            child_content: [
                {
                    child_name: __('Browse Templates', 'wdesignkit'),
                    child_svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#020202" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12H22" stroke="#020202" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke="#020202" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>,
                    child_dependency: ['browse'],
                    condition: true,
                    child_link: '/browse'
                },
                {
                    child_name: __('My Templates', 'wdesignkit'),
                    child_svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 20H20M9.5 15.5V9.5H5L12 2.5L19 9.5H14.5V15.5H9.5Z" stroke="#020202" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>,
                    child_dependency: ['my_uploaded'],
                    condition: true,
                    child_link: '/my_uploaded',
                },
            ]
        },
        {
            parent_name: __('Widgets', 'wdesignkit'),
            parent_svg: <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.85305 0.582239C10.5417 0.10019 11.4583 0.100192 12.1469 0.582239L11 2.2207L2.66749 8.05344L1.52057 6.41497L9.85305 0.582239ZM1.83245 13.6967L1.4181 13.3652C0.375944 12.5314 0.427213 10.9303 1.52057 10.165L1.83245 9.94666L1.4181 9.61518C0.375943 8.78145 0.427214 7.18032 1.52057 6.41497L2.66749 8.05344L6.62467 11.2192L9.75058 13.7199C10.481 14.3043 11.5189 14.3043 12.2494 13.7199L15.3753 11.2192L19.3325 8.05344L11 2.2207L12.1469 0.582239L20.4794 6.41497C21.5727 7.18033 21.624 8.78145 20.5818 9.61518L20.1675 9.94666L20.4794 10.165C21.5727 10.9303 21.624 12.5315 20.5818 13.3652L20.1675 13.6967L20.4794 13.915C21.5727 14.6803 21.624 16.2815 20.5818 17.1152L16.6247 20.2809L13.4988 22.7816C12.0379 23.9503 9.96207 23.9503 8.50119 22.7816L5.37528 20.2809L1.4181 17.1152C0.375944 16.2815 0.427213 14.6803 1.52057 13.915L1.83245 13.6967ZM3.45999 14.9987L2.66749 15.5534L6.62467 18.7192L9.75058 21.2199C10.481 21.8043 11.5189 21.8043 12.2494 21.2199L15.3753 18.7192L19.3325 15.5534L18.54 14.9987L16.6247 16.5309L13.4988 19.0316C12.0379 20.2003 9.96207 20.2003 8.50119 19.0316L5.37528 16.5309L3.45999 14.9987ZM16.6247 12.7809L18.54 11.2487L19.3325 11.8034L15.3753 14.9692L12.2494 17.4699C11.5189 18.0543 10.481 18.0543 9.75058 17.4699L6.62467 14.9692L2.66749 11.8034L3.45999 11.2487L5.37528 12.7809L8.50119 15.2816C9.96207 16.4503 12.0379 16.4503 13.4988 15.2816L16.6247 12.7809Z" fill="white" />
            </svg>,
            path_includes: ['widget-browse', 'widget-listing'],
            parent_link: '/widget-browse',
            type: 'wdkit',
            dependency: 'builders',
            child_content: [
                {
                    child_name: __('Browse Widgets', 'wdesignkit'),
                    child_svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#020202" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12H22" stroke="#020202" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke="#020202" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>,
                    child_dependency: ['widget-browse'],
                    condition: true,
                    child_link: '/widget-browse'
                },
                {
                    child_name: __('My Widgets', 'wdesignkit'),
                    child_svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 20H20M9.5 15.5V9.5H5L12 2.5L19 9.5H14.5V15.5H9.5Z" stroke="#020202" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>,
                    child_dependency: ['widget-listing'],
                    condition: true,
                    child_link: '/widget-listing',
                },
            ]
        },
        {
            parent_name: __('Save Template', 'wdesignkit'),
            parent_svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M20.625 5.375H4.375V8.625H20.625V5.375ZM4.375 21.625V10.25H12.5V14.8214C12.5 15.6001 13.3679 16.0646 14.0158 15.6327L15.75 14.4765L17.4842 15.6327C18.1321 16.0646 19 15.6001 19 14.8214V10.25H20.625V21.625H4.375ZM17.375 10.25H14.125V13.6068L15.2542 12.854C15.5544 12.6539 15.9456 12.6539 16.2458 12.854L17.375 13.6068V10.25ZM4.375 3.75C3.47754 3.75 2.75 4.47754 2.75 5.375V21.625C2.75 22.5225 3.47754 23.25 4.375 23.25H20.625C21.5225 23.25 22.25 22.5225 22.25 21.625V5.375C22.25 4.47754 21.5225 3.75 20.625 3.75H4.375ZM7.625 7C7.625 7.44873 7.26123 7.8125 6.8125 7.8125C6.36377 7.8125 6 7.44873 6 7C6 6.55127 6.36377 6.1875 6.8125 6.1875C7.26123 6.1875 7.625 6.55127 7.625 7ZM10.0625 7.8125C10.5112 7.8125 10.875 7.44873 10.875 7C10.875 6.55127 10.5112 6.1875 10.0625 6.1875C9.61376 6.1875 9.25 6.55127 9.25 7C9.25 7.44873 9.61376 7.8125 10.0625 7.8125ZM6 14.3125C6 13.8638 6.36377 13.5 6.8125 13.5H8.4375C8.88623 13.5 9.25 13.8638 9.25 14.3125C9.25 14.7612 8.88623 15.125 8.4375 15.125H6.8125C6.36377 15.125 6 14.7612 6 14.3125ZM6.8125 17.5625C6.36377 17.5625 6 17.9263 6 18.375C6 18.8237 6.36377 19.1875 6.8125 19.1875H15.75C16.1987 19.1875 16.5625 18.8237 16.5625 18.375C16.5625 17.9263 16.1987 17.5625 15.75 17.5625H6.8125Z" fill="white" /></svg>,
            path_includes: ['save_template'],
            parent_link: '/save_template',
            type: 'popup',
            dependency: 'templates',
        },
        {
            parent_name: __('Workspace', 'wdesignkit'),
            parent_svg: <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.3503 6.81612C16.3503 8.67309 14.7959 10.2143 12.8337 10.2143C10.8714 10.2143 9.31699 8.67309 9.31699 6.81612C9.31699 4.95915 10.8714 3.41797 12.8337 3.41797C14.7959 3.41797 16.3503 4.95915 16.3503 6.81612ZM22.7503 17.1865C22.7503 19.0435 21.1959 20.5846 19.2337 20.5846C17.2714 20.5846 15.717 19.0435 15.717 17.1865C15.717 15.3295 17.2714 13.7883 19.2337 13.7883C21.1959 13.7883 22.7503 15.3295 22.7503 17.1865ZM9.95033 17.1865C9.95033 19.0435 8.39592 20.5846 6.43366 20.5846C4.4714 20.5846 2.91699 19.0435 2.91699 17.1865C2.91699 15.3295 4.4714 13.7883 6.43366 13.7883C8.39592 13.7883 9.95033 15.3295 9.95033 17.1865Z" stroke="white" strokeWidth="1.5" />
            </svg>,
            path_includes: ['manage_workspace', 'share_with_me'],
            parent_link: '/manage_workspace',
            type: 'all',
            dependency: 'all',
            child_content: [
                {
                    child_name: __('Manage Workspace', 'wdesignkit'),
                    child_svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.6843 6.81612C15.6843 8.67309 14.1299 10.2143 12.1676 10.2143C10.2054 10.2143 8.65098 8.67309 8.65098 6.81612C8.65098 4.95915 10.2054 3.41797 12.1676 3.41797C14.1299 3.41797 15.6843 4.95915 15.6843 6.81612ZM22.0843 17.1865C22.0843 19.0435 20.5299 20.5846 18.5676 20.5846C16.6054 20.5846 15.051 19.0435 15.051 17.1865C15.051 15.3295 16.6054 13.7883 18.5676 13.7883C20.5299 13.7883 22.0843 15.3295 22.0843 17.1865ZM9.28431 17.1865C9.28431 19.0435 7.7299 20.5846 5.76764 20.5846C3.80538 20.5846 2.25098 19.0435 2.25098 17.1865C2.25098 15.3295 3.80539 13.7883 5.76764 13.7883C7.7299 13.7883 9.28431 15.3295 9.28431 17.1865Z" stroke="#020202" strokeWidth="1.5" />
                    </svg>,
                    child_dependency: ['manage_workspace'],
                    condition: true,
                    child_link: '/manage_workspace'
                },
                {
                    child_name: __('Shared with Me', 'wdesignkit'),
                    child_svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.375 5.875C12.375 3.73489 14.1099 2 16.25 2C18.3901 2 20.125 3.73489 20.125 5.875C20.125 8.01511 18.3901 9.75 16.25 9.75C15.1698 9.75 14.1929 9.30803 13.4901 8.59505L10.4621 10.5004C10.6477 10.9532 10.75 11.449 10.75 11.9687C10.75 12.488 10.6479 12.9834 10.4626 13.436L13.491 15.3416C14.1937 14.6291 15.1703 14.1875 16.25 14.1875C18.3901 14.1875 20.125 15.9224 20.125 18.0625C20.125 20.2026 18.3901 21.9375 16.25 21.9375C14.1099 21.9375 12.375 20.2026 12.375 18.0625C12.375 17.5424 12.4775 17.0462 12.6633 16.593L9.63573 14.6879C8.93292 15.4014 7.95562 15.8437 6.875 15.8437C4.73489 15.8437 3 14.1089 3 11.9687C3 9.82862 4.73489 8.09375 6.875 8.09375C7.95517 8.09375 8.93212 8.53571 9.63486 9.24867L12.6629 7.34334C12.4773 6.89048 12.375 6.39469 12.375 5.875ZM16.25 3.5C14.9383 3.5 13.875 4.56331 13.875 5.875C13.875 7.18669 14.9383 8.25 16.25 8.25C17.5617 8.25 18.625 7.18669 18.625 5.875C18.625 4.56331 17.5617 3.5 16.25 3.5ZM6.875 9.59375C5.56331 9.59375 4.5 10.6571 4.5 11.9687C4.5 13.2804 5.56331 14.3437 6.875 14.3437C8.18669 14.3437 9.25 13.2804 9.25 11.9687C9.25 10.6571 8.18669 9.59375 6.875 9.59375ZM13.875 18.0625C13.875 16.7508 14.9383 15.6875 16.25 15.6875C17.5617 15.6875 18.625 16.7508 18.625 18.0625C18.625 19.3742 17.5617 20.4375 16.25 20.4375C14.9383 20.4375 13.875 19.3742 13.875 18.0625Z" fill="#020202" />
                    </svg>,
                    child_dependency: ['share_with_me'],
                    condition: true,
                    child_link: 'share_with_me',
                },
            ]
        },
        {
            parent_name: __('Settings', 'wdesignkit'),
            parent_svg: <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.9098 9.14582C11.2127 9.14582 9.83689 10.5216 9.83689 12.2187C9.83689 13.9158 11.2127 15.2916 12.9098 15.2916C14.6069 15.2916 15.9828 13.9158 15.9828 12.2187C15.9828 10.5216 14.6069 9.14582 12.9098 9.14582ZM21.5349 10.0259L20.7029 10.7108C19.7539 11.4921 19.7539 12.9453 20.7029 13.7266L21.5349 14.4115C21.8298 14.6543 21.9059 15.0746 21.715 15.4053L20.0721 18.2508C19.8811 18.5816 19.4791 18.7258 19.1214 18.5918L18.1123 18.2138C16.9611 17.7825 15.7026 18.5091 15.5005 19.7216L15.3233 20.7846C15.2605 21.1613 14.9346 21.4375 14.5527 21.4375H11.2669C10.8851 21.4375 10.5591 21.1613 10.4964 20.7846L10.3192 19.7216C10.1171 18.5091 8.85853 17.7825 7.7074 18.2138L6.69826 18.5918C6.34061 18.7258 5.93853 18.5816 5.74756 18.2508L4.10471 15.4053C3.91377 15.0746 3.9899 14.6543 4.28475 14.4115L5.11678 13.7266C6.0658 12.9453 6.0658 11.4921 5.11678 10.7108L4.28475 10.0259C3.9899 9.78317 3.91377 9.36285 4.10471 9.03211L5.74756 6.18661C5.93853 5.85586 6.34061 5.71164 6.69826 5.84563L7.7074 6.22367C8.85853 6.65492 10.1171 5.92832 10.3192 4.71578L10.4964 3.65278C10.5591 3.2761 10.8851 3 11.2669 3H14.5527C14.9346 3 15.2605 3.2761 15.3233 3.65278L15.5005 4.71578C15.7026 5.92832 16.9611 6.65492 18.1123 6.22367L19.1214 5.84563C19.4791 5.71164 19.8811 5.85586 20.0721 6.18661L21.715 9.03211C21.9059 9.36285 21.8298 9.78317 21.5349 10.0259Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
            path_includes: ['activate', 'settings'],
            parent_link: '/settings',
            type: 'wdkit',
            child_content: [
                {
                    child_name: __('Manage Licence', 'wdesignkit'),
                    child_svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 8.5C12.646 8.5 13.2347 8.25502 13.6784 7.85289C13.7324 7.79071 13.7907 7.73238 13.8529 7.67836C14.255 7.23469 14.5 6.64595 14.5 6C14.5 4.61929 13.3807 3.5 12 3.5C10.6193 3.5 9.5 4.61929 9.5 6C9.5 6.64595 9.74498 7.23469 10.1471 7.67836C10.2093 7.73238 10.2676 7.79071 10.3216 7.85289C10.7653 8.25502 11.354 8.5 12 8.5ZM12 10C12.4365 10 12.8567 9.93007 13.25 9.80081V11.5394L12.2304 11.2845C12.0791 11.2467 11.9209 11.2467 11.7696 11.2845L10.75 11.5394V9.80081C11.1433 9.93007 11.5635 10 12 10ZM9.21332 8.86957C9.18529 8.84235 9.15765 8.81471 9.13043 8.78668C9.09246 8.76341 9.04779 8.75 9 8.75H4C3.86193 8.75 3.75 8.86193 3.75 9V20C3.75 20.1381 3.86193 20.25 4 20.25H20C20.1381 20.25 20.25 20.1381 20.25 20V9C20.25 8.86193 20.1381 8.75 20 8.75H15C14.9522 8.75 14.9075 8.76341 14.8696 8.78668C14.8423 8.81471 14.8147 8.84235 14.7867 8.86957C14.7634 8.90754 14.75 8.95221 14.75 9V12.2438C14.75 12.8619 14.1692 13.3154 13.5696 13.1655L12 12.7731L10.4304 13.1655C9.83082 13.3154 9.25 12.8619 9.25 12.2438V9C9.25 8.95221 9.23659 8.90754 9.21332 8.86957ZM8 6C8 6.43653 8.06993 6.85673 8.19919 7.25H4C3.0335 7.25 2.25 8.0335 2.25 9V20C2.25 20.9665 3.0335 21.75 4 21.75H20C20.9665 21.75 21.75 20.9665 21.75 20V9C21.75 8.0335 20.9665 7.25 20 7.25H15.8008C15.9301 6.85673 16 6.43653 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6ZM7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44771 18 7 18H17C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16H7Z" fill="#020202" />
                    </svg>,
                    child_dependency: ['activate'],
                    condition: !(wdkitData?.wdkit_white_label?.licence_tab),
                    child_link: '/activate'
                },
                {
                    child_name: __('General Settings', 'wdesignkit'),
                    child_svg: <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.9098 9.14582C11.2127 9.14582 9.83689 10.5216 9.83689 12.2187C9.83689 13.9158 11.2127 15.2916 12.9098 15.2916C14.6069 15.2916 15.9828 13.9158 15.9828 12.2187C15.9828 10.5216 14.6069 9.14582 12.9098 9.14582ZM21.5349 10.0259L20.7029 10.7108C19.7539 11.4921 19.7539 12.9453 20.7029 13.7266L21.5349 14.4115C21.8298 14.6543 21.9059 15.0746 21.715 15.4053L20.0721 18.2508C19.8811 18.5816 19.4791 18.7258 19.1214 18.5918L18.1123 18.2138C16.9611 17.7825 15.7026 18.5091 15.5005 19.7216L15.3233 20.7846C15.2605 21.1613 14.9346 21.4375 14.5527 21.4375H11.2669C10.8851 21.4375 10.5591 21.1613 10.4964 20.7846L10.3192 19.7216C10.1171 18.5091 8.85853 17.7825 7.7074 18.2138L6.69826 18.5918C6.34061 18.7258 5.93853 18.5816 5.74756 18.2508L4.10471 15.4053C3.91377 15.0746 3.9899 14.6543 4.28475 14.4115L5.11678 13.7266C6.0658 12.9453 6.0658 11.4921 5.11678 10.7108L4.28475 10.0259C3.9899 9.78317 3.91377 9.36285 4.10471 9.03211L5.74756 6.18661C5.93853 5.85586 6.34061 5.71164 6.69826 5.84563L7.7074 6.22367C8.85853 6.65492 10.1171 5.92832 10.3192 4.71578L10.4964 3.65278C10.5591 3.2761 10.8851 3 11.2669 3H14.5527C14.9346 3 15.2605 3.2761 15.3233 3.65278L15.5005 4.71578C15.7026 5.92832 16.9611 6.65492 18.1123 6.22367L19.1214 5.84563C19.4791 5.71164 19.8811 5.85586 20.0721 6.18661L21.715 9.03211C21.9059 9.36285 21.8298 9.78317 21.5349 10.0259Z" stroke="#020202" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>,
                    child_dependency: ['settings'],
                    condition: true,
                    child_link: '/settings',
                },
            ]
        }
    ];

    const Wdkitlogo = () => {

        let link = wdkitData?.wdkit_white_label?.website_url || wdkitData?.wdkit_server_url,
            image = wdkitData?.wdkit_white_label?.plugin_logo || img_path + "assets/images/jpg/Wdesignkit-logo.png";

        return <Fragment>
            <div className="wkit-img-logo">
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <img src={image} alt="wdesignlogo" className="wkit-logo" draggable="false" />
                </a>
                <span className="wdkit-version-info">{'v' + wdkitData.WDKIT_VERSION}</span>
            </div>
        </Fragment>
    }

    const check_setting_meta = (type) => {
        if (type == 'all') {
            if (Template_meta || Builder_meta) {
                return true;
            } else {
                return false;
            }
        } else if (type == 'templates') {
            return Template_meta;
        } else if (type == 'builders') {
            return Builder_meta;
        } else {
            return true;
        }
    }

    const wkit_logout_User = async () => {
        await wkit_logout(navigation);
        props.wdkit_set_toast(['Logged out successfully!', "You're logged out! Remember your login details and sign in again.", '', 'success']);
    }

    return (
        <>
            {((pathname.includes("widget-listing") && pathname.includes("builder")) || pathname.includes("download") || pathname.includes('theplus_popup')) ? "" :
                <div className="wkit-left-side">
                    <Wdkitlogo />
                    {!location.pathname.includes('preset') &&
                        <div className="wdkit-inner-right-side-menu">
                            {Object.values(mega_menu_array).filter((data) => {
                                if (data.type == 'all') {
                                    return data;
                                } else {
                                    if (wdkitData.use_editor == data.type) {
                                        return data;
                                    } else if (wdkitData.use_editor != 'wdkit' && data.type == 'popup') {
                                        return data;
                                    }
                                }
                            }).map((data, index) => {
                                return (
                                    <div className="menu-wrapper" key={index}>
                                        <ul>
                                            <div className={`wkit-submenu-container ${check_setting_meta(data.dependency) ? '' : 'wkit-disable-submenu'}`}>
                                                {!check_setting_meta(data.dependency) &&
                                                    <span className="wkit-disable-menu-tooltip">Feature Disabled. Enable from Settings Panel.</span>
                                                }
                                                <li className={`wkit-menu ${pathname.includes(data.path_includes[0]) || pathname.includes(data.path_includes[1]) ? 'active' : ''}`}>
                                                    <Link to={data.parent_link} className={check_setting_meta(data.dependency) ? 'wkit-menu-dp-header' : 'wkit-menu-dp-header wkit-disable-menu-feature'} >
                                                        {data.parent_svg}
                                                        <span className="wkit-menu-text-label">{data.parent_name}</span>
                                                        {data.child_content &&
                                                            <svg className={`${data.disable ? '' : 'wkit-megamenu-dropdown'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 11 10" fill="none">
                                                                <path d="M8.96621 3.73047L6.24954 6.44714C5.92871 6.76797 5.40371 6.76797 5.08288 6.44714L2.36621 3.73047" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            </svg>
                                                        }
                                                    </Link>
                                                    {data.parent_name !== 'Save Template' &&
                                                        <div className="wdkit-submenu">
                                                            <div className="wdkit-submenu-inner-content">
                                                                {data.child_content ?
                                                                    data?.child_content.map((child_data, c_index) => {
                                                                        if (child_data.condition) {
                                                                            return (
                                                                                <Link className={`wdkit-submenu-link ${pathname.includes(child_data.child_dependency[0]) ? 'wdkit-active-submenu' : ''}`} to={child_data.child_link} key={c_index}>
                                                                                    {child_data.child_svg}
                                                                                    <span >{child_data.child_name}</span>
                                                                                </Link>
                                                                            )
                                                                        }
                                                                    })
                                                                    :
                                                                    ''
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                </li>
                                            </div>
                                        </ul>
                                    </div>
                                )
                            })}
                            <hr />
                            {get_user_login() ?
                                <div className="wkit-login-signup-with-notify">
                                    <div className="wkit-user-profile-cover">
                                        {props.wdkit_meta?.userinfo ?
                                            <div className="wkit-user-circle-profile">
                                                <img src={props.wdkit_meta?.userinfo?.user_profile} alt="profile Pic" className="wkit-user-profile-img" draggable="false" />
                                            </div>
                                            :
                                            <div className="wkit-inner-logo-skeleton"></div>
                                        }
                                        <div className="wkit-user-dropdown-new">
                                            <div className={`wkit-user-dropdown-inner ${wdkitData?.wdkit_white_label?.help_link ? 'wkit-wl-use-info' : ''}`}>
                                                <div className="wkit-top-strip">
                                                    {props.wdkit_meta?.userinfo ?
                                                        <>
                                                            <div className="wkit--inner-logo">
                                                                <img src={props.wdkit_meta?.userinfo?.user_profile} alt="profile Pic" className="wkit-user-profile-img" draggable="false" />
                                                            </div>
                                                            <div className="wkit-dropdown-right-side-info">
                                                                <span>{props.wdkit_meta?.userinfo?.full_name}</span>
                                                                <a>{props.wdkit_meta?.userinfo?.user_email}</a>
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <div className="wkit-inner-logo-skeleton"></div>
                                                            <div className="wkit-dropdown-right-side-info-skeleton">
                                                                <span className="wkit-username-skeleton"></span>
                                                                <span className="wkit-user-email-skeleton"></span>
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                                <div className="wkit-user-dropdown-navs">
                                                    {!(wdkitData?.wdkit_white_label?.help_link) &&
                                                        <ul className="wkit-user-dropdown-link-inner">
                                                            <li className="wkit-user-dropdown-link">
                                                                <a href="https://wdesignkit.com/admin/dashboard" target="_blank" className="wkit-user-server-links">
                                                                    <span>
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fillRule="evenodd" clipRule="evenodd" d="M2.44922 3.44525C2.44922 2.89517 2.89517 2.44922 3.44525 2.44922H5.19128C5.74136 2.44922 6.18731 2.89517 6.18731 3.44525V11.8262C6.18731 12.3763 5.74136 12.8222 5.19128 12.8222H3.44525C2.89517 12.8222 2.44922 12.3763 2.44922 11.8262V3.44525ZM3.44525 0.949219C2.06675 0.949219 0.949219 2.06675 0.949219 3.44525V11.8262C0.949219 13.2047 2.06675 14.3222 3.44525 14.3222H5.19128C6.56979 14.3222 7.68731 13.2047 7.68731 11.8262V3.44525C7.68731 2.06675 6.56979 0.949219 5.19128 0.949219H3.44525ZM2.44922 18.8103C2.44922 18.2603 2.89517 17.8143 3.44525 17.8143H11.8262C12.3763 17.8143 12.8222 18.2603 12.8222 18.8103V20.5564C12.8222 21.1064 12.3763 21.5524 11.8262 21.5524H3.44525C2.89517 21.5524 2.44922 21.1064 2.44922 20.5564V18.8103ZM3.44525 16.3143C2.06675 16.3143 0.949219 17.4318 0.949219 18.8103V20.5564C0.949219 21.9349 2.06675 23.0524 3.44525 23.0524H11.8262C13.2047 23.0524 14.3222 21.9349 14.3222 20.5564V18.8103C14.3222 17.4318 13.2047 16.3143 11.8262 16.3143H3.44525ZM18.8103 17.8143C18.2603 17.8143 17.8143 18.2603 17.8143 18.8103V20.5564C17.8143 21.1064 18.2603 21.5524 18.8103 21.5524H20.5564C21.1064 21.5524 21.5524 21.1064 21.5524 20.5564V18.8103C21.5524 18.2603 21.1064 17.8143 20.5564 17.8143H18.8103ZM16.3143 18.8103C16.3143 17.4318 17.4318 16.3143 18.8103 16.3143H20.5564C21.9349 16.3143 23.0524 17.4318 23.0524 18.8103V20.5564C23.0524 21.9349 21.9349 23.0524 20.5564 23.0524H18.8103C17.4318 23.0524 16.3143 21.9349 16.3143 20.5564V18.8103ZM11.1794 3.44525C11.1794 2.89517 11.6253 2.44922 12.1754 2.44922H20.5564C21.1064 2.44922 21.5524 2.89517 21.5524 3.44525V11.8262C21.5524 12.3763 21.1064 12.8222 20.5564 12.8222H12.1754C11.6253 12.8222 11.1794 12.3763 11.1794 11.8262V3.44525ZM12.1754 0.949219C10.7969 0.949219 9.67938 2.06675 9.67938 3.44525V11.8262C9.67938 13.2047 10.7969 14.3222 12.1754 14.3222H20.5564C21.9349 14.3222 23.0524 13.2047 23.0524 11.8262V3.44525C23.0524 2.06675 21.9349 0.949219 20.5564 0.949219H12.1754Z" fill="#020202" />
                                                                        </svg>
                                                                    </span>
                                                                    <span className="wkit-user-link-name">{__('Dashboard', 'wdesignkit')}</span>
                                                                </a>
                                                            </li>
                                                            <li className="wkit-user-dropdown-link">
                                                                <a href="https://wdesignkit.com/admin/profile" target="_blank" className="wkit-user-server-links">
                                                                    <span>
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M5.43626 20.8281C5.78817 17.5143 8.59212 14.9329 11.9992 14.9329C15.4063 14.9329 18.2102 17.5145 18.562 20.8281M23 12C23 18.0751 18.0751 23 12 23C5.92476 23 1 18.0751 1 12C1 5.92476 5.92476 1 12 1C18.0751 1 23 5.92476 23 12ZM16.4006 10.5338C16.4006 12.9639 14.4307 14.9338 12.0006 14.9338C9.57033 14.9338 7.60051 12.9639 7.60051 10.5338C7.60051 8.10384 9.57033 6.13388 12.0006 6.13388C14.4307 6.13388 16.4006 8.10384 16.4006 10.5338Z" stroke="#020202" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </span>
                                                                    <span className="wkit-user-link-name">{__('Manage Profile', 'wdesignkit')}</span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    }
                                                    <button className="wkit-user-logout-link-btn" onClick={(e) => { wkit_logout_User(navigation) }}>
                                                        <span className="wkit-logout-user">{__('Logout', 'wdesignkit')}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {!(wdkitData?.wdkit_white_label?.help_link) &&
                                        <div className="wkit-notify-icon-cover">
                                            <a className="wkit-notification-icon" href="https://wdesignkit.com/admin/notification" target="_blank">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 21 20" fill="none">
                                                    <path d="M16.4068 14.4085L15.3318 13.3335V9.16683C15.3318 6.6085 13.9652 4.46683 11.5818 3.90016V3.3335C11.5818 2.64183 11.0235 2.0835 10.3318 2.0835C9.64016 2.0835 9.08183 2.64183 9.08183 3.3335V3.90016C6.69016 4.46683 5.33183 6.60016 5.33183 9.16683V13.3335L4.25683 14.4085C3.73183 14.9335 4.0985 15.8335 4.84016 15.8335H15.8152C16.5652 15.8335 16.9318 14.9335 16.4068 14.4085ZM13.6652 14.1668H6.9985V9.16683C6.9985 7.10016 8.25683 5.41683 10.3318 5.41683C12.4068 5.41683 13.6652 7.10016 13.6652 9.16683V14.1668ZM10.3318 18.3335C11.2485 18.3335 11.9985 17.5835 11.9985 16.6668H8.66516C8.66516 17.5835 9.40683 18.3335 10.3318 18.3335Z" fill="white" fillOpacity="0.5" />
                                                </svg>
                                                {notify_count &&
                                                    <span className="wkit-unread-notification">{notify_count}</span>
                                                }
                                            </a>
                                        </div>
                                    }
                                </div>
                                :
                                <div className="wdkit-login-signUp-btn-cover">
                                    <Link to="/login" className="wdkit-tertiaty-btn">{__('Login', 'wdesignkit')}</Link>
                                    {!(wdkitData?.wdkit_white_label?.help_link) &&
                                        <a href={wdkitData.wdkit_server_url} className="wkit-pink-btn-class wkit-get-started-btn">{__('Get Started', 'wdesignkit')}</a>
                                    }
                                </div>
                            }

                        </div>
                    }
                </div>
            }
        </>
    );
}

export default Side_menu;