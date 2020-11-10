import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Context providing a UI-agnostic Toast notification. 
 * Resets (and optionally sets) a Toast notification. If called with a `props` object, it will set the Toast and display it.
 * 
 * @namespace
 * @function
 * @param {Object} props The fields (kind, title, subtitle, caption, timeout, onClose, className) to set for the Toast.
 * @returns toast
 */
export const ToastContext = createContext({});

/**
 * Provides {@link ToastContext}.
 * @component
 * @category Context Provider
 */
export const ToastProvider = ({component, children}) => {
    const [ active, setActive ] = useState(false);
    const [ kind, setKind ] = useState();
    const [ title, setTitle ] = useState();
    const [ subtitle, setSubtitle] = useState();
    const [ caption, setCaption ] = useState();
    const [ timeout, setTimeout ] = useState();
    const [ onCloseButtonClick, setOnCloseButtonClick ] = useState();
    const [ className, setClassName ] = useState();

    const toast = (props) => {
        toast.reset();

        if (props) {
            const { kind, title, subtitle, caption, timeout, onCloseButtonClick, className } = props;

            toast
                .kind(kind)
                .title(title)
                .subtitle(subtitle)
                .caption(caption)
                .timeout(timeout)
                .onCloseButtonClick(onCloseButtonClick)
                .className(className)
                .show();
        }

        return toast;
    };

    const wrap = (func) => (...args) => { setActive(false); func(...args); return toast; };

    const setArgs = (func) => (...args) => {
        func();
        if (args.length === 2 || args.length === 3) {
            setTitle(args[0].toString());
            if (args.length === 3) setSubtitle(args[1].toString());
            setCaption(args[args.length-1].toString());
        }
    };

    /**
     * Whether the Toast is active (being displayed).
     * @memberof ToastContext#
     */
    toast.active = active;

    /**
     * Shows the Toast.
     * 
     * @method
     * @memberof ToastContext#
     * @returns toast
     */
    toast.show = wrap(() => setActive(true));

    /**
     * Resets the Toast (hides it and clears its attributes).
     * 
     * @method
     * @memberof ToastContext#
     * @returns toast
     */
    toast.reset = wrap(() => {
        setActive(false);
        setKind();
        setTitle();
        setSubtitle();
        setCaption();
        setTimeout();
        setOnCloseButtonClick();
        setClassName();
    });

    /**
     * Shortcut for `toast.kind('error')`.
     * 
     * @method
     * @memberof ToastContext#
     * @returns toast
     */
    toast.error = wrap(setArgs(() => setKind('error')));

    /**
     * Shortcut for `toast.kind('info')`.
     * 
     * @method
     * @memberof ToastContext#
     * @returns toast
     */
    toast.info = wrap(setArgs(() => setKind('info')));

    /**
     * Shortcut for `toast.kind('success')`.
     * 
     * @method
     * @memberof ToastContext#
     * @returns toast
     */
    toast.success = wrap(setArgs(() => setKind('success')));

    /**
     * Shortcut for `toast.kind('warning')`.
     * 
     * @method
     * @memberof ToastContext#
     * @returns toast
     */
    toast.warning = wrap(setArgs(() => setKind('warning')));

    /**
     * Sets the kind (type) of the Toast.
     * 
     * @method
     * @memberof ToastContext#
     * @param {string} kind error, info, success, warning
     * @returns toast
     */
    toast.kind = wrap((v) => setKind(v === undefined ? v : v.toString()));

    /**
     * Sets the title of the Toast.
     * 
     * @method
     * @memberof ToastContext#
     * @param {string} title
     * @returns toast
     */
    toast.title = wrap((v) => setTitle(v === undefined ? v : v.toString()));

    /**
     * Sets the subtitle of the Toast.
     * 
     * @method
     * @memberof ToastContext#
     * @param {string} subtitle
     * @returns toast
     */
    toast.subtitle = wrap((v) => setSubtitle(v === undefined ? v : v.toString()));

    /**
     * Sets the caption (the body or content) of the Toast.
     * 
     * @method
     * @memberof ToastContext#
     * @param {string} caption
     * @returns toast
     */
    toast.caption = wrap((v) => setCaption(v === undefined ? v : v.toString()));

    /**
     * Sets the timeout (in milliseconds) of the Toast.
     * 
     * @method
     * @memberof ToastContext#
     * @param {int} ms
     * @returns toast
     */
    toast.timeout = wrap((v) => setTimeout(parseInt(v)));

    /**
     * Sets the `onCloseButtonClick` handler of the Toast.
     * 
     * @method
     * @memberof ToastContext#
     * @param {func} handler
     * @returns toast
     */
    toast.onCloseButtonClick = wrap((v) => setOnCloseButtonClick(v));

    /**
     * Sets the class of the Toast.
     * 
     * @method
     * @memberof ToastContext#
     * @param {string} class
     * @returns toast
     */
    toast.className = wrap((v) => setClassName(v));

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {active && component({ kind, title, subtitle, caption, timeout, onCloseButtonClick: (e) => { onCloseButtonClick && onCloseButtonClick(e); toast.reset(); }, className })}
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    /** 
     * A function receiving the Toast properties and returning a component to render.
     */
    component: PropTypes.func.isRequired,

    /**
     * The rest of the app being wrapped.
     */
    children: PropTypes.element.isRequired,
};