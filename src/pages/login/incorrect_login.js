import '../login/login.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Get_site_url } from '../../helper/helper-function';

const { __ } = wp.i18n;

const {
    form_data,
    wkit_set_user_login,
    get_userinfo,
    wkit_get_user_login
} = wp.wkit_Helper;

const Incorrect_login = (props) => {

    let data = props?.data ? props.data : '';

    if (data) {
        return (
            <div className='wkit-in-login-popup'>
                <div className='wkit-in-login-popup-outer' onClick={() => { props.close_popup() }}></div>
                <div className={data?.size ? `wkit-in-login-popup-content wkit-${data.size}-popup` : 'wkit-in-login-popup-content'}>
                    <div className='wkit-lg-popup-body'>
                        <div className='wkit-lg-upper-part'>
                            {data?.icon &&
                                <div className='wkit-lg-popup-icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="28" viewBox="0 0 22 19" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.28978 1.36021L0.819777 15.5002C0.645145 15.8026 0.552743 16.1455 0.551766 16.4947C0.550788 16.8439 0.641268 17.1873 0.814203 17.4907C0.987139 17.7941 1.2365 18.047 1.53748 18.2241C1.83847 18.4012 2.18058 18.4964 2.52978 18.5002H19.4698C19.819 18.4964 20.1611 18.4012 20.4621 18.2241C20.7631 18.047 21.0124 17.7941 21.1854 17.4907C21.3583 17.1873 21.4488 16.8439 21.4478 16.4947C21.4468 16.1455 21.3544 15.8026 21.1798 15.5002L12.7098 1.36021C12.5315 1.06631 12.2805 0.823324 11.981 0.654689C11.6814 0.486053 11.3435 0.397461 10.9998 0.397461C10.656 0.397461 10.3181 0.486053 10.0186 0.654689C9.71906 0.823324 9.46805 1.06631 9.28978 1.36021ZM10.999 5.25C11.6894 5.25 12.249 5.80964 12.249 6.5V10.5C12.249 11.1904 11.6894 11.75 10.999 11.75C10.3087 11.75 9.74902 11.1904 9.74902 10.5V6.5C9.74902 5.80964 10.3087 5.25 10.999 5.25ZM10.999 13.25C10.3087 13.25 9.74902 13.8096 9.74902 14.5C9.74902 15.1904 10.3087 15.75 10.999 15.75H11.009C11.6994 15.75 12.259 15.1904 12.259 14.5C12.259 13.8096 11.6994 13.25 11.009 13.25H10.999Z" fill="#FF1E1E" />
                                    </svg>
                                </div>
                            }
                            {data?.heading &&
                                <span className='wkit-lg-popup-heading'>{data?.heading}</span>
                            }
                            {data?.sub_heading.length > 0 &&
                                <div className='wkit-lg-sub-heading'>
                                    {data?.sub_heading.map((html) => {
                                        return (
                                            <span className={`wkit-lg-popup-text wkit-lg-text-${html?.type ? html.type : 'normal'}`}>{html.text}</span>
                                        );
                                    })}
                                </div>
                            }
                        </div>
                        {(data?.checkbox_text || data?.note?.length > 0) &&
                            <div className='wkit-lg-middle-part'>
                                {data?.note?.length > 0 &&
                                    <div className='wkit-lg-note-content'>
                                        <span className='wkit-lg-note-head'> Note : </span>
                                        {data?.note.map((html) => {
                                            return (
                                                <span className={`wkit-lg-note-text wkit-lg-text-${html?.type ? html.type : 'normal'}`}>
                                                    {html.text}
                                                </span>
                                            );
                                        })
                                        }

                                    </div>
                                }
                                {data?.checkbox_text &&
                                    <div className='wkit-lg-checkbox-content'>
                                        <input className='wkit-checkbox-inp' type='checkbox' checked={true} disabled/>
                                        <span className='wkit-checkbox-text'>{data?.checkbox_text}</span>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    <div className='wkit-lg-popup-footer'>
                        <div className='wkit-lg-popup-footer-btns'>
                            {data?.ft_btn1_text &&
                                <>
                                    {data?.ft_btn1_link ?
                                        <a href={data?.ft_btn1_link} target='_blank' rel='noopener noreferrer' className='wkit-btn-class'>{data?.ft_btn1_text}</a>
                                        :
                                        <div className='wkit-btn-class' onClick={() => { data?.ft_btn1_fun ? props.btn1_fun() : '' }}>{data?.ft_btn1_text}</div>
                                    }
                                </>
                            }
                            {data?.ft_btn2_text &&
                                <>
                                    {data?.ft_btn2_link ?
                                        <a href={data?.ft_btn2_link} target='_blank' rel='noopener noreferrer' className='wkit-outer-btn-class'>{data?.ft_btn2_text}</a>
                                        :
                                        <div className='wkit-outer-btn-class' onClick={() => { data?.ft_btn2_fun ? props.btn2_fun() : '' }}>{data?.ft_btn2_text}</div>
                                    }
                                </>
                            }
                        </div>

                        {data?.ex_link_text &&
                            <div className='wkit-footer-link'>
                                {data?.ex_link_url ?
                                    <a className='wkit-footer-link-txt' href={data?.ex_link_url} target='_blank' rel='noopener noreferrer'>{data?.ex_link_text}</a>
                                    :
                                    <span className='wkit-footer-link-txt'>{data?.ex_link_text}</span>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div >
        );
    }
}

export default Incorrect_login;