export interface FilePayloadJsonApi {
  file_id: string;
  file_name: string;
  file_urls: {
    html: string;
    download: string;
  };
  file_hashes: {
    sha256: string;
  };
}
