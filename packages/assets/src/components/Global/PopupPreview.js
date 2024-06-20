import React, {lazy} from 'react';
import {formatTimestampToDate} from '../../helpers/formatDate';
const CanvasImage = lazy(() => import('./CanvasImage'));

import './popupPreview.css';
const PopupPreview = ({selectedItem, user, closeModal}) => {
  if (!selectedItem) return null;

  return (
    <div className="popup-preview">
      <div className="popup-preview__content">
        <span className="popup-preview__close-button" onClick={closeModal}>
          &times;
        </span>
        <div className="popup-preview__media-container">
          {/* {selectedItem.media_type === 'IMAGE' && <CanvasImage imageUrl={selectedItem.media_url} />} */}
          {/* {selectedItem.media_type === 'IMAGE' && (
            <img src={selectedItem.media_url} alt="Media" className="media-image" />
          )} */}
          {selectedItem.media_type === 'IMAGE' && (
            <CanvasImage imageUrl={selectedItem.media_url}></CanvasImage>
          )}
          {selectedItem.media_type === 'VIDEO' && (
            <video controls className="popup-preview__media-video">
              <source src={selectedItem.media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <div className="popup-preview__media-details">
            <div className="popup-preview__avatar">H</div>
            <div className="popup-preview__text">
              <p className="popup-preview__user-caption">
                <b className="popup-preview__user-name">{user?.username}</b>
                <span className="popup-preview__caption">{selectedItem.caption}</span>
              </p>
              <p className="popup-preview__timestamp">
                {formatTimestampToDate(selectedItem.timestamp)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupPreview;
