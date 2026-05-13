# Projeto de Testes de Performance - BlazeDemo

Este repositorio contem um projeto de testes de performance para o cenario de compra de passagem aerea com sucesso no site publico de demonstracao BlazeDemo.

O objetivo e organizar planos de teste, scripts de execucao, relatorios e documentacao tecnica para analise dos resultados obtidos com Apache JMeter.

## Ferramenta utilizada

- Apache JMeter 5.6.3
- Execucao em modo non-GUI
- Relatorios HTML gerados pelo proprio JMeter

## URL testada

```text
https://www.blazedemo.com
```

## Cenario automatizado

Compra de passagem aerea com sucesso, contemplando o fluxo principal do BlazeDemo:

1. Acessar a pagina inicial.
2. Selecionar cidade de origem e destino.
3. Pesquisar voos disponiveis.
4. Escolher um voo.
5. Preencher os dados de compra.
6. Confirmar a compra com sucesso.

## Testes implementados

O projeto possui dois planos de teste JMeter:

- `Load Test`: execucao com carga sustentada, usando 400 usuarios virtuais, ramp-up de 300 segundos e duracao de 600 segundos. O objetivo e avaliar a estabilidade do fluxo sob volume constante.
- `Spike Test`: execucao com aumento abrupto de carga, usando 500 usuarios virtuais, ramp-up de 20 segundos e duracao de 300 segundos. O objetivo e avaliar a resposta do ambiente diante de pico repentino de acessos.

## Criterio de aceitacao

O cenario sera considerado aprovado quando atender simultaneamente aos seguintes criterios:

- Vazao minima de 250 requisicoes por segundo.
- 90th percentile inferior a 2 segundos.
- Taxa de erro compativel com execucao estavel do cenario.

## Estrutura do projeto

```text
agi-performance
|-- README.md
|-- .gitignore
|-- test-plans
|   |-- blazedemo-load-test.jmx
|   `-- blazedemo-spike-test.jmx
|-- reports
|   |-- load-test
|   |   |-- results.jtl
|   |   `-- html
|   `-- spike-test
|       |-- results.jtl
|       `-- html
|-- scripts
|   |-- run-load-test.ps1
|   `-- run-spike-test.ps1
`-- docs
    |-- load-test-analysis.md
    `-- spike-test-analysis.md
```

### Diretorios

- `test-plans`: planos de teste JMeter (`.jmx`) usados nas execucoes.
- `reports/load-test`: resultado bruto e relatorio HTML do Load Test.
- `reports/spike-test`: resultado bruto e relatorio HTML do Spike Test.
- `scripts`: scripts PowerShell para execucao dos testes em modo non-GUI.
- `docs`: analises tecnicas detalhadas dos resultados.

## Como executar os testes

Os planos de teste JMeter estao versionados em:

```text
test-plans/blazedemo-load-test.jmx
test-plans/blazedemo-spike-test.jmx
```

Antes de executar, ajuste a variavel `$jmeterBin` nos scripts PowerShell, se necessario, apontando para o executavel `jmeter.bat` da instalacao local do Apache JMeter 5.6.3.

### Executar Load Test

```powershell
.\scripts\run-load-test.ps1
```

Saidas geradas:

```text
reports/load-test/results.jtl
reports/load-test/html
```

### Executar Spike Test

```powershell
.\scripts\run-spike-test.ps1
```

Saidas geradas:

```text
reports/spike-test/results.jtl
reports/spike-test/html
```

## Evidencias versionadas

O projeto contem as evidencias das execucoes realizadas:

- `reports/load-test/results.jtl`
- `reports/load-test/html/index.html`
- `reports/load-test/html/statistics.json`
- `reports/spike-test/results.jtl`
- `reports/spike-test/html/index.html`
- `reports/spike-test/html/statistics.json`

Os arquivos `statistics.json` dos relatorios HTML foram usados como fonte de conferencia das metricas consolidadas apresentadas neste README.

## Relatorios HTML

Os relatorios completos gerados pelo Apache JMeter estao versionados no repositorio como evidencia da execucao.

### Load Test

- [Abrir relatorio HTML do Load Test](./reports/load-test/html/index.html)
- [Arquivo de resultado bruto - Load Test](./reports/load-test/results.jtl)

### Spike Test

- [Abrir relatorio HTML do Spike Test](./reports/spike-test/html/index.html)
- [Arquivo de resultado bruto - Spike Test](./reports/spike-test/results.jtl)

> Observacao: o GitHub pode exibir arquivos HTML como codigo-fonte. Para visualizar o relatorio com layout completo, clone ou baixe o repositorio e abra o arquivo `index.html` diretamente no navegador.

## Execucao via GitHub Actions

Alem da execucao local, o projeto tambem possui um workflow manual e opcional para execucao dos testes no GitHub Actions.

Para executar:

1. Acesse a aba **Actions** do repositorio.
2. Selecione **JMeter Performance Tests**.
3. Clique em **Run workflow**.
4. Escolha o tipo de teste:
   - `load`
   - `spike`
   - `both`
5. Aguarde a execucao.
6. Baixe os relatorios gerados na secao **Artifacts** da execucao.

Os relatorios gerados pelo workflow ficam disponiveis como artifacts do GitHub Actions:

- `load-test-report`: contem `reports/action-load-test/results.jtl` e `reports/action-load-test/html`.
- `spike-test-report`: contem `reports/action-spike-test/results.jtl` e `reports/action-spike-test/html`.

> Observacao: a execucao via GitHub Actions e manual e opcional. Como o BlazeDemo e um ambiente publico de demonstracao, os testes de carga devem ser executados com responsabilidade.

## Resultado do Load Test

| Metrica | Resultado |
|---|---:|
| Usuarios virtuais | 400 |
| Ramp-up | 300 segundos |
| Duracao | 600 segundos |
| Vazao alvo | 250 req/s |
| Total de amostras | 100.822 |
| Throughput medio | 165,23 req/s |
| 90th percentile total | 636 ms |
| Taxa de erro | 2,44% |

### Transacao completa: Compra de passagem com sucesso

| Metrica | Resultado |
|---|---:|
| Throughput | 41,45 transacoes/s |
| 90th percentile | 4.312,80 ms |
| Taxa de erro | 5,79% |

### Conclusao do Load Test

O criterio de aceitacao nao foi satisfeito, pois a vazao media ficou abaixo de 250 req/s e houve erros durante a execucao.

Embora o 90th percentile total tenha permanecido abaixo de 2 segundos, o throughput medio de 165,23 req/s nao atingiu a vazao alvo definida para o desafio.

## Resultado do Spike Test

| Metrica | Resultado |
|---|---:|
| Usuarios virtuais | 500 |
| Ramp-up | 20 segundos |
| Duracao | 300 segundos |
| Vazao alvo | 250 req/s |
| Total de amostras | 104.192 |
| Throughput medio | 170,42 req/s |
| 90th percentile total | 4.568,10 ms |
| Taxa de erro | 2,48% |

### Transacao completa: Compra de passagem com sucesso

| Metrica | Resultado |
|---|---:|
| Throughput | 42,73 transacoes/s |
| 90th percentile | 8.412,80 ms |
| Taxa de erro | 5,64% |

### Conclusao do Spike Test

O criterio de aceitacao nao foi satisfeito, pois a vazao ficou abaixo de 250 req/s, o 90th percentile ficou acima de 2 segundos e houve erros durante a execucao.

## Principais erros observados

Durante as execucoes, foram observados os seguintes erros:

- `Connect timed out`
- `HTTP 429 Too Many Requests`
- `HTTP 502 Bad Gateway`

Esses erros indicam limitacao de capacidade, protecao contra excesso de requisicoes ou instabilidade temporaria do ambiente testado.

## Conclusao geral

Com base nos resultados coletados, os testes de Load Test e Spike Test nao atenderam integralmente aos criterios de aceitacao definidos.

No Load Test, a latencia total permaneceu dentro do limite esperado, mas a vazao media ficou abaixo da meta de 250 req/s e houve ocorrencia de erros. A transacao completa tambem apresentou p90 acima de 2 segundos, o que reforca a necessidade de avaliar o fluxo de negocio completo alem das requisicoes individuais.

No Spike Test, alem da vazao media tambem ficar abaixo da meta, houve degradacao significativa de tempo de resposta, principalmente na transacao completa de compra de passagem com sucesso.

Portanto, o cenario avaliado nao pode ser considerado aprovado para o criterio estabelecido.

## Observacao sobre o ambiente BlazeDemo

O BlazeDemo e um ambiente publico de demonstracao. Por isso, os resultados podem variar por concorrencia externa, limitacoes de infraestrutura ou mecanismos de protecao contra alto volume de requisicoes.
