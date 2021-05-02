import { ErrorInfo } from 'src/types';

export const FileError: ErrorInfo = {
  FILE_UPLOAD_FAILED: {
    code: 'file-500',
    message: '업로드에 실패하였습니다.'
  },

  FILE_CAPACITY_EXCEEDED: {
    code: 'file-406',
    message: '업로드 할 수 있는 파일 용량을 초과하였습니다 (파일 하나당 100MB)'
  },

  FILE_STORAGE_NOT_FOUND:{
    code: 'file-404',
    message: '해당 roomID를 가진 저장 스토리지가 존재하지 않습니다'
  }
};
