import { 
    Controller, 
    Post, 
    UploadedFiles, 
    UseInterceptors, 
    
  } from '@nestjs/common';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { existsSync, mkdirSync } from "fs";
  import { diskStorage } from "multer";

  import { RoomService } from "../room/services/room.service"

//   import { multerOptions } from './multerConfig/index';

//   const filePath = () =>
  
  
  
  @Controller('file')
  export default class FileController {
    constructor(
        private readonly roomService: RoomService,
    ) {}
  
    @Post('upload')
    @UseInterceptors(
      FilesInterceptor('files', 20, {
       dest: "../../testStoarge"
    }))
    uploadFiles(@UploadedFiles() files: File[], ) {
        
        console.log(files);
        return 'method doned'
      }   
  }
  