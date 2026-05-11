pipeline {
    agent any

    environment {
        IMAGE_NAME = "cicd-demo"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh '''
                    node -v || exit 1
                    npm -v || exit 1
                    npm install
                    '''
                }
            }
        }

        stage('Lint') {
            steps {
                dir('app') {
                    sh 'npm run lint || true'
                }
            }
        }

        stage('Unit + Integration Tests') {
            steps {
                dir('app') {
                    sh 'npm test || true'
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=cicd-demo \
                    -Dsonar.sources=app \
                    -Dsonar.host.url=https://interscholastic-extramural-lyman.ngrok-free.dev \
                    -Dsonar.token=$SONAR_TOKEN \
                    -Dsonar.javascript.lcov.reportPaths=app/coverage/lcov.info
                    '''
                }
            }
        }

        stage('Trivy File System Scan') {
            steps {
                sh 'trivy fs . || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh "trivy image $IMAGE_NAME:$IMAGE_TAG || true"
            }
        }

        stage('Docker Run') {
            steps {
                sh '''
                docker rm -f cicd-demo-container || true
                docker run -d --name cicd-demo-container -p 3000:3000 cicd-demo:latest
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

        always {
            cleanWs()
        }
    }
}
