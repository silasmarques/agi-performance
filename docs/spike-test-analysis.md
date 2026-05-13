# Analise do Spike Test - BlazeDemo

## Objetivo

Avaliar o comportamento do cenario de compra de passagem aerea com sucesso no BlazeDemo diante de aumento abrupto de carga, observando vazao, latencia, erros e estabilidade da transacao completa.

## Configuracao do teste

| Parametro | Valor |
|---|---:|
| Tipo de teste | Spike Test |
| Usuarios virtuais | 500 |
| Ramp-up | 20 segundos |
| Duracao | 300 segundos |
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
| Total de amostras | 104.192 |
| Throughput medio | 170,42 req/s |
| 90th percentile total | 4.568,10 ms |
| Taxa de erro | 2,48% |

## Resultado da transacao completa

Transacao avaliada: `TC - Compra de passagem com sucesso`

| Metrica | Resultado |
|---|---:|
| Total de amostras | 26.135 |
| Throughput | 42,73 transacoes/s |
| 90th percentile | 8.412,80 ms |
| Taxa de erro | 5,64% |

## Analise de vazao

O throughput medio observado foi de 170,42 req/s, abaixo da meta de 250 req/s.

Mesmo com 500 usuarios virtuais e ramp-up agressivo de 20 segundos, o ambiente nao sustentou a vazao alvo definida para o teste.

Na transacao completa de compra de passagem com sucesso, o throughput foi de 42,73 transacoes/s, indicando que o fluxo de negocio completo apresentou capacidade efetiva menor do que a vazao total de requisicoes individuais.

## Analise de tempo de resposta

O 90th percentile total foi de 4.568,10 ms, acima do limite de 2 segundos.

Na transacao completa, o 90th percentile foi ainda mais elevado, chegando a 8.412,80 ms. Esse comportamento indica degradacao significativa do tempo de resposta durante o pico de carga.

## Analise de erros

A taxa de erro total foi de 2,48%.

Na transacao completa de compra de passagem com sucesso, a taxa de erro foi de 5,64%, superior a taxa consolidada do teste. Isso indica maior sensibilidade do fluxo completo sob carga abrupta.

Os principais erros observados foram:

- `Connect timed out`
- `HTTP 429 Too Many Requests`
- `HTTP 502 Bad Gateway`

Esses erros sao compativeis com indisponibilidade temporaria, limitacao de trafego e falhas de resposta do servidor durante aumento repentino de carga.

## Conclusao

O Spike Test nao satisfez o criterio de aceitacao.

A vazao media ficou abaixo de 250 req/s, o 90th percentile total ficou acima de 2 segundos e houve erros durante a execucao. Alem disso, a transacao completa de compra de passagem com sucesso apresentou latencia elevada e taxa de erro superior a taxa consolidada.

Portanto, o cenario nao pode ser considerado aprovado sob condicao de pico de carga.

## Evidencias

- Plano de teste: `test-plans/blazedemo-spike-test.jmx`
- Resultado bruto: `reports/spike-test/results.jtl`
- Relatorio HTML: `reports/spike-test/html/index.html`
- Estatisticas consolidadas: `reports/spike-test/html/statistics.json`

## Observacoes

O BlazeDemo e um ambiente publico de demonstracao. Como nao ha controle sobre sua infraestrutura, os resultados podem sofrer influencia de concorrencia externa, limites de protecao contra trafego excessivo e instabilidades temporarias.
