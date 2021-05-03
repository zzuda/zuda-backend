import { Controller, Post, UploadedFiles, UseInterceptors, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { FileService } from './file.service';
import { FileBodyDTO } from './dto/upload-file-body.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: './fileStorage/temp'
    })
  )
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() fileBodyDTO: FileBodyDTO
  ): string {
    const result = this.fileService.moveFile(files, fileBodyDTO);

    return result;
  }

  @Post('delete')
  deleteFile(@Body() FileBody: FileBodyDTO): string {
    const result = this.fileService.deleteFile(FileBody);

    return result;
  }

  @Post('deleteStorage')
  deleteDir(@Body() roomID: FileBodyDTO): string {
    const result = this.fileService.removeRoomStorage(roomID);

    return result;
  }
}
