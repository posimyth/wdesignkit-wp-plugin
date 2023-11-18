import './select_template.scss';
const Select_template = () => {
    return (
        <div className="wkit-select-main">
            <div className="wkit-save-heading">Save Templates and push to cloud</div>
            <div className='wkit-select-template'>
                <input type="text" className='wkit-input-filed' />
                <select className='wkit-select'>
                    <option>One</option>
                    <option>two</option>
                    <option>three</option>
                </select>
                <button type="button" className="wkit-save-btn">Save</button>
            </div>
        </div>
    );
}
export default Select_template;