FROM openjdk:21-jdk-slim

# Instalar Maven
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean

WORKDIR /app

# Copiar o pom.xml primeiro para aproveitar o cache das dependências
COPY pom.xml .

# Baixar dependências
RUN mvn dependency:go-offline

# Copiar o código fonte
COPY src ./src

# Executar com configurações para development
CMD ["mvn", "spring-boot:run", \
     "-Dspring-boot.run.jvmArguments='-XX:TieredStopAtLevel=1 -Dspring.devtools.restart.enabled=true'", \
     "-Dspring-boot.run.profiles=dev"]