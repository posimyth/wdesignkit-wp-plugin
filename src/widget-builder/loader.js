import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Widget_builder_container from './redux-container/widget_builder_container';
import { wdKit_Form_data, Get_user_info_data, get_user_login } from '../helper/helper-function';
// import { Wkit_template_Skeleton, wdKit_Form_data, get_user_login, Get_user_info_data, Wkit_availble_not, Toast_message } from '../../helper/helper-function';

import Elementor_file_create from './file-creation/elementor_file';

const Loader = (props) => {

    const [data, setdata] = useState(false);
    const [state, setstate] = useState("");
    const [userData, setUserData] = useState("loading");

    const widget_name = useParams();
    const navigation = useNavigate();

    useEffect(() => {
        let login_data = get_user_login();
        if (!login_data) {
            navigation("/login")
        }
    }, [])

    useEffect(() => {
        if (props.wdkit_meta) {
            setUserData(props.wdkit_meta);
        }
    }, [props.wdkit_meta]);

    const generateUniqueID = () => {
        const now = new Date();
        const uniqueID = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
        const hashedID = parseInt(uniqueID, 10) % 10000;
        return String(hashedID).padStart(4, '0');
    }

    useEffect(() => {

        const UpdateList = async () => {
            let final_array = [];
            var countload = 0;

            let form_arr = { 'type': 'wkit_get_widget_list' }
            let plugin_data = await wdKit_Form_data(form_arr)
                .then(response => {
                    const data = response;
                    return data;
                })

            let server_data = userData?.widgettemplate;
            let widget_limit = userData?.creadit?.widgets_limit ? userData?.creadit?.widgets_limit : 50;

            if (server_data?.length > 0) {
                await plugin_data.map((data) => {
                    let index = server_data.findIndex((id) => id.w_unique == data.widgetdata.widget_id);
                    if (index <= -1 && final_array.length < widget_limit) {

                        let name = data.widgetdata.name + "_" + data.widgetdata.widget_id;
                        final_array.push(name);
                    }
                })

                await server_data.map((data) => {
                    let index = plugin_data.findIndex((id) => id.widgetdata.widget_id == data.w_unique);
                    if (index >= -1 && final_array.length < widget_limit) {
                        let w_name = plugin_data[index]?.widgetdata?.name;
                        let w_id = plugin_data[index]?.widgetdata?.widget_id;

                        let name = w_name + "_" + w_id;
                        final_array.push(name);
                    }
                })
            } else {
                await plugin_data.map((data) => {
                    if (final_array.length < widget_limit) {
                        let name = data.widgetdata.name + "_" + data.widgetdata.widget_id;
                        final_array.push(name);
                    }
                })
            }

            const Get_data = async (valid_data) => {

                let CharName = (widget_name && widget_name.id) ? widget_name.id : "";

                let file = CharName ? CharName.replaceAll(" ", "_") : "";
                let folder = CharName ? CharName.replaceAll(" ", "-") : "";

                if (valid_data.includes(CharName)) {
                    var array_data = [];
                    var widgets = [];

                    let form_arr = { 'type': 'wkit_get_widget_list' }
                    await wdKit_Form_data(form_arr)
                        .then((response) => {
                            let data = [];
                            data = response;
                            data.map((widget) => {
                                widgets.push(widget.widgetdata)
                            })
                        })

                    if (widgets) {
                        let count = widgets.length;
                        widgets.map(async (data) => {

                            if (data.name + "_" + data.widget_id == CharName) {

                                let Json_URL = `${wdkitData.WDKIT_SERVER_PATH}/${data.type}/${folder}/${file}.json?v=${generateUniqueID()}`;

                                await fetch(Json_URL)
                                    .then((response) => response.json())
                                    .then((json) => { array_data.push(json) })

                                let old_html = [...props.Editor_code];
                                old_html[0] = array_data[0].Editor_data

                                props.addToEditor_code(old_html)
                                props.addToCarthandler(array_data[0].section_data)
                                props.addTowidgethandler(array_data[0].widget_data.widgetdata)
                                props.addTolinkhandler(array_data[0].Editor_Link.links)

                                setstate({
                                    "Editor_code": [array_data[0].Editor_data],
                                    "carddata": array_data[0].section_data,
                                    "widgetdata": array_data[0].widget_data.widgetdata,
                                    "links": array_data[0].Editor_Link.links,
                                })
                            } else {
                                count = count - 1
                            }
                        })
                        if (count <= 0) {
                            if (countload < 5) {
                                countload = countload + 1;
                                Get_data();
                            } else {
                                // setTimeout(() => {
                                //     navigation('/widget-listing')
                                // }, 5000);
                            }
                        }
                    }
                } else {
                    // setTimeout(() => {
                    //     navigation('/widget-listing')
                    // }, 5000);
                }
            }
            Get_data(final_array);
        }
        UpdateList();

    }, [userData])

    useEffect(() => {
        setTimeout(() => {
            if (props &&
                props.Editor_code &&
                props.Editor_data &&
                props.cardData &&
                props.widgetdata &&
                state &&
                state.Editor_code &&
                state.carddata &&
                state.widgetdata &&
                state.links) {
                if (JSON.stringify(props.Editor_code) == JSON.stringify(state.Editor_code) &&
                    JSON.stringify(props.Editor_data) == JSON.stringify(state.links) &&
                    JSON.stringify(props.cardData) == JSON.stringify(state.carddata) &&
                    JSON.stringify(props.widgetdata) == JSON.stringify(state.widgetdata)) {
                    setdata(true)
                }
            }
        }, 800)
    });

    return (
        <>
            {data == true ? <Widget_builder_container /> : <div className="wb-loader" style={{ display: 'flex' }} >
                <div className="wb-loader-circle"></div>
            </div>}
        </>
    );
}

export default Loader;