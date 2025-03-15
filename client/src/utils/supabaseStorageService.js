// src/utils/storageService.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  'https://iyfjlgdaqhljlruamuhl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZmpsZ2RhcWhsamxydWFtdWhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTEyNzgzNywiZXhwIjoyMDU0NzAzODM3fQ.baLnBIROjoG0BPAcAbFHuuRRwNBCtPt784I7FZTjpTc'
);

class StorageService {
  async uploadFile(bucketName, files, directory = null) {
    // Handle both single file and multiple files
    const fileArray = Array.isArray(files)
      ? files
      : [{ fileName: files.fileName, file: files.file }];

    const uploads = fileArray.map(async ({ fileName, file }) => {
      const modifiedFileName = directory
        ? directory + "/" + fileName
        : fileName;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(modifiedFileName, file, {
          cacheControl: "3600",
          upsert: false,
        });
      const url = await this.getFileUrl(bucketName, modifiedFileName);
      return { modifiedFileName, url, data, error };
    });

    const urls = await Promise.all(uploads);
    return urls;
  }

  async deleteFile(bucketName, fileNames, directory = null) {
    // Handle both single filename and multiple filenames
    const files = Array.isArray(fileNames) ? fileNames : [fileNames];

    const modifiedFiles = directory
      ? files.map((file) => directory + "/" + file)
      : files;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove(modifiedFiles);
    return { data, error };
  }

  async deleteDirectory(bucketName, directory) {
    try {
      // First, list all files in the directory
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list(directory);

      if (listError) {
        return { error: listError };
      }

      if (!files || files.length === 0) {
        return { data: null, message: "Directory is empty or doesn't exist" };
      }

      // Create an array of full paths for each file
      const filePaths = files.map((file) => `${directory}/${file.name}`);

      // Delete all files in the directory
      const { data, error } = await supabase.storage
        .from(bucketName)
        .remove(filePaths);

      if (error) {
        return { error };
      }

      return {
        data,
        message: `Successfully deleted ${files.length} files from ${directory}`,
      };
    } catch (error) {
      return {
        error: {
          message: "Failed to delete directory",
          details: error.message,
        },
      };
    }
  }

  getFileUrl(bucketName, fileName) {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return data?.publicUrl || null;
  }

  async getAllFilesInDirectory(bucketName, directory) {
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list(directory);

    if (error) {
      return { error };
    }

    const urls = files.map((file) => ({
      name: file.name,
      url: this.getFileUrl(bucketName, `${directory}/${file.name}`),
    }));

    return urls;
  }
}

async function checkSupabaseStorageConnection() {
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      throw error;
    }

    return {
      connected: true,
      buckets: data?.length || 0,
    };
  } catch (error) {
    console.error("Supabase Storage Connection Error:", error);
    return {
      connected: false,
      error: error.message,
    };
  }
}

export const storageService = new StorageService();
export { checkSupabaseStorageConnection };

