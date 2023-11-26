/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import { styles } from "./styles";
import { cropImage } from "../../functions/cropFunction";
import { baseUrl } from "../../api";

interface DataFormProps {
  onUploadDone: () => void;
}

interface FormDataStateType {
  name: string;
  email: string;
  avatar: RequestInfo | URL;
}

const DataForm = ({ onUploadDone }: DataFormProps) => {
  const [formData, setFormData] = useState<FormDataStateType>({
    name: "",
    email: "",
    avatar: "",
  });
  const [selectedImage, setSelectedImage] = useState<RequestInfo | URL>("");
  const [showErrorImage, setShowErrorImage] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const resetUploadForm = () => {
    setFormData({
      name: "",
      email: "",
      avatar: "",
    });
    setSelectedImage("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setUploading(true);
      const formDataObj = new FormData();
      const croppedBlob = await fetch(selectedImage).then((res) => res.blob());
      formDataObj.append("avatar", croppedBlob, "cropped_avatar.png");
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);

      await axios.post(`${baseUrl}/data`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      resetUploadForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setUploading(false);
      onUploadDone();
    }
  };

  const handleChange = async (e: any) => {
    setShowErrorImage(false);
    if (e.target.name === "avatar") {
      let image = "";
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          setShowErrorImage(true);
          setSelectedImage("");
        } else {
          try {
            const file = e.target.files[0];
            image = await cropImage(file);
            setSelectedImage(image);
          } catch (err) {
            console.log(err);
          }
        }
      }
      setFormData({ ...formData, avatar: image });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <div>
      <form
        style={styles.formContainer as React.CSSProperties}
        onSubmit={handleSubmit}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label style={styles.avatarWrap}>
          Avatar:
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />
          {selectedImage && (
            <img
              src={selectedImage as string | undefined}
              alt="Preview"
              height={50}
              width={50}
            />
          )}
        </label>
        {showErrorImage && (
          <p style={{ color: "red", marginTop: -10 }}>
            {"Please select Image with size <= 2MB!"}
          </p>
        )}

        <button
          style={styles.buttonWrap}
          type="submit"
          disabled={showErrorImage}
        >
          {uploading ? "Uploading" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DataForm;
