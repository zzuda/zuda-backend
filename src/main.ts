import { ValidationPipe } from '@nestjs/common';    // 정보 유효성 검증을 위한 파이프(관) Validation Pipe  라이브러리를  임포트
import { ConfigService } from '@nestjs/config';     // Config 서비스를 불러옴
import { NestFactory } from '@nestjs/core';         //  기본 사용을 위한 파일인듯 
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // REST 웹 서비스를 설계, 빌드, 문서화, 소비하는 일을 도와주는 대형 도구 생태계의 지원을 받는 오픈 소스 프레임워크라 함
import csurf from 'csurf';                                  // csrf 공격 방어를 위한 모듈
import helmet from 'helmet';                                // 웹 취약성 보호를 위한 모듈 
import { AppModule } from './app.module';                    // 모든 것의 루트 모듈파일 (imports, controllers, providers가 이들을 관리), 서버와 연결해주는 역할인듯...?
import { ResponseInterceptor } from './shared/interceptors/response.interceptor'; //@Injectable() 를 위한 걸까...? //https://velog.io/@junguksim/NestJS-%EB%85%B8%ED%8A%B8-4-Interceptors

async function bootstrap() {                                //비동기 함수 bootstrap() 시작
  const app = await NestFactory.create(AppModule);          //AppModule를 매개변수 삼아 app 만듬
  const config = app.get<ConfigService>('ConfigService');   // 서비스 설정

  const corsHost = config.get<string>('CORS_HOST', 'http://localhost:3000');    //CORS  (메인 또는 포트가 다른 서버의 자원을 요청하는 매커니즘) 이라고 함

  app.enableCors({
    origin: corsHost
  });
  app.use(helmet());
  app.use(csurf());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const documentConfig = new DocumentBuilder().setTitle('ZUDA API Document').build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}

bootstrap();
