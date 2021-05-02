import { Injectable, ConflictException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { existsSync, mkdirSync, rename, rmdir } from "fs";

import { Express } from 'express'
import { FileBodyDTO } from './dto/upload-file-body.dto';
import { FileError } from '../shared/errors/file.error';


@Injectable()
export class FileService{
  constructor(
    private readonly configService: ConfigService
  ) {}

  async moveFile(files: Express.Multer.File[], fileBody: FileBodyDTO): Promise<string>{

    const filePath = 'fileStorage'
    const { roomID } = fileBody;
    const backSlash = '\\';
    const temp = 'temp'

    const fileStorage = filePath + backSlash;
    const tempStorage: string = fileStorage + backSlash + temp;
    const roomStorage: string = fileStorage + backSlash + roomID;

    if(!existsSync(fileStorage)) mkdirSync(fileStorage);
      if(!existsSync(tempStorage)) mkdirSync(tempStorage);
        if(!existsSync(roomStorage)) mkdirSync(roomStorage)

    if(files == null)
      throw new NotAcceptableException(FileError.NULL_UPLOAD)
      
    // eslint-disable-next-line no-restricted-syntax
    for(const item in files){
      if({}.hasOwnProperty.call(files, item)){
        const recievedFiles = files[item].path;
        const moveToStorage = `${ roomStorage }\\${ files[item].originalname }`;

        if(files[item].size >= this.configService.get<number>('MAX_SIZE_PER_FILE', 104857600)){
          rmdir(fileStorage + backSlash + temp + backSlash + files[item].filename, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        });
        throw new NotAcceptableException(FileError.FILE_CAPACITY_EXCEEDED);
      }
         
        rename(recievedFiles, moveToStorage, (err)=> {
          if(err) throw new ConflictException(FileError.FILE_UPLOAD_FAILED);
      });   

    }
  }
    return "파일 업로드 완료";
       
  }


  async deleteFile(fileBody: FileBodyDTO): Promise<string>{

    const fileStorage = 'fileStorage';
    const { fileName, roomID } = fileBody;
    const backSlash = '\\';
    
    rmdir(fileStorage + backSlash + roomID + backSlash + fileName, { recursive: true }, (err) => {
      if (err) {
          throw err;
      }
  })

    return "파일이 삭제되었습니다";
  }

    
  async removeRoomStorage(fileBody: FileBodyDTO): Promise<string>{

  const fileStorage = 'fileStorage';
  const { roomID } = fileBody;
  const backSlash = '\\';

  if(!existsSync(fileStorage + backSlash + roomID))
    throw new NotFoundException(FileError.FILE_STORAGE_NOT_FOUND)
    
    rmdir(fileStorage + backSlash + roomID, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });

    return "file Storage Removed";
  }
}
