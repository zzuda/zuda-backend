import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from '../file/file.controller';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigService,
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        dest: '../../testStoarge',
        //파일 업로드 용량 체크 응답 시간 개선 필요 (fmulter limits)
        limits: { fileSize: configService.get<number>('MAX_SIZE_PER_FILE', 10*1024*1024) },
      }),
    inject:[ConfigService]
    })
  ],
  providers: [FileService],
  exports: [MulterModule],
  controllers: [FileController]
})
export class FileModule {}
