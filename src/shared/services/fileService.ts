import { IServerResponse } from '@/interfaces/server/IServerResponse';
import { AxiosResponse } from 'axios';

import { axiosInstanceV1 } from '../axios';
export type UploadFolderType = 'resume' | 'post' | 'editor' | 'userAvatar';

class FileService {
  async upload(uploadFolder: UploadFolderType, formData: FormData) {
    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    };

    const res: AxiosResponse<IServerResponse> = await axiosInstanceV1.post(
      `save-image/${uploadFolder}`,
      formData,
      config
    );

    return res.data;
  }
}

export const fileService = new FileService();
