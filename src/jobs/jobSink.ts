import {BroadcastChatMessageWorker} from "./worker/chat/broadcastChatMessageWorker";
import {BroadcastChatMessage} from "./descriptions/chat/broadcastChatMessage";
import {SendCrcReceivedEmailWorker} from "./worker/emailNotifications/sendCrcReceivedEmailWorker";
import {SendCrcReceivedEmail} from "./descriptions/emailNotifications/sendCrcReceivedEmail";
import {SendCrcTrustChangedEmailWorker} from "./worker/emailNotifications/sendCrcTrustChangedEmailWorker";
import {SendCrcTrustChangedEmail} from "./descriptions/emailNotifications/sendCrcTrustChangedEmail";
import {InvoicePayedWorker} from "./worker/payment/invoicePayedWorker";
import {InvoicePayed} from "./descriptions/payment/invoicePayed";
import {Job} from "./jobQueue";

export const jobSink = async (job:Job) => {
  switch (job.topic) {
    case "broadcastChatMessage".toLowerCase():
      return await new BroadcastChatMessageWorker()
        .run(job.id, BroadcastChatMessage.parse(job.payload));
    case "sendCrcReceivedEmail".toLowerCase():
      return new SendCrcReceivedEmailWorker({
          errorStrategy: "logAndDrop"
        })
        .run(job.id, SendCrcReceivedEmail.parse(job.payload));
    case "sendCrcTrustChangedEmail".toLowerCase():
      return  new SendCrcTrustChangedEmailWorker({
          errorStrategy: "logAndDrop"
        })
        .run(job.id, SendCrcTrustChangedEmail.parse(job.payload));
    case "invoicePayed".toLowerCase():
      return new InvoicePayedWorker({
          errorStrategy: "logAndDropAfterThreshold",
          dropThreshold: 3
        })
        .run(job.id, InvoicePayed.parse(job.payload));
    default:
      return undefined;
  }
}