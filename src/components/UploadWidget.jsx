import { useEffect, useRef } from "react";

const UploadWidget = ({ onUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dtt2e86e2",
        uploadPreset: "offzorvr",
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          onUpload(result.info.url);
        }
      }
    );
  }, [onUpload]);
  return (
    <button type="button" className="btn btn-dark" onClick={() => widgetRef.current.open()}>
      ⬆️ Upload Image
    </button>
  );
};

export default UploadWidget;