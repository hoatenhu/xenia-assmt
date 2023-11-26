/* eslint-disable @typescript-eslint/no-explicit-any */
export async function cropImage(file: any) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const image = new Image();
      image.src = e.target.result;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const aspectRatio = 1 / 1; // 1:1 ratio
        const maxSize = Math.min(image.width, image.height);

        // Calculate the dimensions for cropping
        let cropWidth, cropHeight, offsetX, offsetY;

        if (image.width > image.height) {
          cropWidth = maxSize;
          cropHeight = maxSize / aspectRatio;
          offsetX = (image.width - maxSize) / 2;
          offsetY = 0;
        } else {
          cropWidth = maxSize * aspectRatio;
          cropHeight = maxSize;
          offsetX = 0;
          offsetY = (image.height - maxSize) / 2;
        }

        // Set the canvas size to the desired cropped size
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Draw the image on the canvas with the calculated dimensions
        ctx?.drawImage(
          image,
          offsetX,
          offsetY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        // Convert the cropped image to a data URL
        const croppedDataURL = canvas.toDataURL();

        resolve(croppedDataURL);
      };

      image.onerror = (error) => {
        reject(error);
      };
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}