import { MerkleJson } from "merkle-json";

class DataChannelWS {
  observers: any[] = [];
  getData: any;
  intervalObject?: ReturnType<typeof setInterval>;
  interval: number;
  currentDataHash?: string;

  constructor(getDataFn: any, interval: number) {
    this.getData = getDataFn;
    this.interval = interval;
  }

  private executeCall() {
    this.getData().then((response: Object) => {
      const newDataHash = new MerkleJson().hash(response);
      if (this.currentDataHash && this.currentDataHash !== newDataHash) {
        this.observers.forEach((observer) => observer.notify());
        this.currentDataHash = newDataHash;
      } else {
        this.currentDataHash = newDataHash;
      }
    });
  }

  public start() {
    this.intervalObject = setInterval(() => this.executeCall(), this.interval);
  }

  public stop() {
    clearInterval(this.intervalObject as ReturnType<typeof setInterval>);
  }

  public updateNow() {
    this.stop();
    this.start();
  }

  public addObserver(observer: any) {
    this.observers.push(observer);
  }
}

export default DataChannelWS;
