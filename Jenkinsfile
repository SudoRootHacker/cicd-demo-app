pipeline {
    agent any

    environment {
        IMAGE_NAME = "cicd-demo"
        IMAGE_TAG = "latest"
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/YOUR_USERNAME/cicd-demo-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint') {
            steps {
                dir('app') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Unit + Integration Tests') {
            steps {
                dir('app') {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                sh '''
                sonar-scanner                 -Dsonar.projectKey=cicd-demo                 -Dsonar.sources=app                 -Dsonar.host.url=http://YOUR_SONAR_IP:9000                 -Dsonar.login=$SONAR_TOKEN
                '''
            }
        }

        stage('Trivy File System Scan') {
            steps {
                sh 'trivy fs .'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image $IMAGE_NAME:$IMAGE_TAG'
            }
        }

        stage('Docker Run') {
            steps {
                sh '''
                docker rm -f cicd-demo-container || true
                docker run -d --name cicd-demo-container -p 3000:3000 $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }
    }

    post {

    success {
        echo 'Pipeline completed successfully'
    }

    failure {
        echo 'Pipeline failed'
    }
    }
}
