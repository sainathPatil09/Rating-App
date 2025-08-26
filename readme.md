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


<!-- 
 docker run -d `
>>   --name prometheus `
>>   -p 9090:9090 `
>>   -v ${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml `
>>   prom/prometheus -->

<!-- docker run -d --name jaeger -p 4318:4318 -p 16686:16686 jaegertracing/all-in-one:latest -->

