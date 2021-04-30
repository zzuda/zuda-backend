import { Injectable } from '@nestjs/common';
import { FileBodyDTO } from './dto/upload-file-body.dto';

import { existsSync, mkdirSync, /*rimraf,*/ rename } from "fs";

@Injectable()
export class FileService{

    async moveFile(files: File[], fileBody : FileBodyDTO){
        
        const roomID : number = fileBody.roomID
        const roomStorage: string = 'fileStorage\\' + roomID;
       
        const recievedFiles: string[] = [];

        if(!existsSync(roomStorage)){
            mkdirSync(roomStorage);
        }

        for( var item in files){
            var tempPath = files. 
            rename("fileStorage\\" + files[item].field , roomStorage, function (err){
                if(err) throw err
                    console.log(err)
            })
        }
        

        //have to make method of move files (temp -> roomStorage with roomID) 
    }
    
    //Delete Storage directory of rooomID when room Destroyed
    async deleteRoomStorage(){

    }
}