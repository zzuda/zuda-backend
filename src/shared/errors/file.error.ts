import { ErrorInfo } from 'src/types';

const errors = {
  FILE_UPLOAD_FAILED: {
    code: 'FILE_UPLOAD_FAILED',
    message: '업로드에 실패하였습니다.'
  },

  FILE_CAPACITY_EXCEEDED: {
    code: 'FILE_CAPACITY_EXCEEDED',
    message: '업로드 할 수 있는 파일 용량을 초과하였습니다 (파일 하나당 100MB)'
  },

  FILE_STORAGE_NOT_FOUND: {
    code: 'FILE_STORAGE_NOT_FOUND',
    message: '해당 roomID를 가진 저장 스토리지가 존재하지 않습니다'
  },

  NULL_UPLOAD: {
    code: 'NULL_UPLOAD',
    message: '업로드된 파일이 없습니다'
  },

  FILE_STORAGE_DELETION_FAILED: {
    code: 'FILE_STORAGE_DELETION_FAILED',
    message: '파일 스토리지 삭제를 실패하였습니다'
  },

  FILE_DELETION_FAILED: {
    code: 'FILE_DELETION_FAILED',
    message: '파일 삭제를 실패하였습니다'
  },

  FILE_NOT_EXIST:{
    code: 'FILE_NOT_EXIST',
    message: '해당하는 이름의 파일은 존재하지 않습니다'
  }
} as const;

export const FileError = errors as ErrorInfo<typeof errors>;
