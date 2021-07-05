pipeline {
    agent any

    tools {
        nodejs "nodejs12"
    }

    environment {
        CI = 'true'
        IMAGE = 'ghcr.io/zzuda/zuda-backend'
        CONTAINER_NAME = 'zuda-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Lint and Test') {
            steps {
                sh 'yarn'
                sh 'yarn lint'
                sh 'yarn test'
            }
        }

        stage('Build') {
            environment {
                TAG = sh(returnStdout: true, script: "git tag --sort version:refname | tail -1").trim()
                GH_USERNAME = credentials('GH_USERNAME')
                GH_TOKEN = credentials('GH_TOKEN')
            }

            steps {
                sh 'echo ${GH_TOKEN} | docker login ghcr.io -u ${GH_USERNAME} --password-stdin'
                sh 'docker build -t ${IMAGE}:latest -t ${IMAGE}:${TAG} .'
                sh 'docker push ${IMAGE}'
            }
        }

        stage('Container cleanup') {
            steps {
                sh 'docker ps -q --filter "name=${CONTAINER_NAME}" | grep -q . && docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME} || true'
                sh 'docker ps -q --filter "name=zuda-db" | grep -q . && docker stop zuda-db && docker rm zuda-db || true'
                sh 'docker ps -q --filter "name=zuda-mongo" | grep -q . && docker stop zuda-mongo && docker rm zuda-mongo || true'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
        
        stage('Webhook') {
            steps {
                discordSend title: '🚀 배포 성공! ${currentBuild.number}', description: '`zuda-backend` 를 배포 성공하였습니다.', result: currentBuild.currentResult, link: currentBuild.absoluteUrl, webhookURL: env.DISCORD_WEBHOOK
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
