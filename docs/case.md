# Home Equity startup Case

## 1. Descrição

O desafio é criar uma aplicação REST para geração, edição e listagem de contratos de empréstimos. Temos alguns requisitos descritos neste documento para ser seguidos.


## 2. Requisitos
- Para cada contrato existe 3 estados (Criação, Upload de Imagens e Aprovação)
- O contrato sempre irá inciar no estado de *Criação*.
- O contrato deve seguir o fluxo de estado de uma forma linear, nunca podendo estar mais de 1 estado ao mesmo tempo. (Conforme descrito no *tópico 3*)
- Somente quando o usuário enviar todos os dados **obrigatórios** ao estado que se encontra, ele pode navegar para o próximo estado. (Dados descrito no *tópico 4*)
- Não pode ser salvo dados de estatos futuros.
- Pode ser atualizados os dados do estado que o contrato se encontra e dos estados anteriores.
- Caso o contrato seja Aprovado ou Repovado, o usuário não pode mais realizar a edição.



## 3. Fluxo dos Estados
```
+---------------+         +-----------------------+         +--------------+
|    Criacão    |    ->   |   Upload de Imagens   |    ->   |   Aprovação  |
+---------------+         +-----------------------+         +--------------+
```



## 4. Dados de cada Estados

**Criação**
 - Nome (obrigatório)
 - Email (obrigatório)
 - CPF (obrigatório)
 - Valor do empréstimo (obrigatório)
 - Renda mensal
 - Data de nascimento
 - Estado civil
 - Endereço

**Upalod de Imagens**
 - CNH ou CPF (obrigatório)
 - Conprovante de renda
 - Imagens do imóvel

**Aprovação**
 - Status (Aprovação ou reprovação do contrato)

*Interface gráfica não necessária*