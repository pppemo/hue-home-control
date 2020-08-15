import { MerkleJson } from "merkle-json";

class ResponseHistoryComparator {
  private extractData: any;
  private onStateChange: any;
  private currentDataHash?: string;

  constructor(extractDataFn?: any, onStateChangeFn?: number) {
    this.extractData = extractDataFn;
    this.onStateChange = onStateChangeFn;
  }

  public compare(newData: Object, ignoreOnStateChangeAction: boolean) {
    const extractedData = this.extractData(newData);
    const newDataHash = new MerkleJson().hash(extractedData);
    if (this.currentDataHash && this.currentDataHash !== newDataHash) {
      !ignoreOnStateChangeAction && this.onStateChange && this.onStateChange();
    }
    this.currentDataHash = newDataHash;
  }

  public setExtractDataFn(extractDataFn: any) {
    this.extractData = extractDataFn;
    return this;
  }

  public setOnStateChangeFn(onStateChangeFn: any) {
    this.onStateChange = onStateChangeFn;
    return this;
  }
}

export default ResponseHistoryComparator;
