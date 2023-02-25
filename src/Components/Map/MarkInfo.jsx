import React from "react";

const MarkInfo = React.forwardRef(({ title, address }, ref) => {
  return (
    <div id="infowindow-content" ref={ref}>
      <span id="place-name" className="title">
        {title}
      </span>
      <br />
      <span id="place-address">{address}</span>
    </div>
  );
});

export default MarkInfo;
