const { EventPosition } = require("@azure/event-hubs");
const { EventProcessorHost, delay } = require("@azure/event-processor-host");

const path = process.env.EVENTHUB_NAME;
const storageCS = process.env.STORAGE_CONNECTION_STRING;
const ehCS = process.env.EVENTHUB_CONNECTION_STRING;
const storageContainerName = "test-container-3";
const ephName = "my-eph";

async function main() {
  // Create the Event Processo Host
  const eph = EventProcessorHost.createFromConnectionString(
    EventProcessorHost.createHostName(ephName),
    storageCS,
    storageContainerName,
    ehCS,
    {
      eventHubPath: path,
      initialOffset: EventPosition.fromEnd(),
      onEphError: (error) => {
        console.log(">>>>>>> [%s] Error: %O", ephName, error);
      }
    }
  );
  let count = 0;
  // Message event handler
  const onMessage = async (context/*PartitionContext*/, data /*EventData*/) => {
    if (data.body == null) {
      console.error(">>>>> null body on partition %s: %s", context.partitionId, JSON.stringify(data));
    } else {
      console.log(JSON.stringify(data.body));
    }
    count++;
    // let us checkpoint every 100th message that is received across all the partitions.
    /*if (count % 1000 === 0) {
      return await context.checkpoint();
    }*/
  };
  // Error event handler
  const onError = (error) => {
    console.error(">>>>> Received Error: %O", error);
  };
  // start the EPH
  await eph.start(onMessage, onError);
  // After some time let' say 2 minutes
  await delay(10 * 60 * 1000);
  // This will stop the EPH.
  await eph.stop();
}

main().catch((err) => {
  console.log(err);
});
