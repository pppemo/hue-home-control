import ResponseHistoryComparator from "./responseHistoryComparator";

class DataPoller {
  private getData: any;
  private intervalObject?: ReturnType<typeof setInterval>;
  private interval: number = 5000;
  private responseHistoryComparator?: ResponseHistoryComparator;

  constructor(getDataFn: any, interval: number) {
    this.getData = getDataFn;
    this.interval = interval;
  }

  private executeCall(ignoreHistoryComparing: boolean) {
    return this.getData().then((response: Object) => {
      this.responseHistoryComparator &&
        this.responseHistoryComparator.compare(
          response,
          ignoreHistoryComparing
        );
    });
  }

  public async start(
    invokeImmediately: boolean = true,
    ignoreHistoryComparing: boolean = false
  ) {
    invokeImmediately && (await this.executeCall(ignoreHistoryComparing));
    this.intervalObject = setInterval(
      () => this.executeCall(ignoreHistoryComparing),
      this.interval
    );
  }

  public stop() {
    clearInterval(this.intervalObject as ReturnType<typeof setInterval>);
  }

  public updateNow(ignoreHistoryComparing: boolean = false) {
    this.stop();
    this.executeCall(ignoreHistoryComparing);
    this.start(false);
  }

  public resetInterval() {
    this.stop();
    this.start(false);
  }

  public setResponseHistoryComparator(
    responseHistoryComparator: ResponseHistoryComparator
  ) {
    this.responseHistoryComparator = responseHistoryComparator;
  }
}

export default DataPoller;
