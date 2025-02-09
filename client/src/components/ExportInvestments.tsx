import { saveAs } from "file-saver";
import axiosInstance from "../axiosConfig";

export function ExportInvestments() {
  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.get("/api/investment/export", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      saveAs(blob, "investments.csv");
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}