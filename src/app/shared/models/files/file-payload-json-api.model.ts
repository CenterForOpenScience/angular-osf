export interface FilePayloadJsonApi {
  file_id: string;
  file_name: string;
  file_urls: FilePayloadUrlsJsonApi;
  file_hashes: FilePayloadHashesJsonApi;
}

interface FilePayloadUrlsJsonApi {
  html: string;
  download: string;
}

interface FilePayloadHashesJsonApi {
  sha256: string;
}
