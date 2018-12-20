# Testing the Event Hubs nozzle

This repo contains some scripts that can be used to test the Cloud Foundry loggregator nozzle for Event Hubs.

## Create the Azure resources

In order to test the nozzle you will need an Event Hubs namespace, an Event Hub, associated security policies, and a Storage Account. The `event_hub.tf` file contains the Terraform configuration to create all the resources.

To use it you will need to define your Azure credentials:

```
export ARM_SUBSCRIPTION_ID=...
export ARM_CLIENT_ID=...
export ARM_CLIENT_SECRET=...
export ARM_TENANT_ID=...
```

Then run `terraform plan` and `terraform apply`.

## Read from Event Hubs

Once the nozzle is deployed and started, you can receive the data by reading from the Event Hub. The `event-processor-host.js` file contains a simple client that writes all events to standard output for a given time (10 minutes by default).

You will need to configure some environment variables with the credentials for Event Hubs and the Storage Account:

```
export EVENTHUB_CONNECTION_STRING=...
export STORAGE_CONNECTION_STRING=...
```

Make sure the Event Hubs connection string uses a policy that allows *receiving* (i.e. Listen) from the Event Hub.

Then install the dependencies and run the script:

```
npm install
node event-processor-host.js
```
