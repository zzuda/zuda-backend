import { ErrorInfo } from 'src/types';

export const FileError: ErrorInfo = {
  FILE_UPLOAD_FAILED: {
    code: 'file-500',
    message: '업로드에 실패하였습니다.'
  },

  FILE_CAPACITY_EXCEEDED: {
    code: 'file-400',
    message: '업로드 할 수 있는 파일 용량을 초과하였습니다 (파일 하나당 100MB)'
  },

  FILE_STORAGE_NOT_FOUND: {
    code: 'file-404',
    message: '해당 roomID를 가진 저장 스토리지가 존재하지 않습니다'
  },

  NULL_UPLOAD: {
    code: 'file-400',
    message: '업로드된 파일이 없습니다'
  },

  FILE_STORAGE_DELETION_FAILED: {
    code: 'file-500',
    message: '파일 스토리지 삭제를 실패하였습니다'
  },

  FILE_DELETION_FAILED: {
    code: 'file-500',
    message: '파일 삭제를 실패하였습니다'
  }
};
