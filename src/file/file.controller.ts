import { 
    Controller, 
    Post, 
    UploadedFiles, 
    UseInterceptors,
    Body,   
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'

import { FileService } from './file.service'
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
  uploadFiles(@UploadedFiles() files: Express.Multer.File[] , @Body() fileBodyDTO: FileBodyDTO): Promise<string> {
    const result = this.fileService.moveFile(files, fileBodyDTO)
    
    return result;
  }   

  @Post('delete')
  DeleteDir(@Body() roomID: FileBodyDTO): Promise<string>{
    const result = this.fileService.deleteRoomStorage(roomID)

    return result;
  }

}
  