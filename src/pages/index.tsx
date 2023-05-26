import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Bucket } from "sst/node/bucket";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { useState, SyntheticEvent } from "react";

export async function getServerSideProps() {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: crypto.randomUUID(),
    Bucket: Bucket.public.bucketName,
  });

  try {
    const url = await getSignedUrl(new S3Client({}), command);
    return { props: { url } };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function Home({ url }: { url: string }) {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const file = (e.target as any).file.files?.[0]!;
    const response = await fetch(url, {
      body: file,
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });

    if (response.ok) {
      setUploadStatus("File uploaded successfully!");
      setSelectedFile(""); // Clear the file input after successful upload
    } else {
      setUploadStatus("File upload failed!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.value);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
      <h1 className="text-4xl font-semibold mb-10 text-black">
        Next App with SSR on AWS
      </h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="file"
          >
            Upload Image
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="file"
            type="file"
            accept="image/png, image/jpeg"
            value={selectedFile}
            onChange={handleFileChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Upload
          </button>
        </div>
      </form>
      {uploadStatus && (
        <p className="text-lg mt-5 text-black">{uploadStatus}</p>
      )}
    </main>
  );
}
