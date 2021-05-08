pipeline {
    agent { docker 'node:12' }

    environment {
        CI = 'true'
        IMAGE = 'ghcr.io/zzuda/zuda-backend'
        CONTAINER_NAME = 'zuda-backend'
    }

    stages {
        stage('docker test') {
            steps { 
                sh 'docker help'
            }
        }
        // stage('Checkout') {
        //     steps {
        //         checkout scm
        //     }
        // }

        // stage('Lint') {
        //     steps {
        //         sh 'yarn'
        //         sh 'yarn lint'
        //     }
        // }

        // stage('Build') {
        //     environment {
        //         TAG = sh(returnStdout: true, script: "git tag --sort version:refname | tail -1").trim()
        //         GH_USERNAME = credentials('GH_USERNAME')
        //         GH_TOKEN = credentials('GH_TOKEN')
        //     }

        //     steps {
        //         sh 'docker login ghcr.io -u ${GH_USERNAME} -p ${GH_TOKEN}'
        //         sh 'docker build -t ${IMAGE}:latest -t ${IMAGE}:${TAG} .'
        //         sh 'docker push ${IMAGE} --all-tags'
        //     }
        // }

        // stage('Cleanup') {
        //     steps {
        //         sh 'docker ps -q --filter "name=${CONTAINER_NAME}" | grep -q . && docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME} || true'
        //     }
        // }

        // stage('Deploy') {
        //     steps {
        //         sh 'docker-compose up -d'
        //     }
        // }
    }
}