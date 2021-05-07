pipeline {
    agent { docker 'node:12' }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Lint') {
            steps {
                sh 'yarn'
                sh 'yarn lint'
            }
        }

        stage('Build') {
            steps {
                echo 'Test'
            }
        }
    }
}