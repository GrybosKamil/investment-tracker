import { saveAs } from "file-saver";
import { Button } from "primereact/button";
import axiosInstance from "../axiosConfig";

export function ExportInvestments() {
  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.get("/api/investment/export", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `investments-${timestamp}.csv`;
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  return (
    <div>
      <Button label="Download" onClick={handleDownload} />
    </div>
  );
}