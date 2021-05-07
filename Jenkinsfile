pipeline {
    tools {
        nodejs 'nodejs12'
    }

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