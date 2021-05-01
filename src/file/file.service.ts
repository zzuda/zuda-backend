import { Injectable } from '@nestjs/common';
import { FileBodyDTO } from './dto/upload-file-body.dto';

import { existsSync, mkdirSync, /*rimraf,*/ rename } from "fs";
import { Express } from "express"

@Injectable()
export class FileService{

    async moveFile(files: Express.Multer.File[], fileBody : FileBodyDTO){
        
        const roomID : number = fileBody.roomID
        const roomStorage: string = 'fileStorage\\' + roomID;
       
        const recievedFiles: string[] = [];

        console.log("룸 ID: ");
        console.log(roomID);

        console.log(" 파일경로:")
        console.log(roomStorage);

        console.log("파일 배열:");
        console.log(files)

        if(!existsSync(roomStorage)){
            mkdirSync(roomStorage);
        }
        
        console.log("--------------------------- 0 번 index");
        console.log(files[0].filename);
        console.log("\n");

        for( var item in files){
            
            rename(files[item].path , roomStorage +"\\"+ files[item].filename, function (err){
                if(err) throw err 
                      
            });
        }
        

        //have to make method of move files (temp -> roomStorage with roomID) 
    }
    
    //Delete Storage directory of rooomID when room Destroyed
    async deleteRoomStorage(){

    }
}