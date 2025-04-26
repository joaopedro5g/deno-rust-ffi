# **Rust + Deno: Integração FFI para Processamento de Big Data**

Esse é um projeto que fiz para explorar a integração de **Rust** e **Deno** para processamento de dados em grande escala. A ideia principal era aproveitar o que há de melhor em cada linguagem: o poder de **processamento paralelo e baixo nível** do Rust e a flexibilidade e facilidade de uso do **Deno** para web e integração com JavaScript/TypeScript. 

---

## 🧠 **Sobre o Projeto**

A proposta é criar uma solução onde **Rust** faz todo o processamento pesado dos dados (dividindo-os em múltiplos núcleos de CPU), enquanto o **Deno** funciona como servidor para consumir esses dados e interagir com o código Rust via FFI (Foreign Function Interface).

O projeto basicamente faz o seguinte:
- O **Deno** recebe dados em JSON (grandes volumes, tipo 100k registros) e os envia para o **Rust** processar.
- O **Rust** divide esses dados em pedaços, processa tudo de forma paralela e retorna os resultados para o **Deno**.
- A comunicação entre o **Deno** e o **Rust** é feita via FFI, utilizando ponteiros para dados, e o Deno manipula esses dados sem problemas.

É um projeto que foi feito para experimentar um **high-performance data processing pipeline**, onde **Rust** cuida da parte de performance e processamento paralelo, e o **Deno** faz a interface web e a integração.

---

## 🚧 **Os Desafios**

Teve alguns desafios bem interessantes que me deram bastante trabalho e aprendizado. O primeiro deles foi **integrar Rust e Deno via FFI**. Para quem não sabe, FFI (Foreign Function Interface) é uma técnica para permitir que duas linguagens diferentes interajam. No caso, o **Rust** expõe funções para serem chamadas pelo **Deno**. 

O primeiro problema foi **gerenciar a memória**. Como o **Rust** tem um controle bem mais rígido da memória, foi preciso fazer umas "gambiarras" com `unsafe` para manipular ponteiros e garantir que o Deno tivesse acesso aos dados de forma correta. O Rust e o Deno não têm um "garbage collector" como o Node.js, então você precisa gerenciar a memória de forma explícita, o que pode ser complicado, mas ao mesmo tempo super eficiente.

Outro desafio foi **garantir que o Rust realmente paralelize o processamento de dados** de forma eficaz. Eu dividi os dados de entrada em pedaços menores e usei threads para processá-los em paralelo, mas precisava garantir que não houvesse **conflitos de memória** ao acessar e modificar os dados ao mesmo tempo. Após alguns testes e ajustes, consegui chegar a uma solução bem eficiente.

O **Deno** também não facilitou muito as coisas quando o assunto foi passar dados binários como ponteiros de memória. O Deno utiliza o tipo `UnsafePointer` para lidar com ponteiros, mas isso não é tão simples quanto parece, e gerenciar isso de forma correta entre **Rust** e **Deno** foi um pouco de dor de cabeça.

---

## 🚀 **O Que Consegui Resolver**

- **Paralelismo**: Consegui dividir o trabalho de processamento de dados entre múltiplos núcleos da CPU, aproveitando ao máximo o poder de processamento do **Rust**.
- **Integração FFI**: Criei uma ponte entre **Deno** e **Rust**, permitindo que o Deno chame funções Rust diretamente e passe dados via ponteiros de memória.
- **Processamento Eficiente**: Concluí que a combinação de Rust com threads para dividir o trabalho de forma paralela realmente ajudou a melhorar muito a performance, especialmente para grandes volumes de dados.

Agora, o código roda perfeitamente, o Deno lê grandes arquivos JSON, processa os dados em paralelo usando Rust, e ainda consegue devolver os resultados sem travar a aplicação.

---

## 🔧 **Como Funciona no Código**

Basicamente, o **Deno** lê o arquivo JSON, converte para um ponteiro e envia para o código **Rust**. O Rust então processa os dados, faz as contagens, validações e divide o processamento em várias threads. Depois, ele retorna os resultados ao Deno, que pode fazer o que quiser com eles (exibir, salvar, etc).

- **Deno** atua como o servidor e faz a parte de **interface web** e gerenciamento de entrada/saída.
- **Rust** cuida da parte de **processamento paralelo** e **gerenciamento de memória**.

---

## 🚨 **Principais Desafios**

1. **Gerenciamento de Memória**: Com Rust e FFI, não tem coleta automática de lixo. Isso significa que você tem que gerenciar a memória manualmente. Rust não vai liberar a memória automaticamente, então o **Deno** é o responsável por isso.
2. **FFI**: A integração entre Rust e Deno é feita via FFI e isso exige cuidado redobrado para garantir que os ponteiros estejam corretos e que não haja vazamentos de memória.
3. **Desempenho**: Ao trabalhar com grandes volumes de dados (como JSONs com 100k ou mais registros), o código precisa ser altamente eficiente, o que é desafiador. Dividir o processamento entre múltiplas threads em Rust foi uma solução bem-vinda.

---

## 🧑‍💻 **Como Rodar**

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/rust-deno-bigdata.git
   cd rust-deno-bigdata
   deno index.ts
<br>
<br>
<i><span style="font-size:1rem; text">Texto corrigido com inteligencia artificial</span></i>