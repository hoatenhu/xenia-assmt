// ImageUploader.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);

  useEffect(() => {
    // Start the next upload in the queue when the current upload completes
    if (!isUploading && uploadQueue.length > 0) {
      const nextFile = uploadQueue[0];
      setFile(nextFile);
      setUploadQueue((prevQueue) => prevQueue.slice(1));
    }
  }, [isUploading, uploadQueue]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Show modal if the selected image exceeds 2MB
    if (selectedFile.size > 2 * 1024 * 1024) {
      setShowModal(true);
    } else {
      // Add the file to the upload queue
      setUploadQueue((prevQueue) => [...prevQueue, selectedFile]);
      setShowModal(false);
    }
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('avatar', file);

      // Send the file to the server
      const response = await axios.post('http://localhost:3001/data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success
      console.log('Upload successful:', response.data);
    } catch (error) {
      // Handle error
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      <button onClick={handleUpload} disabled={!file || isUploading}>
        Upload Image
      </button>

      {/* Image Size Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Image Size Exceeds Limit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The selected image exceeds the maximum size of 2MB. Please choose a smaller image.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageUploader;
