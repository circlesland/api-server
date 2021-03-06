import {EventSource} from "./eventSource";
import {Maybe, PaginationArgs, ProfileEvent, ProfileEventFilter, SortOrder} from "../../types";

export class CombinedEventSource implements EventSource {
  private readonly _resolvers:EventSource[];

  constructor(resolvers:EventSource[]) {
    this._resolvers = resolvers;
  }

  async getEvents(forSafeAddress: string, pagination:PaginationArgs, filter:Maybe<ProfileEventFilter>): Promise<ProfileEvent[]> {
    const resultPromises = this._resolvers.map(resolver => {
      try {
        return resolver.getEvents(forSafeAddress, pagination, filter)
      } catch (e) {
        console.error(e);
        return [];
      }
    });
    const results = await Promise.all(resultPromises);
    const events = results.flatMap(o => o);

    const sortedEvents = events.sort((a,b) => {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();
        return (
          pagination.order == SortOrder.Asc
            ? aTime < bTime
            : aTime > bTime
        )
          ? -1
          : aTime < bTime
            ? 1
            : 0;
      });

    if (sortedEvents.length == 0) {
      return [];
    }

    return sortedEvents.slice(0, Math.min(pagination.limit, sortedEvents.length));
  }
}