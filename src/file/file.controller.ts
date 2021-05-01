import { 
    Controller, 
    Post, 
    UploadedFiles, 
    UseInterceptors,
    Body,
    
  } from '@nestjs/common';
  import { FileService } from './file.service'
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { FileBodyDTO } from "./dto/upload-file-body.dto"
  


  
  
  
  @Controller('file')
  export class FileController {
    constructor(
      private readonly fileService: FileService,
    ) {}
  
    @Post('upload')
    @UseInterceptors(
      FilesInterceptor('files', 20, {
       dest: "./fileStorage/temp"
    }))
    uploadFiles(@UploadedFiles() files: Express.Multer.File[] , @Body() fileBodyDTO: FileBodyDTO) {
      const result = this.fileService.moveFile(files, fileBodyDTO)
      console.log(files[0].filename);
      

        // console.log(fileBodyDTO)  
        // console.log(files);
        return result;
  
      }   
  }
  