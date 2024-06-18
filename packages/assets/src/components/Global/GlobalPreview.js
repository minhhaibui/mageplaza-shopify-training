import React, {useState} from 'react';
import {formatTimestampToDate} from '../../helpers/formatDate';
import './globalPreview.css';

const GlobalPreview = ({feedConfig = {columns: 1, postSpacing: 0}, media, user}) => {
  const {columns, postSpacing} = feedConfig;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMouseEnter = index => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleItemClick = item => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="global-preview">
      <div
        className="grid-container"
        style={{gridGap: `${postSpacing}px`, gridTemplateColumns: `repeat(${columns}, 1fr)`}}
      >
        {media?.media?.map((item, index) => (
          <div
            key={index}
            className={`grid-item ${hoveredIndex === index ? 'hovered' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleItemClick(item)}
          >
            {item.media_type === 'IMAGE' && (
              <img src={item.media_url} alt={`Image ${index + 1}`} className="media-image" />
            )}
            {item.media_type === 'VIDEO' && (
              <video controls className="media-video">
                <source src={item.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {hoveredIndex === index && (
              <div className="overlay">
                <p className="date">{formatTimestampToDate(item.timestamp)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <div className="media-container">
              {selectedItem.media_type === 'IMAGE' && (
                <img src={selectedItem.media_url} alt="Media" className="media-image" />
              )}
              {selectedItem.media_type === 'VIDEO' && (
                <video controls className="media-video">
                  <source src={selectedItem.media_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              <div className="media-details">
                <div className="avatar">H</div>
                <div className="">
                  <p>
                    <b className="user-name">{user?.username}</b>
                    <span>{selectedItem.caption}</span>
                  </p>
                  <p>{formatTimestampToDate(selectedItem.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalPreview;
