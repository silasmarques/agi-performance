# Projeto de Testes de Performance - BlazeDemo

Este repositório contém um projeto de testes de performance para o cenário de compra de passagem aérea com sucesso no site público de demonstração BlazeDemo.

O objetivo é organizar planos de teste, scripts de execução, relatórios e documentação técnica para análise dos resultados obtidos com Apache JMeter.

## Ferramenta utilizada

- Apache JMeter 5.6.3
- Execução em modo non-GUI
- Relatórios HTML gerados pelo próprio JMeter

## URL testada

```text
https://www.blazedemo.com
```

## Cenário automatizado

Compra de passagem aérea com sucesso, contemplando o fluxo principal do BlazeDemo:

1. Acessar a página inicial.
2. Selecionar cidade de origem e destino.
3. Pesquisar voos disponíveis.
4. Escolher um voo.
5. Preencher os dados de compra.
6. Confirmar a compra com sucesso.

## Testes implementados

O projeto possui dois planos de teste JMeter:

- `Load Test`: execução com carga sustentada, usando 400 usuários virtuais, ramp-up de 300 segundos e duração de 600 segundos. O objetivo é avaliar a estabilidade do fluxo sob volume constante.
- `Spike Test`: execução com aumento abrupto de carga, usando 500 usuários virtuais, ramp-up de 20 segundos e duração de 300 segundos. O objetivo é avaliar a resposta do ambiente diante de pico repentino de acessos.

## Critério de aceitação

O cenário será considerado aprovado quando atender simultaneamente aos seguintes critérios:

- Vazão mínima de 250 requisições por segundo.
- 90th percentile inferior a 2 segundos.
- Taxa de erro compatível com execução estável do cenário.

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

### Diretórios

- `test-plans`: planos de teste JMeter (`.jmx`) usados nas execuções.
- `reports/load-test`: resultado bruto e relatório HTML do Load Test.
- `reports/spike-test`: resultado bruto e relatório HTML do Spike Test.
- `scripts`: scripts PowerShell para execução dos testes em modo non-GUI.
- `docs`: análises técnicas detalhadas dos resultados.

## Como executar os testes

Os planos de teste JMeter estão versionados em:

```text
test-plans/blazedemo-load-test.jmx
test-plans/blazedemo-spike-test.jmx
```

Antes de executar, ajuste a variável `$jmeterBin` nos scripts PowerShell, se necessário, apontando para o executável `jmeter.bat` da instalação local do Apache JMeter 5.6.3.

### Executar Load Test

Executa o plano `test-plans/blazedemo-load-test.jmx` e gera um novo resultado em `reports/load-test`.

```powershell
.\scripts\run-load-test.ps1
```

Saídas geradas:

```text
reports/load-test/results.jtl
reports/load-test/html
```

### Executar Spike Test

Executa o plano `test-plans/blazedemo-spike-test.jmx` e gera um novo resultado em `reports/spike-test`.

```powershell
.\scripts\run-spike-test.ps1
```

Saídas geradas:

```text
reports/spike-test/results.jtl
reports/spike-test/html
```

## Evidências versionadas

O projeto contém as evidências das execuções realizadas:

- `reports/load-test/results.jtl`
- `reports/load-test/html/index.html`
- `reports/load-test/html/statistics.json`
- `reports/spike-test/results.jtl`
- `reports/spike-test/html/index.html`
- `reports/spike-test/html/statistics.json`

Os arquivos `statistics.json` dos relatórios HTML foram usados como fonte de conferência das métricas consolidadas apresentadas neste README.

## Execução via GitHub Actions

Além da execução local, o projeto também possui um workflow manual e opcional para execução dos testes no GitHub Actions.

Para executar:

1. Acesse a aba **Actions** do repositório.
2. Selecione **JMeter Performance Tests**.
3. Clique em **Run workflow**.
4. Escolha o tipo de teste:
   - `load`: executa apenas o Load Test.
   - `spike`: executa apenas o Spike Test.
   - `both`: executa Load Test e Spike Test na mesma execução.
5. Aguarde a execução.
6. Baixe os relatórios gerados na seção **Artifacts** da execução.

Os relatórios gerados pelo workflow ficam disponíveis como artifacts do GitHub Actions:

- `load-test-report`: contém `reports/action-load-test/results.jtl` e `reports/action-load-test/html`.
- `spike-test-report`: contém `reports/action-spike-test/results.jtl` e `reports/action-spike-test/html`.

> Observação: a execução via GitHub Actions é manual e opcional. Como o BlazeDemo é um ambiente público de demonstração, os testes de carga devem ser executados com responsabilidade.

## Resultado do Load Test

| Métrica | Resultado |
|---|---:|
| Usuários virtuais | 400 |
| Ramp-up | 300 segundos |
| Duração | 600 segundos |
| Vazão alvo | 250 req/s |
| Total de amostras | 100.822 |
| Throughput médio | 165,23 req/s |
| 90th percentile total | 636 ms |
| Taxa de erro | 2,44% |

### Transação completa: Compra de passagem com sucesso

| Métrica | Resultado |
|---|---:|
| Throughput | 41,45 transações/s |
| 90th percentile | 4.312,80 ms |
| Taxa de erro | 5,79% |

### Conclusão do Load Test

O critério de aceitação não foi satisfeito, pois a vazão média ficou abaixo de 250 req/s e houve erros durante a execução.

Embora o 90th percentile total tenha permanecido abaixo de 2 segundos, o throughput médio de 165,23 req/s não atingiu a vazão alvo definida para o desafio.

## Resultado do Spike Test

| Métrica | Resultado |
|---|---:|
| Usuários virtuais | 500 |
| Ramp-up | 20 segundos |
| Duração | 300 segundos |
| Vazão alvo | 250 req/s |
| Total de amostras | 104.192 |
| Throughput médio | 170,42 req/s |
| 90th percentile total | 4.568,10 ms |
| Taxa de erro | 2,48% |

### Transação completa: Compra de passagem com sucesso

| Métrica | Resultado |
|---|---:|
| Throughput | 42,73 transações/s |
| 90th percentile | 8.412,80 ms |
| Taxa de erro | 5,64% |

### Conclusão do Spike Test

O critério de aceitação não foi satisfeito, pois a vazão ficou abaixo de 250 req/s, o 90th percentile ficou acima de 2 segundos e houve erros durante a execução.

## Principais erros observados

Durante as execuções, foram observados os seguintes erros:

- `Connect timed out`
- `HTTP 429 Too Many Requests`
- `HTTP 502 Bad Gateway`

Esses erros indicam limitação de capacidade, proteção contra excesso de requisições ou instabilidade temporária do ambiente testado.

## Conclusão geral

Com base nos resultados coletados, os testes de Load Test e Spike Test não atenderam integralmente aos critérios de aceitação definidos.

No Load Test, a latência total permaneceu dentro do limite esperado, mas a vazão média ficou abaixo da meta de 250 req/s e houve ocorrência de erros. A transação completa também apresentou p90 acima de 2 segundos, o que reforça a necessidade de avaliar o fluxo de negócio completo além das requisições individuais.

No Spike Test, além da vazão média também ficar abaixo da meta, houve degradação significativa de tempo de resposta, principalmente na transação completa de compra de passagem com sucesso.

Portanto, o cenário avaliado não pode ser considerado aprovado para o critério estabelecido.

## Observação sobre o ambiente BlazeDemo

O BlazeDemo é um ambiente público de demonstração. Por isso, os resultados podem variar por concorrência externa, limitações de infraestrutura ou mecanismos de proteção contra alto volume de requisições.
