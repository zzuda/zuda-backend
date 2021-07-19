/* eslint-disable max-classes-per-file */
import {Controller, Post, UploadedFiles, UseInterceptors, Body, Get, Res} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    PickType,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse
} from '@nestjs/swagger'
import {FilesInterceptor} from '@nestjs/platform-express';
import {Express, query} from 'express';

import {FileListReturn} from 'src/types';
import {FileService} from './file.service';
import {FileBodyDTO} from './dto/file-body.dto';
import { Query } from 'mongoose';

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
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ApiInternalServerErrorResponse()
    @UseInterceptors(FilesInterceptor('files', 20, {dest: './fileStorage/temp'}))
    uploadFiles(
        @UploadedFiles()files : Express.Multer.File[],
        @Body()fileBodyDTO : FileBodyDTO
    ): FileListReturn {
        const result = this
            .fileService
            .moveFile(files, fileBodyDTO);

        return result;
    }

    @Post('delete')
    @ApiOperation({summary: '파일 삭제', description: '- 해당 roomId에 해당하는 파일을 삭제합니다'})
    @ApiBody({type: FileBodyDTO})
    @ApiOkResponse()
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
    @ApiOkResponse()
    @ApiInternalServerErrorResponse()
    @ApiNotFoundResponse()
    deleteDir(@Body()roomID : FileBodyDTO): string {
        const result = this
            .fileService
            .removeRoomStorage(roomID);

        return result;
    }

    @Post('list')
    @ApiOperation(
        {summary: '파일 리스트 조회', description: '- 해당 roomId에 방의 파일 리스트를 조회합니다 \n - 방의 숫자는 String 형태로 들어와야 합니다'}
    )
    @ApiBody({type: FileStorageDTO})
    @ApiOkResponse()
    @ApiInternalServerErrorResponse()
    @ApiNotFoundResponse()
    getFile(@Body()roomId : FileBodyDTO): FileListReturn {
        const result = this
            .fileService
            .getRoomFiles(roomId);

        return result;
    }

    @Get('download/:roomId/:fileName')
    async downloadFile(@Res() res: Response, @Param('roomId') roomId: number, @Query('fileName') fileName: string, {
        
    }

}