import { EventSource } from "../eventSource";
import {
  ChatMessage,
  Direction,
  Maybe,
  PaginationArgs,
  ProfileEvent,
  ProfileEventFilter,
} from "../../../types";
import { Prisma } from "../../../api-db/client";
import ChatMessageWhereInput = Prisma.ChatMessageWhereInput;
import { Environment } from "../../../environment";

export class ChatMessageEventSource implements EventSource {
  async getEvents(
    forSafeAddress: string,
    pagination: PaginationArgs,
    filter: Maybe<ProfileEventFilter>
  ): Promise<ProfileEvent[]> {
    const noFilter: ChatMessageWhereInput = {
      OR: [
        {
          from: forSafeAddress,
        },
        {
          to: forSafeAddress,
        },
      ],
    };

    const filteredWhereFrom: ChatMessageWhereInput = {
      AND: [
        {
          OR: [
            {
              from: forSafeAddress,
            },
            {
              to: forSafeAddress,
            },
          ],
        },
        {
          from: filter?.from ?? undefined,
        },
      ],
    };

    const filteredWhereTo: ChatMessageWhereInput = {
      AND: [
        {
          OR: [
            {
              from: forSafeAddress,
            },
            {
              to: forSafeAddress,
            },
          ],
        },
        {
          to: filter?.to ?? undefined,
        },
      ],
    };

    const filteredWhereFromTo: ChatMessageWhereInput = {
      AND: [
        {
          OR: [
            {
              from: forSafeAddress,
            },
            {
              to: forSafeAddress,
            },
          ],
        },
        {
          from: filter?.from ?? undefined,
          to: filter?.to ?? undefined,
        },
      ],
    };

    const filteredWhereWith: ChatMessageWhereInput = {
      AND: [
        {
          OR: [
            {
              from: forSafeAddress,
            },
            {
              to: forSafeAddress,
            },
          ],
        },
        {
          OR: [
            {
              from: filter?.with ?? undefined,
            },
            {
              to: filter?.with ?? undefined,
            },
          ],
        },
      ],
    };

    const createdAt = pagination.continueAt
      ? {
          createdAt:
            pagination.order == "ASC"
              ? {
                  gt: new Date(pagination.continueAt),
                }
              : {
                  lt: new Date(pagination.continueAt),
                },
        }
      : {};

    let compositeFilter = {
      ...(filter?.from && filter?.to
        ? filteredWhereFromTo
        : filter?.from && !filter?.to
        ? filteredWhereFrom
        : !filter?.from && filter?.to
        ? filteredWhereTo
        : filter?.with
        ? filteredWhereWith
        : noFilter),
      ...createdAt,
    };

    if (filter?.chatMessage?.id) {
      compositeFilter = {
        ...compositeFilter,
        id: filter.chatMessage.id
      }
    }

    const chatMessages = await Environment.readonlyApiDb.chatMessage.findMany({
      where: compositeFilter,
      orderBy: {
        createdAt:
          pagination.order == "ASC"
            ? Prisma.SortOrder.asc
            : Prisma.SortOrder.desc,
      },
      take: pagination.limit ?? 50,
    });

    return chatMessages
      .filter((o) => {
        // TODO: Move this filter to the query
        const direction = o.from == forSafeAddress ? "out" : "in";
        if (filter?.direction == Direction.Out && direction == "in") {
          return false;
        }
        if (filter?.direction == Direction.In && direction == "out") {
          return false;
        }
        return true;
      })
      .map((r) => {
        return <ProfileEvent>{
          __typename: "ProfileEvent",
          safe_address: forSafeAddress,
          type: "ChatMessage",
          block_number: null,
          direction: r.from == forSafeAddress ? "out" : "in",
          timestamp: r.createdAt.toJSON(),
          value: null,
          transaction_hash: null,
          transaction_index: null,
          contact_address: r.from == forSafeAddress ? r.to : r.from,
          payload: <ChatMessage>{
            __typename: "ChatMessage",
            id: r.id,
            from: r.from,
            to: r.to,
            text: r.text,
          },
        };
      });
  }
}
