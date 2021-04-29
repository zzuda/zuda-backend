import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from '../file/file.controller'
// import { FileService } from '../file/file.service';

@Module({
  imports: [
    
    MulterModule.registerAsync({
        useFactory: () => ({
          dest: '../../testStoarge',
        }),
      }),
  ],
//   providers: [
//     FileService
//   ],
  exports: [MulterModule],
  controllers: [FileController]
})
export class FileModule {}
