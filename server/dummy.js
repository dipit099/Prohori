import React from 'react';

function FileReaderComponent() {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const blob = new Blob([file], { type: file.type });
        // Convert blob to binary data
        const arrayBuffer = await blob.arrayBuffer();
        
        setCommentImage(Array.from(new Uint8Array(arrayBuffer)))
        
      } catch (error) {
        console.error("error:", error);
      }
    }
  };
}

export default FileReaderComponent;