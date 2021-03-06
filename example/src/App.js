import React, { useContext, useEffect } from 'react';

import { ToastContext, ToastProvider } from '@ithreat/toast-provider';
import '@ithreat/toast-provider/dist/index.css';

const Toast = ({kind, title, subtitle, caption, timeout, onCloseButtonClick, className}) => {
  useEffect(() => {
    const timer = timeout && setTimeout(onCloseButtonClick, timeout);
    return () => timer && clearTimeout(timer);
  }, []);

  return (
    <div className={className} style={{boxSizing: 'border-box', margin: '1em', padding: '1em', zIndex: 1000, backgroundColor: 'silver', position: 'fixed', top: '0px', right: '0px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <b>{title}</b>
        <button onClick={onCloseButtonClick}>[X]</button>
      </div>
      <div><i>{subtitle}</i></div>
      <div>{kind}: {caption}</div>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider component={(props) => <Toast {...props}/>}>
      <App2/>
    </ToastProvider>
  )
};

const App2 = () => {
  const setToast = useContext(ToastContext);

  const createToast = () => {
    setToast({kind: 'warning', title: 'Beware', subtitle: 'A wild toast has appeared!', caption: 'caption'});
  };

  return (<div>
    <div>This part of the app has access to the Toast provider.</div>
    <div><button onClick={createToast}>Produce a Toast notification!</button></div>
  </div>);
};

export default App;