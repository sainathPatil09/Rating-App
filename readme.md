# **Rating Store – Observability with OpenTelemetry**

This project demonstrates how to instrument a Node.js/Express service with OpenTelemetry (OTel) for metrics and traces, and how to export them to Prometheus (for metrics) and Jaeger (for traces).

## NOTE: 

## **🚀 Features**

- ✅ Automatic tracing for HTTP, Express, and Mongoose requests

- ✅ Custom metrics middleware for request counts, durations, errors, and active users

- ✅ Exposes /metrics endpoint for Prometheus scraping

- ✅ OTLP exporter for sending traces

- ✅ Integrates with Prometheus + Jaeger for monitoring and visualization

---

## **Architecture**
![Observability Architecture](/images/observibility.png)

---

## Steps to Clone This Repository and Switch to the `otel` Branch

1. **Clone the Repository**
    - Open your terminal or command prompt.
    - Run the following command to clone the repository:
      ```
      git clone <repository-url>
      ```
      Replace `<repository-url>` with the actual URL of the repository.

2. **Navigate to the Repository Directory**
    - Change your working directory to the cloned repository:
      ```
      cd <repository-directory>
      ```
      Replace `<repository-directory>` with the name of the cloned folder.

3. **Fetch All Branches**
    - Ensure you have all remote branches:
      ```
      git fetch --all
      ```

4. **Switch to the `otel` Branch**
    - Use the following command to switch to the `otel` branch:
      ```
      git checkout otel
      ```
    - If the branch does not exist locally, this command will create a local tracking branch for `otel`.

5. **Verify the Branch**
    - Confirm you are on the correct branch:
      ```
      git branch
      ```
    - The `otel` branch should be highlighted with an asterisk (`*`).

**Note:** If you encounter any issues, ensure you have the necessary permissions to access the repository and that the `otel` branch exists on the remote.


## **Running Observability Tools with Docker**

Follow these steps to run Prometheus, Jaeger, and Grafana using Docker:

### 1. Start Prometheus

Make sure you have a `prometheus.yml` configuration file in your current directory. Then run:

```sh
docker run -d \
    --name prometheus \
    -p 9090:9090 \
    -v ${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus
```

- Prometheus UI will be available at [http://localhost:9090](http://localhost:9090).

### 2. Start Jaeger

```sh
docker run -d --name jaeger -p 4318:4318 -p 16686:16686 jaegertracing/all-in-one:latest
```

- Jaeger UI will be available at [http://localhost:16686](http://localhost:16686).

### 3. Start Grafana

```sh
docker run -d -p 3000:3000 --name=grafana grafana/grafana
```

- Grafana UI will be available at [http://localhost:3000](http://localhost:3000).

> **Tip:** Use `docker ps` to check running containers and `docker stop <container-name>` to stop them.

<!-- docker run -d `
   --name prometheus `
   -p 9090:9090 `
   -v ${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml `
   prom/prometheus 

docker run -d --name jaeger -p 4318:4318 -p 16686:16686 jaegertracing/all-in-one:latest

docker run -d -p 3000:3000 --name=grafana grafana/grafana  -->