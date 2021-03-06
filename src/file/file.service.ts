import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, rename, rmdir, readdirSync } from 'fs';

import { Express, Response } from 'express';
import { FileListReturn, FileDownloadReturn } from 'src/types';
import { FileBodyDTO } from './dto/file-body.dto';
import { FileError } from '../shared/errors/file.error';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  moveFile(files: Express.Multer.File[], fileBody: FileBodyDTO): FileListReturn {
    const filePath = 'fileStorage';
    const { roomId } = fileBody;
    const backSlash = '\\';
    const temp = 'temp';

    const uploadedFiles: string[] = [];

    const fileStorage = filePath + backSlash;
    const tempStorage: string = fileStorage + backSlash + temp;
    const roomStorage: string = fileStorage + backSlash + roomId;

    if (!existsSync(fileStorage)) mkdirSync(fileStorage);
    if (!existsSync(tempStorage)) mkdirSync(tempStorage);
    if (!existsSync(roomStorage)) mkdirSync(roomStorage);

    if (files === null) throw new BadRequestException(FileError.NULL_UPLOAD);

    // eslint-disable-next-line no-restricted-syntax
    for (const item in files) {
      if ({}.hasOwnProperty.call(files, item)) {
        const recievedFiles = files[item].path;
        const moveToStorage = `${roomStorage}\\${files[item].originalname}`;

        if (files[item].size >= this.configService.get<number>('MAX_SIZE_PER_FILE', 104857600)) {
          rmdir(
            fileStorage + backSlash + temp + backSlash + files[item].filename,
            {
              recursive: true
            },
            (err) => {
              if (err) throw err;
            }
          );
          throw new BadRequestException(FileError.FILE_CAPACITY_EXCEEDED);
        }
        rename(recievedFiles, moveToStorage, (err) => {
          if (err) throw new InternalServerErrorException(FileError.FILE_UPLOAD_FAILED);
        });
        uploadedFiles[item] = files[item].originalname;
      }
    }
    return { roomId, files: uploadedFiles };
  }

  deleteFile(fileBody: FileBodyDTO): string {
    const fileStorage = 'fileStorage';
    const { fileName, roomId } = fileBody;
    const backSlash = '\\';

    rmdir(
      fileStorage + backSlash + roomId + backSlash + fileName,
      {
        recursive: true
      },
      (err) => {
        if (err) throw new InternalServerErrorException(FileError.FILE_DELETION_FAILED);
      }
    );
    return '????????? ?????????????????????';
  }

  removeRoomStorage(fileBody: FileBodyDTO): string {
    const fileStorage = 'fileStorage';
    const { roomId } = fileBody;
    const backSlash = '\\';

    if (!existsSync(fileStorage + backSlash + roomId))
      throw new NotFoundException(FileError.FILE_STORAGE_NOT_FOUND);

    rmdir(
      fileStorage + backSlash + roomId,
      {
        recursive: true
      },
      (err) => {
        if (err) throw new InternalServerErrorException(FileError.FILE_STORAGE_DELETION_FAILED);
      }
    );
    return 'file Storage Removed';
  }

  getRoomFiles(fileBody: FileBodyDTO): FileListReturn {
    const { roomId } = fileBody;
    const fileStorage = 'fileStorage';
    const backSlash = '\\';
    let files: string[];

    if (!existsSync(fileStorage + backSlash + roomId))
      throw new NotFoundException(FileError.FILE_STORAGE_NOT_FOUND);

    // eslint-disable-next-line prefer-const
    files = readdirSync(fileStorage + backSlash + roomId);

    return { roomId, files };
  }

  downloadFile(res: Response, roomId: number, fileName: string): FileDownloadReturn {
    res.download(`fileStorage/${roomId}/${fileName}`, fileName, (err) => {
      if (err) {
        throw new NotFoundException(FileError.FILE_NOT_EXIST);
      }
    });

    return { roomId, fileName };
  }
}
