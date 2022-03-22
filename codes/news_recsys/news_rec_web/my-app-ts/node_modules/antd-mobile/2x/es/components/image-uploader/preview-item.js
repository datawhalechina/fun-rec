import React, { useMemo } from 'react';
import { CloseOutline } from 'antd-mobile-icons';
import classNames from 'classnames';
import Image from '../image';
import SpinLoading from '../spin-loading';
import { useConfig } from '../config-provider';
const classPrefix = `adm-image-uploader`;

const PreviewItem = props => {
  const {
    locale
  } = useConfig();
  const {
    url,
    file,
    deletable,
    onDelete
  } = props;
  const src = useMemo(() => {
    if (url) {
      return url;
    }

    if (file) {
      return URL.createObjectURL(file);
    }

    return '';
  }, [url, file]);

  function renderLoading() {
    return props.status === 'pending' && React.createElement("div", {
      className: `${classPrefix}-cell-mask`
    }, React.createElement("span", {
      className: `${classPrefix}-cell-loading`
    }, React.createElement(SpinLoading, {
      color: 'white'
    }), React.createElement("span", {
      className: `${classPrefix}-cell-mask-message`
    }, locale.ImageUploader.uploading)));
  }

  function renderDelete() {
    return deletable && React.createElement("span", {
      className: `${classPrefix}-cell-delete`,
      onClick: onDelete
    }, React.createElement(CloseOutline, {
      className: `${classPrefix}-cell-delete-icon`
    }));
  }

  return React.createElement("div", {
    className: classNames(`${classPrefix}-cell`, props.status === 'fail' && `${classPrefix}-cell-fail`)
  }, React.createElement(Image, {
    className: `${classPrefix}-cell-image`,
    src: src,
    fit: 'cover',
    onClick: props.onClick
  }), renderLoading(), renderDelete());
};

export default PreviewItem;