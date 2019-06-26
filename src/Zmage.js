/**
 * 应用主入口
 **/

// Libs
import ReactDOM from 'react-dom'
import React, {Fragment} from 'react'
// Components
import Browser from './components/Browser'
// Utils
import { defType, defProp, defPropDesktop, defPropMobile, defPropAuto } from './config/default'
import { SOURCE_TYPE } from "./Zmage.constant"
import { convertSet } from './Zmage.utils'

// 基础组件
export default class ReactZmage extends React.PureComponent {

    constructor(props){
        super(props)

        this.coverRef = React.createRef()
        this.isControlled = this.props.hasOwnProperty('browsing')

        this.state = {
            // 浏览
            browsing: false,
        }

        // TODO:FEATURE 懒加载
        // TODO:FEATURE 翻页动画
        // TODO:FEATURE 移动端的拖拽翻页
        // TODO:ENHANCE 禁用移动端的滑动退出及禁用滚动
        // TODO:ENHANCE 移动端下点击隐藏的背景按下时会变暗
        // TODO:BUG     移动端下左右按钮
    }

    /* 切换查看状态 */
    inBrowsing = ({ force } ={}) => {
        const { onBrowsing } = this.props
        if (this.isControlled && !force) {
            typeof onBrowsing === "function" && onBrowsing()
        } else {
            this.setState({
                browsing: true
            }, () => {
                typeof onBrowsing === "function" && onBrowsing()
            })
        }
    }
    outBrowsing = () => {
        const { unBrowsing } = this.props
        if (this.isControlled) {
            typeof unBrowsing === "function" && unBrowsing()
        } else {
            this.setState({
                browsing: false
            }, () => {
                typeof unBrowsing === "function" && unBrowsing()
            })
        }
    }

    render() {

        const {
            // Internal
            className, style, onClick,
            // Data
            src, alt, txt, set, defaultPage,
            // Presets
            preset,
            // Control
            controller, hotKey,
            // Styles
            zIndex, backdrop, radius, edge,
            // 生命周期
            onBrowsing, unBrowsing, onZooming, onSwitching, onRotating,
            // 受控属性
            browsing: controlledBrowsing,
            // 剩余参数
            ...restProps
        } = this.props
        const { browsing } = this.state

        const defPropWithEnv = preset.toString()==="desktop"
            ? defPropDesktop
            : preset.toString()==="mobile"
                ? defPropMobile
                : defPropAuto

        return (
            <Fragment>

                {/*封面图片*/}
                <img
                    ref={this.coverRef}
                    className={className}
                    style={{ cursor:'zoom-in', ...style }}
                    src={src} alt={alt} title={alt}
                    onClick={(e) => {
                        this.inBrowsing()
                        typeof onClick === "function" && onClick(e)
                    }}
                    {...restProps}
                />

                {/*查看叠层*/}
                <Browser
                    // Controlled status
                    browsing={browsing}
                    // Internal
                    coverRef={this.coverRef}
                    outBrowsing={this.outBrowsing}
                    // Data
                    defaultPage={defaultPage}
                    set={convertSet({ set, src, alt, txt })}
                    // Control
                    controller={{ ...defPropWithEnv.controller, ...controller }}
                    hotKey={{ ...defPropWithEnv.hotKey, ...hotKey }}
                    // Styles
                    zIndex={zIndex}
                    backdrop={backdrop}
                    radius={radius}
                    edge={edge}
                />

            </Fragment>
        )
    }
}

// 命令式
let commandTarget, commandContainer
ReactZmage.browsing = ({ browsing, ...props }) => {
    // Init env
    commandTarget = document.body;
    commandContainer = document.createElement('div')
    commandContainer.id = 'zmagePortal'
    commandTarget.appendChild(commandContainer)
    // Mount target
    ReactDOM.render(
        <ReactZmage
            {...props}
            source={SOURCE_TYPE.COMMAND}
            unBrowsing={() => {
                typeof props.unBrowsing === "function" && props.unBrowsing()
                try { setTimeout(() => commandTarget.removeChild(commandContainer), 350) } catch (e) {}
            }}
        />, commandContainer
    )
}

// 属性默认值
ReactZmage.defaultProps = {

    /**
     * 基础数据
     **/
    src: defProp.src,
    alt: defProp.alt,
    txt: defProp.txt,
    set: defProp.set,
    defaultPage: defProp.defaultPage,

    /**
     * 预设
     **/
    preset: defProp.preset,

    /**
     * 功能控制
     **/
    controller: defProp.controller,
    hotKey: defProp.hotKey,

    /**
     * 界面样式
     **/
    backdrop: defProp.backdrop,
    zIndex: defProp.zIndex,
    radius: defProp.radius,
    edge: defProp.edge,

    /**
     * 生命周期
     **/
    onBrowsing: defProp.onBrowsing,
    unBrowsing: defProp.unBrowsing,
    onZooming: defProp.onZooming,
    onSwitching: defProp.onSwitching,
    onRotating: defProp.onRotating,

    /**
     * 受控屬性
     **/
    // browsing: defProp.browsing,
}

// 属性类型
ReactZmage.propTypes = {

    /**
     * 基础数据
     **/
    src: defType.src,
    alt: defType.alt,
    txt: defType.txt,
    set: defType.set,
    defaultPage: defType.defaultPage,

    /**
     * 预设
     **/
    preset: defType.preset,

    /**
     * 功能控制
     **/
    controller: defType.controller,
    hotKey: defType.hotKey,

    /**
     * 界面样式
     **/
    backdrop: defType.backdrop,
    zIndex: defType.zIndex,
    radius: defType.radius,
    edge: defType.edge,

    /**
     * 生命周期
     **/
    onBrowsing: defType.onBrowsing,
    unBrowsing: defType.unBrowsing,
    onZooming: defType.onZooming,
    onSwitching: defType.onSwitching,
    onRotating: defType.onRotating,

    /**
     * 受控屬性
     **/
    browsing: defType.browsing,
}