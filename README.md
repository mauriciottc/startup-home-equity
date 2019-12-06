# Home Equity Contract Register

## Introdução 

Esse documento tem a intenção de guiar o entendimento e a utilização da API de gerenciamento de contratos de uma Startup de Home equity. A solução teve sua complexidade aumentada pois visa testar o novo metodo de interação com RDS o **RDS DATA SERVICE**. O problema é apresentado no arquivo **docs/case.md**.

## Architecture

A arquitetura de micro-serviços foi utilizada para solucionar o problema de maneira totalmente escalavel e infraestrutura como 100% código.

## Tecnologies

A AWS foi escolhida para suportar os ambientes de dev até prod. O API gateway cria pontos externos Publicos que possibilitam a chamada de funções Lambda. O RDS é utilizado para armazenar os dados dos contratosm, o DynamoDB é utilizado para armazenar os dados das imagens enviadas e o S3 armazena as imagens. Por motivos de segurança o S3 é privado e é apenas possivel enviar ou receber imagens via PreSignedURLs que são solicitadas pelos lambdas após verificações de regras de negócios.

* Aws Lambda
    * https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
* API Gateway
    * https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html
* Serverless Framework - Used to help the development and deployment.
     * https://serverless.com/framework/docs/providers/aws/guide/
* RDS Aurora Serverless.
     * https://aws.amazon.com/pt/rds/aurora/
* DynamoDB.
     * https://aws.amazon.com/pt/dynamodb/
* S3.
     * https://aws.amazon.com/pt/s3/

## Design

A solução foi desenvolvida com três principais camadas, o controller que é a função apontada pelo API gateway que trata a entrada e saida, o service que realiza verifições e aplicação de regras do negócio e por ultimo o repository que se comunica com os recursos de infra estrutura via AWS-SDK.

```
|-- controllers
|   `-- contract.js
|   `-- document.js
|-- services
|   `-- contract.service.js
|   `-- document.service.js
|-- repositories
|   `-- contract.repository.js
|   `-- document.repository.js
|-- helpers
|   ....
```

## Layers

Para reduzir o tamanho dos pacotes de cada função todos os node_modules e helpers foram encapsulados em um 

## Subida do Ambiente

Devido a limitações do RDS DATA SERVICE passos manuais precisam ser realizados para que o banco esteja preparado para execução.

```
sls deploy -s stg
```
- O arquivo docs/db_initial_config.sh deve receber os ARN's do RDS e secret criados
- Após a alateração os comandos devem ser executados

```
./db_initial_config.sh
```

## Execução Local

### Requirements

O ambiente de execução local não foi configurado para execução 100% local e depende de recursos provisionados na nuvem para execução. É possivel realizar a invocação local das funções com eventos pré-configurados na pasta docs/events

runtime: nodejs10.x

```
sls invoke local -f listDocuments -p docs/events/listDocument.json -s stg
```

### Documentação Swagger

Os endpoints estão documentados no swaggerHub https://app.swaggerhub.com/apis/mauriciottc/startup-home-equity/1.0.1
