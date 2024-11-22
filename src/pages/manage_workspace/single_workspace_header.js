import { Wkit_template_Skeleton } from '../../helper/helper-function';
import './single_workspace_header.scss'

const WS_single_skeleton = () => {
    return (
        <div>
            <div className="wkit-single-workspace-header wkit-workspace-boxed">
                <div className="wkit-single-skeleton-left-side">
                    <div className="wkit-skeleton-profile-img wkit-main-profile-skeleton" style={{ borderRadius: "5px" }}></div>
                    <div className="wkit-skeleton-line"></div>
                    <div className="wkit-workspace-skeleton-btn-wrapper">
                        <div className="wkit-btn"></div>
                        <div className="wkit-btn"></div>
                    </div>
                </div>
                <div className="wkit-single-skeleton-right-side">
                    <div>
                        <ul className="wkit-small-img-wrapper">
                            <li><div className="wkit-skeleton-profile-img"></div></li>
                            <li><div className="wkit-skeleton-profile-img"></div></li>
                            <li><div className="wkit-skeleton-profile-img"></div></li>
                        </ul>
                    </div>
                    <div className="template-page-kit-title">
                        <div className="wkit-skeleton-line"></div>
                    </div>
                </div>
            </div>
            <Wkit_template_Skeleton />
        </div>

    )
}
export default WS_single_skeleton;