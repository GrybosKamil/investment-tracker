import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { useRef, useState } from "react";
import axiosInstance from "../axiosConfig";

export function ImportInvestments() {
  const [file, setFile] = useState<File | null>(null);

  const fileUploadRef = useRef<FileUpload | null>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (event: FileUploadSelectEvent) => {
    setFile(event.files[0]);
  };

  const handleClear = () => {
    fileUploadRef.current?.clear();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(
        "/api/investment/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("File uploaded successfully", response.data);

      await queryClient.invalidateQueries({ queryKey: ["investment-types"] });
      await queryClient.invalidateQueries({ queryKey: ["investments"] });

      setFile(null);
      fileUploadRef.current?.clear();
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          ref={fileUploadRef}
          mode="basic"
          accept=".csv"
          onSelect={handleFileChange}
        />
        <Button label="Upload" type="submit" />
        {file ? (
          <Button label="Clear" onClick={handleClear} severity="secondary" />
        ) : null}
      </form>
    </div>
  );
}
