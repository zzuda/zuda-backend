import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, rename, rmdir } from "fs";

import { Express } from 'express'
import { FileBodyDTO } from './dto/upload-file-body.dto';


@Injectable()
export class FileService{
  async moveFile(files: Express.Multer.File[], fileBody: FileBodyDTO): Promise<string>{

    const fileStorage = 'fileStorage';
    const { roomID } = fileBody;
    const backSlash = '\\';

    const roomStorage: string = fileStorage + backSlash + roomID;

    if(!existsSync(roomStorage)){ 
      mkdirSync(roomStorage); 
    }

    // eslint-disable-next-line no-restricted-syntax
    for(const item in files){
      if({}.hasOwnProperty.call(files, item)){
        const recievedFiles = files[item].path;
        const moveToStorage = `${ roomStorage }\\${ files[item].filename }`;

        rename(recievedFiles, moveToStorage, (err)=> {
          if(err) throw err; 
      });
      }   
    }
      return "파일이 업로드 되었습니다";  
    }
    
    async deleteRoomStorage(fileBody: FileBodyDTO): Promise<string>{

    const fileStorage = 'fileStorage';
    const { roomID } = fileBody;
    const backSlash = '\\';
      
      rmdir(fileStorage + backSlash + roomID, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    });

    return "file Storage Removed";
  }
}
