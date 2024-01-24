"use client";

const App = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:8000/getfile");
      const blob = await response.blob();

      // Create a blob URL for the downloaded file
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const a = document.createElement("a");
      a.href = url;
      a.download = "filename.mp3";

      // Append the link to the document and trigger a click event
      document.body.appendChild(a);
      a.click();

      // Remove the link and revoke the blob URL to free up resources
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Download MP3 File</button>cd
    </div>
  );
};

export default App;
