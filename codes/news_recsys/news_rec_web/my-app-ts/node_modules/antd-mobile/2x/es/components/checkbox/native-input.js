import React, { useEffect, useRef } from 'react';
export const NativeInput = props => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (props.disabled) return;
    if (!inputRef.current) return;
    const input = inputRef.current;

    function handleClick(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      props.onChange(input.checked);
    }

    input.addEventListener('click', handleClick);
    return () => {
      input.removeEventListener('click', handleClick);
    };
  }, [props.disabled, props.onChange]);
  return React.createElement("input", {
    ref: inputRef,
    type: 'checkbox',
    checked: props.checked,
    onChange: () => {},
    disabled: props.disabled,
    id: props.id
  });
};