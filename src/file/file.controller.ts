/* eslint-disable max-classes-per-file */
import {Controller, Post, UploadedFiles, UseInterceptors, Body} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    PickType,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse
} from '@nestjs/swagger'
import {FilesInterceptor} from '@nestjs/platform-express';
import {Express} from 'express';

import {FileService} from './file.service';
import {FileBodyDTO} from './dto/file-body.dto';

export class FileUploadDTO extends PickType(FileBodyDTO, ['roomId']) {}

export class FileStorageDTO extends PickType(FileBodyDTO, ['roomId']) {}

@Controller('file')
@ApiTags("file")
export class FileController {
    constructor(private readonly fileService : FileService) {}

    @Post('upload')
    @ApiOperation({
        summary: '파일 업로드 API',
        description: '- 파일을 업로드 합니다 \n - 한 파일당 최대 크기는 100MB \n - 한번에 최대 20개 까지 업로드 할 수 있습니다 \n - 해당 ' +
                '방 ID에 해당하는 roomStorage(저장 스토리지)가 존재하지 않으면 자동 생성됩니다.'
    })
    @ApiBody({type: FileUploadDTO})
    @ApiBadRequestResponse()
    @ApiInternalServerErrorResponse()
    @UseInterceptors(FilesInterceptor('files', 20, {dest: './fileStorage/temp'}))
    uploadFiles(
        @UploadedFiles()files : Express.Multer.File[],
        @Body()fileBodyDTO : FileBodyDTO
    ): string {
        const result = this
            .fileService
            .moveFile(files, fileBodyDTO);

        return result;
    }

    @Post('delete')
    @ApiOperation({summary: '파일 삭제', description: '- 해당 roomId에 해당하는 파일을 삭제합니다'})
    @ApiBody({type: FileBodyDTO})
    @ApiInternalServerErrorResponse()
    deleteFile(@Body()FileBody : FileBodyDTO): string {
        const result = this
            .fileService
            .deleteFile(FileBody);

        return result;
    }

    @Post('deleteStorage')
    @ApiOperation(
        {summary: '파일 스토리지 삭제', description: '- 해당 roomId에 해당하는 저장공간을 삭제합니다'}
    )
    @ApiBody({type: FileStorageDTO})
    @ApiInternalServerErrorResponse()
    @ApiNotFoundResponse()
    deleteDir(@Body()roomID : FileBodyDTO): string {
        const result = this
            .fileService
            .removeRoomStorage(roomID);

        return result;
    }
}
