# Analise do Load Test - BlazeDemo

## Objetivo

Avaliar o comportamento do cenario de compra de passagem aerea com sucesso no BlazeDemo sob carga sustentada, considerando o criterio de aceitacao definido para o desafio.

## Configuracao do teste

| Parametro | Valor |
|---|---:|
| Tipo de teste | Load Test |
| Usuarios virtuais | 400 |
| Ramp-up | 300 segundos |
| Duracao | 600 segundos |
| Vazao alvo | 250 req/s |
| URL testada | https://www.blazedemo.com |

## Criterio de aceitacao

Para aprovacao do cenario, o teste deveria atender aos seguintes pontos:

- Atingir 250 requisicoes por segundo.
- Manter o 90th percentile abaixo de 2 segundos.
- Executar com estabilidade, sem taxa de erro relevante.

## Resultados consolidados

| Metrica | Resultado |
|---|---:|
| Total de amostras | 100.822 |
| Throughput medio | 165,23 req/s |
| 90th percentile total | 636 ms |
| Taxa de erro | 2,44% |

## Resultado da transacao completa

Transacao avaliada: `TC - Compra de passagem com sucesso`

| Metrica | Resultado |
|---|---:|
| Total de amostras | 25.304 |
| Throughput | 41,45 transacoes/s |
| 90th percentile | 4.312,80 ms |
| Taxa de erro | 5,79% |

## Analise de vazao

O throughput medio observado foi de 165,23 req/s, abaixo da meta estabelecida de 250 req/s.

Isso representa atendimento parcial do volume esperado, mas nao suficiente para aprovacao do criterio de vazao. Mesmo com 400 usuarios virtuais e ramp-up gradual de 300 segundos, o ambiente nao sustentou a quantidade de requisicoes por segundo definida como alvo.

Na transacao completa de compra de passagem com sucesso, o throughput foi de 41,45 transacoes/s. Esse numero mostra a capacidade efetiva do fluxo de negocio completo, que e menor do que a vazao total de requisicoes individuais.

## Analise de tempo de resposta

O 90th percentile total foi de 636 ms, permanecendo abaixo do limite maximo de 2 segundos.

Sob a perspectiva de latencia total, o resultado consolidado foi satisfatorio. A maior parte das requisicoes individuais apresentou tempo de resposta compativel com o criterio definido.

Na transacao completa, entretanto, o 90th percentile foi de 4.312,80 ms. Esse dado mostra que a agregacao do fluxo completo apresenta latencia superior ao limite de 2 segundos, mesmo quando o total consolidado das requisicoes individuais permanece abaixo desse limite.

## Analise de erros

A taxa de erro registrada foi de 2,44%.

Na transacao completa, a taxa de erro foi de 5,79%, superior a taxa consolidada do teste. Isso indica maior sensibilidade do fluxo completo sob carga sustentada.

Os principais erros observados foram:

- `Connect timed out`
- `HTTP 429 Too Many Requests`
- `HTTP 502 Bad Gateway`

A presenca desses erros indica que, durante a execucao, houve falhas de conectividade, limitacao por excesso de requisicoes ou indisponibilidade temporaria do servico.

## Conclusao

O Load Test nao satisfez o criterio de aceitacao.

Embora o 90th percentile total tenha ficado abaixo de 2 segundos, a vazao media ficou abaixo de 250 req/s e houve erros durante a execucao. A transacao completa tambem apresentou p90 acima de 2 segundos e taxa de erro mais alta do que o consolidado geral.

Portanto, o cenario de compra de passagem com sucesso nao pode ser considerado aprovado no Load Test.

## Evidencias

- Plano de teste: `test-plans/blazedemo-load-test.jmx`
- Resultado bruto: `reports/load-test/results.jtl`
- Relatorio HTML: `reports/load-test/html/index.html`
- Estatisticas consolidadas: `reports/load-test/html/statistics.json`

## Observacoes

O BlazeDemo e um ambiente publico de demonstracao. Os resultados podem ser influenciados por fatores externos, como concorrencia de outros usuarios, protecoes contra trafego excessivo, limitacoes de infraestrutura e instabilidades temporarias.
