import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../axiosConfig";

export function ImportInvestments() {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
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
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
