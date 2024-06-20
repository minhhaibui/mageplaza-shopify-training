import React, {useState, lazy, Suspense, useRef} from 'react';
import {formatTimestampToDate} from '../../helpers/formatDate';
import './globalPreview.css';
const PopupPreview = lazy(() => import('./PopupPreview'));
const CanvasImage = lazy(() => import('./CanvasImage'));

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
            {item.media_type === 'IMAGE' && <CanvasImage imageUrl={item.media_url}></CanvasImage>}
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
      {/* <Suspense>
        {selectedItem && (
          <PopupPreview selectedItem={selectedItem} user={user} closeModal={closeModal} />
        )}
      </Suspense> */}
    </div>
  );
};

export default GlobalPreview;
