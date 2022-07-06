import React from 'react';
import './App.css';
import {startEdit} from './start-edit';

const App = () => {
  const [focused, setFocus] = React.useState<boolean>(false);
  const [isEditing, setEditing] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setFocusCb = React.useCallback((event: React.SyntheticEvent<HTMLDivElement>) => {
    if (isEditing) return;
    if (!inputRef.current) return;

    event.stopPropagation();
    setFocus(true);
    inputRef.current.focus();
  }, [inputRef, setFocus, isEditing]);

  React.useEffect(() => {
    const handler = () => {
      setFocus(false);
      setEditing(false);
    };
    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, [setFocus]);

  React.useEffect(() => {
    const handler = (event: Event) => {
      startEdit();
      setEditing(true);
    };
    document.addEventListener('compositionstart', handler);
    // if (safari && !IPadOrIPhone) || (windows && electron)
    // Sougou IME will only trigger textInput event
    document.addEventListener('textInput', handler);

    return () => {
      document.removeEventListener('compositionstart', handler);
      document.removeEventListener('textInput', handler);
    };
  }, []);

  const onInputChange = React.useCallback((event: any) => {
    setValue(event.target.value);
  }, []);

  const inputStyle: React.CSSProperties = {
    display: isEditing ? 'block' : 'none',
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10,
    right: 10,
  };

  const hiddenInputStyle: React.CSSProperties = {
    position: 'fixed',
    width: 0,
    height: 0,
    left: -1000,
    top: -1000,
  };
  return (
    <div className='App' onClick={setFocusCb} style={focused ? {border: '2px solid crimson', padding: 9} : undefined}>
      click to focus, then type something
      {/*TODO: merge onChange with compositionstart*/}
      <input
        style={isEditing ? inputStyle : hiddenInputStyle}
        ref={inputRef}
        value={value}
        onChange={onInputChange}
      />
    </div>
  );
};

export default App;
